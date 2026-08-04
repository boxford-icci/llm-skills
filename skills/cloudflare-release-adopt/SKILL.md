---
name: cloudflare-release-adopt
description: Implement one item from a repo's Cloudflare adoption plan — adopt a new Cloudflare product, SDK, binding, or framework, bump a Cloudflare dependency, or clear a deprecation or billing deadline. Use when asked to roll out, adopt, apply, or ship Cloudflare updates, to action the Cloudflare adoption plan, or to work the next item on it. Reads the plan written by cloudflare-release-plan and lands one change behind a feature flag with tests. Safe to run unattended on a schedule.
user-invocable: true
argument-hint: "[CF-004 | next] — item ID from the plan, or `next` to pick the highest-priority todo"
---

Read `../_house-style/house-style.md` before starting.

# Cloudflare release adopt

You take **one** item from `docs/CLOUDFLARE_ADOPTION_PLAN.md` and land it. The
plan already decided *what* and *why* — that argument is over. Your job is the
smallest correct change that satisfies the item's `Steps`, plus proof it works.

The plan is written by `cloudflare-release-plan`. Its schema is
`../cloudflare-release-plan/plan-format.md` — read that first, and re-read the
stage gates in `../cloudflare-release-plan/SKILL.md`. You enforce them; you do
not relax them.

## Run

**Step 1 — pick the item.** Locate the driver, then let it rank. Priority is
overdue `Deadline` first, then bucket 1 → 2 → 3. Bucket 4 is never returned —
those are decisions to *not* act.

```bash
D=$(ls -d ~/.claude/skills/cloudflare-release-plan/driver.mjs .claude/skills/cloudflare-release-plan/driver.mjs 2>/dev/null | head -1); echo "$D"
```

```bash
node "$D" plan --todo
```

```bash
node "$D" plan --next --json
```

With an explicit ID argument, use that item instead. Do not hand-roll grep or awk
against the plan — `plan` is tested, and the obvious awk one-liner for overdue
items uses `strftime`, a gawk extension that fails on macOS BSD awk. Exit `5`
means no plan exists yet; run `cloudflare-release-plan` first.

**Step 2 — re-verify the premise before writing code.** The plan may be weeks
old and was partly written from announcements rather than from packages. Check
the item's `What this sweep did not check` counterpart in the plan. Specifically:

- Does the cited `Evidence:` path still exist and still say what the plan claims?
- Is the version in `Source:` still current?
  `node "$D" deps` (locate `$D` as in `cloudflare-release-plan`).
- For a bucket-1 "deletes code" item: does the replacement **actually** behave as
  claimed? Read the package. A workaround deleted on inference reintroduces the
  exact incident it was written to prevent.

If the premise is wrong, set `Status: blocked` with a one-line reason, say so, and
stop. **A correct refusal beats a wrong migration.**

**Step 3 — branch, then implement the item's `Steps` in order.** Do not skip a
step because it looks like ceremony. A step that says "spike, do not merge" means
the following steps depend on what the spike learned.

**Step 4 — run the repo's own checks**, discovered from its manifest, not
guessed. Look for the aggregate script first (`check`, `check:ci`, `verify`,
`precommit`) and prefer it:

```bash
node -e "const s=require('./package.json').scripts||{};for(const k of Object.keys(s))if(/^(test|lint|check|format|typecheck|build|verify)/.test(k))console.log(k.padEnd(28),s[k])"
```

Also honour the repo's own instructions file (`CLAUDE.md`, `AGENTS.md`,
`CONTRIBUTING.md`) — many mandate a specific pre-commit sequence. Run it.

**Step 5 — update the plan** in the same PR: `Status: done`, plus a
`- **Landed:** <PR url or branch>` line. A landed change with a stale plan means
the next routine re-does the work.

## Non-negotiables

- **One item per PR.** If a second item is a one-line change, it still gets its
  own PR. Bundling makes the revert a negotiation.
