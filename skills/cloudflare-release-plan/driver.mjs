#!/usr/bin/env node
// Cloudflare release watcher — repo-agnostic.
//
// Zero dependencies. Node >= 18 (global fetch). Run from the target repo root.
// Knows nothing about any specific project: the Cloudflare surface is derived
// from the repo's own wrangler config(s) and package manifests.
//
//   node <skill-dir>/driver.mjs <command> [flags]
//
// Commands: surface | releases | new | blog | deps | report | state | vendor
// See SKILL.md.

import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_DIR = dirname(fileURLToPath(import.meta.url));
const CHANGELOG_RSS = 'https://developers.cloudflare.com/changelog/rss.xml';
const BLOG_RSS = 'https://blog.cloudflare.com/rss/';
const DEFAULT_PLAN = 'docs/CLOUDFLARE_ADOPTION_PLAN.md';

// ---------------------------------------------------------------------------
// arg parsing
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
const command = argv.find((a) => !a.startsWith('-')) ?? 'report';
const flag = (name, fallback = undefined) => {
  const hit = argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return fallback;
  const eq = hit.indexOf('=');
  return eq === -1 ? true : hit.slice(eq + 1);
};
const list = (name) => {
  const v = flag(name);
  return typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : [];
};

function die(msg, code = 2) {
  process.stderr.write(`driver.mjs: ${msg}\n`);
  process.exit(code);
}

// Dates must be `--flag=value`. A bare `--since 2026-08-01` parses as boolean
// true; silently falling back to a default there would quietly answer a
// different question than the one asked, so it is a hard error.
const dateFlag = (name, fallback) => {
  const raw = flag(name);
  if (raw === undefined) return fallback;
  if (raw === true) die(`--${name} needs "=": use --${name}=YYYY-MM-DD, not --${name} YYYY-MM-DD`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) die(`--${name} must be YYYY-MM-DD, got "${raw}"`);
  return raw;
};

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n) => new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

const AS_JSON = flag('json') === true;
const SHOW_ALL = flag('all') === true;
const LIMIT = Number(flag('limit', '0')) || 0;
const UNTIL = dateFlag('until', '9999-12-31');
const PLAN_PATH = typeof flag('plan') === 'string' ? flag('plan') : DEFAULT_PLAN;

// Piping into `head` closes stdout early; without this the process dies with an
// unhandled EPIPE and a stack trace instead of exiting quietly like a Unix tool.
process.stdout.on('error', (err) => {
  if (err.code === 'EPIPE') process.exit(0);
  throw err;
});

// ---------------------------------------------------------------------------
// surface detection — derived from the repo, never hardcoded
// ---------------------------------------------------------------------------

// wrangler config section -> Cloudflare changelog product name(s).
// Keys are matched against both TOML (`[[d1_databases]]`) and JSON
// (`"d1_databases":`) config shapes.
const BINDING_PRODUCTS = {
  d1_databases: ['D1'],
  kv_namespaces: ['Workers KV'],
  r2_buckets: ['R2'],
  'queues.producers': ['Queues'],
  'queues.consumers': ['Queues'],
  queues: ['Queues'],
  'durable_objects.bindings': ['Durable Objects'],
  durable_objects: ['Durable Objects'],
  analytics_engine_datasets: ['Analytics Engine'],
  vectorize: ['Vectorize'],
  ai: ['Workers AI', 'AI Gateway'],
  secrets_store_secrets: ['Secrets Store'],
  workflows: ['Workflows'],
  hyperdrive: ['Hyperdrive'],
  browser: ['Browser Rendering', 'Browser Run'],
  containers: ['Containers'],
  pipelines: ['Pipelines'],
  dispatch_namespaces: ['Workers for Platforms'],
  mtls_certificates: ['Cloudflare Fundamentals'],
  send_email: ['Email Service', 'Email Routing'],
  images: ['Images'],
  observability: ['Workers Observability', 'Logs'],
  'unsafe.bindings': ['Rate limiting'],
  vpc_services: ['Workers VPC'],
};

