# yusronizza-api — API Documentation

**Version:** 2.2.0 (implementation) — adds **submenu support** to the navigation menu: `menu_items` gained
`parent_id`, nesting one level deep. `GET /public/menu`/`GET /admin/menu` now return a nested tree (each top-level
item carries its submenu items in `children`); the management endpoint (`/admin/menu-items`) stays flat, with
`parent_id` visible per row, for straightforward table editing. See section 7.8/8.8's "Submenus" note.

**v2.1.0** adds a **media library**: upload images/documents/archives
(`POST /admin/media`), manage them (`GET`/`PATCH`/`DELETE /admin/media...`), and serve the raw bytes back out at a
public, unauthenticated `GET /media/{filename}` — outside `/api/v1` entirely, since an `<img src>` tag or a browser
address bar can't attach an `Authorization` header (section 7.9 and 8.12). Files are stored on local disk (see
Appendix B's `MEDIA_STORAGE_DIR`) behind a small storage abstraction, so a future move to object storage only
touches `internal/platform/storage`, nothing else.

**v2.0.0** reorganized the entire API into two top-level groups, `/api/v1/public` and `/api/v1/admin`, replacing
every previous path (e.g. `GET /api/v1/posts` is now `GET /api/v1/public/posts`; its admin-only write counterpart
is now `POST /api/v1/admin/posts`, not the same path under a different method). Where a resource has both a public
read and an admin read (Posts, Projects, Profile), they're deliberately two separate, simpler handlers rather than
one endpoint branching on how it was reached — see section 7 vs section 8. This was a breaking change with no
aliases for the old paths, consistent with this project's established practice of clean breaks (it predates any
real deployment). v2.0.0 also added a dynamic, admin-editable **navigation menu** (`GET /public/menu`,
`GET /admin/menu`, and full CRUD at `/admin/menu-items` — section 7.8 and 8.8) so neither frontend has to hardcode
its own nav. Every feature from prior releases — session/client-key/Bearer auth, CSRF protection, rate limiting,
full-text + fuzzy search, the API-client registry, the audit log, the request log — carries over unchanged in
behavior, just at its new path.

**Base URL:** `http://localhost:8080/api/v1` (local/dev) · `https://yusronizza.com/api/v1` (production, once deployed)
— except the media-serving route (section 7.9), which deliberately sits at `http://localhost:8080/media/...`, not
under `/api/v1` at all.
**Protocol:** HTTP locally, HTTPS in production
**Format:** JSON (`application/json`) for every request and response body

This document is the single source of truth for this API — every route, every validation rule, every error
condition, and every place a design decision was made.

---

## Table of Contents

