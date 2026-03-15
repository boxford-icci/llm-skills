---
applyTo: "skills/**/*.md,skills/manifest.txt"
---

When editing skills in this repository:

- Match the existing public repo style before inventing a new structure.
- Keep each skill sharply scoped. One skill should answer one kind of question well.
- Preserve the house-style linkage when a skill should inherit the shared review voice.
- Prefer strong output formats over vague advice.
- If you add or remove a published skill, update both `skills/manifest.txt` and `README.md`.
- Validate skill changes with `./scripts/install-copilot-skills.sh` and `./scripts/verify-copilot-skills.sh`, ideally against a temporary target directory first.
