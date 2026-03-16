# Fleet phase prompt templates

Copy, paste, and adjust these prompts when working with the agents in this repository.

## 1. Orchestrator-first routing

```text
Use The Orchestrator to decide whether this task should stay single-agent or fan out to fleet. Choose the smallest useful lineup, give me one short prompt per selected agent, and tell me what should run in parallel versus sequence.
```

## 2. Planning phase

Use when the work spans product, architecture, and design before code is written.

```text
Run a planning-phase review for this feature. Use The Product Mind for problem and scope, The Architect for system design and failure modes, and The Designer for UX/UI implications. Keep each review focused on its specialty and then synthesize the result into one build / rethink decision.
```

## 3. API planning phase

Use when the feature is backend or contract heavy.

```text
Run a planning-phase review for this API feature. Use The Product Mind for feature value, The Architect for architecture and failure modes, and The Builder for API contract, dependency, and implementation practicality concerns. Then synthesize the results.
```

## 4. Pre-merge backend/API phase

Use when the branch changes backend behavior, contracts, dependencies, or release risk.

```text
Run a pre-merge review on this branch. Use The Builder to audit API, dependency, and implementation practicality risks, and use The Enforcer to decide whether this is safe to ship. Return blockers first, then a final ship / fix / rethink verdict.
```

## 5. Execution phase

Use when product and architecture are mostly settled and the work now needs direct implementation pressure.

```text
Run an execution-phase pass for this task. Use The Architect to confirm the simplest correct shape, then use The Executor to turn that into the smallest sound implementation approach. Keep it direct, first-principles, and biased toward deletion and reuse.
```

## 6. Bug-fix phase

Use when the work is primarily about isolating and fixing a failure.

```text
Run a bug-fix pass on this issue. Use The Debugger to identify the exact trigger and root cause, then use The Tester to define the smallest regression coverage that proves the fix is real.
```

## 7. Test strategy phase

Use when the question is "what is the honest test plan here?"

```text
Run a test-strategy pass for this change. Use The Tester to define must-have, nice-to-have, and not-worth-testing coverage. Focus on contracts, state transitions, regressions, and the cheapest layer that actually proves behavior.
```

## 8. Hardening / break-test phase

Use before release or on systems that feel fragile.

```text
Run a hardening pass for this feature or branch. Use The Breaker to enumerate the most realistic production break scenarios, use The Tester to turn the highest-risk ones into concrete validation, and use The Enforcer to decide whether the remaining risk is shippable.
```

## 9. Security review phase

Use when the change touches auth, permissions, uploads, admin functions, secrets, or exposed endpoints.

```text
Run a security review on this change. Use The Security Engineer to identify real exploit paths, trust-boundary mistakes, and abuse cases. If the work is API-heavy, pair it with The Builder. If the branch is close to merge, finish with The Enforcer.
```

## 10. Performance review phase

Use when the change could affect latency, query shape, throughput, memory, or scaling ceilings.

```text
Run a performance review on this work. Use The Performance Engineer to identify the dominant cost structure, tail-latency risks, and scaling traps. Pair with The Architect if the issue is structural and The Tester if the fix needs regression coverage.
```

## 11. Reliability review phase

Use when the work spans queues, retries, background jobs, degraded behavior, alerting, or recovery under failure.

```text
Run a reliability review on this change. Use The Reliability Engineer to evaluate failure handling, observability, retry behavior, backpressure, and recovery paths. Pair with The Architect if the issue is structural and The Enforcer if the branch is nearing release.
```

## 12. Migration review phase

Use for schema changes, data moves, event version changes, or staged rollouts across services.

```text
Run a migration review for this rollout. Use The Migration Engineer to stress-test forward/backward compatibility, deploy sequencing, rollback safety, and partial-rollout behavior. Pair with The Architect for design concerns and The Enforcer before ship.
```

## 13. Contract compatibility phase

