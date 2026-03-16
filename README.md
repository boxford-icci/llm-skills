# LLM Skills

Public home for Blake Oxford's open-source workflow and review skills.

Current bundle version: `0.6.0`

This repo now also includes **repository-level custom agent scaffolds** in `.github/agents/` that bundle the skills into practical teams for Copilot CLI and other Copilot agent surfaces.

It also now includes **Copilot routing instructions** and **phase prompt templates** so the repo itself nudges Copilot toward better specialist selection, better fleet usage, and a clearer path from planning to execution and testing.

## Included skills

- `_house-style`
- `api-review`
- `apple-ship`
- `aws-ship`
- `azure-ship`
- `cloudflare-ship`
- `dep-audit`
- `google-cloud-ship`
- `onboarding-audit`
- `paranoid-review`
- `plan-eng-review`
- `plan-product-review`
- `postmortem`
- `retro`
- `section-review`
- `ship`
- `supabase-ship`
- `tech-debt`
- `ui-designer`
- `ux-designer`
- `vercel-ship`

These are the published skills currently included in this repository.

## Custom agent bundles

The `.github/agents/` directory contains opinionated agent profiles that bundle these skills by job:

- `orchestrator.agent.md` — meta-agent that decides single-agent vs fleet-style delegation
- `enforcer.agent.md` — `paranoid-review` + `ship`
- `architect.agent.md` — `plan-eng-review` + `section-review`
- `product-mind.agent.md` — `plan-product-review`
- `executor.agent.md` — direct first-principles implementation specialist
- `debugger.agent.md` — root-cause bug-fixing specialist
- `tester.agent.md` — high-signal test strategy specialist
- `breaker.agent.md` — adversarial hardening and break-testing specialist
- `security.agent.md` — auth, trust-boundary, abuse-path, and exposure specialist
- `performance.agent.md` — latency, memory, throughput, and scale specialist
- `reliability.agent.md` — observability, retries, failure handling, and recovery specialist
- `migration.agent.md` — staged rollout, schema/data transition, and rollback specialist
- `contract-tester.agent.md` — consumer compatibility and contract-validation specialist
- `builder.agent.md` — `api-review` + `dep-audit` + `onboarding-audit`
- `investigator.agent.md` — `postmortem` + `retro` + `tech-debt`
- `designer.agent.md` — `ux-designer` + `ui-designer`
- `accessibility.agent.md` — keyboard, screen-reader, semantics, and inclusive-interaction specialist
- `product-design-review.agent.md` — orchestration layer for `ux-designer` + `ui-designer`
- `cloudflare-ship.agent.md` — Cloudflare-specific ship and rollout specialist
- `apple-ship.agent.md` — Apple/TestFlight/App Store release specialist
- `aws-ship.agent.md` — AWS-specific release specialist
- `google-cloud-ship.agent.md` — Google Cloud-specific release specialist
- `azure-ship.agent.md` — Azure-specific release specialist
- `platform-administrator.agent.md` — detects likely platform and routes to the right provider-specific shipper
- `supabase-ship.agent.md` — Supabase-specific release specialist
- `vercel-ship.agent.md` — Vercel-specific release specialist

Important nuance: skills are still selected by relevance. The custom agents do not hard-pin a skill in the Copilot runtime. Instead, their prompts tell Copilot which skills to lean on for that role.

The same nuance applies to the orchestrator agent: it does not force a private hidden fleet API. It gives Copilot a disciplined routing policy so the model can choose the right specialist or group of specialists.

Best-practice note: keep `The Orchestrator` lightweight. It should route and scope work, not redo the actual specialist review itself.

With these additions, the repo is no longer only review-oriented. It now has a fuller bench:
- plan with `The Product Mind`, `The Architect`, `The Designer`
- include with `The Accessibility Engineer`
- execute with `The Executor`
- debug with `The Debugger`
- prove with `The Tester`
- attack with `The Breaker`
- secure with `The Security Engineer`
- scale with `The Performance Engineer`
- stabilize with `The Reliability Engineer`
- migrate with `The Migration Engineer`
- protect contracts with `The Contract Tester`
- ship on Cloudflare with `The Cloudflare Shipper`
- ship on Apple platforms with `The Apple Shipper`
- ship on AWS with `The AWS Shipper`
- ship on Google Cloud with `The Google Cloud Shipper`
- ship on Azure with `The Azure Shipper`
- ship on Supabase with `The Supabase Shipper`
- ship on Vercel with `The Vercel Shipper`
- detect the right platform shipper with `The Platform Administrator`
- gate with `The Enforcer`

