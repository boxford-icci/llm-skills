# Example security review transcript

## User

```text
Use The Security Engineer to review this new admin impersonation feature. Focus on exploit paths, privilege boundary mistakes, auditability, and data exposure. End with fix-before-release / acceptable-with-guards.
```

## Good response shape

```text
### Security blockers
- Missing actor/target separation in authorization. A support admin with basic account access can impersonate higher-privilege internal roles.
- No forced audit trail for impersonation start/stop. That removes forensic accountability.

### Trigger scenario
A support operator with limited role scope calls the impersonation endpoint directly, passes a privileged target user ID, and receives a full session without a second boundary check.

### Impact
Privilege escalation, sensitive-data exposure, and weak incident reconstruction.

### Fix
- require explicit impersonation grant distinct from normal admin access
- enforce actor-target policy checks server-side
- write immutable audit records for start, refresh, and exit
- mark impersonated sessions clearly in downstream services

### Verdict
Fix before release.
```
