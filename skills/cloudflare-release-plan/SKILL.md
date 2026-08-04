---
name: cloudflare-release-plan
description: Look up the newest Cloudflare releases (changelog, blog, npm) that affect the current repo and write or update its Cloudflare adoption plan. Use when asked what's new from Cloudflare, to check for Cloudflare updates or Innovation Week / Agents Week announcements, to audit Cloudflare dependency drift, to sweep for new Cloudflare products, SDKs, bindings, or frameworks worth adopting, or to refresh the adoption plan. Safe to run unattended on a schedule. Plans only — never implements; hand the plan to cloudflare-release-adopt.
user-invocable: true
argument-hint: "[--since=YYYY-MM-DD] [--plan=PATH] — omit to sweep from the plan's last-swept date"
---

Read `../_house-style/house-style.md` before starting.

# Cloudflare release plan

Cloudflare ships daily and runs a themed Innovation Week roughly monthly. Most of
it is irrelevant to any given repo; a handful of items delete code that repo
currently maintains by hand. Your job is to find that handful, triage it, and
write it down. **You plan. You do not implement.**

Driven by `driver.mjs` (in this skill directory) — zero dependencies, Node 18+,
run from the target repo root. It knows nothing about any specific project: the
Cloudflare surface is derived from that repo's own wrangler configs and package
manifests. Output contract: `plan-format.md` in this skill directory. Read it
before writing anything.

## Run

Locate the driver once, then use `$D`. This works whether the skill is installed
globally or vendored into the repo:

```bash
D=$(ls -d ~/.claude/skills/cloudflare-release-plan/driver.mjs .claude/skills/cloudflare-release-plan/driver.mjs 2>/dev/null | head -1); echo "$D"
```

**Step 1 — what does this repo actually use, and when did we last look?**

```bash
node "$D" surface && node "$D" state
```

**Step 2 — what's new since then.** This is the command to use by default. It
auto-derives `--since` from the plan's `Last swept:` line and drops anything the
plan already cites, so re-running it does not re-report the same items:

```bash
node "$D" new
```

If it prints `**Nothing new.**`, bump `Last swept:` to today, say so in one line,
and stop. Do not invent work.

**Step 3 — triage** every remaining item into exactly one bucket, then write it
into the plan per `plan-format.md`.

Other commands, for when `new` isn't the right question:

| Command | Use it when |
| --- | --- |
| `node "$D" report --since=2026-07-01` | First-ever sweep, or you want a full window regardless of what's already in the plan. |
| `node "$D" releases --since=2026-08-02 --until=2026-08-07 --all` | Isolating one Innovation Week. `--all` is **required** — see Gotchas. |
| `node "$D" deps` | Dependency drift only. Cheap; safe to run weekly. |
| `node "$D" blog --since=2026-07-20` | Big launches appear on the blog days before the changelog. |
| `node "$D" plan` / `plan --todo` / `plan --next` | Read back what's already in the plan. `cloudflare-release-adopt` uses this. |
| `node "$D" vendor` | Copy this skill pair into the repo's `.claude/skills/` for environments with no `~/.claude`. |

Flags: `--since=` `--until=` `--all` `--products=A,B` `--limit=N` `--json` `--plan=PATH`.
Dates require `=`. Exit codes: `2` bad usage, `3` not a Cloudflare repo,
`4` network/feed failure, `5` no plan file.

## Triage rubric

Four buckets, in priority order. Every item goes in exactly one.

1. **Deletes code we maintain** — Cloudflare shipped the thing this repo
   hand-rolled. Look for local workarounds whose comments name an exit condition
   ("remove this when the SDK supports X"); those comments are the highest-signal
   grep in the repo. Net-negative diffs. Take these first.
2. **Forced move** — deprecation, breaking change, or billing change **with a
   date**. The driver tags these `[BREAKING]` / `[DEPRECATION]` / `[BILLING]` and
   lists them in a callout above the entries. Schedule them; don't debate them.
   Record the deadline in the item.
3. **Capability we'd otherwise build.** Needs real cost/benefit. Cheap ones
   (config-only, CI-only) go first; anything that migrates populated data is a
   *decision*, not a task — scope it as "run the existing eval as a baseline,
   then compare", never as "migrate".
4. **Ignore** — models we don't call, dashboard UX, products we don't bind.
   **Most items land here, and recording them is the point** — it stops the next
   sweep re-litigating the same entries.

### Stage gates

Non-negotiable. Applies to every bucket-3 item:

- `preview` / `experimental` / `research preview` → **do not adopt.** Note and move on.
- `private beta` → no. Can't gate production on an allowlist.
- `public beta` / `open beta` → non-prod environment only, behind a feature flag.
- `GA` → production-eligible, still behind a feature flag for one release.

