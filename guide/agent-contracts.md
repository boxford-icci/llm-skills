# Agent contracts

This is the compact matrix for what each agent should answer and what a good output must contain.

| Agent | Core question | Good output must contain |
|---|---|---|
| `The Product Mind` | Should we build this, for whom, and what is the honest MVP? | user problem, target user, MVP boundary, what not to build, build/rethink verdict |
| `The Architect` | Is the design shape correct? | design judgment, failure modes, alternatives, decision |
| `The Designer` | Is the flow and interface good? | UX issues, UI issues, smallest high-leverage fixes, design verdict |
| `The Accessibility Engineer` | Can diverse users actually operate this? | keyboard/focus/semantics findings, assistive-tech risks, fix list, accessibility verdict |
| `The Executor` | What is the smallest correct implementation? | outcome, scope, simplest shape, reuse/delete guidance, execution verdict |
| `The Debugger` | What is the root cause? | trigger, symptom, mechanism, fix, regression protection |
| `The Tester` | What must be proven and at what layer? | must-have tests, nice-to-have tests, not-worth-testing, confidence verdict |
| `The Breaker` | How does this fail under stress or hostile reality? | dangerous scenarios, why they matter, validation ideas, hardening verdict |
| `The Security Engineer` | Where is the exploit path? | exploit chain, asset at risk, blast radius, fix, security verdict |
| `The Performance Engineer` | What is the dominant cost or scale risk? | main cost driver, scale trigger, simplest fix, performance verdict |
| `The Reliability Engineer` | What fails badly in production conditions? | failure mode, observability gap, degraded behavior, recovery path, reliability verdict |
| `The Migration Engineer` | Is the transition survivable during rollout? | compatibility analysis, rollout order, rollback path, migration verdict |
| `The Contract Tester` | Will consumers keep working? | contract surface, compatibility promises, breaking risk, test plan, compatibility verdict |
| `The Builder` | Is the API/dependency/devex side practical? | API risk, dependency risk, onboarding/devex risk, implementation-facing summary |
| `The Enforcer` | Is this safe to ship? | blockers first, ship risks, rollback view, hard ship/fix/rethink verdict |
| `The Investigator` | What should we learn from this incident or debt? | what happened, process failures, structural gaps, recurrence-reduction actions |
| `The Orchestrator` | Who should do this work? | routing choice, chosen agents, execution order, suggested prompts, synthesis plan |

## Minimum bar

If an answer does not name the concrete risk, impact, and next move, it is not done.