- **Feature-flag anything with runtime behaviour.** Grep the repo's existing
  convention (`FEATURE_*`, `ENABLE_*`, a flags module) and match it. New flag
  defaults **off** in production for one release. Config-only and CI-only changes
  are exempt.
- **Respect the stage gates.** `preview` / `experimental` / `private beta` items
  are not implementable — if one is `todo`, the plan is wrong. Set it `blocked`
  and say why rather than shipping a preview API into production.
- **Never loosen a test to make a change pass.** If a contract test fails, either
  the change broke the contract or the test encoded the old behaviour. Say which,
  with evidence. Weakening the assertion is how a silent regression ships.
- **Deadline items get the smallest possible change.** A billing deadline is
  satisfied by measuring cost and flipping a kill switch, not by a redesign.
- **Never bump a pinned dependency to a range.** A pin on an auth, crypto, or
  protocol boundary is deliberate. Move the pin, keep the pin.
- **Never touch production config for a data migration.** Populated indexes,
  databases, and queues get a baseline measurement first. If the plan says
  "compare against the eval", the eval result is the deliverable — not a migration.

## Verification is the deliverable

"Tests pass" is not proof for this kind of work. Most Cloudflare adoption changes
touch config, bindings, or a transport layer, where local tests are the weakest
signal available.

| Change type | What actually proves it |
| --- | --- |
| Binding added / changed | A non-prod deploy plus one request that exercises the binding. Config that parses is not config that works. |
| Transport / protocol | Round-trip from every registered client type, not just one. Clients negotiate differently. |
| Dependency bump | The repo's auth or smoke suite, not just unit tests. |
| Observability / tracing | A trace or log actually appears in the dashboard. |
| Deleted workaround | The original failure mode does **not** return. Re-read the deleted code's comment for the symptom it described and check for exactly that. |
| Billing / limits | A number: measured usage against the new pricing dimension. |

If you cannot verify a change in the available environment, say so plainly and
mark the item `in-progress` with a note on what verification remains. Do not
report it `done`.

## Gotchas

- **The plan's `Evidence:` line rots.** Line numbers shift; files move. Re-grep by
  symbol name, not by line number.
- **A "current" dependency can still be the wrong package.** If the plan's item is
  about a successor package under a new name, the old one bumping cleanly is
  irrelevant — check for the successor, not the version.
- **A declared dependency may never be imported.** Vendored code leaves the
  manifest entry behind. `grep -rn "from ['\"]<pkg>" src/` before bumping.
- **Compatibility dates are not version numbers.** Raising
  `compatibility_date` in a wrangler config changes runtime behaviour across every
  binding at once. It is its own item with its own PR, never a drive-by edit.
- **A feature flag in a config file is not the same as one in code.** Check both:
  a `FEATURE_X = "true"` var means nothing if no code reads it, and adding the
  read without the var means the flag is silently off.
- **Monorepos have more than one wrangler config.** A binding added to the root
  config and not the workspace that needs it fails only at runtime.
  `node "$D" surface` lists every config it found — reconcile against all of them.

## Routine mode

Unattended, on a schedule. Non-interactive, so:

1. Pick `next`. If nothing is `todo`, exit 0 saying so. **Do not invent work, and
   do not promote a bucket-4 item to justify a run.**
2. If the item's `Steps` contain anything you cannot verify unattended — a
   production deploy, a dashboard check, a spike whose outcome decides the design
   — implement up to that boundary, mark `in-progress`, and open a draft PR that
   names the human step. Never guess past it.
3. One PR, titled `<type>(cloudflare): <CF-ID> <summary>` matching the repo's
   commit convention (check `commitlint.config.*` if present).
4. PR body: the item verbatim, what you ran, what passed, and **what remains
   unverified**. That last section is required and must not be empty.
5. If checks fail and the fix isn't obvious in one pass, open the PR as a draft
   with the failure output. A visible red PR beats a silent skip.
