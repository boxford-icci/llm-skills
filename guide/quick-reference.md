# Quick reference

Use this when you need the shortest possible reminder of how to route work in this repository.

## Single-agent defaults

- `The Product Mind` — should we build this and what is the honest MVP?
- `The Architect` — is the design shape correct?
- `The Designer` — is the flow and interface good?
- `The Accessibility Engineer` — can real users operate this with keyboard and assistive tech?
- `The Executor` — what is the smallest correct implementation?
- `The Debugger` — what is the root cause?
- `The Tester` — what must be proven and at what layer?
- `The Breaker` — how does this fail under hostile reality?
- `The Security Engineer` — where is the exploit path?
- `The Performance Engineer` — what is the dominant cost or scale risk?
- `The Reliability Engineer` — what fails badly in production conditions?
- `The Migration Engineer` — is the transition survivable during rollout?
- `The Contract Tester` — will consumers keep working?
- `The Builder` — is the API/dependency/devex side practical?
- `The Enforcer` — is this safe to ship?
- `The Investigator` — what should we learn from the incident or debt?

## Smallest useful fleets

- New feature: `The Product Mind` + `The Architect` + `The Designer`
- Accessibility-heavy UI: `The Designer` + `The Accessibility Engineer` + `The Enforcer`
- Implementation from approved plan: `The Architect` + `The Executor` + `The Tester`
- Bug and regression: `The Debugger` + `The Tester`
- Security-sensitive API change: `The Security Engineer` + `The Builder` + `The Enforcer`
- Performance-sensitive system change: `The Architect` + `The Performance Engineer` + `The Tester`
- Reliability-sensitive distributed change: `The Reliability Engineer` + `The Architect` + `The Enforcer`
- Migration or rollout: `The Migration Engineer` + `The Contract Tester` + `The Enforcer`
- Incident follow-through: `The Investigator` + `The Reliability Engineer` + `The Architect`

## Fast routing rules

- One real question -> one specialist.
- Two or more distinct risk surfaces -> smallest useful fleet.
- If ship risk matters -> end with `The Enforcer`.
- If consumer compatibility matters -> include `The Contract Tester`.
- If partial failure matters -> include `The Reliability Engineer`.
- If assistive-tech operation matters -> include `The Accessibility Engineer`.

## Prompt skeletons

### Orchestrator-first

```text
Use The Orchestrator to decide whether this should stay single-agent or fan out to fleet. I care most about [risk 1], [risk 2], and [decision I need]. Give me one short prompt per selected agent.
```

### Single specialist

```text
Use [agent] for this change. Focus on [specific concern], ignore low-value style commentary, and end with a hard verdict.
```

### Fleet with synthesis

```text
Run a fleet review for this work. Use [agent A] for [question], [agent B] for [question], and [agent C] for the final ship/decision gate. Return blockers first, then one synthesis.
```
