#!/bin/bash
set -euo pipefail

echo "[predeploy] Node: $(node -v), npm: $(npm -v)"

# The predeploy hook runs in the staging dir; build there so the compiled
# assets are copied into /var/app/current during finalize. (EB docs)
# Working directory is already the app root in staging.
# If your build needs devDependencies, temporarily install them:
if [ -f package-lock.json ]; then
  # Include dev deps just for the build (npm v7+ uses --include=dev)
  npm ci --include=dev
else
  npm install --include=dev
fi

npm run build

# Optionally prune dev deps after the build to keep the footprint small:
npm prune --omit=dev || true

echo "[predeploy] Build completed successfully"
