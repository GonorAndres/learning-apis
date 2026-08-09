# Cloudflare Workers Deployment

Status: local implementation verified on 2026-08-09, production actions pending

## Architecture

- `learning-apis.gonor.me` is a custom domain for the
  `learning-apis-frontend` Cloudflare Worker.
- OpenNext serves Next.js pages, localization, static assets, SSR, and image
  optimization from the Worker.
- The custom Worker forwards `/api` and `/api/*` to the stable Cloud Run service
  URL, preserving the method, body, path, query, and request headers.
- Cloud Run receives `FRED_API_KEY` and `BANXICO_TOKEN` through Google Secret
  Manager bindings.

## Tracked Work

- [x] Add the custom API-forwarding Worker.
- [x] Declare `learning-apis.gonor.me` as the Worker custom domain.
- [x] Add OpenNext and Wrangler configuration.
- [x] Add PR tests, lint, Next build, and Worker build.
- [x] Order production deployment as backend, frontend, then smoke tests.
- [x] Remove plain credential values from the deployment workflow.
- [ ] Rotate the exposed FRED and Banxico credentials.
- [x] Create `fred-api-key` and `banxico-token` containers in Secret Manager.
- [ ] Add the rotated values as versions of both Secret Manager secrets.
- [x] Grant the Cloud Run runtime service account Secret Manager Secret
  Accessor on both secrets.
- [x] Verify Cloudflare API authentication and configure the GitHub Actions
  account ID and API token secrets.
- [x] Run the complete local verification suite.
- [ ] Obtain approval for git and production infrastructure actions.
- [ ] Create a branch, commit, push, and open a pull request.
- [ ] Require pull requests and the `verify` check on `main`.

## Secret Migration

Rotate both provider credentials before adding new secret versions. Supply each
rotated value through standard input so it is not included in shell history:

```bash
gcloud secrets create fred-api-key --replication-policy=automatic
gcloud secrets versions add fred-api-key --data-file=-

gcloud secrets create banxico-token --replication-policy=automatic
gcloud secrets versions add banxico-token --data-file=-
```

If either secret already exists, skip its `create` command and add only a new
version. Do not inspect or print the old Cloud Run environment values. After the
first successful secret-backed deployment, revoke the exposed credentials at
FRED and Banxico if rotation did not revoke them automatically.

## Required GitHub Secrets

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Google Cloud authentication continues to use the existing Workload Identity
Federation provider. FRED and Banxico values are no longer GitHub deployment
secrets.
