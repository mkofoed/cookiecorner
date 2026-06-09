# CookieCorner

Local-only CookieCorner starter stack for the Hyggefis launch.

## Stack

- Next.js 16 + TypeScript
- ASP.NET 10 Web API
- Docker Compose

## Services

- `web` on `http://localhost:3000`
- `api` on `http://localhost:8080`

## Run locally

```bash
docker compose up --build
```

## Notes

- The API loads `src/CookieCorner.Api/appsettings.Local.json` for local-only secrets.
- That file is gitignored and mounted into the API container at runtime.
- No database is configured yet.
