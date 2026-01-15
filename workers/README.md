# Cloudflare Workers Sync Backend

This Worker powers the sync API for jm-tasks using Durable Objects as the
authoritative store.

## Endpoints

- `POST /sync/push` - Accepts local changes from the client.
- `GET /sync/pull?since=<iso>` - Returns remote changes since a timestamp.
- `POST /sync/conflict` - Receives conflict payloads (Phase 1 logs only).

## Environment Variables

- `SYNC_API_TOKEN` (optional): If set, requests must include
  `Authorization: Bearer <token>`.
- `SYNC_CORS_ORIGINS` (optional): Comma-separated list of allowed origins.
  Defaults to `*` for development.

## Local Development

```bash
npm run workers:dev
```

The Worker runs locally with Durable Objects enabled. Use the base URL from
Wrangler output (typically `http://127.0.0.1:8787`).

## Deployment

```bash
npm run workers:deploy
```

Set production secrets with:

```bash
npx wrangler secret put SYNC_API_TOKEN --config workers/wrangler.toml
```
