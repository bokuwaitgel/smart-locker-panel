# Deploying the panel to 247panel.ekzomap.mn

Both domains resolve to the same host: `165.245.181.105`, nginx 1.27.5.

| | |
|---|---|
| Backend | `https://247box.ekzomap.mn` (Express, already proxied by nginx) |
| Panel | `https://247panel.ekzomap.mn` (this Next.js app, port 3000) |

## 1. Run the app on the server — Docker (recommended)

```bash
sudo mkdir -p /opt/247panel
# copy the repo there (git clone / rsync), then:
cd /opt/247panel
docker compose up -d --build
```

The container binds `127.0.0.1:3000` only, so nothing is exposed publicly — nginx
terminates TLS and proxies to it.

`NEXT_PUBLIC_API_URL` is inlined into the client bundle at **build time**, so it is a
Docker build arg, not a runtime env var. Default is `https://247box.ekzomap.mn`;
override per build:

```bash
NEXT_PUBLIC_API_URL=https://247box.ekzomap.mn docker compose up -d --build
```

Changing it later requires `--build` — restarting the container picks up nothing.

Verify before touching nginx:

```bash
curl -I http://127.0.0.1:3000/login          # expect 200
docker compose ps                            # expect healthy
docker compose logs -f panel
```

Redeploy after a code change:

```bash
git pull && docker compose up -d --build
```

The image is multi-stage on `node:20-alpine` using Next.js `output: "standalone"`
(~300 MB), runs as non-root user `nextjs`, and has a healthcheck hitting `/login`.

### Without Docker

```bash
cd /var/www/247panel
npm ci
echo 'NEXT_PUBLIC_API_URL=https://247box.ekzomap.mn' > .env.production
npm run build
sudo npm i -g pm2
pm2 start npm --name 247panel -- start
pm2 save
pm2 startup   # run the command it prints
```

Or systemd — see `247panel.service` in this directory. Note that with
`output: "standalone"` set, `npm run start` still works normally.

## 2. nginx vhost + SSL

Both in one go, after step 1 is running:

```bash
sudo bash deploy/setup-247panel.sh
```

The script refuses to continue unless the app answers on `127.0.0.1:3000`, then
installs the vhost, reloads nginx, checks the hostname stops reaching Express,
issues the cert and runs a renewal dry-run.

### Why `https://247panel.ekzomap.mn/` returns backend JSON

```
{"success":false,"message":"Cannot GET /","error":"Not Found",...}
```

That is Express, not the panel — the response carries `X-Powered-By: Express` and is
byte-identical to `https://247box.ekzomap.mn/`. There is **no vhost for the panel
hostname**, so nginx falls back to its default server (the 247box block) and proxies
the request to the backend, which has no `GET /` route. The same missing vhost is why
TLS fails: the only cert on the host is `CN=247box.ekzomap.mn`, SAN
`DNS:247box.ekzomap.mn`, which does not cover `247panel`.

Installing the vhost fixes both — server_name matching beats the default server.

### Manual equivalent

```bash
sudo cp deploy/nginx-247panel.conf /etc/nginx/sites-available/247panel.ekzomap.mn
sudo ln -s /etc/nginx/sites-available/247panel.ekzomap.mn /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d 247panel.ekzomap.mn --redirect
sudo systemctl reload nginx
```

Certbot edits the vhost in place, adding the `listen 443 ssl` block, the
`ssl_certificate` paths and the http→https redirect. Renewal runs off the
`certbot.timer` systemd unit; confirm with `sudo certbot renew --dry-run`.

Verify — subject must say `247panel`, and the header must **not** say Express:

```bash
echo | openssl s_client -connect 247panel.ekzomap.mn:443 \
  -servername 247panel.ekzomap.mn 2>/dev/null | openssl x509 -noout -subject -dates
curl -sI https://247panel.ekzomap.mn/login
```

## 4. Backend CORS

The panel calls the API from the browser with `withCredentials: true`, so the backend
must echo the exact origin — `*` is rejected by the browser when credentials are sent.

```js
app.use(cors({
  origin: ['https://247panel.ekzomap.mn', 'http://localhost:3000'],
  credentials: true,
}));
```

Verify (must print `Access-Control-Allow-Origin: https://247panel.ekzomap.mn`):

```bash
curl -s -i -X OPTIONS https://247box.ekzomap.mn/auth/login \
  -H "Origin: https://247panel.ekzomap.mn" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" | grep -i access-control
```

## 5. Auth cookie note

`js-cookie` writes the token from JS on the panel origin, and the axios interceptor
resends it as an `Authorization: Bearer` header — so the token is not a cross-site
cookie and needs no `SameSite=None`. If the backend also sets its own session cookie,
that one does need `SameSite=None; Secure` to survive the cross-origin hop between
`247panel` and `247box`.
