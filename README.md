# yusronizza.github.io

Personal portfolio, CV, and blog, built with Next.js (App Router) and Tailwind CSS, exported as a fully static site for GitHub Pages.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # static export to ./out
npm run lint
```

## Editing content

All content is mocked in plain TypeScript modules — there is no CMS or database. Edit the files below and the site rebuilds from them automatically:

| What                          | File                          |
| ------------------------------ | ------------------------------ |
| Name, social links, nav, SEO defaults | `lib/config/site.ts`     |
| About/CV content (bio, experience, education, skills) | `lib/data/profile.ts` |
| Projects                       | `lib/data/projects.ts`        |
| Blog posts                     | `lib/data/posts.ts`           |

Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) to your production domain — it drives canonical URLs, the sitemap, and Open Graph tags.

## Project structure

```
app/                  Routing & page composition (thin — delegates to components/lib)
  about/, cv/, projects/, blog/   Route segments
  sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx   SEO file conventions
components/
  layout/              Header, Footer, Container
  ui/                  Generic presentational primitives (Card, Badge, Button, ...)
  home/, projects/, blog/, cv/   Domain-specific presentational components
  seo/                 JSON-LD structured data renderer
  theme/               Dark/light theme toggle + FOUC-prevention script
lib/
  config/site.ts       Single source of truth for site identity & nav
  data/                 Dummy content + accessor functions (profile, projects, posts)
  seo/                  Metadata + JSON-LD schema builders
  utils/                Formatting helpers
```

This separation keeps routing, presentation, and data access independent: swapping the dummy data module for a real CMS or API later only touches `lib/data/`.

## SEO

- Per-page `generateMetadata`/static `metadata` with canonical URLs, Open Graph and Twitter Card tags.
- `sitemap.ts` and `robots.ts` generated from the same data that powers the pages, so they never drift out of sync.
- JSON-LD structured data (`Person`, `WebSite`, `BlogPosting`, `BreadcrumbList`) for richer search results.
- A generated default Open Graph image (`app/opengraph-image.tsx`).

## Deployment

Static export (`output: "export"` in `next.config.ts`) builds to `out/`, which can be hosted on any static file host. A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys `out/` to GitHub Pages on every push to `main`.

To enable it: in the repo's Settings → Pages, set the source to "GitHub Actions".
