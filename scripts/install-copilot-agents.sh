#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SOURCE_DIR="$REPO_DIR/.github/agents"
TARGET_DIR="${1:-$HOME/.copilot/agents}"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "ERROR: Missing agents directory at $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"

find "$SOURCE_DIR" -maxdepth 1 -type f -name '*.agent.md' | sort | while IFS= read -r agent; do
  target="$TARGET_DIR/$(basename "$agent")"
  cp "$agent" "$target"
  echo "Installed $(basename "$agent") -> $target"
done

echo
echo "Agent install complete. Start a new Copilot session so the updated agents are loaded."
