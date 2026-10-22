# VantageTech

Lead-generation site for VantageTech, an AI customer-support platform for
direct-to-consumer brands: landing page, FAQ, an AI chat assistant grounded on
the company's own documents, and a Calendly booking dialog.

**Live site**: https://ui-fidelity-pilot.lovable.app
**Domain**: vantagetech.me

## Requirements

- **Bun 1.3** — the committed lockfile is `bun.lock`, so install with Bun.
  `npm ci` cannot work here: there is no `package-lock.json`.
- **Node.js 22** — pinned in `.nvmrc` and in `package.json` `engines`.

## Run it

```sh
bun install --frozen-lockfile
bun run dev
```

The dev server prints its own URL (in this sandbox it is
`http://localhost:8080`).

The chat assistant needs a server-side key. Export it before starting the
server, or copy `.env.example` and keep the value out of git:

```sh
export LOVABLE_API_KEY=...   # see .env.example
```

Without it the site still works; the assistant replies with a fallback
"book a call with us" message instead of answering questions.

## Checks

```sh
bun run typecheck   # TypeScript
bun run lint        # ESLint + Prettier
bun run test        # Vitest
```

## Build and preview

```sh
bun run build       # -> dist/ (client assets + a Cloudflare Worker)
bun run preview     # builds, then serves dist/ with wrangler
```

`vite build` targets nitro's `cloudflare-module` preset, so the deployable
bundle is the worker in `dist/server` plus the static files in `dist/client`.
`.wrangler/deploy/config.json` points wrangler at that worker.

## Deploying

### Netlify

The connected Netlify project builds with Bun and publishes `dist/client`.
On Netlify, `vite.config.ts` selects Nitro's `netlify` preset, which also emits
the server-rendering and server-function handler into
`.netlify/functions-internal`. Deploy both through Netlify's normal Git build;
publishing the client directory alone does not deploy the server.

Set `LOVABLE_API_KEY` in the Netlify project's environment variables with
Functions scope to enable the chat assistant. Without it, the site still works
and chat returns its existing offline message. Keep the value server-side.

Other environments retain the Cloudflare target described below.

1. **Publish from Lovable** — the default path, no extra accounts or secrets:
   the preview's Publish button ships the current code, and the chat key is
   already wired up on the hosted backend.
2. **Push to GitHub, deploy with GitHub Actions** — `.github/workflows/ci.yml`
   installs from the lockfile and runs typecheck, lint, tests and the build on
   every push and pull request, then uploads the bundle as an artifact.
   `.github/workflows/deploy-cloudflare.yml` builds and runs
   `wrangler deploy` on pushes to `main`. It stays skipped until you add
   `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` under
   **Settings → Secrets and variables → Actions**; add `LOVABLE_API_KEY` there
   too if the deployed site should answer chat questions, and set the
   `CF_WORKER_NAME` repository variable if you want a worker name other than
   `vantagetech`. From a checkout the same deploy is `bun run deploy:cf`.
3. **Self-host** — take the `cloudflare-worker-bundle` artifact from a CI run
   and serve it with `npx wrangler dev` (or `npx wrangler deploy`), passing
   `LOVABLE_API_KEY` in the server environment.

### Why not GitHub Pages

Pages serves static files only. This site has no pre-rendered `index.html` —
the page is rendered by the server on each request, and the chat assistant is a
server function — so a Pages deploy of `dist/client` alone would show nothing
useful and the chat would not answer. The `CNAME` file in the repo is a leftover
Pages marker for `vantagetech.me`; point the domain at whichever host you
actually deploy to instead.

## Repo layout

- `src/routes/` — pages (`index.tsx` is the landing page, `__root.tsx` the shell)
- `src/components/` — `ChatWidget`, `BookingModal`, `ThemeToggle`, plus `ui/` primitives
- `src/lib/` — chat server function, its knowledge base, error handling
- `src/test/` — Vitest suites
- `public/` — favicons and `robots.txt`
