# yusronizza.com

Personal portfolio, CV, and blog in English, Japanese, and Indonesian. Next.js (App Router) and Tailwind CSS,
with content served by [`yusronizza-api`](../yusronizza-api) and edited in
[`yusronizza-admin`](../yusronizza-admin). Hosted on Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # point API_URL at a running API, set API_CLIENT_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You need the API running (`make docker-up` in
`yusronizza-api`) and a client key for this site, created once with:

```bash
curl -X POST http://localhost:8080/api/v1/admin/clients \
  -H "Authorization: Bearer $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"yusronizza-site"}'
```

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `API_URL` | Yes | Base URL of `yusronizza-api` (server-side only). |
| `API_CLIENT_KEY` | Yes | This site's registered client key; public API reads require it. |
| `NEXT_PUBLIC_SITE_URL` | Yes in production | Canonical origin for links, sitemap, feeds, and Open Graph. |
| `REVALIDATE_SECRET` | Recommended | Secret for `POST /api/revalidate`; set the same value as the API's `SITE_REVALIDATE_SECRET`. |
| `TRUST_FORWARDED_FOR` | Only off Vercel | `true` when a proxy you control overwrites `X-Forwarded-For`. On Vercel it's trusted automatically. |

## How it works

- **Languages.** Every page lives under `app/[lang]`. English is served at unprefixed URLs (`/blog/x`),
  Japanese and Indonesian at `/ja/...` and `/id/...`; `proxy.ts` rewrites unprefixed URLs to `/en` internally
  and redirects `/en/...` to the unprefixed form. Content comes translated from the API; interface text is in
  `lib/i18n/dictionaries.ts`.
- **Caching.** Pages are static per language and refreshed in the background (ISR). API fetches carry cache
  tags (`posts`, `projects`, `profile`, `menu`). After every admin edit the API calls `POST /api/revalidate`
  with the affected tags, so changes appear within seconds; otherwise pages refresh hourly.
- **Talking to the API.** Only the server calls the API. The contact form and page-view beacon post to this
  site's own `/api/contact` and `/api/pageview`, which forward them with the client key and the visitor's IP
  (`X-Visitor-IP`), so rate limits and visitor counts are per visitor.
- **SEO.** Per-language canonical URLs, `hreflang` alternates with `x-default`, `og:locale`, JSON-LD
  (`Person`, `WebSite`, `BlogPosting`, `BreadcrumbList`), a sitemap listing every page in every language,
  RSS feeds (`/feed.xml`, `/ja/feed.xml`, `/id/feed.xml`), and a generated Open Graph card per post.
- **Security.** Content-Security-Policy and HSTS (`next.config.ts`); the API is never exposed through this
  domain; `/api/contact` and `/api/pageview` reject cross-site posts.

```
app/
  [lang]/            pages (home, about, cv, projects, blog, contact, l/[code]) + layout, feeds, OG images
  api/               contact, pageview, revalidate route handlers
  sitemap.ts, robots.ts, manifest.ts, icons
components/          layout, home, blog, projects, cv, ui
lib/
  api/               server-only API client with cache tags
  i18n/              locales, URL helpers, dictionaries
  seo/               metadata (hreflang) and JSON-LD builders
  server/            proxy-to-api helper for the route handlers
proxy.ts             language routing
```

## Testing

```bash
npm run typecheck
npm run lint
E2E_BASE_URL=http://localhost:3000 npm run test:e2e   # Playwright, against a running site + API
```

The smoke suite checks every page in every language (status, `<html lang>`, no console errors or horizontal
overflow), hreflang and canonical tags, the language switcher, real 404s, the sitemap and feeds, the contact
form, and the mobile menu. CI (`.github/workflows/ci.yml`) runs type checking, lint, `npm audit`, and a build.

## Deploying (Vercel)

1. Import the repository in Vercel (framework: Next.js) and set the environment variables above.
2. On the API, set `SITE_REVALIDATE_URL=https://yusronizza.com/api/revalidate` and the matching
   `SITE_REVALIDATE_SECRET`.
3. Vercel deploys previews per branch and production from `main`. Vercel Analytics and Speed Insights are
   enabled automatically there (they're skipped on other hosts).

The site is not served from GitHub Pages: it needs a server for language routing, on-demand revalidation, the
contact/page-view routes, and image optimization.