// npm package -> product(s). Catches surface that has no binding to detect.
const PACKAGE_PRODUCTS = [
  [/^agents$/, ['Agents']],
  [/^@cloudflare\/(think|ai-chat|codemode|computer)$/, ['Agents']],
  [/^@modelcontextprotocol\//, ['Agents', 'Access']],
  [/^@cloudflare\/workers-oauth-provider$/, ['Access']],
  [/^@cloudflare\/sandbox$/, ['Containers']],
  [/^@cloudflare\/(puppeteer|playwright)$/, ['Browser Run', 'Browser Rendering']],
  [/^(partyserver|partysocket)$/, ['Durable Objects']],
  [/^@cloudflare\/(vite-plugin|vitest-pool-workers)$/, ['Workers']],
];

function configFiles(dir = '.') {
  const names = ['wrangler.toml', 'wrangler.json', 'wrangler.jsonc'];
  const out = [];
  for (const n of names) if (existsSync(join(dir, n))) out.push(join(dir, n));
  return out;
}

// Look one level deep in the conventional monorepo container dirs. Deliberately
// not a full recursive walk: node_modules alone would make that unusable.
function workspaceDirs() {
  const out = ['.'];
  for (const container of ['packages', 'apps', 'services', 'workers']) {
    if (!existsSync(container)) continue;
    let entries;
    try {
      entries = readdirSync(container, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) if (e.isDirectory()) out.push(join(container, e.name));
  }
  return out;
}

function allConfigFiles() {
  return workspaceDirs().flatMap((d) => configFiles(d));
}

function manifestPaths() {
  return workspaceDirs()
    .map((d) => join(d, 'package.json'))
    .filter((p) => existsSync(p));
}

function detectSurface() {
  const products = new Set();
  const evidence = {};
  const note = (name, file) => {
    products.add(name);
    (evidence[name] ??= new Set()).add(file);
  };

  const configs = allConfigFiles();
  for (const file of configs) {
    const text = readFileSync(file, 'utf8');
    // A wrangler config at all means Workers + Wrangler. Nothing else is assumed.
    note('Workers', file);
    note('Wrangler', file);
    for (const [section, names] of Object.entries(BINDING_PRODUCTS)) {
      const esc = section.replace(/\./g, '\\.');
      const toml = new RegExp(`^\\s*\\[\\[?(?:env\\.[a-z0-9_-]+\\.)?${esc}[\\]]`, 'm');
      const json = new RegExp(`"${esc.replace(/\\\./g, '\\.')}"\\s*:`, 'm');
      if (!toml.test(text) && !json.test(text)) continue;
      for (const n of names) note(n, file);
    }
  }

  const manifests = manifestPaths();
  for (const file of manifests) {
    let pkg;
    try {
      pkg = JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      continue;
    }
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    for (const name of Object.keys(deps)) {
      for (const [re, names] of PACKAGE_PRODUCTS) {
        if (re.test(name)) for (const n of names) note(`${n}`, file);
      }
      if (name === 'wrangler') {
        note('Workers', file);
        note('Wrangler', file);
      }
    }
  }

  return {
    products: [...products].sort(),
    evidence: Object.fromEntries(Object.entries(evidence).map(([k, v]) => [k, [...v]])),
    configs,
    manifests,
    isCloudflareRepo: products.size > 0,
  };
}

function requireCloudflareRepo() {
  const s = detectSurface();
  if (!s.isCloudflareRepo) {
    die(
      `no Cloudflare surface found in ${resolve('.')}\n` +
        `  Looked for wrangler.toml/.json/.jsonc and Cloudflare npm packages in: ${workspaceDirs().join(', ')}\n` +
        `  If this is a Cloudflare repo with a non-standard layout, pass --products=Workers,D1,...`,
      3
    );
  }
  return s;
}

// ---------------------------------------------------------------------------
// RSS parsing (regex-based — these two feeds are machine-generated and stable)
// ---------------------------------------------------------------------------

const unescapeXml = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`));
  return m ? unescapeXml(m[1]).trim() : '';
};

// Changelog descriptions are entire rendered HTML pages, including
// syntax-highlighted <pre> blocks with a <span> per token. Drop the code before
// stripping tags or the "summary" is hundreds of chars of code fragments.
function summarise(html, maxLen = 400) {
  const text = html
    .replace(/<pre[\s\S]*?<\/pre>/gi, ' ')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
}

async function fetchFeed(url) {
  let res;
  try {
    res = await fetch(url, {
      headers: { 'user-agent': 'cloudflare-release-plan/1 (+llm-skills)' },
    });
  } catch (err) {
    die(`GET ${url} failed: ${err.message}\n  No network egress? \`deps\` and \`releases\` both need public internet.`, 4);
  }
  if (!res.ok) die(`GET ${url} -> HTTP ${res.status}`, 4);
  return res.text();
}

