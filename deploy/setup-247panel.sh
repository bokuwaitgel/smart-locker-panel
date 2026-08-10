#!/usr/bin/env bash
# Publish the panel at https://247panel.ekzomap.mn through the existing
# smart-locker nginx + certbot containers.
#
# Run on the server, from the panel repo root:
#   sudo bash deploy/setup-247panel.sh
#
# Idempotent: re-running with a valid cert already present skips issuance.
set -euo pipefail

DOMAIN=247panel.ekzomap.mn
EMAIL=itgel6708@gmail.com
STACK_DIR=${STACK_DIR:-/root/smart-locker}      # nginx + certbot + backend compose project
PANEL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NGINX_CT=smart-locker-nginx-1
CONF_DIR=$STACK_DIR/nginx/conf.d
VHOST=$CONF_DIR/247panel.conf
CERT_LIVE=$STACK_DIR/certbot/conf/live/$DOMAIN

[[ $EUID -eq 0 ]] || { echo "run as root"; exit 1; }
[[ -d $CONF_DIR ]] || { echo "!! $CONF_DIR not found — set STACK_DIR to the smart-locker compose dir"; exit 1; }

reload_nginx() {
  docker exec "$NGINX_CT" nginx -t
  docker exec "$NGINX_CT" nginx -s reload
}

# 1. Panel container on the nginx network -----------------------------------
# nginx proxies to http://247panel:3000 over smart-locker_default. Publishing
# 127.0.0.1:3000 is not enough: inside the nginx container that address is its
# own loopback.
echo "==> (re)starting the panel on the shared network"
cd "$PANEL_DIR"
docker compose up -d --build

echo "==> checking DNS from inside nginx"
if ! docker exec "$NGINX_CT" sh -c "wget -qO- --timeout=5 http://247panel:3000/login >/dev/null"; then
  echo "!! nginx cannot reach http://247panel:3000"
  echo "   networks on the panel container:"
  docker inspect 247panel --format '{{range $k,$v := .NetworkSettings.Networks}}     {{$k}}{{println}}{{end}}'
  exit 1
fi

# 2. Bootstrap vhost, HTTP only ---------------------------------------------
# The real vhost references cert files that do not exist yet; nginx would refuse
# to start. Serve only the ACME challenge until the cert is issued.
if [[ ! -s $CERT_LIVE/fullchain.pem ]]; then
  echo "==> installing bootstrap vhost (ACME challenge only)"
  install -m 644 "$PANEL_DIR/deploy/nginx-247panel-bootstrap.conf" "$VHOST"
  reload_nginx

  echo "==> issuing certificate via the certbot container"
  cd "$STACK_DIR"
  docker compose run --rm --entrypoint certbot certbot \
    certonly --webroot -w /var/www/certbot \
    -d "$DOMAIN" --email "$EMAIL" --agree-tos --no-eff-email --non-interactive
else
  echo "==> certificate already present, skipping issuance"
fi

[[ -s $CERT_LIVE/fullchain.pem ]] || { echo "!! no cert at $CERT_LIVE — aborting before nginx breaks"; exit 1; }

# 3. Real vhost with SSL -----------------------------------------------------
echo "==> installing the SSL vhost"
install -m 644 "$PANEL_DIR/deploy/nginx-247panel.conf" "$VHOST"
reload_nginx

# 4. Verify ------------------------------------------------------------------
echo "==> certificate"
echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null \
  | openssl x509 -noout -subject -dates -ext subjectAltName

echo "==> response (must NOT say x-powered-by: express)"
curl -sI "https://$DOMAIN/login" | head -6

echo "==> renewal dry-run"
cd "$STACK_DIR"
docker compose run --rm --entrypoint certbot certbot renew --dry-run \
  || echo "!! renewal dry-run failed — fix before the cert expires"

echo "==> done. https://$DOMAIN"
