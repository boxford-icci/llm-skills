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

missing=0

while IFS= read -r agent; do
  target="$TARGET_DIR/$(basename "$agent")"
  if [[ ! -f "$target" ]]; then
    echo "MISSING: $target"
    missing=1
  fi
done < <(find "$SOURCE_DIR" -maxdepth 1 -type f -name '*.agent.md' | sort)

if [[ "$missing" -ne 0 ]]; then
  echo
  echo "Agent verification failed. Re-run scripts/install-copilot-agents.sh and start a new Copilot session." >&2
  exit 1
fi

echo "Agent verification passed for $TARGET_DIR"