// Fallback for items with no pubDate: the slug is `YYYY-MM-DD-title`.
function slugDate(link) {
  const m = link.match(/\/post\/(\d{4}-\d{2}-\d{2})-/);
  return m ? m[1] : '';
}

function parseItems(xml) {
  const items = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const raw = m[1];
    const title = tag(raw, 'title');
    const link = tag(raw, 'link');
    const pubDate = tag(raw, 'pubDate');
    const iso = pubDate ? new Date(pubDate).toISOString().slice(0, 10) : slugDate(link);
    // Changelog titles are `Agents, Workers - <headline>`. Each item carries
    // exactly ONE <category>, so the title prefix is the real product list —
    // filtering on <category> alone silently drops cross-product items.
    const sep = title.indexOf(' - ');
    const prefix = sep === -1 ? '' : title.slice(0, sep);
    const looksLikeProducts = Boolean(prefix) && prefix.length < 80 && !/[.?!]/.test(prefix);
    items.push({
      date: iso,
      title: looksLikeProducts ? title.slice(sep + 3).trim() : title,
      products: looksLikeProducts
        ? prefix.split(',').map((s) => s.trim()).filter(Boolean)
        : [tag(raw, 'category')].filter(Boolean),
      category: tag(raw, 'category'),
      link,
      summary: summarise(tag(raw, 'description')),
    });
  }
  return items;
}

const STAGE_RE = [
  [/\bbreaking change\b/i, 'BREAKING'],
  [/\bdeprecat/i, 'DEPRECATION'],
  [/\bbilling is now enabled\b|\bpricing (now )?(adds|includes)\b|\bbilling (starts|begins)\b/i, 'BILLING'],
  [/\bgenerally available\b|\bnow GA\b|\bis GA\b/i, 'GA'],
  [/\bopen beta\b/i, 'open beta'],
  [/\bpublic beta\b/i, 'public beta'],
  [/\bprivate beta\b|\bclosed beta\b/i, 'private beta'],
  [/\bresearch preview\b/i, 'research preview'],
  [/\bbeta\b/i, 'beta'],
  [/\bpreview\b/i, 'preview'],
  [/\bexperimental\b/i, 'experimental'],
];

function stageOf(item) {
  const hay = `${item.title} ${item.summary}`;
  for (const [re, label] of STAGE_RE) if (re.test(hay)) return label;
  return '';
}

// Bucket 2 in the plan: anything with a date attached to it.
const isForcedMove = (stage) => ['BREAKING', 'DEPRECATION', 'BILLING'].includes(stage);

// ---------------------------------------------------------------------------
// plan state — the plan file IS the state store, so routines stay idempotent
// ---------------------------------------------------------------------------

function findPlan() {
  const candidates = [PLAN_PATH, 'CLOUDFLARE_ADOPTION_PLAN.md', 'docs/cloudflare-adoption-plan.md'];
  for (const c of candidates) if (existsSync(c)) return c;
  return null;
}

