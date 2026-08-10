#!/usr/bin/env bash
# Provision nginx vhost + Let's Encrypt cert for 247panel.ekzomap.mn.
# Run on the server, from the repo root:  sudo bash deploy/setup-247panel.sh
set -euo pipefail

DOMAIN=247panel.ekzomap.mn
EMAIL=itgel6708@gmail.com
UPSTREAM=127.0.0.1:3000
AVAILABLE=/etc/nginx/sites-available/$DOMAIN
ENABLED=/etc/nginx/sites-enabled/$DOMAIN
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/nginx-247panel.conf"

[[ $EUID -eq 0 ]] || { echo "run as root"; exit 1; }

echo "==> checking the app is up on $UPSTREAM"
if ! curl -fsS -o /dev/null -m 5 "http://$UPSTREAM/login"; then
  echo "!! nothing answering on $UPSTREAM — start it first:"
  echo "     docker compose up -d --build"
  exit 1
fi

echo "==> installing vhost"
install -m 644 "$SRC" "$AVAILABLE"
ln -sfn "$AVAILABLE" "$ENABLED"
mkdir -p /var/www/html

echo "==> nginx -t"
nginx -t
systemctl reload nginx

echo "==> checking port 80 reaches the app (not the backend)"
if curl -fsS -m 10 -H "Host: $DOMAIN" http://127.0.0.1/login | grep -qi "x-powered-by: express"; then
  echo "!! still hitting Express — the vhost is not matching. check server_name."
  exit 1
fi

echo "==> issuing certificate"
command -v certbot >/dev/null || { apt-get update && apt-get install -y certbot python3-certbot-nginx; }
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect

systemctl reload nginx

echo "==> verifying"
echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null \
  | openssl x509 -noout -subject -dates -ext subjectAltName
curl -sI "https://$DOMAIN/login" | head -3
certbot renew --dry-run

echo "==> done. https://$DOMAIN"