### Recommended `/fleet` pattern

For a new feature:

- Planning phase: `The Product Mind`, `The Architect`, `The Designer`
- Accessibility-sensitive UI phase: `The Designer`, `The Accessibility Engineer`
- Build phase: `The Architect`, `The Executor`
- Test/hardening phase: `The Tester`, `The Breaker`
- Security/performance/reliability/migration phase: `The Security Engineer`, `The Performance Engineer`, `The Reliability Engineer`, `The Migration Engineer`, `The Contract Tester` as needed
- Pre-merge phase: `The Enforcer`, `The Builder`
- Provider release phase: relevant platform shipper + `The Enforcer`
- Unknown provider phase: `The Platform Administrator`, then relevant platform shipper + `The Enforcer`
- Post-incident or periodic review: `The Investigator`

### Orchestrator-first usage

If you want Copilot to decide whether a task needs one specialist or several, start with `The Orchestrator`.

Examples:

```bash
copilot --agent=orchestrator --prompt "Decide whether this feature request needs a fleet review, and if so choose the right agents"
copilot --agent=orchestrator --prompt "Route this PR review to the right agents and tell me whether to use fleet"
```

In the interactive CLI, you can also say:

```text
Use The Orchestrator to decide whether this should stay single-agent or fan out to fleet.
```

If you want a shorter operational handoff instead of the full routing memo, say so explicitly:

```text
Use The Orchestrator in concise handoff mode. Just tell me the next agent to run, give me one clean prompt, and keep it short.
```

The intended workflow is:
1. Start with `The Orchestrator`
2. Let it choose the smallest useful lineup
3. If it recommends multiple agents, switch to `/fleet`
4. Run the recommended agents in parallel
5. Synthesize the results back into one decision

Treat it like a dispatcher:
- `The Orchestrator` chooses
- specialist agents analyze
- you or a final synthesis pass combines the outputs

Use full routing mode when you want the reasoning, lineup, and sequencing spelled out.
Use concise handoff mode when you already trust the router and just want the next move.

The Orchestrator now has anti-stall behavior:
- if you say "do it", "run it", or "fix it", it should bias toward concise handoff mode
- if the ask is repeated, it should stop repeating the full routing memo
- if the situation is fuzzy but still actionable, it should choose the best specialist instead of staying meta
- if the issue is branch hygiene or cleanup, it should bias toward `The Executor`
- if the issue is a real defect or blocker, it should bias toward `The Debugger`

## Routing matrix

Use this as the quick "who should I call?" reference.

| Situation | Best single agent | Common fleet lineup |
|---|---|---|
| Feature idea or scope debate | `The Product Mind` | `The Product Mind` + `The Architect` + `The Designer` |
| Accessibility audit or inclusive interaction issue | `The Accessibility Engineer` | `The Designer` + `The Accessibility Engineer` + `The Enforcer` |
| Technical design or RFC | `The Architect` | `The Product Mind` + `The Architect` |
| Direct implementation from a settled plan | `The Executor` | `The Architect` + `The Executor` + `The Tester` |
| Bug or regression | `The Debugger` | `The Debugger` + `The Tester` |
| Test plan or coverage gap | `The Tester` | `The Tester` + `The Contract Tester` |
| Security-sensitive API/admin/auth change | `The Security Engineer` | `The Security Engineer` + `The Builder` + `The Enforcer` |
| Performance concern or scaling path | `The Performance Engineer` | `The Architect` + `The Performance Engineer` + `The Tester` |
| Reliability concern, queues, retries, or observability | `The Reliability Engineer` | `The Reliability Engineer` + `The Architect` + `The Enforcer` |
| Schema/data/API transition | `The Migration Engineer` | `The Migration Engineer` + `The Architect` + `The Contract Tester` + `The Enforcer` |
| Consumer-facing API/schema change | `The Contract Tester` | `The Builder` + `The Contract Tester` + `The Enforcer` |
| Final ship gate | `The Enforcer` | `The Builder` + `The Enforcer` |
| Cloudflare release or edge rollout | `The Cloudflare Shipper` | `The Cloudflare Shipper` + `The Enforcer` |
| Apple/TestFlight/App Store release | `The Apple Shipper` | `The Apple Shipper` + `The Enforcer` |
| AWS release or rollout | `The AWS Shipper` | `The AWS Shipper` + `The Enforcer` |
| Google Cloud release or rollout | `The Google Cloud Shipper` | `The Google Cloud Shipper` + `The Enforcer` |
| Azure release or slot/revision rollout | `The Azure Shipper` | `The Azure Shipper` + `The Enforcer` |
| Supabase release or rollout | `The Supabase Shipper` | `The Supabase Shipper` + `The Enforcer` |
| Vercel release or rollout | `The Vercel Shipper` | `The Vercel Shipper` + `The Enforcer` |
| Unknown platform release | `The Platform Administrator` | `The Platform Administrator` + relevant shipper + `The Enforcer` |
| Incident / retro / debt learning | `The Investigator` | `The Investigator` + `The Architect` + `The Reliability Engineer` |