Before proposing a flag, grep the repo for its existing convention
(`FEATURE_*`, `ENABLE_*`, a flags module) and match it. Do not introduce a second
flag style.

## Rules

- **Bump `Last swept:` on every run**, including no-op runs. The next routine
  derives its window from it.
- **Never reuse an ID**, even for rejected items — PRs and commits cite them.
- **Every item needs a `Source:` URL.** `new` dedupes on those URLs; an item
  without one is re-reported every sweep, forever.
- **Verify every URL you cite.** `curl -sS -o /dev/null -w '%{http_code}' -L <url>`.
  Slugs are not guessable from titles — guessing produces 404s in a committed doc.
- **Cite `file:line` for every claim about the repo.** "We hand-roll this" without
  a path is a hunch.
- **Do not edit code.** Not even a version bump. That is `cloudflare-release-adopt`.
- **Preserve human edits.** Update `Status:` fields and append new items; never
  rewrite existing prose or delete items you didn't add.
- **Fill in "What this sweep did not check."** Anything inferred from an
  announcement rather than verified against the package goes here, explicitly.

## Gotchas

- **Two feeds, neither complete.** The changelog RSS (~1100 entries, years of
  history) is the one worth filtering. The blog RSS holds roughly the **last two
  weeks only** — useless for history, essential for catching Innovation Week
  launches that have no changelog entry yet. Run both.
- **`<category>` holds exactly one product; the title holds the real list.**
  Titles are `Agents, Workers - <headline>`. Filtering on `<category>` alone
  silently drops cross-product items. The driver parses the title prefix and
  falls back to `<category>`; don't "simplify" that.
- **`--all` is required to spot new products.** The surface filter only matches
  products the repo already binds, so a brand-new product worth adopting is
  invisible by construction. Use `--all` for "what should we start using", the
  default filter for "what breaks us".
- **`deps` "current" ≠ safe.** A new major published under a **different package
  name** never shows as `behind`. `@modelcontextprotocol/sdk@^1.30.0` reads
  `current` against `1.30.0` while its actual successors
  `@modelcontextprotocol/server@2.0.0` and `/client@2.0.0` show as
  `SUCCESSOR-AVAILABLE`. That row is the most important output of the table.
- **Exact pins are invisible to bump bots.** The driver labels them
  `behind (EXACT PIN — no bot will bump this)`. On an auth or crypto boundary a
  pin is correct engineering — the fix is to pin *forward* deliberately, not to
  loosen it.
- **Innovation Week wrap-up posts are unreliable.** `/…-week-in-review/` pages
  return content spanning multiple release waves with publication dates that
  contradict the changelog. Trust `--since`/`--until` on the changelog over any
  "everything we launched" recap.
- **The changelog RSS is ~7 MB** and every `releases` call re-downloads it. Batch
  questions into one `--json` run rather than looping the driver.
- **A declared dependency may be dead.** Before calling a version bump
  actionable, grep for an actual import. Vendored copies of a package leave the
  manifest entry behind, and bumps to it have zero runtime effect.
- **`.claude/` is gitignored in many repos.** If you `vendor`, check
  `git check-ignore -v` before assuming the skill will reach a teammate or CI.

## Routine mode

Unattended, on a schedule. Non-interactive, so:

1. `node "$D" new` — if `**Nothing new.**`, bump `Last swept:`, commit, exit.
2. Otherwise triage, update the plan, and open a **plan-only PR** — no code changes.
3. Title: `docs(cloudflare): sweep <since>→<today>, N new items`. Body: the
   forced-move callout verbatim, plus the new item IDs.
4. Exit 3 means the repo has no Cloudflare surface. That is a **clean no-op**, not
   a failure — say so and stop. Don't force `--products` to manufacture output.
5. Never open a PR that only bumps `Last swept:` when items were found but you
   ran out of confidence. Leave them `todo` with an honest note instead.

### Cadence

**`new` is safe to run hourly.** Dedupe against `Last swept:` and the plan's
cited `Source:` URLs means a run with nothing to report opens no PR and writes
nothing but the date. Sweep frequency therefore buys **detection latency**, not
review noise — the PR count is set by what Cloudflare actually ships (~1 item per
weekday touching a typical surface), not by how often you look.

The real cost of hourly is a ~7 MB feed fetch per run. That is the tradeoff; it is
not a reason to sweep slowly.

- **Hourly on weekdays** — the default for a repo that wants to be current. Cloudflare
  posts almost nothing on weekends.
- **Adopt daily at most.** One item per PR; more than one a day outruns review.
- **During an Innovation Week**, expect several relevant posts per day and blog
  posts landing *before* their changelog entries. `new` prints an
  `INNOVATION WEEK IN PROGRESS` banner when it detects one — when you see it, also
  run `blog` and `releases --all`, because the surface filter cannot match a
  product the repo does not yet bind.