// Parse `### CF-### · title` blocks plus their metadata lines. Kept in the
// driver rather than as an awk snippet in the docs: BSD awk (macOS) has no
// strftime, so the obvious one-liner is silently non-portable.
function readItems() {
  const path = findPlan();
  if (!path) return { path: PLAN_PATH, exists: false, items: [] };
  const text = readFileSync(path, 'utf8');
  const items = [];
  let cur = null;
  const field = (line, name) => {
    const m = line.match(new RegExp(`^\\s*-\\s*\\*\\*${name}:\\*\\*\\s*(.*?)\\s*$`));
    return m ? m[1] : null;
  };
  for (const line of text.split('\n')) {
    const head = line.match(/^###\s+(CF-\d+)\s*[·|-]\s*(.+?)\s*$/);
    if (head) {
      if (cur) items.push(cur);
      cur = { id: head[1], title: head[2], bucket: null, stage: null, status: null, deadline: null, sources: [], body: '' };
      continue;
    }
    if (!cur) continue;
    cur.body = (cur.body ?? '') + line + '\n';
    const b = field(line, 'Bucket');
    if (b !== null) cur.bucket = parseInt(b, 10) || null;
    const st = field(line, 'Stage');
    if (st !== null) cur.stage = st;
    const s = field(line, 'Status');
    if (s !== null) cur.status = s;
    const d = field(line, 'Deadline');
    if (d !== null) cur.deadline = /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null;
    const src = field(line, 'Source');
    if (src !== null) cur.sources.push(src);
  }
  if (cur) items.push(cur);
  const now = today();
  for (const i of items) i.overdue = Boolean(i.deadline && i.deadline < now && i.status === 'todo');
  return { path, exists: true, items };
}

// Priority: overdue deadlines first, then bucket order, then ID order.
// Bucket 4 is never actionable — those items are decisions to NOT act.
const strip = (i) => (i ? (({ body, ...rest }) => rest)(i) : i);

function rankTodo(items) {
  return items
    .filter((i) => i.status === 'todo' && i.bucket !== 4)
    .sort(
      (a, b) =>
        Number(b.overdue) - Number(a.overdue) ||
        (a.bucket ?? 9) - (b.bucket ?? 9) ||
        a.id.localeCompare(b.id)
    );
}

const VALID_STATUS = ['todo', 'in-progress', 'blocked', 'done', 'rejected'];
const VALID_BUCKET = [1, 2, 3, 4];

// A hand-edited plan is the normal case, and a free-prose `Status:` parses
// without complaint while silently dropping the item out of `plan --todo`.
// That already happened once in the wild, so the shape is checked, not trusted.
function validateItems(items) {
  const problems = [];
  const seen = new Map();
  for (const i of items) {
    if (seen.has(i.id)) problems.push(`${i.id}: duplicate ID (IDs are never reused)`);
    seen.set(i.id, true);
    if (!VALID_STATUS.includes(i.status))
      problems.push(`${i.id}: Status "${i.status ?? '(missing)'}" is not one of ${VALID_STATUS.join(' | ')}`);
    if (!VALID_BUCKET.includes(i.bucket))
      problems.push(`${i.id}: Bucket "${i.bucket ?? '(missing)'}" is not 1-4`);
    if (!i.sources.length)
      problems.push(`${i.id}: no Source: URL — dedupe runs off those, so this item is re-reported every sweep`);
    if (i.bucket !== 4 && i.status !== 'rejected' && !i.stage)
      problems.push(`${i.id}: no Stage:`);
    // plan-format.md requires these on buckets 1-3. The adopter consumes this
    // file as its implementation plan: an actionable item with no Steps has no
    // defined scope, and one with no Verify has no definition of done. One
    // shipped without them before this check existed.
    if (i.bucket !== 4 && !['rejected', 'done'].includes(i.status)) {
      // Prefix match, not exact: a heading like `**Verify after the release**`
      // carries more information than a bare `**Verify**` and should not be
      // flattened by the linter.
      if (!/^\*\*Steps\b.*\*\*\s*$/m.test(i.body ?? '')) problems.push(`${i.id}: no **Steps** section (required for buckets 1-3)`);
      if (!/^\*\*Verify\b.*\*\*\s*$/m.test(i.body ?? '')) problems.push(`${i.id}: no **Verify** section (required for buckets 1-3)`);
    }
  }
  return problems;
}

function readState() {
  const path = findPlan();
  if (!path) return { path: PLAN_PATH, exists: false, lastSwept: null, knownLinks: [] };
  const text = readFileSync(path, 'utf8');
  const swept = text.match(/^-?\s*\*\*Last swept:\*\*\s*(\d{4}-\d{2}-\d{2})/m);
  const links = [
    ...new Set(
      [...text.matchAll(/https:\/\/(?:developers|blog)\.cloudflare\.com\/[^\s>)\]]+/g)].map((m) =>
        m[0].replace(/[.,>)\]]+$/, '')
      )
    ),
  ];
  return { path, exists: true, lastSwept: swept?.[1] ?? null, knownLinks: links };
}

// ---------------------------------------------------------------------------
// commands
// ---------------------------------------------------------------------------

const lc = (s) => String(s).toLowerCase();

