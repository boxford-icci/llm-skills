# Example migration transcript

## User

```text
Use The Migration Engineer to assess this move from nullable `status` to required `status` with a new enum. Focus on mixed-version deploys, rollback safety, and consumer compatibility. End with safe to roll / needs staged migration / unsafe transition.
```

## Good response shape

```text
### Migration risk
This is not safe as a one-step rollout. Old nodes still write `status = null`, while new code assumes the enum is always present.

### Partial-rollout failure path
During mixed deploy, worker jobs created by old nodes can still persist null values. New readers then fail enum decoding or branch incorrectly.

### Safe rollout shape
1. Expand first: allow null plus new enum values in readers.
2. Backfill existing rows.
3. Switch writers to the new enum.
4. Enforce non-null only after mixed-version traffic is gone.

### Rollback view
Rollback is only safe before the final non-null enforcement step. After that, old readers may not understand newly written enum states unless compatibility is preserved.

### Verdict
Needs staged migration.
```
