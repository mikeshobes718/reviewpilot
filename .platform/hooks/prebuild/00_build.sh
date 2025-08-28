#!/bin/bash
set -euo pipefail
# Build Next.js on the EB instance before deployment completes
if [ -z "${EB_APP_STAGING_DIR:-}" ]; then
  EB_APP_STAGING_DIR="/var/app/staging"
fi
cd "$EB_APP_STAGING_DIR"
# Ensure Node and npm are available
node -v || true
npm -v || true
# Install all dependencies (including dev) for build
npm ci
# Build the app
npm run build