async function changelog({ since, excludeKnown = false }) {
  const explicit = list('products');
  // `--products` and `--all` are both explicit overrides — honour them without
  // demanding a detectable surface, or the escape hatch named in the
  // requireCloudflareRepo() error message would not actually work.
  const surface = explicit.length || SHOW_ALL ? detectSurface() : requireCloudflareRepo();
  const wanted = new Set((explicit.length ? explicit : surface.products).map(lc));
  const all = parseItems(await fetchFeed(CHANGELOG_RSS));
  let items = all.filter((i) => i.date && i.date >= since && i.date <= UNTIL);
  if (!SHOW_ALL) {
    items = items.filter(
      (i) => i.products.some((p) => wanted.has(lc(p))) || wanted.has(lc(i.category))
    );
  }
  let skippedKnown = 0;
  if (excludeKnown) {
    const known = new Set(readState().knownLinks);
    const before = items.length;
    items = items.filter((i) => !known.has(i.link));
    skippedKnown = before - items.length;
  }
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const shaped = (LIMIT ? items.slice(0, LIMIT) : items).map((i) => {
    const stage = stageOf(i);
    return { ...i, stage, forcedMove: isForcedMove(stage) };
  });
  return {
    feed: CHANGELOG_RSS,
    since,
    until: UNTIL,
    filtered: !SHOW_ALL,
    surfaceSource: explicit.length ? '--products' : 'detected',
    totalInFeed: all.length,
    matched: items.length,
    skippedKnown,
    surface: explicit.length ? explicit : surface.products,
    items: shaped,
  };
}

// Cloudflare opens each Innovation Week with a "Welcome to <X> Week" post. During
// one, several relevant items land per day and blog posts precede their changelog
// entries — so detection changes how the caller should sweep, not just what it
// reports. Checked against the whole blog feed (~2 weeks) rather than the
// requested window, or an hourly sweep would only see it on the opening day.
function detectInnovationWeek(allBlogItems) {
  const hit = allBlogItems.find((i) => /^welcome to\b.*\bweek\b/i.test(i.title));
  if (!hit) return null;
  const started = hit.date;
  const ageDays = Math.floor((Date.parse(today()) - Date.parse(started)) / 86_400_000);
  // Innovation Weeks run ~5 days; treat anything older as finished.
  return ageDays >= 0 && ageDays <= 6 ? { title: hit.title, link: hit.link, started, dayOfWeek: ageDays + 1 } : null;
}

async function blogSince(since) {
  const all = parseItems(await fetchFeed(BLOG_RSS));
  const items = all
    .filter((i) => i.date && i.date >= since && i.date <= UNTIL)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return {
    feed: BLOG_RSS,
    since,
    until: UNTIL,
    totalInFeed: all.length,
    matched: items.length,
    innovationWeek: detectInnovationWeek(all),
    items: LIMIT ? items.slice(0, LIMIT) : items,
  };
}

// Cloudflare ecosystem + the SDKs that gate which Cloudflare features are usable.
const WATCH = [
  /^@cloudflare\//,
  /^wrangler$/,
  /^agents$/,
  /^@modelcontextprotocol\//,
  /^partyserver$/,
  /^partysocket$/,
];

// Successor packages published under a NEW NAME. A new major that renames the
// package can never show up as "behind" — it shows up as "not-installed", which
// is the single most important signal this table produces.
const SUCCESSORS = {
  '@modelcontextprotocol/sdk': ['@modelcontextprotocol/server', '@modelcontextprotocol/client'],
  '@cloudflare/puppeteer': ['@cloudflare/playwright'],
};

