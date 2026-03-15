# Prompt patterns

Use these as reusable prompt shapes for the llm-skills bench.

They are not magic incantations. They are strong defaults.

## 1. Single specialist prompt

Use when one agent clearly owns the question.

```text
Use [agent] for this task. Focus on [primary concern]. Ignore low-value style commentary. Name the exact trigger scenario, the impact, and the fix. End with a hard verdict.
```

## 2. Orchestrator-first prompt

Use when you are unsure whether to stay single-agent or fan out.

```text
Use The Orchestrator to decide whether this should stay single-agent or fan out to fleet. I care most about [risk 1], [risk 2], and [decision needed]. Give me one short prompt per selected agent and tell me what can run in parallel.
```

## 3. Fleet prompt

Use when you already know the right lineup.

```text
Run a fleet review for this work. Use [agent A] for [question], [agent B] for [question], and [agent C] for the final gate. Keep each agent in its lane. Return blockers first, then one synthesis.
```

## 4. Synthesis prompt

Use after specialists have already done their work.

```text
Synthesize these specialist findings into one decision. Merge overlapping points, separate blockers from optional improvements, resolve conflicts explicitly, and end with one clear verdict.
```

## 5. Good risk framing

Prefer risk framing like this:

- auth risk
- consumer compatibility
- rollout safety
- retry behavior
- queue growth
- screen-reader usability
- regression coverage
- ship blockers

Avoid vague framing like this:

- just review it
- tell me your thoughts
- give feedback
- make it better

## 6. Example transformations

### Weak

```text
Review this feature.
```

### Better

```text
Use The Product Mind to decide whether this feature solves a real user problem and what the honest MVP is.
```

### Weak

```text
Look at this migration.
```

### Better

```text
Use The Migration Engineer to assess forward/backward compatibility, partial-rollout behavior, and rollback safety for this migration. End with safe to roll / needs staged migration / unsafe transition.
```

### Weak

```text
Check this UI.
```

### Better

```text
Use The Accessibility Engineer to audit keyboard access, focus order, semantics, validation behavior, and screen-reader announcements for this UI change.
```
