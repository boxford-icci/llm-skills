# Direct run workflows

Use this when you already know the right specialist and do not want to route first.

This is the fast path.

## Debug directly

```text
Use The Debugger. Investigate and fix the real blocker in this change. Separate actual code defects from branch hygiene or cleanup work. Avoid widening scope. End with what was wrong, what got fixed, and what still needs focused retest.
```

## Execute directly

```text
Use The Executor. Implement the smallest correct version of this approved plan. Reuse existing code where possible, keep scope tight, and end with implement now / redesign first.
```

## Test directly

```text
Use The Tester. Define the honest regression coverage for this change. Focus on what must be proven, the cheapest layer that proves it, and any confidence gap that remains.
```

## Ship gate directly

```text
Use The Enforcer. Review this work for real ship blockers only. Ignore low-value style commentary. End with ship / fix before merge / rethink.
```

## Security directly

```text
Use The Security Engineer. Review this change for real exploit paths, trust-boundary mistakes, privilege errors, and data exposure. End with fix-before-release / acceptable-with-guards.
```

## Migration directly

```text
Use The Migration Engineer. Assess forward/backward compatibility, mixed-version behavior, rollback safety, and rollout order. End with safe to roll / needs staged migration / unsafe transition.
```

## Rule of thumb

If you already know the job, run the specialist.
Use `The Orchestrator` only when the real question is who should own the work.

## Cloudflare release directly

```text
Use The Cloudflare Shipper. Review this Cloudflare release for route blast radius, binding mistakes, cache/state surprises, and rollback realism. End with safe to deploy / fix before deploy / Cloudflare red flag.
```

## Apple release directly

```text
Use The Apple Shipper. Review this TestFlight or App Store release for signing, entitlement, privacy, upgrade, and review blockers. End with safe for TestFlight/App Store / fix before submission / Apple release red flag.
```

## Google Cloud release directly

```text
Use The Google Cloud Shipper. Review this GCP release for IAM, secret access, startup, scaling, and rollback risk. End with safe to release / fix before release / GCP release red flag.
```

## Azure release directly

```text
Use The Azure Shipper. Review this Azure release for managed identity, Key Vault, slot or revision behavior, ingress, startup, and rollback risk. End with safe to release / fix before release / Azure release red flag.
```

## Platform detection directly

```text
Use The Platform Administrator. Infer the likely release platform from this repo and release description, choose the right provider-specific shipper, and give me one launch-ready prompt. If this is close to production, tell me whether The Enforcer should run next.
```