## Overlap rules

Use these rules when adjacent agents look similar:

- `The Builder` vs `The Contract Tester`
  - Use `The Builder` for API shape, dependency risk, onboarding friction, and practical delivery concerns.
  - Use `The Contract Tester` when the core question is whether consumers will keep working across changes.

- `The Security Engineer` vs `The Reliability Engineer`
  - Use `The Security Engineer` for exploit paths, trust boundaries, auth, data exposure, and abuse cases.
  - Use `The Reliability Engineer` for retries, observability, backpressure, degraded behavior, and recovery under failure.

- `The Performance Engineer` vs `The Reliability Engineer`
  - Use `The Performance Engineer` when the main risk is cost, latency, throughput, or scale ceiling.
  - Use `The Reliability Engineer` when the main risk is partial failure, operational visibility, queue growth, or cascading failure.

- `The Designer` vs `The Accessibility Engineer`
  - Use `The Designer` for flow, hierarchy, screen quality, and general usability.
  - Use `The Accessibility Engineer` when keyboard support, semantics, focus management, screen readers, motion, contrast, or inclusive operation are first-order concerns.

- `The Enforcer` vs everyone else
  - Use the specialist agents to find domain-specific risk.
  - Use `The Enforcer` when you want the final pre-merge or pre-release gate.

## Operating guide

If you want the doctrine behind this repository — philosophy, routing rules, anti-patterns, output contracts, and maintenance rules — read:

- `guide/operating-model.md`
- `guide/quick-reference.md`
- `guide/change-checklist.md`
- `guide/prompt-patterns.md`
- `guide/agent-contracts.md`
- `guide/glossary.md`
- `guide/troubleshooting.md`
- `guide/evaluation-rubric.md`
- `guide/pruning-guide.md`
- `guide/release-checklist.md`
- `guide/self-audit.md`

Use `operating-model.md` for doctrine, `quick-reference.md` for fast routing, `change-checklist.md` when evolving the bench or docs, `prompt-patterns.md` for reusable prompt shapes, `agent-contracts.md` for output expectations, `glossary.md` for shared language, `troubleshooting.md` when the system gets fuzzy or noisy, `evaluation-rubric.md` when you need to judge answer quality consistently, `pruning-guide.md` when the bench starts feeling crowded or redundant, `release-checklist.md` before publishing updates, and `self-audit.md` for periodic bench health checks.

## Copilot routing files

These files improve automatic behavior inside repositories that use this setup:

- `.github/copilot-instructions.md` — repository-wide rules for how Copilot should treat skills, agents, validation, and docs in this repo
- `.github/instructions/skills.instructions.md` — path-specific guidance for editing `skills/**`
- `.github/instructions/agents.instructions.md` — path-specific guidance for editing `.github/agents/**` and agent install scripts

These files do not create magic hard routing. They bias Copilot toward the intended specialist model and reduce prompt repetition.

## Phase prompt templates

Copy-paste-ready prompts live in:

- `templates/fleet-phase-prompts.md`

This file gives you reusable prompts for:

