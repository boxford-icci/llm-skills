#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$REPO_DIR/skills/manifest.txt"
OPENCLAW_SKILLS_DIR="${HOME}/.openclaw/skills"
OPENCLAW_CONFIG="${HOME}/.openclaw/openclaw.json"

echo "LLM Skills — OpenClaw installer"
echo "Bundle version: $(cat "$REPO_DIR/VERSION")"
echo

# --- Step 1: Install raw skills via extraDirs config ---

if [[ -f "$OPENCLAW_CONFIG" ]]; then
  SKILLS_DIR="$REPO_DIR/skills"
  if grep -q "$SKILLS_DIR" "$OPENCLAW_CONFIG" 2>/dev/null; then
    echo "extraDirs already configured in openclaw.json — skipping."
  else
    echo "NOTE: Add this to your openclaw.json under skills.load.extraDirs:"
    echo "  \"$SKILLS_DIR\""
    echo
    echo "Example:"
    echo "  \"skills\": {"
    echo "    \"load\": {"
    echo "      \"extraDirs\": [\"$SKILLS_DIR\"],"
    echo "      \"watch\": true"
    echo "    }"
    echo "  }"
    echo
  fi
else
  echo "WARNING: No openclaw.json found at $OPENCLAW_CONFIG"
  echo "Run 'openclaw onboard' first, then re-run this script."
  exit 1
fi

# --- Step 2: Install agent-as-skills into ~/.openclaw/skills/ ---

AGENT_SKILLS_DIR="$REPO_DIR/openclaw/skills"

if [[ ! -d "$AGENT_SKILLS_DIR" ]]; then
  echo "ERROR: Missing openclaw/skills/ directory in repo" >&2
  exit 1
fi

mkdir -p "$OPENCLAW_SKILLS_DIR"

for skill_dir in "$AGENT_SKILLS_DIR"/*/; do
  skill_name="$(basename "$skill_dir")"
  TARGET_PATH="$OPENCLAW_SKILLS_DIR/$skill_name/"
  rsync -a --delete "$skill_dir" "$TARGET_PATH"
  echo "Installed agent skill: $skill_name"
done

echo
echo "Install complete."
echo "  Raw skills: loaded via extraDirs from $REPO_DIR/skills/"
echo "  Agent skills: installed to $OPENCLAW_SKILLS_DIR/"
echo
echo "Restart the gateway: openclaw gateway restart"
echo "Verify ACP health: /acp doctor"
