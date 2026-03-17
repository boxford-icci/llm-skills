#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$REPO_DIR/skills/manifest.txt"
CODEX_SKILLS="${HOME}/.codex/skills"

echo "LLM Skills — Codex installer"
echo "Bundle version: $(cat "$REPO_DIR/VERSION")"
echo

if [[ ! -d "${HOME}/.codex" ]]; then
  echo "WARNING: No ~/.codex directory found. Install Codex first."
  exit 1
fi

mkdir -p "$CODEX_SKILLS"

# --- Step 1: Symlink raw skills ---

while IFS= read -r skill || [[ -n "$skill" ]]; do
  [[ -z "$skill" ]] && continue
  SOURCE="$REPO_DIR/skills/$skill"
  TARGET="$CODEX_SKILLS/$skill"

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

# --- Step 2: Symlink agent-as-skills from openclaw/skills ---

AGENT_SKILLS="$REPO_DIR/openclaw/skills"

if [[ -d "$AGENT_SKILLS" ]]; then
  for skill_dir in "$AGENT_SKILLS"/*/; do
    skill_name="$(basename "$skill_dir")"
    TARGET="$CODEX_SKILLS/$skill_name"

    if [[ -L "$TARGET" ]]; then
      rm "$TARGET"
    elif [[ -d "$TARGET" ]]; then
      echo "EXISTS (not symlink): $skill_name — skipping"
      continue
    fi

    ln -s "$skill_dir" "$TARGET"
    echo "Linked agent skill: $skill_name"
  done
fi

echo
echo "Install complete."
echo "  Skills: symlinked to $CODEX_SKILLS/"
echo
echo "Restart Codex to pick up the new skills."