async function npmLatest(name) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`, {
      headers: { accept: 'application/json' },
    });
    if (!res.ok) return null;
    const j = await res.json();
    return typeof j.version === 'string' ? j.version : null;
  } catch {
    return null;
  }
}

// Good enough for the caret/tilde/pin ranges real manifests use. Reports
// "behind" on any major bump (^4 does not cover 5.x) and on stale exact pins.
function satisfiedBy(range, latest) {
  const nums = (v) => String(v).split('.').map((n) => parseInt(n, 10) || 0);
  const [lM, lm, lp] = nums(latest);
  const op = range.match(/^[\^~]/)?.[0] ?? '';
  const [rM, rm, rp] = nums(String(range).replace(/^[\^~><=\s]+/, ''));
  const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  if (op === '^') return lM === rM && cmp([lM, lm, lp], [rM, rm, rp]) >= 0;
  if (op === '~') return lM === rM && lm === rm && lp >= rp;
  return lM === rM && lm === rm && lp === rp;
}

async function deps() {
  const declared = new Map();
  for (const file of manifestPaths()) {
    let pkg;
    try {
      pkg = JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      continue;
    }
    for (const field of ['dependencies', 'devDependencies']) {
      for (const [name, range] of Object.entries(pkg[field] ?? {})) {
        if (range === '*' || String(range).startsWith('workspace:') || String(range).startsWith('link:')) continue;
        if (!WATCH.some((re) => re.test(name))) continue;
        const e = declared.get(name) ?? { range, files: [], pinned: !/^[\^~]/.test(String(range)) };
        e.files.push(file);
        declared.set(name, e);
      }
    }
  }

  // Only look up successors for packages actually declared — no point asking
  // npm about @modelcontextprotocol/server in a repo with no MCP surface.
  const successorTargets = new Set();
  for (const [from, tos] of Object.entries(SUCCESSORS)) {
    if (declared.has(from)) for (const t of tos) if (!declared.has(t)) successorTargets.add(t);
  }

  const names = [...new Set([...declared.keys(), ...successorTargets])].sort();
  const rows = await Promise.all(
    names.map(async (name) => {
      const latest = await npmLatest(name);
      const d = declared.get(name);
      const successorOf = Object.entries(SUCCESSORS).find(([, tos]) => tos.includes(name))?.[0] ?? null;
      let status;
      if (!d) status = 'SUCCESSOR-AVAILABLE';
      else if (!latest) status = 'lookup-failed';
      else if (satisfiedBy(d.range, latest)) status = 'current';
      // An exact pin is deliberate, but no bump bot will ever surface it, so it
      // needs a louder label than a stale caret range.
      else status = d.pinned ? 'behind (EXACT PIN — no bot will bump this)' : 'behind';
      return { name, declared: d?.range ?? null, latest, files: d?.files ?? [], pinned: d?.pinned ?? false, successorOf, status };
    })
  );
  const actionable = rows.filter((r) => r.status !== 'current' && r.status !== 'lookup-failed');
  return { rows, actionable };
}

// ---------------------------------------------------------------------------
// rendering
// ---------------------------------------------------------------------------

const out = (s) => process.stdout.write(`${s}\n`);

function renderChangelog(r, heading = 'Cloudflare changelog') {
  const range = r.until === '9999-12-31' ? `since ${r.since}` : `${r.since} → ${r.until}`;
  out(`## ${heading} — ${range}`);
  out('');
  if (r.filtered) {
    out(`${r.matched} of ${r.totalInFeed} feed entries match this repo's surface (${r.surfaceSource}).`);
    out(`Surface: ${r.surface.join(', ')}`);
  } else {
    out(`${r.matched} of ${r.totalInFeed} feed entries in range (surface filter OFF — all products).`);
  }
  if (r.skippedKnown) out(`Skipped ${r.skippedKnown} entries already cited in the plan.`);
  out('');
  if (!r.items.length) return out('_Nothing new._');
  const forced = r.items.filter((i) => i.forcedMove);
  if (forced.length) {
    out(`> **${forced.length} forced move(s)** — deadline-bearing, triage first:`);
    for (const i of forced) out(`> - [${i.stage}] [${i.title}](${i.link})`);
    out('');
  }
  let day = '';
  for (const i of r.items) {
    if (i.date !== day) {
      day = i.date;
      out(`### ${day}`);
    }
    out(`- [${i.products.join(', ')}]${i.stage ? ` **[${i.stage}]**` : ''} [${i.title}](${i.link})`);
    if (i.summary) out(`  - ${i.summary}`);
  }
}

function renderBlog(r) {
  out(`## Cloudflare blog — since ${r.since}`);
  out('');
  if (!r.items.length) return out('_Nothing new._');
  for (const i of r.items) out(`- ${i.date} — [${i.title}](${i.link})`);
}

