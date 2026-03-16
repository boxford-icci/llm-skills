# Workflow Guide — Blake Oxford LLM Skills

## The skills

| Skill | When to use | Cognitive mode |
|---|---|---|
| `/plan-product-review` | Before deciding what to build | Is this the right thing? |
| `/plan-eng-review` | After product direction is locked | Is the architecture sound? |
| `/execute` | Time to write code | Build it, fix it, refactor it, delete it |
| `/section-review` | Reviewing existing code/UI in depth | What's the real quality? |
| `/paranoid-review` | Before merging a branch | Will this survive production? |
| `/ship` | Branch is ready, land it | Pass the gate or fix it |
| `/api-review` | Reviewing API design | Use it, then break it |
| `/ux-designer` | Evaluating user experience | Can a real user do their job? |
| `/ui-designer` | Evaluating visual design | Does it look right and feel consistent? |
| `/a11y-audit` | Accessibility compliance | Can everyone use this? |
| `/test-audit` | Evaluating test suite quality | Is our coverage real or fake? |
| `/test-write` | Writing missing tests | Cover the paths that matter |
| `/test-fix` | Fixing broken or flaky tests | Is the test wrong or the code wrong? |
| `/dep-audit` | Periodic or before adding deps | Does every dep earn its place? |
| `/tech-debt` | Sprint planning, quarterly review | What's the real cost of carrying this? |
| `/onboarding-audit` | New project setup, periodic check | Can a stranger get this running? |
| `/postmortem` | After an incident | What happened and why did we allow it? |
| `/retro` | End of week/sprint | What actually happened? (git, not vibes) |

## Feature lifecycle

The skills form a pipeline. Each one has a different job at a different stage.

```
Idea
 │
 ▼
/plan-product-review ─── Is this the right thing to build?
 │                        Verdict: Build / Rethink / Don't build
 │
 ▼
/plan-eng-review ──────── Is the architecture sound?
 │                        Verdict: Ready / Needs work / Wrong approach
 │
 ▼
/execute build ────────── Write the code
 │                        Reads before writing. Tests what it ships.
 │
 ▼
/paranoid-review ──────── Will this survive production?
 │                        Verdict: Ship / Fix then ship / Rethink
 │
 ├── Fix then ship? ──▶ /execute fix ──▶ (loop back to /paranoid-review)
 │
 ▼
/ship ─────────────────── Pre-flight gate
 │                        Verdict: PASS / BLOCK
 │
 ├── BLOCK? ──────────▶ /execute fix ──▶ (loop back to /ship)
 │
 ▼
Merged
```

## Periodic audits

These aren't tied to a feature. Run them on a schedule.

| Cadence | Skill | Why |
|---|---|---|
| Weekly | `/retro` | What actually shipped, who did what, what to change |
| Monthly | `/dep-audit` | Catch CVEs, abandoned deps, unnecessary deps |
| Monthly | `/tech-debt` | Track cost trends, reprioritize |
| Quarterly | `/onboarding-audit` | Test the new-developer experience before it rots |
| After any incident | `/postmortem` | Find the process failure, not just the code failure |

## Deep dives

Use these when you need focused analysis on a specific area.

| Trigger | Skill |
|---|---|
| "This section feels wrong" | `/section-review [section]` |
| "Is our API well-designed?" | `/api-review [routes]` |
| "We keep having bugs in X" | `/section-review [X]` then `/tech-debt [X]` |
| "New hire couldn't get set up" | `/onboarding-audit` |

## Parallel review

`/parallel-review` orchestrates multiple skills as parallel subagents and synthesizes the results.

| Mode | Skills spawned | When |
|---|---|---|
| `pre-merge` | `/paranoid-review` + `/dep-audit` + `/ship` | Before merging any PR |
| `deep-audit` | `/section-review` + `/tech-debt` + `/api-review` | Quarterly or pre-launch |
| `health` | `/dep-audit` + `/tech-debt` + `/onboarding-audit` | Monthly check-in |
| `post-incident` | `/postmortem` + `/retro` + `/paranoid-review` | After any outage |
| `test` | `/test-audit` + `/test-write` + `/test-fix` | Test suite overhaul |
| `design` | `/ux-designer` + `/ui-designer` + `/a11y-audit` | Full frontend quality audit |

Usage:

```
/parallel-review pre-merge feature/payments
/parallel-review deep-audit src/
/parallel-review health .
/parallel-review post-incident #incident-47
/parallel-review test src/
/parallel-review design src/components/
```

The coordinator deduplicates findings across reviewers, resolves severity conflicts (takes the higher), surfaces contradictions, and produces a single prioritized report with a combined verdict.

## Combining skills

Skills are more powerful in sequence:

- **Product → Eng → Implement → Review → Ship** — the full feature lifecycle
- **Section review → Tech debt** — find what's wrong, then quantify the cost
- **Dep audit → Paranoid review** — audit deps, then review the code that uses them
- **Postmortem → Retro** — investigate the incident, then zoom out to the week
- **Onboarding audit → Tech debt** — friction points often reveal structural debt
- **Test audit → Test write → Test fix** — audit quality, fill gaps, fix what's broken
- **Paranoid review → Test write** — review finds bugs, tests prevent recurrence
- **Execute build → Parallel review test** — build the feature, then verify the tests are real
- **UX review → UI review → A11y audit** — flows, then visuals, then compliance
- **Parallel review design → Execute fix** — find all frontend issues, then fix them
- **A11y audit → Execute fix → Ship** — accessibility compliance before shipping

## When NOT to use a skill

- Don't use `/plan-product-review` when the product direction is already locked and validated. It will question decisions that have already been made.
- Don't use `/paranoid-review` on a prototype. Use `/section-review` with prototype stage instead.
- Don't use `/ship` before `/paranoid-review`. The gate checks hygiene, not correctness.
- Don't use `/retro` mid-sprint for planning. It looks backward, not forward.
- Don't use `/postmortem` for near-misses that didn't impact users. Use `/paranoid-review` on the code instead.
