#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/seed-admin-production.sh

What it does:
  - Pulls Vercel Production env vars into a temp file (deleted after run)
  - Prompts for SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD (password hidden)
  - Runs: npx prisma db seed

Notes:
  - This does NOT print or store your password.
  - If you forget the admin password, re-run this script to reset it.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ ! -t 0 ]]; then
  usage
  echo "ERROR: non-interactive stdin; refusing to prompt for credentials." >&2
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "ERROR: vercel CLI not found. Install it first: npm i -g vercel" >&2
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "ERROR: npx not found. Install Node.js first." >&2
  exit 1
fi

tmp_env="$(mktemp -t dianzi-vercel-prod-env.XXXXXX)"
cleanup() {
  rm -f "$tmp_env"
}
trap cleanup EXIT

echo "Pulling Vercel Production env vars into a temp file (will be deleted after run)..."
# Keep stdout quiet to reduce accidental secret exposure in logs.
vercel env pull "$tmp_env" --environment=production -y >/dev/null

# Export everything from the pulled env file to the current process.
set -a
# shellcheck disable=SC1090
source "$tmp_env"
set +a

read -r -p "Admin email: " admin_email
if [[ -z "${admin_email}" ]]; then
  echo "ERROR: admin email is required." >&2
  exit 1
fi

read -r -s -p "Admin password (hidden): " admin_password
echo
if [[ -z "${admin_password}" ]]; then
  echo "ERROR: admin password is required." >&2
  exit 1
fi
if [[ "${admin_password}" == "admin123" ]]; then
  echo "ERROR: refusing default password 'admin123' for hardened deployments." >&2
  exit 1
fi

read -r -s -p "Confirm password (hidden): " admin_password_confirm
echo
if [[ "${admin_password}" != "${admin_password_confirm}" ]]; then
  echo "ERROR: passwords do not match." >&2
  exit 1
fi

# Ensure hardened mode checks are active regardless of where this runs.
export NODE_ENV=production
export VERCEL_ENV=production

export SEED_ADMIN_EMAIL="${admin_email}"
export SEED_ADMIN_PASSWORD="${admin_password}"

echo "Running prisma seed against Production database..."
npx prisma db seed

echo "Done. You can now login at /login with the email/password you entered."