Use when multiple consumers depend on an API, schema, event payload, or interface that is changing.

```text
Run a contract-compatibility review on this change. Use The Contract Tester to define the compatibility promises, identify breaking-change risk, and specify the sharpest contract tests to prove consumers will keep working. Pair with The Builder for API-heavy work.
```

## 14. Pre-merge frontend/product phase

Use when the branch changes product behavior or user-facing screens.

```text
Run a pre-merge review on this frontend/product branch. Use The Designer for UX/UI risks and The Enforcer for production blockers and ship readiness. Return the design risks separately from the final shipping verdict.
```

## 15. Release readiness phase

Use when you want a bigger final gate on a major release.

```text
Run a release-readiness review. Use The Enforcer for ship blockers, The Builder for API/dependency/developer-experience risks, and The Architect for architectural and rollback concerns. Prioritize anything that could cause production instability or painful rollback.
```

## 16. Post-incident phase

Use after an outage, regression, or production surprise.

```text
Run a post-incident analysis. Use The Investigator to reconstruct what happened and identify process failures, then use The Architect to identify the structural gaps that allowed the incident path to exist. End with concrete changes that reduce recurrence risk.
```

## 17. Product design review phase

Use when the work is still mostly design and product direction.

```text
Run a product design review. Use Product Design Review or The Designer to critique the feature from UX and UI perspectives. Focus on user job, flow friction, hierarchy, states, accessibility, and what should be deleted or simplified.
```

## 18. Accessibility review phase

Use when keyboard behavior, semantics, focus handling, contrast, motion, or screen-reader usability matter enough to deserve their own pass.

```text
Run an accessibility review on this UI change. Use The Accessibility Engineer to audit keyboard access, focus order, semantics, announcements, validation, motion, and recovery from errors. Pair with The Designer if the usability and accessibility questions are intertwined.
```


## 19. Cloudflare release phase

Use when shipping Workers, Pages, routes, bindings, KV/R2/D1 changes, or other Cloudflare edge infrastructure.

```text
Run a Cloudflare release review. Use The Cloudflare Shipper to audit bindings, routes, stateful resources, cache behavior, and rollback realism. Finish with The Enforcer if this is the final production gate.
```

## 20. Apple release phase

Use when shipping an iOS or macOS build through TestFlight or the App Store.

```text
Run an Apple release review. Use The Apple Shipper to audit signing, entitlements, privacy disclosures, upgrade risk, and App Review-sensitive behavior. Finish with The Enforcer if you want one final ship gate.
```

## 21. AWS release phase

Use when shipping to Lambda, ECS, EKS, API Gateway, CloudFront, App Runner, or other AWS runtime surfaces.

```text
Run an AWS release review. Use The AWS Shipper to audit IAM, secrets, region/account assumptions, network shape, startup behavior, scaling settings, and rollback realism. Finish with The Enforcer if this is the final release gate.
```

## 22. Google Cloud release phase

Use when shipping to Cloud Run, GKE, App Engine, or other GCP runtime surfaces.

```text
Run a Google Cloud release review. Use The Google Cloud Shipper to audit IAM, service accounts, secret access, startup behavior, autoscaling assumptions, and rollback realism. Finish with The Enforcer if this is the final release gate.
```

## 23. Azure release phase

Use when shipping to App Service, Functions, Container Apps, AKS, slots, or other Azure runtime surfaces.

```text
Run an Azure release review. Use The Azure Shipper to audit managed identity, Key Vault access, app settings, slot or revision behavior, ingress, and rollback realism. Finish with The Enforcer if this is the final release gate.
```

## 24. Platform detection phase

Use when the repo is shipping somewhere, but you want the system to choose the right provider-specific shipper first.

```text
Run a platform-detection pass for this release. Use The Platform Administrator to infer the likely platform from repo signals and release language, choose the right provider-specific shipper, and give me one launch-ready prompt. If this is close to production, tell me whether The Enforcer should run after that.
```
