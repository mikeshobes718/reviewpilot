#!/usr/bin/env bash
set -euo pipefail
for ROOT in /var/proxy/staging/nginx/conf.d /var/proxy/live/nginx/conf.d; do
  [ -d "$ROOT" ] || continue
  rm -f "$ROOT"/elasticbeanstalk/https_redirect.conf || true
  rm -f "$ROOT"/elasticbeanstalk/https-redirect.conf || true
  rm -f "$ROOT"/elasticbeanstalk/05-force-https.conf || true
  rm -f "$ROOT"/elasticbeanstalk/99-https-redirect.conf || true
  rm -f "$ROOT"/*redirect*.conf || true
done
