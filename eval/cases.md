# Eval cases

Use these cases to test the routing model, specialist quality, and synthesis quality.

## Case 1: Security-sensitive admin feature

### Prompt

```text
Use The Orchestrator to decide whether this new admin billing feature should stay single-agent or fan out to fleet. I care most about auth risk, migration safety, consumer compatibility, and final ship risk. Give me one short prompt per selected agent.
```

### Minimum good result

- chooses fleet, not single-agent
- includes `The Security Engineer`
- includes `The Migration Engineer` or `The Contract Tester` if rollout/compatibility is part of the change
- sequences `The Enforcer` after the domain specialists
- gives launch-ready prompts

### Common bad result

- routes straight to `The Architect`
- chooses too many adjacent agents without clear boundaries
- forgets the final gate

## Case 2: Settled implementation plan

### Prompt

```text
Use The Executor for this approved plan. Focus on the smallest correct implementation, what can be reused, and what should stay out of scope. End with implement now / redesign first.
```

### Minimum good result

- stays in execution mode instead of turning into architecture debate
- names simplest correct shape
- calls out reuse and deletion opportunities
- states what is out of scope

### Common bad result

- reopens settled product questions
- gives abstract coding advice
- lacks a clear go/no-go decision

## Case 3: UI redesign with accessibility risk

### Prompt

```text
Run a fleet review on this checkout redesign. Use The Designer for flow and hierarchy, The Accessibility Engineer for keyboard/focus/semantics, and The Enforcer for the final ship call. Return blockers first, then one synthesis.
```

### Minimum good result

- each agent stays in lane
- synthesis merges shared fixes
- accessibility issues are concrete, not generic
- ends with ship / fix / rethink

### Common bad result

- Designer and Accessibility Engineer repeat each other
- Enforcer adds new domain findings instead of gating
- no combined decision at the end

## Case 4: Distributed reliability concern

### Prompt

```text
Use The Reliability Engineer to review this queue-backed workflow for retry storms, observability gaps, degraded behavior, and recovery path. End with safe enough / harden before release.
```

### Minimum good result

- names failure mode and trigger
- describes what is observable versus silent
- covers retry or queue growth behavior
- gives concrete hardening moves

### Common bad result

- drifts into security or performance commentary without cause
- talks about best practices without describing failure mechanics

## Case 5: Migration under partial rollout

### Prompt

```text
Use The Migration Engineer to assess forward/backward compatibility, deploy order, rollback safety, and partial-rollout behavior for this schema transition. End with safe to roll / needs staged migration / unsafe transition.
```

### Minimum good result

- identifies compatibility windows
- describes expansion/contraction or other staged approach if needed
- explains rollback path in plain language
- ends with a hard rollout verdict

### Common bad result

- only comments on schema style
- ignores mixed-version reality
- does not say whether the rollout is safe

## Case 6: Admin auth boundary change

### Prompt

```text
Use The Security Engineer to review this admin API change that introduces role-based access for account takeover tooling. Focus on privilege escalation, trust-boundary mistakes, auditability, and data exposure. End with fix-before-release / acceptable-with-guards.
```

### Minimum good result

- identifies the privilege boundary clearly
- names an exploit path or abuse path
- requires auditability if takeover or impersonation is involved
- ends with a real ship decision

### Common bad result

- talks about auth in general terms
- ignores actor-target separation
- gives no concrete exploit sequence

## Case 7: Incident follow-through

### Prompt

```text
Run a fleet review for this payment outage retrospective. Use The Investigator for what happened and process gaps, The Reliability Engineer for production failure handling, and The Architect for structural fixes. End with the three highest-leverage recurrence-reduction actions.
```

### Minimum good result

- separates incident facts from architectural fixes
- includes observability or failure-handling improvements
- ends with a short prioritized follow-through list

### Common bad result

- turns into generic retrospective commentary
- repeats the same point across all three roles
- fails to prioritize next actions

## Case 8: Performance-sensitive hot path

### Prompt

```text
Use The Performance Engineer to review this search aggregation path for dominant latency, throughput, and cost risks. Focus on the main bottleneck, the trigger scenario, and the simplest fix. End with acceptable / optimize before scale.
```

### Minimum good result

- identifies the dominant cost or latency driver
- names the scale trigger
- suggests the smallest useful optimization
- does not drift into broad architecture redesign without cause

### Common bad result

- lists many tiny optimizations without prioritization
- ignores the main bottleneck
- gives no threshold for concern

## Case 9: Consumer-facing contract break

### Prompt

```text
Use The Contract Tester to assess this response-shape change for external API consumers. Focus on compatibility promises, likely breakage modes, and the cheapest proof strategy. End with compatible / breaking / unclear-needs-proof.
```

### Minimum good result

- names the contract surface precisely
- identifies likely consumer breakage modes
- proposes a proof strategy at the cheapest realistic layer
- ends with a hard compatibility verdict

### Common bad result

- treats contract breakage like internal refactoring
- avoids saying whether the change is breaking
- gives tests without saying what they prove

