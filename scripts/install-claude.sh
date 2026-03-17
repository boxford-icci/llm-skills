#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$REPO_DIR/skills/manifest.txt"
CLAUDE_DIR="${HOME}/.claude"

echo "LLM Skills — Claude Code installer"
echo "Bundle version: $(cat "$REPO_DIR/VERSION")"
echo

# --- Step 1: Install skills via symlinks ---

SKILLS_TARGET="$CLAUDE_DIR/skills"
mkdir -p "$SKILLS_TARGET"

while IFS= read -r skill || [[ -n "$skill" ]]; do
  [[ -z "$skill" ]] && continue
  SOURCE="$REPO_DIR/skills/$skill"
  TARGET="$SKILLS_TARGET/$skill"

  if [[ ! -d "$SOURCE" ]]; then
    echo "WARNING: Missing source $SOURCE — skipping" >&2
    continue
  fi

  if [[ -L "$TARGET" ]]; then
    rm "$TARGET"
  elif [[ -d "$TARGET" ]]; then
    echo "EXISTS (not symlink): $skill — skipping"
    continue
  fi

  ln -s "$SOURCE" "$TARGET"
  echo "Linked skill: $skill"
done < "$MANIFEST"

echo

# --- Step 2: Install agents ---

AGENTS_SOURCE="$REPO_DIR/claude/agents"
AGENTS_TARGET="$CLAUDE_DIR/agents"
mkdir -p "$AGENTS_TARGET"

for agent_file in "$AGENTS_SOURCE"/*.md; do
  name="$(basename "$agent_file")"
  cp "$agent_file" "$AGENTS_TARGET/$name"
  echo "Installed agent: $name"
done

echo

# --- Step 3: Install house-style rule ---

RULES_DIR="$CLAUDE_DIR/rules"
mkdir -p "$RULES_DIR"

if [[ -f "$REPO_DIR/claude/rules/house-style.md" ]]; then
  cp "$REPO_DIR/claude/rules/house-style.md" "$RULES_DIR/house-style.md"
  echo "Installed rule: house-style.md"
fi

echo
echo "Install complete."
echo "  Skills: symlinked to $SKILLS_TARGET/"
echo "  Agents: copied to $AGENTS_TARGET/"
echo "  Rules: copied to $RULES_DIR/"
echo
echo "Start a new Claude Code session to pick up the changes."