- orchestrator-first routing
- planning-phase review
- API planning
- execution phase
- bug-fix phase
- test strategy
- hardening / break-test phase
- security review phase
- performance review phase
- reliability review phase
- migration review phase
- contract compatibility phase
- pre-merge backend/API review
- pre-merge frontend/product review
- release readiness
- post-incident analysis
- product design review
- accessibility review phase

### Using these agents

In Copilot CLI:

```bash
copilot
/agent
```

Or invoke directly:

```bash
copilot --agent=enforcer --prompt "Review this PR diff for production blockers"
copilot --agent=designer --prompt "Review the checkout mockups and flow"
copilot --agent=accessibility --prompt "Audit this UI for keyboard, screen reader, and focus problems"
copilot --agent=executor --prompt "Implement the smallest correct version of this approved plan"
copilot --agent=tester --prompt "Define the honest regression coverage for this change"
copilot --agent=security --prompt "Review this auth/API change for real exploit paths"
copilot --agent=reliability --prompt "Review this distributed flow for retries, observability, and failure handling"
copilot --agent=migration --prompt "Stress-test this schema rollout and rollback plan"
```

If you want parallel review, use `/fleet` from inside the CLI and assign the relevant agents to the same task phase.

To make these agent profiles available across projects, install them to your user-level Copilot agents directory:

```bash
cd ~/Documents/GitHub/llm-skills
./scripts/install-copilot-agents.sh
./scripts/verify-copilot-agents.sh
```

This copies the `.agent.md` files into `~/.copilot/agents/`. If you only want them in one repository, keep them in that repository's `.github/agents/` directory instead.

## Evaluation harness

If you want to test whether the bench is actually useful instead of just well-documented, use the files in `eval/`.

- `eval/README.md` — how to run the manual evaluation loop
- `eval/cases.md` — routing, review, execution, security, incident, performance, contract, reliability, and migration test cases

Use these with `guide/evaluation-rubric.md` and the golden transcripts in `examples/`.

## Scenario recipes and goldens

If you want copy-paste workflows or concrete golden response shapes instead of inventing prompts from scratch, use the files in `recipes/` and `examples/`. The direct-run recipe is the fastest path when you do not need routing first.

- `recipes/feature-workflow.md` — feature from idea to pre-merge
- `recipes/incident-workflow.md` — outage, regression, and follow-through
- `recipes/platform-change-workflow.md` — migrations, contracts, security, reliability, and ship gate
- `recipes/direct-run-workflows.md` — fast-path prompts when you already know the right specialist
- `The Platform Administrator` — fastest route when you know you are shipping but not which shipper should own the release
- `examples/orchestrator-transcript.md` — example orchestrator prompt and response shape
- `examples/fleet-review-transcript.md` — example specialist lineup and synthesis flow
- `examples/executor-transcript.md` — example execution-scoping response shape
- `examples/security-review-transcript.md` — example exploit-path review shape
- `examples/migration-transcript.md` — example staged-rollout review shape

## Versioning

- `VERSION` — current bundle version marker for the repo and bootstrap flow

## Changelog

- `CHANGELOG.md` — high-level record of the bench, guide, eval, and tooling additions in this build-out

## Operational checklists

- `guide/release-checklist.md` — what to verify before publishing or recommending an updated bundle
- `guide/self-audit.md` — periodic health check for overlap, routing drift, and weak roles

## Cross-tool compatibility

This repository is now structured so the same bench can be used across several agentic coding tools with minimal rework:

- `AGENTS.md` — shared repository contract for cross-tool agents
- `CLAUDE.md` — Claude Code root instructions
- `.cursor/rules/llm-skills.mdc` — Cursor project rules
- `.clinerules/01-llm-skills.md` — Cline workspace rules
- `DEVIN_TASKS.md` — Devin-oriented task framing and validation guide
- `orchestration/crewai/` — CrewAI starter agent and task maps
- `orchestration/langchain/agent-map.yaml` — LangChain/LangGraph starter role graph

These files do not replace the source surfaces. The canonical bench still lives in `skills/`, `.github/agents/`, `codex/agents/`, and `claude/agents/`.

## Install for GitHub Copilot CLI

```bash
git clone https://github.com/blakeox/llm-skills.git ~/Documents/GitHub/llm-skills
cd ~/Documents/GitHub/llm-skills
./scripts/bootstrap-copilot.sh
```

