# LLM Skills Installation

## GitHub Copilot CLI

```bash
git clone https://github.com/blakeox/llm-skills.git ~/Documents/GitHub/llm-skills
cd ~/Documents/GitHub/llm-skills
./scripts/bootstrap-copilot.sh
```

After installing, start a new Copilot CLI session so the updated skills are loaded.

### Update later

```bash
cd ~/Documents/GitHub/llm-skills
git pull
./scripts/bootstrap-copilot.sh
```

## Claude Code

```bash
git clone https://github.com/blakeox/llm-skills.git ~/Documents/GitHub/llm-skills
cd ~/Documents/GitHub/llm-skills
./scripts/install-claude.sh
```

This will:
- Symlink all skills into `~/.claude/skills/`
- Copy agents (with `skills:` frontmatter) into `~/.claude/agents/`
- Copy the house-style rule into `~/.claude/rules/`

Start a new Claude Code session after installing.

### What you get

- 27 skills available as `/skill-name` commands
- 26 specialist agents available as subagent types
- House-style rule auto-loaded into every conversation
- Agents auto-preload their skill dependencies via `skills:` frontmatter

### Update later

```bash
cd ~/Documents/GitHub/llm-skills
git pull
./scripts/install-claude.sh
```

## OpenClaw

### Prerequisites

- OpenClaw installed and onboarded (`openclaw onboard`)
- Gateway running (`openclaw gateway`)

### Install

```bash
git clone https://github.com/blakeox/llm-skills.git ~/Documents/GitHub/llm-skills
cd ~/Documents/GitHub/llm-skills
./scripts/install-openclaw.sh
```

Then add `extraDirs` to your `~/.openclaw/openclaw.json` under `skills.load`:

```json
{
  "skills": {
    "load": {
      "extraDirs": [
        "/Users/YOUR_USERNAME/Documents/GitHub/llm-skills/skills"
      ],
      "watch": true,
      "watchDebounceMs": 250
    }
  }
}
```

Restart the gateway:

```bash
openclaw gateway restart
```

### What you get

- 27 raw skills loaded via `extraDirs` (live — changes in the repo propagate automatically)
- 26 agent-as-skills installed to `~/.openclaw/skills/` (specialist roles as slash commands)
- Orchestrator skill (`/orchestrator`) routes to the right specialist(s)

### Optional: ACP bridge to Claude Code / Codex

Add ACP config to `openclaw.json` to let Ox spawn Claude Code or Codex sessions:

```json
{
  "acp": {
    "enabled": true,
    "dispatch": { "enabled": true },
    "backend": "acpx",
    "defaultAgent": "claude",
    "allowedAgents": ["pi", "claude", "codex", "opencode", "gemini", "kimi"],
    "maxConcurrentSessions": 8
  }
}
```

Install the acpx plugin:

```bash
openclaw plugins install acpx
openclaw config set plugins.entries.acpx.enabled true
openclaw config set plugins.entries.acpx.config.permissionMode approve-all
openclaw config set plugins.entries.acpx.config.nonInteractivePermissions deny
openclaw gateway restart
```

Verify with `/acp doctor` from any channel.

### Update later

```bash
cd ~/Documents/GitHub/llm-skills
git pull
./scripts/install-openclaw.sh
openclaw gateway restart
```

## Codex

```bash
git clone https://github.com/blakeox/llm-skills.git ~/Documents/GitHub/llm-skills
cd ~/Documents/GitHub/llm-skills
./scripts/install-codex.sh
```

This symlinks all skills and agent-as-skills into `~/.codex/skills/`. Restart Codex to pick them up.

### Update later

```bash
cd ~/Documents/GitHub/llm-skills
git pull
./scripts/install-codex.sh
```

## Verify manually

```bash
# Copilot
ls ~/.copilot/skills

# Claude Code
ls ~/.claude/skills ~/.claude/agents ~/.claude/rules

# OpenClaw
ls ~/.openclaw/skills
# Raw skills load via extraDirs — check with /acp doctor or gateway logs

# Codex
ls ~/.codex/skills
```

## Notes

- The canonical published skill list lives in `skills/manifest.txt`.
- Skills are the shared vocabulary across all platforms.
- Agents are platform-specific wrappers that compose skills into specialist roles.
- The orchestrator (available on all platforms) routes tasks to the right specialist(s).
