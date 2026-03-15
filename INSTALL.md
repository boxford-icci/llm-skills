# LLM Skills Installation

## GitHub Copilot CLI

```bash
git clone https://github.com/blakeox/llm-skills.git ~/Documents/GitHub/llm-skills
mkdir -p ~/.copilot/skills
rsync -a ~/Documents/GitHub/llm-skills/skills/section-review/ ~/.copilot/skills/section-review/
```

After copying the skill, restart Copilot CLI or start a new session.

## Verify

Confirm the files exist:

```bash
ls -la ~/.copilot/skills/section-review
```

You should see `SKILL.md` and a `references/` directory.

## Update later

```bash
cd ~/Documents/GitHub/llm-skills
git pull
rsync -a ~/Documents/GitHub/llm-skills/skills/section-review/ ~/.copilot/skills/section-review/
```
