#!/usr/bin/env bash
# Provision nginx vhost + Let's Encrypt cert for 247panel.ekzomap.mn.
# Run on the server, from the repo root:  sudo bash deploy/setup-247panel.sh
set -euo pipefail

DOMAIN=247panel.ekzomap.mn
EMAIL=itgel6708@gmail.com
UPSTREAM=127.0.0.1:3000
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/nginx-247panel.conf"

[[ $EUID -eq 0 ]] || { echo "run as root"; exit 1; }

echo "==> checking the app is up on $UPSTREAM"
if ! curl -fsS -o /dev/null -m 5 "http://$UPSTREAM/login"; then
  echo "!! nothing answering on $UPSTREAM — start it first:"
  echo "     docker compose up -d --build"
  exit 1
fi

# Debian/Ubuntu packages use sites-available + sites-enabled; the nginx.org
# packages (this host, nginx 1.27.5) only ship conf.d. Detect which is live.
echo "==> detecting nginx layout"
if [[ -d /etc/nginx/sites-enabled ]] && grep -qE '^\s*include\s+.*sites-enabled' /etc/nginx/nginx.conf; then
  TARGET=/etc/nginx/sites-available/$DOMAIN
  mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
  install -m 644 "$SRC" "$TARGET"
  ln -sfn "$TARGET" "/etc/nginx/sites-enabled/$DOMAIN"
  echo "    sites-enabled layout -> $TARGET"
elif grep -qE '^\s*include\s+.*conf\.d' /etc/nginx/nginx.conf; then
  TARGET=/etc/nginx/conf.d/$DOMAIN.conf
  mkdir -p /etc/nginx/conf.d
  install -m 644 "$SRC" "$TARGET"
  echo "    conf.d layout -> $TARGET"
else
  echo "!! nginx.conf includes neither sites-enabled nor conf.d — add the server block by hand:"
  grep -nE '^\s*include' /etc/nginx/nginx.conf
  exit 1
fi

mkdir -p /var/www/html

echo "==> nginx -t"
nginx -t
systemctl reload nginx

echo "==> checking port 80 reaches the app (not the backend)"
HEADERS=$(curl -sS -i -m 10 -H "Host: $DOMAIN" http://127.0.0.1/login | head -20 || true)
if grep -qi "x-powered-by: express" <<<"$HEADERS"; then
  echo "!! still hitting Express — the vhost is not matching. check server_name."
  sed -n '1,5p' <<<"$HEADERS"
  exit 1
fi
sed -n '1p' <<<"$HEADERS"

echo "==> issuing certificate"
command -v certbot >/dev/null || { apt-get update && apt-get install -y certbot python3-certbot-nginx; }
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect

systemctl reload nginx

echo "==> verifying"
echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null \
  | openssl x509 -noout -subject -dates -ext subjectAltName
curl -sI "https://$DOMAIN/login" | head -3
certbot renew --dry-run || echo "!! renewal dry-run failed — check it before the cert expires"

echo "==> done. https://$DOMAIN"