function renderDeps(r) {
  out('## Cloudflare-ecosystem dependency drift');
  out('');
  out('| package | declared | latest | status |');
  out('| --- | --- | --- | --- |');
  for (const x of r.rows) {
    const name = x.successorOf ? `${x.name}<br>_(successor to ${x.successorOf})_` : x.name;
    out(`| ${name} | ${x.declared ?? '—'} | ${x.latest ?? '?'} | ${x.status} |`);
  }
  out('');
  out(r.actionable.length ? `**${r.actionable.length} actionable row(s).**` : '_No drift._');
}

// ---------------------------------------------------------------------------

const commands = {
  surface: async () => {
    const s = detectSurface();
    if (AS_JSON) return out(JSON.stringify(s, null, 2));
    if (!s.isCloudflareRepo) return requireCloudflareRepo();
    out('## Detected Cloudflare surface');
    out('');
    out(`Configs:   ${s.configs.join(', ') || 'none'}`);
    out(`Manifests: ${s.manifests.join(', ') || 'none'}`);
    out('');
    for (const p of s.products) out(`- ${p} — ${s.evidence[p].join(', ')}`);
  },

  state: async () => {
    const st = readState();
    const s = detectSurface();
    const payload = {
      ...st,
      knownLinkCount: st.knownLinks.length,
      suggestedSince: st.lastSwept ?? daysAgo(30),
      today: today(),
      isCloudflareRepo: s.isCloudflareRepo,
      surface: s.products,
    };
    delete payload.knownLinks;
    if (AS_JSON) return out(JSON.stringify(payload, null, 2));
    out('## Plan state');
    out('');
    out(`Plan file:     ${st.path}${st.exists ? '' : '  (does not exist yet)'}`);
    out(`Last swept:    ${st.lastSwept ?? 'never'}`);
    out(`Cited links:   ${st.knownLinks.length}`);
    out(`Suggested --since: ${payload.suggestedSince}`);
    out(`Today:         ${payload.today}`);
  },

  // Read side of the plan. `cloudflare-release-adopt` starts here.
  plan: async () => {
    const { path, exists, items } = readItems();
    if (!exists) die(`no plan file found (looked for ${PLAN_PATH}). Run the cloudflare-release-plan skill first.`, 5);
    const problems = validateItems(items);
    if (flag('validate') === true) {
      if (AS_JSON) return out(JSON.stringify({ path, ok: problems.length === 0, problems }, null, 2));
      if (!problems.length) return out(`${path}: ${items.length} item(s), schema OK.`);
      out(`${path}: ${problems.length} schema problem(s)`);
      for (const p of problems) out(`  - ${p}`);
      process.exitCode = 6;
      return;
    }
    const ranked = rankTodo(items);
    const next = ranked[0] ?? null;
    if (flag('next') === true) {
      if (!next) {
        if (AS_JSON) return out(JSON.stringify({ path, next: null }, null, 2));
        return out('No actionable `todo` items. Nothing to adopt.');
      }
      if (AS_JSON) return out(JSON.stringify({ path, next: strip(next) }, null, 2));
      out(`${next.id} · ${next.title}`);
      out(`  bucket ${next.bucket} · stage ${next.stage} · deadline ${next.deadline ?? '—'}${next.overdue ? ' · OVERDUE' : ''}`);
      for (const s of next.sources) out(`  ${s}`);
      return;
    }
    const shown = flag('todo') === true ? ranked : items;
    if (AS_JSON) return out(JSON.stringify({ path, count: shown.length, next: next?.id ?? null, items: shown.map(strip) }, null, 2));
    out(`## ${path} — ${shown.length} item(s)`);
    out('');
    if (problems.length) {
      out(`> **${problems.length} schema problem(s)** — run \`plan --validate\` for detail.`);
      out('');
    }
    out('| ID | b | stage | status | deadline | title |');
    out('| --- | --- | --- | --- | --- | --- |');
    for (const i of shown) {
      out(
        `| ${i.id} | ${i.bucket ?? '?'} | ${i.stage ?? '?'} | ${i.status ?? '?'}${i.overdue ? ' **OVERDUE**' : ''} | ${i.deadline ?? '—'} | ${i.title} |`
      );
    }
    out('');
    out(next ? `**Next:** ${next.id} — ${next.title}` : '_No actionable todo items._');
  },

  releases: async () => {
    const r = await changelog({ since: dateFlag('since', daysAgo(30)) });
    AS_JSON ? out(JSON.stringify(r, null, 2)) : renderChangelog(r);
  },

  // The routine command: only what is new since the plan's own "Last swept",
  // minus anything the plan already cites. Exit 0 with no items = nothing to do.
  new: async () => {
    const st = readState();
    const since = dateFlag('since', st.lastSwept ?? daysAgo(30));
    const r = await changelog({ since, excludeKnown: true });
    const b = await blogSince(since);
    const d = await deps();
    const nothing = r.items.length === 0 && d.actionable.length === 0;
    if (AS_JSON) return out(JSON.stringify({ state: { path: st.path, lastSwept: st.lastSwept }, nothing, changelog: r, blog: b, deps: d }, null, 2));
    out(`# New since ${since}${st.lastSwept ? ' (plan\'s last sweep)' : ' (no prior sweep recorded)'}`);
    out('');
    if (b.innovationWeek) {
      const w = b.innovationWeek;
      out(`> **INNOVATION WEEK IN PROGRESS** — day ${w.dayOfWeek}, opened ${w.started}.`);
      out(`> [${w.title}](${w.link})`);
      out('> Expect several relevant posts per day, and blog posts landing before their');
      out('> changelog entries. Also run `blog` and `releases --all` this sweep — the');
      out('> surface filter cannot match a product this repo does not yet bind.');
      out('');
    }
    if (nothing) {
      out('**Nothing new.** No unseen changelog entries on this surface and no dependency drift.');
      out('');
      out('Commit nothing and open no PR. A date-only bump of `Last swept:` is not worth');
      out('a PR at a fast cadence — dedupe runs off the cited `Source:` URLs, so a stale');
      out(`date only widens the scan window. Let the bump to ${today()} ride along in the`);
      out('next sweep that actually finds something.');
      return;
    }
    renderDeps(d);
    out('');
    renderChangelog(r, 'Unseen changelog entries');
    out('');
    renderBlog(b);
  },

  blog: async () => {
    const r = await blogSince(dateFlag('since', daysAgo(30)));
    AS_JSON ? out(JSON.stringify(r, null, 2)) : renderBlog(r);
  },

  deps: async () => {
    const r = await deps();
    AS_JSON ? out(JSON.stringify(r, null, 2)) : renderDeps(r);
  },

  report: async () => {
    const since = dateFlag('since', daysAgo(30));
    const [c, b, d] = await Promise.all([changelog({ since }), blogSince(since), deps()]);
    if (AS_JSON) return out(JSON.stringify({ changelog: c, blog: b, deps: d }, null, 2));
    out(`# Cloudflare release watch — ${since} → ${UNTIL === '9999-12-31' ? 'today' : UNTIL}`);
    out('');
    renderDeps(d);
    out('');
    renderChangelog(c);
    out('');
    renderBlog(b);
  },

  // Copy this skill pair into the target repo's .claude/skills/ so a cloud
  // routine that has no ~/.claude/skills still finds it.
  vendor: async () => {
    const skillsRoot = dirname(SKILL_DIR);
    const dest = flag('to');
    const target = typeof dest === 'string' ? dest : '.claude/skills';
    let copied = 0;
    // `_house-style` must come along: both SKILL.md files open with
    // `Read ../_house-style/house-style.md`, which is a dead path once the pair
    // is copied out of the global skills tree.
    for (const name of ['cloudflare-release-plan', 'cloudflare-release-adopt', '_house-style']) {
      const src = join(skillsRoot, name);
      if (!existsSync(src)) continue;
      const dir = join(target, name);
      mkdirSync(dir, { recursive: true });
      for (const f of readdirSync(src)) {
        copyFileSync(join(src, f), join(dir, f));
        copied++;
      }
      out(`vendored ${name} -> ${dir}`);
    }
    if (!copied) die(`nothing to vendor from ${skillsRoot}`);
    out('');
    out('Remember: `.claude/` is gitignored in many repos. Check with:');
    out('  git check-ignore -v .claude/skills/cloudflare-release-plan/SKILL.md');
  },
};

const run = commands[command];
if (!run) die(`unknown command "${command}". Try: ${Object.keys(commands).join(' | ')}`);
await run();
