#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
VERSION_FILE="$REPO_DIR/VERSION"
TARGET_ROOT="${1:-$HOME/.copilot}"
AGENT_TARGET="$TARGET_ROOT/agents"
SKILL_TARGET="$TARGET_ROOT/skills"

mkdir -p "$TARGET_ROOT"

if [[ -f "$VERSION_FILE" ]]; then
  VERSION="$(tr -d "[:space:]" < "$VERSION_FILE")"
else
  VERSION="unknown"
fi

echo "Bootstrapping Copilot assets version $VERSION into $TARGET_ROOT"
echo

"$REPO_DIR/scripts/install-copilot-agents.sh" "$AGENT_TARGET"
"$REPO_DIR/scripts/verify-copilot-agents.sh" "$AGENT_TARGET"
"$REPO_DIR/scripts/install-copilot-skills.sh" "$SKILL_TARGET"
"$REPO_DIR/scripts/verify-copilot-skills.sh" "$SKILL_TARGET"

echo
echo "Bootstrap complete for version $VERSION. Start a new Copilot session so updated agents and skills are loaded."
