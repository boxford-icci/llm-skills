# Plan file format

The contract between `cloudflare-release-plan` (writes) and
`cloudflare-release-adopt` (reads). Both skills read this file. Changing the
shape breaks the other skill — don't drift it casually.

Default location: `docs/CLOUDFLARE_ADOPTION_PLAN.md`. Override with `--plan=PATH`.
It lives in the target repo and is **committed** — it is the durable state, not a
scratch file. `driver.mjs state` parses it, so routines stay idempotent without a
separate state store.

## Header (required, exactly these lines)

```markdown
# Cloudflare adoption plan

- **Last swept:** 2026-08-04
- **Surface:** D1, Durable Objects, Queues, R2, Workers, Workers KV, Workflows, Wrangler
- **Next ID:** CF-018
```

- `Last swept` — `driver.mjs state` regexes this to derive `--since`. **The
  planner must bump it on every run, including runs that found nothing.** Forget
  it and the next routine re-sweeps the same window forever.
- `Surface` — paste from `driver.mjs surface`. Drift here is the signal a new
  binding was added and the plan's filter is stale.
- `Next ID` — monotonic counter. **IDs are never reused, even for rejected
  items**, because commit messages and PRs reference them.

## Item (one `###` block each)

```markdown
### CF-004 · Retire StatelessStreamableHTTPServerTransport

- **Bucket:** 1 — deletes code we maintain
- **Stage:** GA
- **Status:** todo
- **Deadline:** —
- **Evidence:** src/mcp/statelessTransport.ts
- **Source:** https://developers.cloudflare.com/changelog/post/2026-07-27-agents-sdk-v0.20.0-mcp-sdk-v2/

Why it matters, in prose. Two or three sentences. What breaks or what gets
deleted, with the concrete file that proves it.

**Steps**

1. Spike on a throwaway route in a non-prod env. Do not merge.
2. Prove the existing contract tests pass unchanged.
3. Migrate behind a feature flag, non-prod default-on.
4. Delete the dead code only after step 1 proved the workaround is dead.

**Verify**

- `npm run test:mcp`
- `npm run check:ci`
```

### Field values

| Field | Allowed values |
| --- | --- |
| `Bucket` | `1 — deletes code we maintain`, `2 — forced move`, `3 — capability or hygiene`, `4 — ignore` |
| `Stage` | `GA`, `public beta`, `open beta`, `private beta`, `preview`, `experimental`, `research preview`, `BREAKING`, `DEPRECATION`, `BILLING`, `n/a` |
| `Status` | `todo`, `in-progress`, `blocked`, `done`, `rejected` |
| `Deadline` | `YYYY-MM-DD` or `—` |
| `Evidence` | Repo-relative paths, `file.ts:12` form welcome. `—` if none. |
| `Source` | One or more Cloudflare URLs. **`driver.mjs new` dedupes against these**, so an item with no source URL will be re-reported every sweep. |

`Steps` and `Verify` are required for buckets 1–3 and omitted for bucket 4.

## Bucket 4 table

Bucket 4 items are one table row, not a block — otherwise the plan becomes
unreadable, since most releases land here. They still consume IDs so the dedupe
works.

```markdown
## Bucket 4 — checked, no action

| ID | Item | Why no action | Source |
| --- | --- | --- | --- |
| CF-011 | Node.js 24 default for Workers Builds | We don't use Workers Builds | https://... |
```

## Trailing sections (required)

```markdown
## Cadence

## What this sweep did not check
```

`What this sweep did not check` is not optional and must not be empty. A plan
that claims complete coverage is lying — the changelog holds ~1100 entries and
no sweep reads them all.

## Parsing

Use the driver — do not hand-roll grep or awk against this file. (The obvious
`awk … strftime("%Y-%m-%d")` one-liner for overdue items is a **gawk extension**
and fails on macOS BSD awk with `calling undefined function strftime`.)

```bash
node <skill-dir>/driver.mjs plan            # every item as a table
node <skill-dir>/driver.mjs plan --todo     # actionable only, priority-ordered
node <skill-dir>/driver.mjs plan --next     # the single next item
node <skill-dir>/driver.mjs plan --next --json
```

Priority order is: overdue `Deadline` first, then bucket 1 → 2 → 3, then ID.
Bucket 4 is never returned — those items are decisions to *not* act.

Exit `5` means no plan file exists yet.

Note `plan` only sees `###` item blocks, so its count excludes the bucket-4
table rows. That is intentional — the blocks are the actionable surface.
