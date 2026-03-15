# Self audit

Use this periodically to check whether the llm-skills bench is still coherent.

This is a health check for the system, not a celebration of how much content exists.

## 1. Routing clarity

Ask:
- can a new user pick the right agent quickly?
- are overlap rules short and sharp?
- do eval cases still test the most important risk surfaces?

If not, routing has drifted.

## 2. Bench sharpness

Ask:
- which agents regularly change the final decision?
- which agents mostly repeat neighbors?
- which roles still have a distinct decision surface?

Use `guide/pruning-guide.md` if the bench is getting fuzzy.

## 3. Prompt quality

Spot-check real prompts or eval cases.

Ask:
- are prompts concrete?
- do they name the risk surface?
- do they request a hard verdict when appropriate?

If not, weak results may be prompt problems, not agent problems.

## 4. Output quality

Use `guide/evaluation-rubric.md` on a few fresh runs.

Look for:
- wrong-lens answers
- vague findings
- missing trigger or impact
- no clear next move
- weak synthesis

## 5. Example truthfulness

Ask:
- do the examples still reflect how the bench actually behaves?
- are the goldens still the standard we want?
- do recipes still match the current routing guidance?

If not, update them before adding more docs.

## 6. Operational readiness

Check:
- `VERSION` is current
- `CHANGELOG.md` reflects meaningful changes
- `scripts/bootstrap-copilot.sh` still works cleanly
- install and verify scripts still pass

## 7. Audit verdict

End each audit with one of these:
- healthy
- healthy but prune soon
- routing drift
- example drift
- release not ready

If you do not end with a verdict, the audit was too vague.
