#!/usr/bin/env bash
set -euo pipefail

report_file="AGENTS_CHANGELOG.md"
timestamp="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
author="${USER:-unknown}"
message="${1:-AI session completed}"

mkdir -p "$(dirname "$report_file")"
if [[ ! -f "$report_file" ]]; then
  cat > "$report_file" <<'EOF'
# AGENTS_CHANGELOG
EOF
fi

printf '\n- [%s] author=%s :: %s\n' "$timestamp" "$author" "$message" >> "$report_file"
echo "Post-report appended to ${report_file}"