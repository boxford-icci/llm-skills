# Example orchestrator transcript

## User

```text
Use The Orchestrator to decide whether this new admin billing feature should stay single-agent or fan out to fleet. I care about auth risk, migration safety, and ship readiness.
```

## Good response shape

```text
### Routing decision
Fleet. This crosses security, migration, and pre-merge safety.

### Selected agent(s)
- The Security Engineer — identify auth, privilege, and data-exposure risks in the admin billing paths.
- The Migration Engineer — assess rollout order, backward compatibility, and rollback safety.
- The Enforcer — decide whether the remaining risk is acceptable to ship.

### Execution plan
Run Security Engineer and Migration Engineer in parallel. Run Enforcer after both complete.

### Suggested prompts
...

### Final synthesis plan
Treat security or migration blockers as ship blockers unless explicitly mitigated.
```