The bootstrap script prints the bundle version from `VERSION` so installs are easier to identify.

If you prefer the explicit steps, you can still run the install and verify scripts individually:

```bash
./scripts/install-copilot-agents.sh
./scripts/verify-copilot-agents.sh
./scripts/install-copilot-skills.sh
./scripts/verify-copilot-skills.sh
```

The canonical published set lives in `skills/manifest.txt`. The install script syncs each listed directory with `rsync -a --delete` so stale local files do not linger.

Start a new Copilot session after installing or updating the skills so they get picked up.

## Update later

```bash
cd ~/Documents/GitHub/llm-skills
git pull
./scripts/bootstrap-copilot.sh
```

The bootstrap script prints the bundle version from `VERSION` so installs are easier to identify.

Or rerun the individual install and verify scripts if you want a more explicit update flow.

## Repository layout

```text
llm-skills/
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/
│   │   ├── accessibility.agent.md
│   │   ├── apple-ship.agent.md
│   │   ├── aws-ship.agent.md
│   │   ├── architect.agent.md
│   │   ├── azure-ship.agent.md
│   │   ├── breaker.agent.md
│   │   ├── builder.agent.md
│   │   ├── cloudflare-ship.agent.md
│   │   ├── contract-tester.agent.md
│   │   ├── debugger.agent.md
│   │   ├── designer.agent.md
│   │   ├── enforcer.agent.md
│   │   ├── executor.agent.md
│   │   ├── google-cloud-ship.agent.md
│   │   ├── investigator.agent.md
│   │   ├── migration.agent.md
│   │   ├── orchestrator.agent.md
│   │   ├── performance.agent.md
│   │   ├── platform-administrator.agent.md
│   │   ├── reliability.agent.md
│   │   ├── product-design-review.agent.md
│   │   ├── product-mind.agent.md
│   │   ├── security.agent.md
│   │   ├── supabase-ship.agent.md
│   │   ├── vercel-ship.agent.md
│   │   └── tester.agent.md
│   └── instructions/
│       ├── agents.instructions.md
│       └── skills.instructions.md
├── .clinerules/
│   └── 01-llm-skills.md
├── .cursor/
│   └── rules/
│       └── llm-skills.mdc
├── orchestration/
│   ├── README.md
│   ├── crewai/
│   │   ├── agents.yaml
│   │   └── tasks.yaml
│   └── langchain/
│       └── agent-map.yaml
├── scripts/
│   ├── bootstrap-copilot.sh
│   ├── install-copilot-agents.sh
│   ├── install-copilot-skills.sh
│   ├── verify-copilot-agents.sh
│   └── verify-copilot-skills.sh
├── AGENTS.md
├── CHANGELOG.md
├── CLAUDE.md
├── DEVIN_TASKS.md
├── VERSION
├── eval/
│   ├── README.md
│   └── cases.md
├── examples/
│   ├── executor-transcript.md
│   ├── fleet-review-transcript.md
│   ├── migration-transcript.md
│   ├── orchestrator-transcript.md
│   └── security-review-transcript.md
├── guide/
│   ├── agent-contracts.md
│   ├── change-checklist.md
│   ├── evaluation-rubric.md
│   ├── glossary.md
│   ├── pruning-guide.md
│   ├── release-checklist.md
│   ├── self-audit.md
│   ├── operating-model.md
│   ├── prompt-patterns.md
│   ├── quick-reference.md
│   └── troubleshooting.md
├── recipes/
│   ├── direct-run-workflows.md
│   ├── feature-workflow.md
│   ├── incident-workflow.md
│   └── platform-change-workflow.md
├── templates/
│   └── fleet-phase-prompts.md
└── skills/
    ├── manifest.txt
    ├── _house-style/
    ├── api-review/
    ├── apple-ship/
    ├── aws-ship/
    ├── azure-ship/
    ├── cloudflare-ship/
    ├── dep-audit/
    ├── google-cloud-ship/
    ├── onboarding-audit/
    ├── paranoid-review/
    ├── plan-eng-review/
    ├── plan-product-review/
    ├── postmortem/
    ├── retro/
    ├── section-review/
    ├── ship/
    ├── supabase-ship/
    ├── tech-debt/
    ├── ui-designer/
    ├── vercel-ship/
    └── ux-designer/
```