1. [Scope](#1-scope)
2. [Authentication](#2-authentication)
3. [Error Handling](#3-error-handling)
4. [Rate Limiting](#4-rate-limiting)
5. [Conventions](#5-conventions)
6. [Health Check](#6-health-check)
7. [Public API](#7-public-api)
8. [Admin API](#8-admin-api)
9. [Appendix A: Endpoint Summary](#appendix-a-endpoint-summary)
10. [Appendix B: Configuration Reference](#appendix-b-configuration-reference)
11. [Appendix C: Database Schema](#appendix-c-database-schema)

---

## 1. Scope

This service implements Blog Posts, Projects, Profile & CV, Contact, Meta/SEO, a Link Shortener, a Navigation Menu,
and a full Administration surface (dashboard stats, contact moderation, an API-client registry, web analytics, a
security audit trail) — split into a **Public API** (section 7) that a frontend or registered integration reads
from, and an **Admin API** (section 8) that only the site owner can reach.

---

## 2. Authentication

Every write endpoint, and every endpoint under `/api/v1/admin`, accepts **either** of two admin credentials —
checked in this order, so either one alone is sufficient. Most of `/api/v1/public`'s reads accept a *third*,
weaker credential instead (section 2.5).

### 2.1 Static Bearer token (scripts, curl, CI)

```
Authorization: Bearer <ADMIN_API_KEY>
```

`ADMIN_API_KEY` is a single static value read from the server's environment at startup — no OAuth flow, no
per-user identity, no expiry. The request's Bearer value must match it **exactly**; any other value (including a
well-formed-but-wrong token) is rejected the same way as a missing header. Right for anything that can hold a
long-lived secret directly and has no convenient place to store a cookie — a script, a CI job, curl.

**Implementation note:** the comparison uses `crypto/subtle.ConstantTimeCompare`, not plain string equality — with
a single long-lived static secret, a byte-by-byte `==` is in principle subject to a timing attack recovering the
key from response-latency differences.

### 2.2 Session cookie (a browser-based admin client)

```
Cookie: admin_session=<JWT>
```

For a real browser-based admin dashboard, handing the frontend `ADMIN_API_KEY` to store in `localStorage` is an
XSS liability. The alternative: log in once via [`POST /admin/login`](#81-login--session) with a username-or-email
identifier plus a password, and the server sets a session token as an `httpOnly` cookie the frontend never
directly touches.

The cookie's value is a signed JWT (`HS256`, `JWT_SIGNING_SECRET`) whose `jti` claim references a row in
`admin_sessions`. The JWT carries its own expiry (`SESSION_DURATION_HOURS`, default 24h), but that's not the only
way a session ends:

- **Idle timeout.** Every authenticated request bumps `last_seen`; a session unused for longer than
  `SESSION_IDLE_TIMEOUT_MINUTES` (default 30) stops validating even though its JWT hasn't expired. `0` disables
  this check.
- **Rotation.** A successful login always issues a brand-new session, deleting any prior one the request's own
  cookie referenced. A password change rotates the caller's own session the same way (after invalidating every
  other one) rather than logging them out.

Cookie attributes: `HttpOnly`, `Secure` in production only, `SameSite=Lax`, `Path=/`. Password login is entirely
optional (see Appendix B) — the static Bearer token always works regardless of whether it's configured.

### 2.3 Common behavior

Either admin credential missing or invalid gets the same response:

```json
{ "error": { "code": "UNAUTHORIZED", "message": "Missing or invalid credentials.", "field": null } }
```

**Implementation note — CORS:** a session cookie only works cross-origin if the browser is told the calling origin
is explicitly trusted — a wildcard `Access-Control-Allow-Origin: *` (used for every cookie-free caller) cannot be
paired with credentialed requests. `CORS_ALLOWED_ORIGINS` (Appendix B) lists the exact origin(s) that get the
specific-origin-plus-credentials treatment instead. Every other origin is unaffected.

### 2.4 CSRF protection (cookie-authenticated writes)

A browser attaches a cookie to a request regardless of which page initiated it — unlike the Bearer token, which
nothing forces a browser to send cross-site. So a state-changing request (`POST`/`PATCH`/`PUT`/`DELETE`)
authenticated via the session cookie must additionally prove it originated from the trusted dashboard, via
**Origin/Referer validation**: the request's `Origin` header (falling back to `Referer`'s origin if `Origin` is
absent) must be one of the exact origins in `CORS_ALLOWED_ORIGINS`. A request with neither header, or an
untrusted one, is rejected:

```json
{ "error": { "code": "FORBIDDEN", "message": "Cross-site request blocked: missing or untrusted Origin.", "field": null } }
```

Does **not** apply to Bearer-token requests (no ambient credential for a hostile page to ride), or to
`GET`/`HEAD`/`OPTIONS` (nothing state-changing to protect).

### 2.5 Registered client key (public reads)

```
X-Client-Key: <key>
```

A third, weaker credential — this doesn't authenticate *an admin*, it identifies *a calling application*. Most
`/api/v1/public` read endpoints require **either** a valid admin credential (checked first, same as everywhere
else) **or** an `X-Client-Key` naming an active, registered client.

```json
{ "error": { "code": "UNAUTHORIZED", "message": "Missing or unregistered client key.", "field": null } }
```

**Not a permissions/scopes system.** The check answers exactly one question — "is this an active, registered
client or not" — nothing else; every registered client sees exactly the same public data as an anonymous
admin-authenticated call. No dedicated rate-limit tier either: a client-key-authenticated request still falls into
the anonymous, IP-keyed tier (section 4) — the key identifies *who's asking* for the request log
([8.9.4](#894-request-log)), not *how much they're allowed to ask for*.

A client is registered via [`POST /admin/clients`](#87-api-clients), itself admin-only — an end user or a partner
integration can't self-register. The plaintext key is returned exactly once, at creation; only its hash is ever
stored.

**Deliberately exempt** despite living under `/public`, because gating them would defeat their own purpose — an
arbitrary browser or bot, not a registered application, is the intended caller:

- [`GET /public/links/{code}`](#74-link-shortener) — public redirect resolution
- [`GET /public/meta/og`](#76-meta--seo) — fetched by social-media/chat link unfurlers
- `POST /public/contact`, `POST /public/analytics/pageviews` — inherently public writes, not reads
- `POST /admin/login` — you don't have any credential yet when logging in

---

## 3. Error Handling

Every error response has the same shape:

```json
{ "error": { "code": "NOT_FOUND", "message": "No post with slug 'missing-post' exists.", "field": null } }
```

| Field     | Type           | Description                                                |
|-----------|----------------|--------------------------------------------------------------|
| `code`    | string         | Machine-readable code, see table below                     |
| `message` | string         | Human-readable description, safe to display                |
| `field`   | string \| null | Set on `VALIDATION_ERROR` to name the failing request field |

| HTTP Status | Code                  | When                                                                 |
|-------------|-----------------------|-----------------------------------------------------------------------|
| 400         | `VALIDATION_ERROR`    | Request body/query failed a business-rule check |
| 400         | `INVALID_CURSOR`      | The `cursor` query param isn't a value this server issued |
| 401         | `UNAUTHORIZED`        | Missing or incorrect credential on a gated endpoint |
| 403         | `FORBIDDEN`           | CSRF check failed on a cookie-authenticated write (section 2.4) |
| 404         | `NOT_FOUND`           | Resource doesn't exist |
| 409         | `CONFLICT`            | Slug (Posts/Projects) or code (Links) already exists on create |
| 422         | `UNPROCESSABLE`       | Reserved; no current code path returns it |
| 429         | `RATE_LIMITED`        | Rate limit exceeded — section 4 |
| 500         | `INTERNAL_ERROR`      | Unexpected server-side failure |
| 503         | `SERVICE_UNAVAILABLE` | `GET /readyz` when the database ping fails |

A panic anywhere in a handler is recovered by middleware and turned into a `500 INTERNAL_ERROR` rather than
crashing the process or leaking a stack trace.

---

## 4. Rate Limiting

Implemented as an in-memory, per-process **fixed-window** counter (`internal/platform/ratelimit`) — not a token
bucket. A window resets entirely at its boundary rather than leaking allowance continuously.

| Tier                    | Limit         | Bucket key                                   |
|-------------------------|---------------|-----------------------------------------------|
| Unauthenticated         | 120 req/min   | Client IP (`X-Forwarded-For`'s last entry, else `RemoteAddr`) |
| Authenticated           | 600 req/min   | The exact admin Bearer token, or a valid session cookie |
| Contact form            | 5 req/hour    | Client IP, stacked on top of the general limit |
| Login (per IP)          | 5 req/min     | Client IP, stacked on `POST /admin/login` regardless of outcome |
| Login (per identifier)  | 5 req/min     | The lowercased `identifier` field from the login body, stacked on both limits above |

A registered client key (section 2.5) does **not** get its own tier — it still falls into the anonymous, IP-keyed
tier. `POST /admin/login`'s two dedicated tiers exist because the general limiters alone have a blind spot each:
per-IP does nothing against an attacker spread across many IPs guessing one account, and per-identifier does
nothing against one IP spraying many identifiers. Both count every attempt, not only failed ones, to keep the
limiter itself simple and stateless.

Every response carries `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and (on `429` only)
`Retry-After`.

**Implementation note — trusting `X-Forwarded-For`:** every IP-keyed limiter reads the **last** entry, not the
first. This deployment is always exactly one trusted reverse-proxy hop from the client (a PaaS edge, or a
self-managed Caddy/nginx — `deployment.md` section 3.5), and a standard proxy *appends* the connecting IP to
whatever it received rather than replacing it — so the last entry is the one that hop actually wrote, while
earlier entries (including the first) can be freely set by the client. Trusting the first entry would let any
caller spoof its own rate-limit bucket and audit-log IP.

**Implementation note:** this is process-local memory — resets on restart, doesn't coordinate across replicas.
Fine for a single-instance deployment; multi-instance would need a Redis-backed `ratelimit.Limiter`.

---

## 5. Conventions

**Pagination** (List/Search endpoints that support it): `limit` (clamped `[1,100]`, default `10`) and `cursor`
(opaque, from a previous response). Response envelope:

```json
{ "data": [ /* ... */ ], "meta": { "total": 42, "limit": 10, "next_cursor": "...", "prev_cursor": null } }
```

`next_cursor`/`prev_cursor` are `null` when there's no further page in that direction. A `cursor` this server
didn't issue returns `400 INVALID_CURSOR`. Not every list endpoint paginates — Projects and Menu are expected to
stay small and return their entire result set in one response, no `meta` envelope at all.

**Sorting:** `?sort=field` ascending, `?sort=-field` descending; unrecognized values fall back to each endpoint's
default.

**Sparse fieldsets:** `?fields=slug,title` on Posts/Projects list endpoints restricts each object to just those
fields.

**Dates:** `YYYY-MM-DD` for date-only values (`published_at`), full RFC3339 (`2026-08-04T10:15:00Z`) for
timestamps.

**Slugs:** lowercase, hyphen-separated, no leading/trailing/double hyphens (`my-post-title`).

**CORS:** open wildcard (`Access-Control-Allow-Origin: *`) for every cookie-free caller; `CORS_ALLOWED_ORIGINS`
origins get the specific-origin-plus-credentials treatment instead — see section 2.3.

---

## 6. Health Check

Two endpoints, neither under `/api/v1`, neither rate-limited or authenticated, neither part of the versioned
contract — both are infra probes.

### 6.1 Liveness

```
GET /healthz
```

"Is the process up at all." Static — does **not** check the database, on purpose: a liveness probe restarting the
process over a temporarily-down dependency would make an outage worse. **Response `200 OK`**, body `ok` (plain
text).

### 6.2 Readiness

```
GET /readyz
```

"Can this instance actually serve a request right now." Pings the database (3-second timeout).

**`200 OK`:** `{ "data": { "status": "ok", "checks": { "database": "ok" } } }`
**`503 SERVICE_UNAVAILABLE`:** `{ "error": { "code": "SERVICE_UNAVAILABLE", "message": "Database is unreachable.", "field": null } }`

---

## 7. Public API

Everything under `/api/v1/public`. Most of it is **[client key or admin]** (section 2.5) — a handful of endpoints
are fully open regardless, called out explicitly below.

### 7.1 Posts

Every post has a **status** (`draft`, `scheduled`, or `published`) and a nullable `published_at`. A caller with no
admin credential (a registered client, same as a fully anonymous one) only ever sees **publicly visible** posts:
`status <> 'draft'` and `published_at` has arrived. A caller **with** an admin credential (Bearer or session, not
just a client key) sees every status — this is the one place a public endpoint's *result* still depends on which
credential was used, not just whether one was present at all; the admin's own always-full-visibility equivalent
lives at `/admin/posts` instead (section 8.2).

**Images:** a post supports images two ways. `cover_image_url` (validated as an absolute `http(s)` URL, or empty —
see 8.2's validation table) is a single header/thumbnail image, returned as-is on both `Post` and `PostSummary`.
Inline images inside `content` use standard Markdown image syntax (`![alt text](url "optional title")`), rendered
server-side to a real `<img>` tag in `content_html` — no special handling needed, this is core CommonMark, not an
extension. Either can point anywhere: an external URL, or a file uploaded via this API's own media library
(`POST /admin/media`, section 8.12), whose response includes the `url` to paste into `cover_image_url` or a
content image tag. Neither field is verified to actually *resolve* to a real image (this backend has no way to
fetch and inspect it) — only that it's a well-formed URL.

#### 7.1.1 List Posts **[client key or admin]**

```
GET /public/posts?limit=&cursor=&tag=&sort=&status=&fields=
```

| Parameter | Type    | Default         | Notes |
|-----------|---------|------------------|-------|
| `limit`   | integer | `10`            | Clamped `[1,100]` |
| `cursor`  | string  | —                | Pagination cursor |
| `tag`     | string  | —                | Exact-match containment filter |
| `sort`    | string  | `-published_at`  | `published_at` or `title`, either direction |
| `status`  | string  | —                | **Admin only** — `draft`/`scheduled`/`published`; ignored otherwise |
| `fields`  | string  | —                | Sparse fieldset |

Returns `PostSummary` (all `Post` fields except `content`/`content_html`):

```json
{
  "data": [
    {
      "slug": "the-ai-boom-is-an-infrastructure-story",
      "title": "The AI Boom Is an Infrastructure Story Now",
      "excerpt": "Behind every model release is a multi-hundred-billion-dollar bet on power, silicon, and supply chains.",
      "tags": ["ai", "hardware", "industry"],
      "published_at": "2026-06-15",
      "reading_time_minutes": 4,
      "status": "published",
      "cover_image_url": ""
    }
  ],
  "meta": { "total": 3, "limit": 10, "next_cursor": null, "prev_cursor": null }
}
```

#### 7.1.2 Get Post by Slug **[client key or admin]**

```
GET /public/posts/{slug}
```

Returns the full `Post` (includes `content`/`content_html`). A draft/not-yet-due slug 404s for a non-admin caller
with the same message as a nonexistent slug, so its existence is never leaked.

#### 7.1.3 Search Posts **[client key or admin]**

```
GET /public/posts/search?q=&limit=&cursor=
```

Full-text search across `title`/`excerpt`/`content` (weighted A/B/C respectively) via `websearch_to_tsquery` —
`q` accepts natural search syntax (quoted phrases, `-exclude`, `or`). Ranked by `ts_rank`, cursor-paginated exactly
like 7.1.1 (`meta` envelope, not a flat top-N).

**Implementation note — partial-word and typo tolerance:** full-text search alone only matches whole, stemmed
words — `q=infra` or a typo like `q=Architechture` would otherwise match nothing. `q` of at least 3 characters
also gets checked against `title` with Postgres `pg_trgm` `word_similarity` (trigram fuzzy matching) as a second,
ORed signal — results are ranked by whichever signal scored higher. Below 3 characters this fallback is disabled
(too short to be meaningful — a 1-2 character query trivially "resembles" almost every title via trigram overlap).
Threshold `0.6`, picked empirically: genuine partial-word/typo matches score `0.68`–`0.89` against this schema's
titles; an unrelated word tops out around `0.5`.

| Parameter | Type    | Default | Notes |
|-----------|---------|---------|-------|
| `q`       | string  | —       | Required |
| `limit`   | integer | `10`    | Clamped `[1,100]` |
| `cursor`  | string  | —       | Pagination cursor |

#### 7.1.4 List All Tags **[client key or admin]**

```
GET /public/posts/tags
```

Every tag currently used by a **publicly visible** post, with counts, alphabetical — no admin bypass (a discovery
aid for public content, not itself gated by visibility rules the way individual posts are).

```json
{ "data": [ { "tag": "ai", "count": 1 }, { "tag": "architecture", "count": 1 } ] }
```

### 7.2 Projects

No visibility distinction by auth — `archived`/`in-progress` projects are visible to everyone, same as `active`.
The admin equivalent at `/admin/projects` (8.3) behaves identically; it exists purely for routing symmetry with
Posts.

#### 7.2.1 List Projects **[client key or admin]**

```
GET /public/projects?featured=&tag=&status=&sort=&fields=
```

Not paginated — returns the entire filtered/sorted set as `ProjectSummary` (all fields except
`long_description`).

| Parameter  | Type    | Default | Notes |
|------------|---------|---------|-------|
| `featured` | boolean | —       | `true` returns only featured projects |
| `tag`      | string  | —       | Exact-match containment filter |
| `status`   | string  | —       | `active`, `in-progress`, or `archived` |
| `sort`     | string  | `-year` | `year` or `title` |

#### 7.2.2 Search Projects **[client key or admin]**

```
GET /public/projects/search?q=&limit=
```

Full-text search across `title`/`description` (weighted A/B). Unpaginated top-N (`limit`, default `10`, clamped
`[1,100]`), unlike Posts search — no fuzzy-title fallback either; this endpoint is unchanged from prior releases.

#### 7.2.3 Get Project by Slug **[client key or admin]**

```
GET /public/projects/{slug}
```

Returns the full `Project`, including `long_description`.

### 7.3 Profile & CV

Singleton resource — exactly one row (`profile.id = 1`). No visibility distinction by auth; `/admin/profile`'s
reads (8.4) are behaviorally identical.

```
GET /public/profile                  → full Profile   [client key or admin]
GET /public/profile/skills           → SkillGroup[]    [client key or admin]
GET /public/profile/experience       → ExperienceEntry[] (optional ?current=true)  [client key or admin]
GET /public/profile/education        → EducationEntry[]  [client key or admin]
GET /public/profile/certifications   → CertificationEntry[]  [client key or admin]
GET /public/profile/awards           → AwardEntry[]  [client key or admin]
```

All 404 (`"Profile has not been configured yet."`) in the theoretical case the singleton row is missing — the seed
migration always creates it, so this shouldn't surface in a normally-provisioned instance.

### 7.4 Link Shortener

```
GET /public/links/{code}
```

**Fully public — no client key or admin credential required**, unlike everything else in this section (gating it
would make the link shortener nonfunctional for its actual purpose: an arbitrary browser clicking a shared link).
This is what a frontend route handler calls to find out where a short code points, so it can perform the actual
browser redirect itself — **this implementation never returns an HTTP redirect directly**. Every successful call
counts as one click (`click_count` incremented, `last_clicked_at` stamped). An expired (`expires_at` passed) or
deactivated (`is_active = false`) link 404s, same message as a nonexistent code. Managing the link registry
(create/update/delete/list) is admin-only — section 8.5.

### 7.5 Contact

```
POST /public/contact
```

**Public — no client key required**, own dedicated rate limit (5/hour/IP, section 4).

```json
{ "name": "Jane Smith", "email": "jane@example.com", "subject": "Hi", "message": "..." }
```

| Field     | Required | Validation             |
|-----------|----------|---------------------------|
| `name`    | yes      | 1–200 characters          |
| `email`   | yes      | Must parse as an email    |
| `subject` | yes      | 1–200 characters          |
| `message` | yes      | 1–5000 characters         |

**Response `202 Accepted`** always, once validation passes, regardless of whether delivery actually succeeds:

```json
{ "data": { "queued": true, "message": "Your message has been received. Yusron will get back to you shortly." } }
```

**Implementation note:** validation and persistence are synchronous (a `400` is immediate, and every validated
submission is written to `contact_messages` before the response is sent); only the Resend API call is dispatched
to a background goroutine with its own 15s timeout, so a slow/unreachable email provider never delays or fails the
response. If `RESEND_API_KEY` is unset, the submission is still persisted and the response is still
`202 { "queued": true }` — `"queued"` guarantees the message is recorded and visible via [8.6](#86-contact-moderation),
not that an email was sent. Each stored message also records a salted hash of the submitter's IP (`ip_hash`,
`IP_HASH_SALT`) for abuse correlation — never exposed via any API response.

### 7.6 Meta & SEO

#### 7.6.1 Sitemap **[client key or admin]**

```
GET /public/sitemap
```

Built dynamically from the live `posts`/`projects` tables on every request — can never drift out of sync with
actual content the way a static file would.

```json
{
  "data": [
    { "url": "https://yusronizza.com/", "lastmod": "2026-08-02", "changefreq": "monthly", "priority": 1.0 },
    { "url": "https://yusronizza.com/blog/the-ai-boom-is-an-infrastructure-story", "lastmod": "2026-06-15", "changefreq": "yearly", "priority": 0.6 }
  ]
}
```

The site base URL is `SITE_BASE_URL` (Appendix B), defaulting to `https://yusronizza.com` — deliberately not this
API's own origin/port; it's the public frontend the sitemap links out to. `lastmod` for static pages (`/`,
`/about`, `/cv`, `/projects`) is the current date at request time; `/blog` uses the most recent post's
`published_at`. Posts are capped at the first 100, newest-first.

#### 7.6.2 Open Graph Metadata

```
GET /public/meta/og?path={url_path}
```

**Fully public — no client key or admin credential required**, unlike 7.6.1 above: fetched directly by
social-media/chat link unfurlers (Twitter, Discord, Slack, ...) building a link preview, which aren't and can't be
a registered client.

| Parameter | Required | Description |
|-----------|----------|----------------|
| `path`    | yes      | Must start with `/`, e.g. `/blog/my-post` |

```json
{
  "data": {
    "title": "Clean Architecture on Bare Metal",
    "description": "...",
    "url": "https://yusronizza.com/blog/clean-architecture-on-bare-metal",
    "image": "https://yusronizza.com/api/v1/public/meta/og-image?path=%2Fblog%2Fclean-architecture-on-bare-metal"
  }
}
```

### 7.7 Web Analytics — Page View Beacon

```
POST /public/analytics/pageviews
```

**Public — no client key required.** Called by the frontend site on every page load.

```json
{ "path": "/blog/clean-architecture-on-bare-metal", "referrer": "https://twitter.com/" }
```

| Field      | Required | Validation |
|------------|----------|----------------|
| `path`     | yes      | Must start with `/`; at most 2048 characters |
| `referrer` | no       | Must parse as a URL if provided; omit or `""` for direct traffic |

`user_agent` and the visitor's IP are derived server-side from the request, never from the body, so a client can't
spoof them. **Response `202 Accepted`**: `{ "data": { "recorded": true } }`. No way to fetch/list/delete an
individual event through the API — only the aggregate reports at [8.9](#89-analytics), by design. Every stored
event also records a salted IP hash (`IP_HASH_SALT`) alongside the raw IP, to approximate unique visitors.

### 7.8 Menu

```
GET /public/menu
```

**[client key or admin]** — the public frontend's own nav, dynamically defined rather than hardcoded, so adding a
page doesn't require a frontend deploy. Returns only `group = "public"`, `is_visible = true` items, as a **nested
tree** — each top-level item carries its submenu items (if any) in `children` — rather than the flat list the
management endpoint (`/admin/menu-items`) returns. See [8.8](#88-menu) for the admin dashboard's parallel
`/admin/menu`, and the CRUD that manages both.

```json
{
  "data": [
    { "id": 1, "group": "public", "parent_id": null, "section": "", "label": "Home", "path": "/", "icon": "home", "sort_order": 10, "is_visible": true, "created_at": "...", "updated_at": "..." },
    {
      "id": 18, "group": "public", "parent_id": null, "section": "", "label": "Docs", "path": "/docs", "icon": "", "sort_order": 15, "is_visible": true, "created_at": "...", "updated_at": "...",
      "children": [
        { "id": 19, "group": "public", "parent_id": 18, "section": "", "label": "Guides", "path": "/docs/guides", "icon": "", "sort_order": 10, "is_visible": true, "created_at": "...", "updated_at": "..." },
        { "id": 20, "group": "public", "parent_id": 18, "section": "", "label": "API Reference", "path": "/docs/api", "icon": "", "sort_order": 20, "is_visible": true, "created_at": "...", "updated_at": "..." }
      ]
    }
  ]
}
```

**Submenus are exactly one level deep** — a `children` entry never has its own `children`. `parent_id` makes an
item a submenu entry of another; see [8.8](#88-menu)'s validation table for how it's constrained. A submenu item
whose parent didn't pass the `is_visible`/group filter (a hidden parent, or — impossible here since this read is
already scoped to one group, but relevant to `/admin/menu-items` — a cross-group parent) is dropped from this
response entirely rather than promoted to look like a top-level item, since that would misrepresent the menu's
actual structure.

`path` is a **frontend** route (e.g. `/blog`, `/admin/posts`), not an API path — this backend has no way to
validate it points anywhere real (unlike `cover_image_url` on a `Post`, which is at least checked for being a
well-formed absolute URL — see 7.1's "Images" note — `path` isn't even that, since a frontend route is
deliberately relative). Not paginated, same reasoning as Projects — a site's nav is expected to stay small.

### 7.9 Media

```
GET  /media/{filename}
HEAD /media/{filename}
```

**Not under `/api/v1`, and deliberately public/unauthenticated** — no client key, no admin credential. `filename`
is the random, server-generated name returned as `url` on the `Media` object (section 8.12), not the name the file
was originally uploaded under. Content negotiation is standard HTTP: `Range` requests (`206 Partial Content`),
conditional `If-Modified-Since`, and `HEAD` (for checking `Content-Length`/`Content-Type` before downloading) are
all supported via `http.ServeContent`.

Response headers:

| Header                   | Behavior |
|---------------------------|----------|
| `Content-Type`            | The type resolved from the original file extension at upload time — never sniffed, never trusted from a request header |
| `X-Content-Type-Options`  | Always `nosniff` — pairs with the above so a browser can never execute the response as something other than its declared type |
| `Content-Disposition`     | `inline` for images (renders in an `<img>`/browser tab); `attachment` for everything else, carrying the *original* filename for the download |
| `Cache-Control`           | `public, max-age=31536000, immutable` — a filename is never reused by a new upload, so the bytes at a given URL never change |

`404 NOT_FOUND` if `filename` doesn't match any uploaded file (including one that's since been deleted).

---

## 8. Admin API

Everything under `/api/v1/admin`. Every endpoint is **[auth required]** (section 2.1/2.2) except
[`POST /admin/login`](#81-login--session) itself, which is what gets you a credential in the first place. A
registered client key (2.5) never works here — only an actual admin credential does.

### 8.1 Login & Session

#### 8.1.1 Login

```
POST /admin/login
```

Rate-limited strictly, both per IP and per `identifier` (section 4).

```json
{ "identifier": "admin", "password": "..." }
```

| Field        | Required | Validation |
|--------------|----------|----------------------------------------------------------------------|
| `identifier` | yes      | The configured `ADMIN_USERNAME` **or** `ADMIN_EMAIL`, matched case-insensitively |
| `password`   | yes      | Must match the stored password |

**`200 OK`** on success — `{ "data": { "authenticated": true } }` plus `Set-Cookie: admin_session=...` (2.2).
**`401 UNAUTHORIZED`** on a wrong identifier, wrong password, or password login not configured at all — all three
return the identical `"Incorrect username/email or password."`, deliberately, so a wrong identifier can't be
distinguished from a wrong password by response content. The password check (`bcrypt.CompareHashAndPassword`)
always runs, even when `identifier` plainly doesn't match, to avoid a timing side-channel. A successful login
always creates a brand-new session, rotating out any prior one the request's own cookie referenced (2.2).

#### 8.1.2 Logout

```
POST /admin/logout
```

Deletes the current session and clears the cookie. Idempotent — logging out with no session, or an already-expired
one, still returns `204 No Content`.

#### 8.1.3 Change Password

```
PATCH /admin/password
```

```json
{ "current_password": "...", "new_password": "..." }
```

| Field              | Required | Validation |
|--------------------|----------|--------------------------------------------------------|
| `current_password` | yes      | Must match the stored password — `400` on `current_password` if not |
| `new_password`     | yes      | At least 12 characters — `400` on `new_password` if shorter |

**`204 No Content`** on success. Invalidates **every** existing session, not just the caller's — so a
stolen-but-still-active session elsewhere doesn't outlive the rotation meant to shut exactly that down. If the
request itself was cookie-authenticated, the caller's own session is rotated (a fresh one issued via the same
`Set-Cookie`) rather than left logged out; a Bearer-token caller had no cookie and gets none back.

#### 8.1.4 Verify Token

```
GET /admin/verify
```

A cheap "is my credential still valid" check — reaching the handler at all already proves it (RequireAuth
rejected it otherwise). `{ "data": { "authenticated": true } }`.

### 8.2 Posts

Full CRUD, plus the admin's own always-full-visibility reads — no auth branching at all here (unlike
[7.1](#71-posts)'s public equivalent): reaching this handler already implies an admin credential, so every read
always sees every status.

```
GET    /admin/posts?limit=&cursor=&tag=&sort=&status=
GET    /admin/posts/tags
GET    /admin/posts/search?q=&limit=&cursor=
GET    /admin/posts/{slug}
POST   /admin/posts
PATCH  /admin/posts/{slug}
DELETE /admin/posts/{slug}
```

Reads mirror [7.1](#71-posts) exactly (same params, same fuzzy-search fallback, same `meta` envelope) except
`status` always takes effect and drafts are never hidden.

**`POST /admin/posts`:**

```json
{
  "title": "My New Article",
  "excerpt": "A short summary.",
  "content": "# Heading\n\nMarkdown content...",
  "tags": ["go", "backend"],
  "published_at": "2026-08-04",
  "slug": null,
  "status": "published",
  "cover_image_url": ""
}
```

| Field             | Required | Validation |
|-------------------|----------|----------------------------------------------------------|
| `title`           | yes      | 1–200 characters |
| `excerpt`         | yes      | 1–500 characters |
| `content`         | yes      | Non-empty Markdown; rendered to `content_html` server-side |
| `tags`            | yes      | At least one tag required |
| `published_at`    | no       | `YYYY-MM-DD`; required if `status` is `scheduled`/`published` |
| `slug`            | no       | Derived from `title` if omitted; must be unique |
| `status`          | no       | `draft`/`scheduled`/`published`, default `published` |
| `cover_image_url` | no       | Empty, or an absolute `http(s)` URL — not verified to resolve to a real image (see 7.1's "Images" note) |

**`201 Created`** with the full `Post`. **`409 CONFLICT`** if the slug already exists.

**`PATCH /admin/posts/{slug}`** — same fields, all optional, partial update (nil/omitted fields untouched). Same
as `published_at`, an explicit empty string on `cover_image_url` clears it (removes the cover image) rather than
being rejected as invalid — omitting the field entirely is what leaves it untouched.
**`DELETE /admin/posts/{slug}`** — **`204 No Content`**, **`404`** if the slug doesn't exist.

**Implementation note — tags are normalized:** a shared `tags` table plus a `post_tags` join table (also used by
Projects), not a JSON array column — invisible from the API (`tags` is still a plain `string[]`), but a tag is a
single canonical row shared across posts and projects.

### 8.3 Projects

```
GET    /admin/projects?featured=&tag=&status=&sort=
GET    /admin/projects/search?q=&limit=
GET    /admin/projects/{slug}
POST   /admin/projects
PATCH  /admin/projects/{slug}
DELETE /admin/projects/{slug}
```

Reads are behaviorally identical to [7.2](#72-projects)'s public equivalent (Projects has no visibility
distinction by auth at all) — kept as a separate handler purely for routing symmetry with Posts.

**`POST /admin/projects`:**

```json
{
  "slug": "my-project",
  "title": "My Project",
  "description": "One-line summary.",
  "long_description": ["Paragraph one.", "Paragraph two."],
  "tags": ["go", "postgres"],
  "role": "Personal Project",
  "year": 2026,
  "featured": false,
  "links": { "repo": "https://github.com/...", "live": "" },
  "highlights": ["Did a thing.", "Did another thing."],
  "status": "active"
}
```

| Field    | Required | Validation |
|----------|----------|------------------------------------------|
| `slug`   | yes      | Must be unique |
| `title`  | yes      | 1–200 characters |
| `year`   | yes      | Reasonable year value |
| `status` | no       | `active`/`in-progress`/`archived`, default `active` |

**`201 Created`**, **`409 CONFLICT`** on a duplicate slug, **`404`** on `PATCH`/`DELETE` of an unknown slug.

### 8.4 Profile & CV

Singleton resource. Reads mirror [7.3](#73-profile--cv) exactly (behaviorally identical — no visibility
distinction).

```
GET   /admin/profile
GET   /admin/profile/skills
GET   /admin/profile/experience
GET   /admin/profile/education
GET   /admin/profile/certifications
GET   /admin/profile/awards
PATCH /admin/profile
GET   /admin/profile/history
```

**`PATCH /admin/profile`** — every field optional, partial update; array fields (`skills`, `experience`, etc.) are
replaced wholesale when present, not merged element-by-element. Only fields actually present in the request body
are considered "set" — `null` vs. omitted is distinguished, so a client can tell "leave `bio` alone" from "clear
`bio` to an empty array."

**`GET /admin/profile/history`** — the audit trail of every `PATCH`, cursor-paginated (`meta` envelope),
newest-first:

```json
{
  "data": [
    {
      "id": 1,
      "changed_fields": {
        "tagline": { "old": "Building things.", "new": "Building high-performance, scalable embedded and digital systems." }
      },
      "changed_at": "2026-08-03T10:15:00Z"
    }
  ],
  "meta": { "total": 1, "limit": 10, "next_cursor": null, "prev_cursor": null }
}
```

**Implementation note:** each `PATCH` is diffed field-by-field against the profile as it stood immediately before
the update — only fields present in the request *and* actually changed produce a history entry. Array fields
record the entire before/after array, not a per-element diff. Recording history is best-effort: a failure never
rolls back the profile update itself, only logs server-side.

### 8.5 Link Shortener

Resolving a code for an actual visitor is [7.4](#74-link-shortener)'s job instead — this is registry management
only.

```
GET    /admin/links?limit=&cursor=
POST   /admin/links
PATCH  /admin/links/{code}
DELETE /admin/links/{code}
```

**`POST /admin/links`:**

```json
{ "target_url": "https://yusronizza.com/blog/big-announcement", "code": null, "expires_at": null }
```

| Field        | Required | Validation |
|--------------|----------|------------------------------------------------------|
| `target_url` | yes      | Must parse as a URL |
| `code`       | no       | Auto-generated (7 chars, base62) if omitted; must be unique if given |
| `expires_at` | no       | RFC3339; null means never expires |

**`201 Created`**, **`409 CONFLICT`** on a duplicate code. **`PATCH`** accepts `target_url`/`expires_at`/`is_active`,
all optional. **`DELETE`** — **`204`**, **`404`** on an unknown code.

### 8.6 Contact Moderation

```
GET    /admin/contact-messages?limit=&cursor=&status=
GET    /admin/contact-messages/{id}
PATCH  /admin/contact-messages/{id}
DELETE /admin/contact-messages/{id}
```

The admin-side view of every validated [`POST /public/contact`](#75-contact) submission, letting the site owner
review messages even if Resend delivery failed or wasn't configured. Cursor-paginated (`meta` envelope),
newest-first, optional `?status=` filter.

**`PATCH /admin/contact-messages/{id}`:**

```json
{ "status": "read" }
```

| Field    | Required | Validation |
|----------|----------|--------------------------------------|
| `status` | yes      | `unread`, `read`, `archived`, or `spam` |

**Implementation note:** `read_at` is stamped server-side the **first** time `status` becomes `"read"`
(`UPDATE ... RETURNING`, no read-then-write race) — moving to `archived`/`spam` afterward never overwrites that
original timestamp.

### 8.7 API Clients

Manages the registry [2.5](#25-registered-client-key-public-reads) checks against.

```
POST   /admin/clients
GET    /admin/clients?limit=&cursor=
DELETE /admin/clients/{id}
```

**`POST /admin/clients`:**

```json
{ "name": "yusronizza-frontend" }
```

| Field  | Required | Validation |
|--------|----------|---------------------------------------------------|
| `name` | yes      | Non-empty after trimming, at most 200 characters |

**Response `201 Created`** — the **only** response that ever includes the plaintext key:

```json
{
  "data": {
    "id": 1,
    "name": "yusronizza-frontend",
    "is_active": true,
    "created_at": "2026-08-04T06:00:00Z",
    "client_key": "6a2bed1689e68bccf57fc0b699c300b1e71db88c73e33df93e4660285c51e9b4"
  }
}
```

**Save `client_key` now** — never returned again; only its SHA-256 hash is stored.

**`GET /admin/clients`** — paginated, `client_key`/hash **never** included:

```json
{
  "data": [ { "id": 1, "name": "yusronizza-frontend", "is_active": true, "created_at": "...", "last_used_at": "..." } ],
  "meta": { "total": 1, "limit": 10, "next_cursor": null, "prev_cursor": null }
}
```

`last_used_at` is `null` until the key's first successful [2.5](#25-registered-client-key-public-reads) check,
then bumped on every subsequent one — a quick way to spot a registered-but-never-integrated or gone-stale client.

**`DELETE /admin/clients/{id}`** — revokes (`is_active = false`), immediately invalidating the key. A **soft**
revoke, not a hard delete: the row stays so [request-log](#894-request-log) entries already attributed to it keep
their `client_name`. **`204`**, idempotent; **`404`** only for an id that never existed. No un-revoke — register a
new client instead.

**Implementation note — why a key, not a password:** generated server-side (`crypto/rand`, 32 bytes → 64 hex
characters) and stored as a plain `SHA-256` hash, not a deliberately-slow one like `bcrypt` — a high-entropy random
token needs no extra work factor to resist brute force the way a human password does, and this check runs on
every gated public `GET` request, where `bcrypt`'s cost would add real, unwanted latency.

### 8.8 Menu

```
GET /admin/menu
```

The admin dashboard's own visible sidebar — mirrors [`GET /public/menu`](#78-menu) exactly, just
`group = "admin"` instead. Managing the underlying data (either group) is a separate, explicit set of endpoints:

```
GET    /admin/menu-items?group=
POST   /admin/menu-items
PATCH  /admin/menu-items/{id}
DELETE /admin/menu-items/{id}
```

`GET /admin/menu-items` is the full management list — **both** groups (or one, via `?group=public`/`?group=admin`),
**including hidden** items, returned **flat** (with `parent_id`) rather than nested — unlike `GET /admin/menu`/
`GET /public/menu`, which only ever show a live nav as a tree. This split exists two ways: "give me my nav" (a
simple, frequent read any frontend can call on every page load, tree-shaped for direct rendering) never gets
confused with "let me manage the underlying menu data" (an editing screen's concern, table-shaped for a
sortable/searchable admin UI).

**`POST /admin/menu-items`:**

```json
{ "group": "public", "parent_id": null, "section": "", "label": "Guides", "path": "/docs/guides", "icon": "edit", "sort_order": 20, "is_visible": true }
```

| Field        | Required | Validation |
|--------------|----------|------------------------------------------------|
| `group`      | yes      | `public` or `admin` |
| `parent_id`  | no       | Omit/`null` for a top-level item. To nest as a submenu entry, must reference an existing **top-level** item in the *same* `group` — see "Submenus" below |
| `label`      | yes      | Non-empty after trimming, at most 100 characters |
| `path`       | yes      | Must start with `/`, at most 200 characters |
| `section`    | no       | Optional grouping label for a sectioned sidebar (e.g. admin's "Analytics"); at most 100 characters |
| `icon`       | no       | At most 50 characters — an icon name/hint, meaningful only to the frontend |
| `sort_order` | no       | Default `0`; lower sorts first |
| `is_visible` | no       | Default `true` |

**`201 Created`**. **`PATCH /admin/menu-items/{id}`** — every field optional, partial update (including moving an
item between groups). `parent_id` follows the same convention `expires_at` uses elsewhere (section 8.5): omitted
leaves it untouched, an explicit `0` clears it (promotes the item back to top-level), a positive id reparents it —
plain JSON `null` and omission are indistinguishable to a server, so `0` (never a real id) is the explicit-clear
sentinel instead. **`DELETE /admin/menu-items/{id}`** — **`204`**, **`404`** on an unknown id. Unlike API Clients,
this is a genuine **hard** delete — nothing downstream (no audit log, no request log) ever references a menu
item, so there's no history worth preserving. Deleting a top-level item also deletes its submenu items (`ON
DELETE CASCADE`) rather than orphaning them.

**Submenus — exactly one level deep.** `parent_id` nests an item under another, but never more than one level:
attempting to nest a third level (a submenu item under another submenu item), reference a parent in a different
`group`, reference a nonexistent parent, make an item its own parent, or reparent an item that already has its
own submenu items — all `400 VALIDATION_ERROR` on field `parent_id`, with a message naming which rule failed.
This is enforced application-side (`MenuUsecase.validateParent`), not by the schema — Postgres has no clean way
to cap FK-chain depth — so it only ever applies through this API, not to whatever raw SQL a migration might run.

### 8.9 Analytics

Two distinct things live under this umbrella: **page views** (public frontend traffic, reported by the frontend
itself via [7.7](#77-web-analytics--page-view-beacon)'s beacon) and **API requests** (this backend's own traffic,
captured automatically by middleware on every call — including calls to these report endpoints themselves).
`summary`/`top-*`/`daily` all accept optional `?since=&until=` (`YYYY-MM-DD`, either side omittable for
"unbounded").

```
GET /admin/analytics/pageviews/summary
GET /admin/analytics/pageviews/top-pages?limit=
GET /admin/analytics/pageviews/top-referrers?limit=
GET /admin/analytics/pageviews/daily
GET /admin/analytics/api-requests/summary
GET /admin/analytics/api-requests/top-endpoints?limit=
GET /admin/analytics/api-requests/daily
GET /admin/analytics/api-requests/logs?limit=&cursor=
```

```json
// GET .../pageviews/summary
{ "data": { "total_views": 4213, "unique_visitors": 1820 } }

// GET .../pageviews/top-pages
{ "data": [ { "path": "/blog/the-ai-boom-is-an-infrastructure-story", "views": 900 } ] }

// GET .../api-requests/summary
{ "data": { "total_requests": 18420, "avg_duration_ms": 4.7, "error_rate_pct": 0.3 } }

// GET .../api-requests/top-endpoints
{ "data": [ { "method": "GET", "route_pattern": "/api/v1/public/posts", "requests": 6100, "avg_duration_ms": 3.1 } ] }

// GET .../daily (either domain)
{ "data": [ { "date": "2026-08-01", "count": 900 }, { "date": "2026-08-02", "count": 1120 } ] }
```

**Implementation note — route pattern, not literal path:** `route_pattern` is the matched chi route template
(e.g. `/api/v1/public/posts/{slug}`), not the literal request path — keeps cardinality bounded regardless of how
many distinct slugs/codes get requested.

**Implementation note — retention:** `analytics_pageviews`/`analytics_api_requests` are the only two tables that
grow unbounded. A background job (started with the server, stopped on graceful shutdown) deletes rows older than
`ANALYTICS_RETENTION_DAYS` (default 180) once at startup and then every 24 hours; `0` disables it.

#### 8.9.4 Request Log

```
GET /admin/analytics/api-requests/logs?limit=&cursor=
```

Everything above in this section is an **aggregate**. This is the individual rows those aggregates are computed
from — cursor-paginated (`meta` envelope, no `since`/`until`), newest first.

```json
{
  "data": [
    { "id": 4821, "method": "GET", "route_pattern": "/api/v1/public/posts", "status_code": 200, "duration_ms": 3, "client_id": 1, "client_name": "yusronizza-frontend", "created_at": "2026-08-04T06:05:00Z" },
    { "id": 4820, "method": "POST", "route_pattern": "/api/v1/admin/clients", "status_code": 201, "duration_ms": 2, "client_id": null, "client_name": null, "created_at": "2026-08-04T06:00:00Z" }
  ],
  "meta": { "total": 4821, "limit": 10, "next_cursor": "...", "prev_cursor": null }
}
```

`client_id`/`client_name` are `null` for an admin-authenticated call, or any route [2.5](#25-registered-client-key-public-reads)
doesn't gate at all; `client_name` reflects the client's **current** name even if renamed after the fact, and
stays populated even after the client is revoked (revoking is a soft `is_active = false`, not a delete).

**Implementation note:** every request-log write happens asynchronously in its own goroutine, detached from the
request's own context, after the response has already been sent — a slow or unreachable database write never adds
latency to, or fails, the API call being measured.

### 8.10 Dashboard Stats

```
GET /admin/stats
```

Aggregates counts across every admin-managed resource in a single call:

```json
{
  "data": {
    "posts": 3, "projects": 2, "links": 12, "link_clicks_total": 483,
    "contact_messages": 7, "page_views_total": 4213, "api_requests_total": 18420
  }
}
```

`page_views_total`/`api_requests_total` are all-time totals — for a windowed breakdown or top pages/endpoints, use
[8.9](#89-analytics) instead.

### 8.11 Audit Log

```
GET /admin/audit-log?limit=&cursor=
```

The security audit trail: every login attempt (success or failure), logout, password change (success or
failure), and use of the static `ADMIN_API_KEY` Bearer token. Cursor-paginated (`meta` envelope), newest-first.

```json
{
  "data": [
    { "id": 42, "event_type": "login_success", "session_id": 17, "ip_address": "203.0.113.10", "user_agent": "Mozilla/5.0 ...", "detail": "", "created_at": "2026-08-03T10:15:00Z" }
  ],
  "meta": { "total": 128, "limit": 10, "next_cursor": "...", "prev_cursor": null }
}
```

| Field        | Type           | Notes |
|--------------|-----------------|----------------------------------------------------------------------|
| `event_type` | string          | `login_success`, `login_failure`, `logout`, `password_change`, `password_change_failure`, `api_key_auth` |
| `session_id` | number \| null  | Null for events with no associated session (`login_failure`, `password_change_failure`, `api_key_auth`) |
| `ip_address` | string          | `X-Forwarded-For`'s last entry, else the raw connection address (section 4) |
| `detail`     | string          | Optional context (e.g. a failure reason); never a password, key, or token |

**Implementation note:** written asynchronously in its own goroutine, same as the request log. `api_key_auth` is
recorded for *every* Bearer-token-authenticated request, not just admin actions of note.

### 8.12 Media Library

```
GET    /admin/media?limit=&cursor=&category=
POST   /admin/media                 (multipart/form-data)
GET    /admin/media/{id}
PATCH  /admin/media/{id}
DELETE /admin/media/{id}
```

Uploads, and manages metadata for, images/documents/archives referenced elsewhere (a post's `cover_image_url`, an
embedded image in Markdown content, an attached document). Retrieving the actual file bytes is a *different,
public* route — [`GET /media/{filename}`](#79-media), section 7.9 — since that one has to work from an `<img>` tag
or a plain browser request, neither of which can send admin credentials.

**`GET /admin/media`** — cursor-paginated (`meta` envelope), newest-first. `category` optionally filters to
`image`, `document`, or `archive`.

```json
{
  "data": [
    { "id": 1, "filename": "31fd97194bb86207cad3f5a88afd2369.png", "original_filename": "diagram.png", "mime_type": "image/png", "category": "image", "size_bytes": 48213, "alt_text": "architecture diagram", "url": "/media/31fd97194bb86207cad3f5a88afd2369.png", "created_at": "2026-08-04T12:10:49Z" }
  ],
  "meta": { "total": 1, "limit": 10, "next_cursor": null, "prev_cursor": null }
}
```

**`POST /admin/media`** — `multipart/form-data`, not JSON (the only endpoint in this API that isn't):

| Form field | Required | Notes |
|------------|----------|-------|
| `file`     | yes      | The upload itself |
| `alt_text` | no       | Accessibility/caption text — the only field ever editable after upload |

The **file extension** (case-insensitive), not the browser-supplied `Content-Type` or the bytes themselves, is the
sole authority on what's accepted and what category/MIME type it's filed under — an intentionally fixed allow-list
that never includes anything that could plausibly execute:

| Category   | Extensions |
|------------|------------|
| `image`    | `.jpg` `.jpeg` `.png` `.gif` `.webp` `.svg` |
| `document` | `.pdf` `.doc` `.docx` `.xls` `.xlsx` `.ppt` `.pptx` `.txt` `.csv` `.md` `.json` |
| `archive`  | `.zip` |

`400 VALIDATION_ERROR` (`field: "file"`) for anything else. The file is stored under a random, server-generated
name (never the original name, never anything path-derived from client input) — see `filename` vs
`original_filename` on the response. `413 PAYLOAD_TOO_LARGE` if the upload exceeds `MEDIA_MAX_UPLOAD_BYTES`
(Appendix B) — a larger, separately-enforced cap than every other (JSON) endpoint's `MAX_REQUEST_BODY_BYTES`.
**`201 Created`** with the full `Media` object on success.

**`PATCH /admin/media/{id}`** — `{"alt_text": "..."}`. `alt_text` is the only field this endpoint ever changes;
everything else describes the uploaded file itself and is immutable after upload. **`DELETE /admin/media/{id}`** —
**`204`**, **`404`** on an unknown id — removes both the database record and the underlying stored file. A hard
delete: nothing tracks media usage across posts/projects, so deleting a file that's still referenced elsewhere
will break that reference (the same way deleting a `Post` referenced by an external bookmark just 404s it).

---

## Appendix A: Endpoint Summary

`✓` under Auth = **[auth required]** (Bearer or session). `client` = **[client key or admin]** (section 2.5). `—` =
fully public.

### Public (`/api/v1/public`)

| Method | Path                        | Auth   | Rate-limit tier |
|--------|-----------------------------|--------|-------------------|
| `GET`  | `/public/posts`             | client | anonymous/authenticated |
| `GET`  | `/public/posts/tags`        | client | anonymous/authenticated |
| `GET`  | `/public/posts/search`      | client | anonymous/authenticated |
| `GET`  | `/public/posts/{slug}`      | client | anonymous/authenticated |
| `GET`  | `/public/projects`          | client | anonymous/authenticated |
| `GET`  | `/public/projects/search`   | client | anonymous/authenticated |
| `GET`  | `/public/projects/{slug}`   | client | anonymous/authenticated |
| `GET`  | `/public/profile`           | client | anonymous/authenticated |
| `GET`  | `/public/profile/skills`    | client | anonymous/authenticated |
| `GET`  | `/public/profile/experience`| client | anonymous/authenticated |
| `GET`  | `/public/profile/education` | client | anonymous/authenticated |
| `GET`  | `/public/profile/certifications` | client | anonymous/authenticated |
| `GET`  | `/public/profile/awards`    | client | anonymous/authenticated |
| `GET`  | `/public/links/{code}`      | —      | anonymous/authenticated |
| `GET`  | `/public/sitemap`           | client | anonymous/authenticated |
| `GET`  | `/public/meta/og`           | —      | anonymous/authenticated |
| `POST` | `/public/contact`           | —      | anonymous + 5/hour contact-specific |
| `POST` | `/public/analytics/pageviews` | —    | anonymous |
| `GET`  | `/public/menu`              | client | anonymous/authenticated |

### Media (outside `/api/v1`)

| Method | Path                | Auth | Rate-limit tier |
|--------|---------------------|------|-------------------|
| `GET`  | `/media/{filename}` | —    | none — not under `/api/v1`, see section 7.9 |
| `HEAD` | `/media/{filename}` | —    | none — not under `/api/v1`, see section 7.9 |

### Admin (`/api/v1/admin`)

| Method   | Path                                   | Auth | Rate-limit tier |
|----------|------------------------------------------|------|-------------------|
| `POST`   | `/admin/login`                          | —    | anonymous + strict login-specific |
| `POST`   | `/admin/logout`                         | ✓    | authenticated |
| `PATCH`  | `/admin/password`                       | ✓    | authenticated |
| `GET`    | `/admin/verify`                         | ✓    | authenticated |
| `GET`    | `/admin/stats`                          | ✓    | authenticated |
| `GET`    | `/admin/audit-log`                      | ✓    | authenticated |
| `GET`    | `/admin/posts`                          | ✓    | authenticated |
| `GET`    | `/admin/posts/tags`                     | ✓    | authenticated |
| `GET`    | `/admin/posts/search`                   | ✓    | authenticated |
| `GET`    | `/admin/posts/{slug}`                   | ✓    | authenticated |
| `POST`   | `/admin/posts`                          | ✓    | authenticated |
| `PATCH`  | `/admin/posts/{slug}`                   | ✓    | authenticated |
| `DELETE` | `/admin/posts/{slug}`                   | ✓    | authenticated |
| `GET`    | `/admin/projects`                       | ✓    | authenticated |
| `GET`    | `/admin/projects/search`                | ✓    | authenticated |
| `GET`    | `/admin/projects/{slug}`                | ✓    | authenticated |
| `POST`   | `/admin/projects`                       | ✓    | authenticated |
| `PATCH`  | `/admin/projects/{slug}`                | ✓    | authenticated |
| `DELETE` | `/admin/projects/{slug}`                | ✓    | authenticated |
| `GET`    | `/admin/profile`                        | ✓    | authenticated |
| `GET`    | `/admin/profile/skills`                 | ✓    | authenticated |
| `GET`    | `/admin/profile/experience`             | ✓    | authenticated |
| `GET`    | `/admin/profile/education`              | ✓    | authenticated |
| `GET`    | `/admin/profile/certifications`         | ✓    | authenticated |
| `GET`    | `/admin/profile/awards`                 | ✓    | authenticated |
| `PATCH`  | `/admin/profile`                        | ✓    | authenticated |
| `GET`    | `/admin/profile/history`                | ✓    | authenticated |
| `GET`    | `/admin/links`                          | ✓    | authenticated |
| `POST`   | `/admin/links`                          | ✓    | authenticated |
| `PATCH`  | `/admin/links/{code}`                   | ✓    | authenticated |
| `DELETE` | `/admin/links/{code}`                   | ✓    | authenticated |
| `GET`    | `/admin/contact-messages`               | ✓    | authenticated |
| `GET`    | `/admin/contact-messages/{id}`          | ✓    | authenticated |
| `PATCH`  | `/admin/contact-messages/{id}`          | ✓    | authenticated |
| `DELETE` | `/admin/contact-messages/{id}`          | ✓    | authenticated |
| `POST`   | `/admin/clients`                        | ✓    | authenticated |
| `GET`    | `/admin/clients`                        | ✓    | authenticated |
| `DELETE` | `/admin/clients/{id}`                   | ✓    | authenticated |
| `GET`    | `/admin/menu`                           | ✓    | authenticated |
| `GET`    | `/admin/menu-items`                     | ✓    | authenticated |
| `POST`   | `/admin/menu-items`                     | ✓    | authenticated |
| `PATCH`  | `/admin/menu-items/{id}`                | ✓    | authenticated |
| `DELETE` | `/admin/menu-items/{id}`                | ✓    | authenticated |
| `GET`    | `/admin/analytics/pageviews/summary`    | ✓    | authenticated |
| `GET`    | `/admin/analytics/pageviews/top-pages`  | ✓    | authenticated |
| `GET`    | `/admin/analytics/pageviews/top-referrers` | ✓ | authenticated |
| `GET`    | `/admin/analytics/pageviews/daily`      | ✓    | authenticated |
| `GET`    | `/admin/analytics/api-requests/summary` | ✓    | authenticated |
| `GET`    | `/admin/analytics/api-requests/top-endpoints` | ✓ | authenticated |
| `GET`    | `/admin/analytics/api-requests/daily`   | ✓    | authenticated |
| `GET`    | `/admin/analytics/api-requests/logs`    | ✓    | authenticated |
| `GET`    | `/admin/media`                          | ✓    | authenticated |
| `POST`   | `/admin/media`                          | ✓    | authenticated |
| `GET`    | `/admin/media/{id}`                     | ✓    | authenticated |
| `PATCH`  | `/admin/media/{id}`                     | ✓    | authenticated |
| `DELETE` | `/admin/media/{id}`                     | ✓    | authenticated |

---

## Appendix B: Configuration Reference

Environment variables read by `internal/platform/config`. Only `DATABASE_URL` and `ADMIN_API_KEY` are strictly
required; everything else has a working default or is an opt-in group.

| Variable                       | Required | Default                        | Purpose |
|---------------------------------|----------|----------------------------------|-----------|
| `DATABASE_URL`                  | **yes**  | —                               | Postgres connection string |
| `SITE_BASE_URL`                 | no       | `https://yusronizza.com`       | Public **frontend** origin (not this API's own) for sitemap/OG absolute URLs |
| `DB_MAX_OPEN_CONNS`              | no       | `10`                            | Pool size |
| `DB_MAX_IDLE_CONNS`              | no       | `5`                             | Idle connections kept warm |
| `DB_CONN_MAX_LIFETIME_SECONDS`   | no       | `1800`                          | Max age of a pooled connection |
| `DB_SIMPLE_PROTOCOL`             | no       | `false`                         | `true` only for a transaction-mode pooler (e.g. Supabase Supavisor on 6543) |
| `ADMIN_API_KEY`                  | **yes**  | —                               | The static Bearer token |
| `ADMIN_USERNAME`                 | no*      | *(empty)*                      | Login `identifier`; at least one of this/`ADMIN_EMAIL` required if `ADMIN_PASSWORD` is set |
| `ADMIN_EMAIL`                    | no*      | *(empty)*                      | Same, alternate identifier |
| `ADMIN_PASSWORD`                 | no*      | *(empty)*                      | Bootstraps password login on first boot only; empty disables it. *Required together with `JWT_SIGNING_SECRET` |
| `JWT_SIGNING_SECRET`             | no*      | *(empty)*                      | Signs the session JWT. *Required together with `ADMIN_PASSWORD` |
| `SESSION_DURATION_HOURS`         | no       | `24`                            | Absolute session lifetime |
| `SESSION_IDLE_TIMEOUT_MINUTES`   | no       | `30`                            | Idle logout; `0` disables |
| `CORS_ALLOWED_ORIGINS`           | no       | *(empty)*                      | Comma-separated origins for credentialed CORS + CSRF trust (2.3/2.4) |
| `APP_ENV`                        | no       | `development`                  | `production` → JSON logs, `Secure`-only cookie |
| `PORT`                           | no       | `8080`                         | HTTP listen port |
| `RESEND_API_KEY`                 | no       | *(empty)*                      | Empty = contact submissions logged, not emailed |
| `CONTACT_TO_EMAIL`               | no       | `yusronizzafaradisa@gmail.com` | Contact form recipient |
| `CONTACT_FROM_EMAIL`             | no       | `onboarding@resend.dev`        | Resend "from" address |
| `IP_HASH_SALT`                   | no       | `yusronizza-ip-hash-default-salt` | Salts the per-visitor hash (page views, contact messages) |
| `ANALYTICS_RETENTION_DAYS`       | no       | `180`                           | Analytics row retention; `0` disables the job |
| `HTTP_READ_TIMEOUT_SECONDS`      | no       | `15`                            | `http.Server` read timeout |
| `HTTP_WRITE_TIMEOUT_SECONDS`     | no       | `15`                            | `http.Server` write timeout |
| `HTTP_IDLE_TIMEOUT_SECONDS`      | no       | `60`                            | `http.Server` idle timeout |
| `MAX_REQUEST_BODY_BYTES`         | no       | `2097152` (2 MiB)               | Hard cap on every JSON request body |
| `MEDIA_STORAGE_DIR`               | no       | `./uploads`                    | Local-disk root for uploaded files — must be a persistent volume in any non-ephemeral deployment |
| `MEDIA_MAX_UPLOAD_BYTES`          | no       | `15728640` (15 MiB)             | Hard cap on `POST /admin/media`'s body specifically, separate from `MAX_REQUEST_BODY_BYTES` above |

A `.env` file in the working directory loads automatically via `godotenv` if present; in production, real
environment variables take precedence.

### Database platform: local Docker vs. Supabase

`internal/repository/postgres` and `migrations/` are unmodified plain Postgres — nothing Supabase-specific. Local
dev uses the `docker-compose.yml` Postgres container; staging/production point `DATABASE_URL` at a
[Supabase](https://supabase.com) project instead — see `README.md`'s "Database" section for the connection-string
format. `DB_MAX_OPEN_CONNS`/`DB_MAX_IDLE_CONNS` default conservatively to fit Supabase's shared free-tier
connection budget; `DB_SIMPLE_PROTOCOL` exists only for Supabase's transaction-mode pooler, which can't support
this backend's default server-side prepared statements.

---

## Appendix C: Database Schema

Plain Postgres throughout. Migrations are split one-table-(or-tightly-coupled-group)-per-file under `migrations/`
— `000001`–`000013` and `000018` create schema, `000014`–`000017` seed data — rather than kept as a handful of
large files; each is the actual source of truth, this appendix is a readable summary kept in sync whenever the
schema changes.

### Relationships

Only the tag-normalization join tables have foreign keys; every other table is independent:

```
post_tags.post_id       → posts.id       (ON DELETE CASCADE)
post_tags.tag_id        → tags.id        (ON DELETE CASCADE)
project_tags.project_id → projects.id    (ON DELETE CASCADE)
project_tags.tag_id     → tags.id        (ON DELETE CASCADE)
```

`analytics_api_requests.client_id` and `admin_auth_audit_log.session_id` deliberately have **no** foreign key —
neither log must ever be at risk of losing its own history to a change on the thing it references (a client being
revoked, a session being deleted on logout).

### posts

| Column                 | Type          | Constraints / Default | Notes |
|------------------------|---------------|--------------------------|-------|
| `id`                   | `BIGSERIAL`   | `PRIMARY KEY`            | Internal only — the API's identifier is `slug` |
| `slug`                 | `TEXT`        | `NOT NULL UNIQUE`        | |
| `title`                | `TEXT`        | `NOT NULL`               | |
| `excerpt`               | `TEXT`        | `NOT NULL`               | |
| `content`               | `TEXT`        | `NOT NULL`               | Raw Markdown |
| `content_html`          | `TEXT`        | `NOT NULL`               | Rendered server-side |
| `published_at`          | `DATE`        | nullable                 | Null for a draft with no date yet |
| `reading_time_minutes`  | `INT`         | `NOT NULL`               | Computed server-side |
| `status`                | `TEXT`        | `NOT NULL DEFAULT 'published'`, `CHECK IN ('draft','scheduled','published')` | |
| `cover_image_url`       | `TEXT`        | `NOT NULL DEFAULT ''`    | |
| `created_at`/`updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT now()` | |
| `search_vector`         | `tsvector`    | `GENERATED ALWAYS AS (...) STORED` | Weighted: title (A) > excerpt (B) > content (C) |

Indexes: `published_at DESC`; `status`; GIN on `search_vector`; GIN on `title` (`gin_trgm_ops`, `pg_trgm` — backs
[7.1.3](#713-search-posts-client-key-or-admin)'s fuzzy fallback).

### projects

| Column             | Type          | Constraints / Default | Notes |
|---------------------|---------------|---------------------------|-------|
| `id`                | `BIGSERIAL`   | `PRIMARY KEY`             | |
| `slug`              | `TEXT`        | `NOT NULL UNIQUE`         | |
| `title`             | `TEXT`        | `NOT NULL`                | |
| `description`       | `TEXT`        | `NOT NULL`                | |
| `long_description`  | `JSONB`       | `NOT NULL DEFAULT '[]'`   | Array of strings |
| `role`              | `TEXT`        | `NOT NULL`                | |
| `year`              | `INT`         | `NOT NULL`                | |
| `featured`          | `BOOLEAN`     | `NOT NULL DEFAULT false`  | |
| `links`             | `JSONB`       | `NOT NULL DEFAULT '{}'`   | `{live, repo}` |
| `highlights`        | `JSONB`       | `NOT NULL DEFAULT '[]'`   | Array of strings |
| `status`            | `TEXT`        | `NOT NULL DEFAULT 'active'`, `CHECK IN ('active','in-progress','archived')` | |
| `search_vector`     | `tsvector`    | `GENERATED ALWAYS AS (...) STORED` | Weighted: title (A) > description (B) |

Indexes: `year DESC`; `featured`; GIN on `search_vector`.

### tags / post_tags / project_tags

`tags(id, name UNIQUE)` shared by both post/project join tables — one canonical row per name, no per-resource
duplication. `post_tags(post_id, tag_id)` and `project_tags(project_id, tag_id)` are composite-PK join tables,
each with an index on `tag_id` for the reverse lookup.

### profile / profile_history

`profile` is a singleton (`id SMALLINT PRIMARY KEY DEFAULT 1`, `CHECK (id = 1)`) with `name`, `title`, `location`,
`website`, `tagline` as plain text columns and `bio`/`skills`/`experience`/`education`/`certifications`/`awards`/
`volunteering`/`languages`/`interests` as `JSONB` arrays. `profile_history(id, changed_fields JSONB, changed_at)`
is the append-only audit trail, indexed on `changed_at DESC`.

### links

`links(id, code UNIQUE, target_url, click_count DEFAULT 0, expires_at, is_active DEFAULT true, last_clicked_at,
created_at, updated_at)`, indexed on `created_at DESC`.

### contact_messages

`contact_messages(id, name, email, subject, message, status DEFAULT 'unread' CHECK IN ('unread','read','archived','spam'),
read_at, ip_hash DEFAULT '', created_at)`, indexed on `created_at DESC` and `status`.

### analytics_pageviews / analytics_api_requests

`analytics_pageviews(id, path, referrer, user_agent, ip INET, ip_hash, created_at)`, indexed on `created_at DESC`
and `path`.

`analytics_api_requests(id, method, route_pattern, status_code, duration_ms, client_id, created_at)`, indexed on
`created_at DESC`, `(method, route_pattern)`, and `client_id`. `client_id` (nullable, no FK) attributes a row to
the registered client that authenticated the call, if any.

### admin_credentials

Singleton (`id SMALLINT PRIMARY KEY DEFAULT 1`, `CHECK (id = 1)`): `username`/`email` (both nullable, `CHECK
(username IS NOT NULL OR email IS NOT NULL)`), `password_hash` (`bcrypt`, never exposed), `updated_at`.
Bootstrapped from `ADMIN_USERNAME`/`ADMIN_EMAIL`/`ADMIN_PASSWORD` on first boot only.

### admin_sessions

`admin_sessions(id, created_at, expires_at, last_seen DEFAULT now(), ip_address DEFAULT '', user_agent DEFAULT '')`,
indexed on `expires_at`. `last_seen` is bumped on every authenticated request using this session — what
`SESSION_IDLE_TIMEOUT_MINUTES` is measured against; `ip_address`/`user_agent` are metadata only, never used to
authorize anything. No dedicated retention job — expired/idle rows are opportunistically deleted on the next
login.

### admin_auth_audit_log

`admin_auth_audit_log(id, event_type, session_id, ip_address DEFAULT '', user_agent DEFAULT '', detail DEFAULT '',
created_at)`, indexed on `created_at DESC` and `event_type`. No retention job — a security record meant to be
kept, unlike the analytics tables.

### api_clients

`api_clients(id, name, key_hash UNIQUE, is_active DEFAULT true, created_at, last_used_at)`. `key_hash` is
`SHA-256(key)`, hex-encoded — plaintext never stored, returned exactly once by
[`POST /admin/clients`](#87-api-clients). The `UNIQUE` constraint on `key_hash` is what makes
[2.5](#25-registered-client-key-public-reads)'s check a single indexed lookup.

### menu_items

`menu_items(id, menu_group TEXT CHECK IN ('public','admin'), parent_id BIGINT REFERENCES menu_items(id) ON DELETE
CASCADE, section DEFAULT '', label, path, icon DEFAULT '', sort_order DEFAULT 0, is_visible DEFAULT true,
created_at, updated_at)`, indexed on `(menu_group, sort_order)` and `parent_id`. Backs
[7.8](#78-menu)/[8.8](#88-menu). `parent_id` is a self-referencing FK backing one level of submenu nesting — depth
beyond one level is rejected application-side (`MenuUsecase.validateParent`), not by the schema. No retention
job — expected to stay small, admin-managed.

### media

`media(id, filename UNIQUE, original_filename, mime_type, category, size_bytes, alt_text, created_at)`, indexed on
`category` and `created_at DESC`. Backs [7.9](#79-media)/[8.12](#812-media-library). Purely an index over files that
actually live in `MediaStorage` (local disk by default — `internal/platform/storage`); `filename` is the random
name the file is stored/served under, `original_filename` is kept only for display/download purposes. No retention
job — deletion is always explicit (`DELETE /admin/media/{id}`), never time-based, since a file could still be
referenced from a post's content indefinitely.
