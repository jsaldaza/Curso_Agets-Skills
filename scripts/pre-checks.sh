#!/usr/bin/env bash
set -euo pipefail

current_branch="$(git branch --show-current 2>/dev/null || true)"
if [[ "${current_branch}" == "main" || "${current_branch}" == "master" ]]; then
  echo "Refusing to run on protected branch: ${current_branch}" >&2
  exit 1
fi

scan_root="${1:-.}"

exclude_args=(
  --exclude-dir=.git
  --exclude-dir=node_modules
  --exclude-dir=dist
  --exclude-dir=build
  --exclude-dir=coverage
  --exclude-dir=.venv
  --exclude-dir=venv
  --exclude-dir=env
  --exclude-dir=tmp
  --exclude-dir=temp
  --exclude=package-lock.json
  --exclude=yarn.lock
  --exclude=pnpm-lock.yaml
  --exclude=*.png
  --exclude=*.jpg
  --exclude=*.jpeg
  --exclude=*.gif
  --exclude=*.webp
  --exclude=*.pdf
)

patterns='(rm -rf|git push --force|curl .*\\| *sh|wget .*\\| *sh|TOKEN=|API_KEY=|Bypass Approvals)'

if grep -RInE "${patterns}" "${scan_root}" "${exclude_args[@]}" > /tmp/agent_safety_scan.txt; then
  echo "Potentially dangerous pattern detected:" >&2
  cat /tmp/agent_safety_scan.txt >&2
  exit 1
fi

echo "Pre-checks passed."