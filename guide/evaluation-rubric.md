# Evaluation rubric

Use this when judging whether an agent answer was actually strong.

This is not about tone.
It is about decision quality.

## Scoring scale

Use a simple 0-2 scale for each dimension.

- `0` = weak or missing
- `1` = partially useful
- `2` = strong and decision-ready

## Core dimensions

### 1. Correct lens

Did the answer use the right frame for the actual question?

Strong:
- addresses the real concern
- stays in role
- does not drift into adjacent domains unless explicitly needed

Weak:
- answers a different question
- gives generally smart commentary through the wrong lens

### 2. Specificity

Did the answer name the concrete risk, trigger, or user path?

Strong:
- identifies the failure path or opportunity clearly
- avoids vague advice

Weak:
- generic observations
- abstract best-practice language

### 3. Causality

Did the answer explain why the issue happens?

Strong:
- ties symptom to mechanism
- explains how the failure emerges

Weak:
- just names a concern without showing the chain

### 4. Impact

Did the answer say who or what gets hurt?

Strong:
- names blast radius, user impact, operational impact, or compatibility impact

Weak:
- implies risk without describing consequence

### 5. Actionability

Did the answer give a concrete next move?

Strong:
- proposes a fix, route, test, or decision
- makes the next step obvious

Weak:
- leaves the reader with homework to interpret the finding

### 6. Honesty

Did the answer distinguish verified facts from assumptions?

Strong:
- states what was checked
- names confidence gaps
- avoids fake certainty

Weak:
- presents inference as proof
- overclaims runtime guarantees

## Role-specific dimensions

### Routing answers

Score these as well:
- smallest useful fleet chosen
- clear execution order when needed
- launch-ready prompts included

### Review answers

Score these as well:
- blocker vs optional separation
- hard verdict present when the role calls for one

### Execution answers

Score these as well:
- simplest correct shape
- clear scope boundaries
- reuse/delete guidance

### Testing answers

Score these as well:
- highest-risk cases first
- cheapest proving layer chosen
- explicit confidence gap when proof is incomplete

### Synthesis answers

Score these as well:
- overlap merged cleanly
- conflicts resolved explicitly
- one decision at the end

## Quick pass/fail heuristic

A strong answer usually scores:
- at least `9/12` on the six core dimensions
- with no `0` in correct lens, specificity, or actionability

If it fails that bar, it probably needs a sharper prompt, a different agent, or a better synthesis step.

## Common failure patterns

### Smart but unfocused

The answer sounds intelligent but does not answer the real question.

Usually means:
- wrong agent
- vague prompt
- too much role overlap

### Correct but weak

The answer is directionally right but too abstract to use.

Usually means:
- missing trigger scenario
- missing impact
- missing next move

### Detailed but redundant

The answer has many words without increasing decision quality.

Usually means:
- too many agents in the fleet
- weak synthesis
- repeated commentary across roles
