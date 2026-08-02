# API Specification — yusronizza.com

**Version:** 1.0.0  
**Base URL:** `https://yusronizza.com/api/v1`  
**Protocol:** HTTPS only  
**Format:** JSON (`application/json`)

This document specifies the REST API that backs the portfolio site. The current implementation is a statically-exported Next.js site where data is resolved at build time; this spec defines the contract a backend service would need to fulfill if the data layer were extracted from the build (e.g., a headless CMS, a dedicated API server, or Next.js Route Handlers re-enabled under a Node/Edge runtime).

---

## Table of Contents

1. [Conventions](#1-conventions)
2. [Authentication](#2-authentication)
3. [Error Handling](#3-error-handling)
4. [Rate Limiting](#4-rate-limiting)
5. [Common Types](#5-common-types)
6. [Blog Posts](#6-blog-posts)
7. [Projects](#7-projects)
8. [Profile & CV](#8-profile--cv)
9. [Tools Registry](#9-tools-registry)
10. [Pomodoro Timer](#10-pomodoro-timer)
11. [Contact](#11-contact)
12. [Meta & SEO](#12-meta--seo)

---

## 1. Conventions

### Versioning

All endpoints are prefixed with `/api/v1/`. Breaking changes increment the major version; backward-compatible additions are released in-place.

### HTTP Methods

| Method   | Semantics                              |
|----------|----------------------------------------|
| `GET`    | Read-only, safe, cacheable             |
| `POST`   | Create a resource or trigger an action |
| `PATCH`  | Partial update (only sent fields change) |
| `DELETE` | Remove a resource                      |

### Pagination

List endpoints that may return large collections use cursor-based pagination:

```
GET /api/v1/posts?limit=10&cursor=<opaque_string>
```

| Parameter | Type    | Default | Description                          |
|-----------|---------|---------|--------------------------------------|
| `limit`   | integer | `10`    | Max items per page. Capped at `100`. |
| `cursor`  | string  | —       | Opaque cursor returned by previous page. Omit for first page. |

Response envelope for lists:

```json
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "limit": 10,
    "next_cursor": "eyJpZCI6MTJ9",
    "prev_cursor": null
  }
}
```

`next_cursor` is `null` when there are no more pages.

### Filtering & Sorting

Filters are passed as query parameters. Sorting uses the `sort` parameter:

```
sort=publishedAt          → ascending
sort=-publishedAt         → descending (note leading minus)
```

Multiple sort keys: `sort=-publishedAt,title`

### Field Selection (Sparse Fieldsets)

Request only the fields you need to reduce payload size:

```
GET /api/v1/posts?fields=slug,title,excerpt,publishedAt
```

### Date Format

All dates use ISO 8601: `YYYY-MM-DD` for calendar dates, `YYYY-MM-DDTHH:mm:ssZ` for timestamps.

### Slug Format

Slugs are lowercase, hyphen-separated strings matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`.

---

## 2. Authentication

Public read endpoints (all `GET` requests listed in this document) are **unauthenticated**. Write endpoints — contact form, pomodoro stats sync — use **Bearer token** authentication via the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are long-lived API keys issued out-of-band (no OAuth flow for a personal site at this scale). The admin key is stored in an environment variable and never committed to the repository.

Endpoints that require a token are marked **[auth required]** in the sections below.

---

## 3. Error Handling

All errors return a JSON body with a consistent shape:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "No post with slug 'missing-post' exists.",
    "field": null
  }
}
```

| Field     | Type            | Description                                        |
|-----------|-----------------|----------------------------------------------------|
| `code`    | string          | Machine-readable error code (see table below)      |
| `message` | string          | Human-readable description                         |
| `field`   | string \| null  | Populated for validation errors; names the failing field |

### Error Codes

| HTTP Status | Code                  | Meaning                                        |
|-------------|-----------------------|------------------------------------------------|
| 400         | `VALIDATION_ERROR`    | Request body or params failed validation       |
| 400         | `INVALID_CURSOR`      | Pagination cursor is malformed or expired      |
| 401         | `UNAUTHORIZED`        | Missing or invalid `Authorization` header      |
| 403         | `FORBIDDEN`           | Token present but lacks permission             |
| 404         | `NOT_FOUND`           | Resource does not exist                        |
| 409         | `CONFLICT`            | Resource already exists (e.g., duplicate slug) |
| 422         | `UNPROCESSABLE`       | Syntactically valid but semantically rejected  |
| 429         | `RATE_LIMITED`        | Too many requests; see `Retry-After` header    |
| 500         | `INTERNAL_ERROR`      | Unexpected server error                        |
| 503         | `SERVICE_UNAVAILABLE` | Downstream dependency (email, DB) unreachable  |

---

## 4. Rate Limiting

Rate limits are communicated via response headers:

| Header                  | Description                                  |
|-------------------------|----------------------------------------------|
| `X-RateLimit-Limit`     | Requests allowed per window                  |
| `X-RateLimit-Remaining` | Requests left in the current window          |
| `X-RateLimit-Reset`     | Unix timestamp when the window resets        |
| `Retry-After`           | Seconds to wait (only on 429 responses)      |

Default limits:

| Tier          | Limit           |
|---------------|-----------------|
| Unauthenticated | 120 req / min |
| Authenticated   | 600 req / min |
| Contact form    | 5 req / hour (per IP) |

---

## 5. Common Types

### `Post`

```typescript
type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;           // Markdown source
  content_html: string;      // Rendered HTML (server-side)
  tags: string[];
  published_at: string;      // ISO 8601 date (YYYY-MM-DD)
  reading_time_minutes: number;
};
```

### `PostSummary`

Same as `Post` but omits `content` and `content_html`. Returned by list endpoints.

```typescript
type PostSummary = Omit<Post, "content" | "content_html">;
```

### `Project`

```typescript
type Project = {
  slug: string;
  title: string;
  description: string;
  long_description: string[];
  tags: string[];
  role: string;
  year: number;
  featured: boolean;
  links: {
    live?: string;
    repo?: string;
  };
  highlights: string[];
};
```

### `Profile`

```typescript
type SkillGroup = { category: string; skills: string[] };

type ExperienceEntry = {
  role: string;
  organization: string;
  location: string;
  start_date: string;       // YYYY-MM
  end_date: string;         // YYYY-MM or "Present"
  summary?: string;
  highlights: string[];
};

type EducationEntry = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  highlights: string[];
};

type CertificationEntry = { name: string; issuer: string; date: string };

type AwardEntry = {
  name: string;
  issuer: string;
  year: string;
  description?: string;
};

type VolunteeringEntry = {
  role: string;
  organization: string;
  location: string;
  year: string;
  highlights: string[];
};

type Profile = {
  name: string;
  title: string;
  location: string;
  website: string;
  tagline: string;
  bio: string[];
  skills: SkillGroup[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  awards: AwardEntry[];
  volunteering: VolunteeringEntry[];
  languages: { name: string; level: string }[];
  interests: string[];
};
```

### `Tool`

```typescript
type Tool = {
  slug: string;
  title: string;
  description: string;
};
```

### `PomodoroSettings`

```typescript
type PomodoroSettings = {
  work_minutes: number;             // 1–60
  short_break_minutes: number;      // 1–30
  long_break_minutes: number;       // 1–60
  sessions_before_long_break: number; // 1–10
  auto_start_next: boolean;
  sound_enabled: boolean;
  notifications_enabled: boolean;
};
```

### `PomodoroStats`

```typescript
type PomodoroStats = {
  date: string;           // ISO date the counters below were last updated
  today_count: number;
  total_count: number;
};
```

---

## 6. Blog Posts

### 6.1 List Posts

```
GET /api/v1/posts
```

Returns a paginated list of post summaries, newest first.

**Query Parameters**

| Parameter | Type    | Description                                              |
|-----------|---------|----------------------------------------------------------|
| `limit`   | integer | Items per page (default: `10`, max: `100`)               |
| `cursor`  | string  | Pagination cursor from a previous response               |
| `tag`     | string  | Filter to posts containing this tag (exact match)        |
| `sort`    | string  | Default: `-published_at`. Allowed: `published_at`, `title` |
| `fields`  | string  | Comma-separated list of fields to include                |

**Response `200 OK`**

```json
{
  "data": [
    {
      "slug": "the-ai-boom-is-an-infrastructure-story",
      "title": "The AI Boom Is an Infrastructure Story Now",
      "excerpt": "Behind every model release is a multi-hundred-billion-dollar bet...",
      "tags": ["ai", "hardware", "industry"],
      "published_at": "2026-06-15",
      "reading_time_minutes": 4
    }
  ],
  "meta": {
    "total": 3,
    "limit": 10,
    "next_cursor": null,
    "prev_cursor": null
  }
}
```

---

### 6.2 Get Post by Slug

```
GET /api/v1/posts/{slug}
```

Returns a single post including rendered HTML.

**Path Parameters**

| Parameter | Type   | Description      |
|-----------|--------|------------------|
| `slug`    | string | The post's slug  |

**Response `200 OK`**

```json
{
  "data": {
    "slug": "clean-architecture-on-bare-metal",
    "title": "Clean Architecture on Bare Metal: What Survives Contact With Hardware",
    "excerpt": "Most clean-architecture advice assumes you have a heap, an OS...",
    "content": "Most clean-architecture writing is implicitly written...",
    "content_html": "<p>Most clean-architecture writing...</p>",
    "tags": ["embedded-systems", "architecture", "firmware"],
    "published_at": "2026-05-20",
    "reading_time_minutes": 3
  }
}
```

**Response `404 NOT_FOUND`**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "No post with slug 'missing-post' exists.",
    "field": null
  }
}
```

---

### 6.3 List All Tags

```
GET /api/v1/posts/tags
```

Returns all tags in use, with the count of posts for each.

**Response `200 OK`**

```json
{
  "data": [
    { "tag": "ai", "count": 1 },
    { "tag": "architecture", "count": 1 },
    { "tag": "embedded-systems", "count": 2 },
    { "tag": "firmware", "count": 1 },
    { "tag": "hardware", "count": 2 },
    { "tag": "industry", "count": 1 },
    { "tag": "supply-chain", "count": 1 }
  ]
}
```

---

### 6.4 Create Post **[auth required]**

```
POST /api/v1/posts
```

Creates a new blog post. The slug is derived from the title if omitted.

**Request Body**

```json
{
  "title": "My New Article",
  "excerpt": "A short summary of the article.",
  "content": "# Heading\n\nContent in Markdown...",
  "tags": ["embedded-systems", "firmware"],
  "published_at": "2026-07-01",
  "slug": "my-new-article"
}
```

| Field          | Type     | Required | Description                                              |
|----------------|----------|----------|----------------------------------------------------------|
| `title`        | string   | yes      | Post title, max 200 chars                                |
| `excerpt`      | string   | yes      | Short summary, max 500 chars                             |
| `content`      | string   | yes      | Full Markdown body                                       |
| `tags`         | string[] | yes      | At least one tag; each tag matches `^[a-z0-9-]+$`        |
| `published_at` | string   | yes      | ISO date `YYYY-MM-DD`                                    |
| `slug`         | string   | no       | Auto-derived from title if omitted                       |

**Response `201 Created`**

```json
{
  "data": {
    "slug": "my-new-article",
    "title": "My New Article",
    "excerpt": "A short summary of the article.",
    "content": "# Heading\n\nContent in Markdown...",
    "content_html": "<h1>Heading</h1><p>Content in Markdown...</p>",
    "tags": ["embedded-systems", "firmware"],
    "published_at": "2026-07-01",
    "reading_time_minutes": 1
  }
}
```

**Response `409 CONFLICT`** — slug already taken.

---

### 6.5 Update Post **[auth required]**

```
PATCH /api/v1/posts/{slug}
```

Partial update. Only included fields are changed.

**Request Body** — any subset of `Post` fields (except `slug` and `reading_time_minutes`, which are derived):

```json
{
  "title": "Updated Title",
  "tags": ["ai", "hardware"]
}
```

**Response `200 OK`** — returns the full updated `Post` object.

---

### 6.6 Delete Post **[auth required]**

```
DELETE /api/v1/posts/{slug}
```

**Response `204 No Content`** — empty body on success.

---

## 7. Projects

### 7.1 List Projects

```
GET /api/v1/projects
```

**Query Parameters**

| Parameter  | Type    | Description                                         |
|------------|---------|-----------------------------------------------------|
| `featured` | boolean | When `true`, returns only featured projects         |
| `tag`      | string  | Filter to projects containing this tag              |
| `sort`     | string  | Default: `-year`. Allowed: `year`, `title`          |
| `fields`   | string  | Sparse fieldset                                     |

**Response `200 OK`**

```json
{
  "data": [
    {
      "slug": "risc-v-32i-microprocessor",
      "title": "RISC-V 32I Base Integer Microprocessor",
      "description": "A from-scratch RV32I processor in Verilog...",
      "tags": ["Verilog", "RISC-V", "Computer Architecture"],
      "role": "Personal Project",
      "year": 2024,
      "featured": true,
      "links": {
        "repo": "https://github.com/yusronizza/riscv"
      }
    }
  ]
}
```

---

### 7.2 Get Project by Slug

```
GET /api/v1/projects/{slug}
```

**Response `200 OK`**

```json
{
  "data": {
    "slug": "risc-v-32i-microprocessor",
    "title": "RISC-V 32I Base Integer Microprocessor",
    "description": "A from-scratch RV32I processor in Verilog...",
    "long_description": [
      "A from-scratch implementation of the RISC-V RV32I base integer instruction set...",
      "The pipelined version handles data and control hazards directly...",
      "Every module — ALU, control unit, register file, hazard unit — is verified independently..."
    ],
    "tags": ["Verilog", "RISC-V", "Computer Architecture"],
    "role": "Personal Project",
    "year": 2024,
    "featured": true,
    "links": {
      "repo": "https://github.com/yusronizza/riscv"
    },
    "highlights": [
      "Implemented the RV32I base integer ISA with both a single-cycle datapath and a 5-stage pipelined microarchitecture.",
      "Designed a dedicated hazard unit for data and control hazard detection.",
      "Extended the ISA with the M (multiply/divide) extension.",
      "Verified each module independently via testbenches."
    ]
  }
}
```

---

### 7.3 Create Project **[auth required]**

```
POST /api/v1/projects
```

**Request Body**

```json
{
  "slug": "fpga-bpsk-modem",
  "title": "FPGA BPSK Modem",
  "description": "BPSK and QPSK modulation implemented in Verilog HDL on a Zynq platform.",
  "long_description": ["..."],
  "tags": ["Verilog", "FPGA", "Digital Communications"],
  "role": "Internship Project",
  "year": 2024,
  "featured": false,
  "links": {
    "repo": "https://github.com/yusronizza/fpga-bpsk"
  },
  "highlights": ["..."]
}
```

**Response `201 Created`** — returns the full `Project` object.

---

### 7.4 Update Project **[auth required]**

```
PATCH /api/v1/projects/{slug}
```

Partial update. Any `Project` field except `slug` may be changed.

**Response `200 OK`** — returns the full updated `Project`.

---

### 7.5 Delete Project **[auth required]**

```
DELETE /api/v1/projects/{slug}
```

**Response `204 No Content`**

---

## 8. Profile & CV

Profile data is owned by one person and has no collection semantics — endpoints return a single object or a named sub-resource.

### 8.1 Get Full Profile

```
GET /api/v1/profile
```

Returns the complete profile object including all CV sections.

**Response `200 OK`**

```json
{
  "data": {
    "name": "Yusron Izza Faradisa",
    "title": "Embedded Systems & Digital Systems Engineer",
    "location": "Nagoya, Japan",
    "website": "https://yusronizza.com",
    "tagline": "Building high-performance, scalable embedded and digital systems.",
    "bio": ["..."],
    "skills": [
      { "category": "Programming", "skills": ["Python", "Go", "C", "Verilog", "MATLAB"] }
    ],
    "experience": [ { "...": "..." } ],
    "education": [ { "...": "..." } ],
    "certifications": [ { "...": "..." } ],
    "awards": [ { "...": "..." } ],
    "volunteering": [ { "...": "..." } ],
    "languages": [
      { "name": "Indonesian", "level": "Native" },
      { "name": "English", "level": "Business" },
      { "name": "Japanese", "level": "N4" }
    ],
    "interests": ["Computer Architecture", "Embedded Systems & IoT"]
  }
}
```

---

### 8.2 Get Profile — Skills Only

```
GET /api/v1/profile/skills
```

**Response `200 OK`**

```json
{
  "data": [
    { "category": "Programming", "skills": ["Python", "Go", "C", "Verilog", "MATLAB"] },
    { "category": "Tools",       "skills": ["Vivado", "Vitis", "STM32CubeIDE", "Git", "VS Code"] },
    { "category": "Frameworks",  "skills": ["Wails", "Next.js", "Tailwind CSS"] },
    { "category": "Libraries",   "skills": ["NumPy", "Pandas", "TensorFlow", "Matplotlib"] }
  ]
}
```

---

### 8.3 Get Profile — Experience Only

```
GET /api/v1/profile/experience
```

Returns experience entries in reverse-chronological order (current/most-recent first).

**Query Parameters**

| Parameter | Type   | Description                                  |
|-----------|--------|----------------------------------------------|
| `current` | boolean | When `true`, returns only entries with `end_date: "Present"` |

**Response `200 OK`**

```json
{
  "data": [
    {
      "role": "Electrical and Electronics Engineer",
      "organization": "CBS Techno Co. Ltd.",
      "location": "Nagoya, Japan",
      "start_date": "2026-01",
      "end_date": "Present",
      "highlights": ["..."]
    }
  ]
}
```

---

### 8.4 Get Profile — Education Only

```
GET /api/v1/profile/education
```

**Response `200 OK`**

```json
{
  "data": [
    {
      "degree": "Bachelor Degree in Electrical Engineering",
      "institution": "Universitas Gadjah Mada",
      "location": "Yogyakarta, Indonesia",
      "period": "Sep 2020 – Oct 2024",
      "highlights": ["..."]
    }
  ]
}
```

---

### 8.5 Get Profile — Certifications

```
GET /api/v1/profile/certifications
```

**Response `200 OK`**

```json
{
  "data": [
    { "name": "Verilog HDL Advanced", "issuer": "Intel", "date": "2024" },
    { "name": "DeepLearning.AI TensorFlow Developer", "issuer": "Coursera", "date": "2023" },
    { "name": "Mathematics for Machine Learning", "issuer": "Coursera", "date": "2023" }
  ]
}
```

---

### 8.6 Get Profile — Awards

```
GET /api/v1/profile/awards
```

**Response `200 OK`**

```json
{
  "data": [
    {
      "name": "JASSO Short-Term Scholarship at Ehime University",
      "issuer": "Japan Student Services Organization",
      "year": "2024",
      "description": "Awarded a scholarship for academic excellence..."
    }
  ]
}
```

---

### 8.7 Update Profile **[auth required]**

```
PATCH /api/v1/profile
```

Partial update of the profile. Accepts any subset of top-level `Profile` fields. Arrays are **replaced in full** when included (not merged), so send the complete updated array.

**Request Body (example — update location and add a new skill group)**

```json
{
  "location": "Tokyo, Japan",
  "skills": [
    { "category": "Programming", "skills": ["Python", "Go", "C", "Verilog", "MATLAB", "Rust"] }
  ]
}
```

**Response `200 OK`** — returns the full updated `Profile`.

---

## 9. Tools Registry

### 9.1 List Tools

```
GET /api/v1/tools
```

**Response `200 OK`**

```json
{
  "data": [
    {
      "slug": "pomodoro",
      "title": "Pomodoro Timer",
      "description": "A configurable focus timer with auto-cycling breaks, sound and notification alerts, and session stats — all saved in your browser."
    }
  ]
}
```

---

### 9.2 Get Tool by Slug

```
GET /api/v1/tools/{slug}
```

**Response `200 OK`**

```json
{
  "data": {
    "slug": "pomodoro",
    "title": "Pomodoro Timer",
    "description": "A configurable focus timer with auto-cycling breaks..."
  }
}
```

---

### 9.3 Create Tool **[auth required]**

```
POST /api/v1/tools
```

**Request Body**

```json
{
  "slug": "base-converter",
  "title": "Number Base Converter",
  "description": "Convert between binary, octal, decimal, and hexadecimal — with bit-width selection."
}
```

**Response `201 Created`** — returns the full `Tool` object.

---

### 9.4 Update Tool **[auth required]**

```
PATCH /api/v1/tools/{slug}
```

**Response `200 OK`** — returns the full updated `Tool`.

---

### 9.5 Delete Tool **[auth required]**

```
DELETE /api/v1/tools/{slug}
```

**Response `204 No Content`**

---

## 10. Pomodoro Timer

The Pomodoro timer currently persists state in `localStorage` under the keys `pomodoro:settings`, `pomodoro:state`, and `pomodoro:stats`. These endpoints define the server-side contract for cross-device sync if a backend is added.

A session identifier (derived from the Bearer token or an anonymous session cookie) determines which user's data is read and written. Anonymous users fall back to `localStorage`; authenticated users get server-side persistence.

### 10.1 Get Settings

```
GET /api/v1/pomodoro/settings
```

**Response `200 OK`**

```json
{
  "data": {
    "work_minutes": 25,
    "short_break_minutes": 5,
    "long_break_minutes": 15,
    "sessions_before_long_break": 4,
    "auto_start_next": false,
    "sound_enabled": true,
    "notifications_enabled": false
  }
}
```

---

### 10.2 Update Settings **[auth required]**

```
PATCH /api/v1/pomodoro/settings
```

Any subset of `PomodoroSettings` fields may be sent.

**Request Body**

```json
{
  "work_minutes": 30,
  "auto_start_next": true
}
```

**Validation**

| Field                        | Constraint         |
|------------------------------|--------------------|
| `work_minutes`               | integer, 1–120     |
| `short_break_minutes`        | integer, 1–60      |
| `long_break_minutes`         | integer, 1–120     |
| `sessions_before_long_break` | integer, 1–10      |
| `auto_start_next`            | boolean            |
| `sound_enabled`              | boolean            |
| `notifications_enabled`      | boolean            |

**Response `200 OK`** — returns the full updated `PomodoroSettings`.

---

### 10.3 Get Stats

```
GET /api/v1/pomodoro/stats
```

**Response `200 OK`**

```json
{
  "data": {
    "date": "2026-08-02",
    "today_count": 3,
    "total_count": 127
  }
}
```

---

### 10.4 Record Completed Session **[auth required]**

```
POST /api/v1/pomodoro/stats/sessions
```

Called by the client each time a work session completes. The server increments `today_count` (resetting the date if it has changed) and `total_count`.

**Request Body**

```json
{
  "completed_at": "2026-08-02T14:35:00Z",
  "duration_minutes": 25
}
```

| Field             | Type    | Required | Description                     |
|-------------------|---------|----------|---------------------------------|
| `completed_at`    | string  | yes      | ISO 8601 UTC timestamp          |
| `duration_minutes`| integer | yes      | Actual session length in minutes |

**Response `200 OK`**

```json
{
  "data": {
    "date": "2026-08-02",
    "today_count": 4,
    "total_count": 128
  }
}
```

---

### 10.5 Reset Stats **[auth required]**

```
DELETE /api/v1/pomodoro/stats
```

Resets `today_count` and `total_count` to zero.

**Response `200 OK`**

```json
{
  "data": {
    "date": "2026-08-02",
    "today_count": 0,
    "total_count": 0
  }
}
```

---

## 11. Contact

### 11.1 Submit Contact Form

```
POST /api/v1/contact
```

Sends an email to `yusronizzafaradisa@gmail.com` via a transactional email provider (e.g., Resend, SendGrid). The sender's address is validated but never stored server-side beyond the email delivery attempt.

**Rate limit:** 5 requests per hour per IP address.

**Request Body**

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Collaboration inquiry",
  "message": "Hi Yusron, I'd love to discuss a potential collaboration..."
}
```

| Field     | Type   | Required | Constraint                        |
|-----------|--------|----------|-----------------------------------|
| `name`    | string | yes      | 1–100 chars                       |
| `email`   | string | yes      | Valid email address               |
| `subject` | string | yes      | 1–200 chars                       |
| `message` | string | yes      | 1–5000 chars                      |

**Response `202 Accepted`** — email has been queued for delivery (fire-and-forget; the client should not wait for delivery confirmation):

```json
{
  "data": {
    "queued": true,
    "message": "Your message has been received. Yusron will get back to you shortly."
  }
}
```

**Response `400 VALIDATION_ERROR`** — example for a missing field:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Field 'email' is required.",
    "field": "email"
  }
}
```

**Response `429 RATE_LIMITED`**

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many contact requests. Please wait before trying again.",
    "field": null
  }
}
```

---

## 12. Meta & SEO

These endpoints serve machine-readable metadata used by crawlers and the site itself.

### 12.1 Sitemap

```
GET /api/v1/sitemap
```

Returns a JSON sitemap of all public URLs with their last-modified dates and priority hints. Clients may transform this to `sitemap.xml` format as needed.

**Response `200 OK`**

```json
{
  "data": [
    { "url": "https://yusronizza.com/",             "lastmod": "2026-08-01", "changefreq": "monthly", "priority": 1.0 },
    { "url": "https://yusronizza.com/about",         "lastmod": "2026-08-01", "changefreq": "monthly", "priority": 0.8 },
    { "url": "https://yusronizza.com/cv",            "lastmod": "2026-08-01", "changefreq": "monthly", "priority": 0.8 },
    { "url": "https://yusronizza.com/projects",      "lastmod": "2026-08-01", "changefreq": "monthly", "priority": 0.8 },
    { "url": "https://yusronizza.com/projects/risc-v-32i-microprocessor", "lastmod": "2026-08-01", "changefreq": "yearly",  "priority": 0.7 },
    { "url": "https://yusronizza.com/blog",          "lastmod": "2026-06-15", "changefreq": "weekly",  "priority": 0.9 },
    { "url": "https://yusronizza.com/blog/the-ai-boom-is-an-infrastructure-story", "lastmod": "2026-06-15", "changefreq": "yearly", "priority": 0.6 },
    { "url": "https://yusronizza.com/blog/ram-shortage-embedded-engineers",          "lastmod": "2026-06-08", "changefreq": "yearly", "priority": 0.6 },
    { "url": "https://yusronizza.com/blog/clean-architecture-on-bare-metal",         "lastmod": "2026-05-20", "changefreq": "yearly", "priority": 0.6 },
    { "url": "https://yusronizza.com/tools",         "lastmod": "2026-08-01", "changefreq": "monthly", "priority": 0.7 },
    { "url": "https://yusronizza.com/tools/pomodoro","lastmod": "2026-08-01", "changefreq": "monthly", "priority": 0.6 }
  ]
}
```

---

### 12.2 Open Graph Metadata

```
GET /api/v1/meta/og?path={url_path}
```

Returns Open Graph metadata for the given site path. Used to generate dynamic OG images or for external link-preview services.

**Query Parameters**

| Parameter | Type   | Required | Description                         |
|-----------|--------|----------|-------------------------------------|
| `path`    | string | yes      | URL path, e.g. `/blog/my-post`      |

**Response `200 OK`**

```json
{
  "data": {
    "title": "Clean Architecture on Bare Metal | Yusron Izza Faradisa",
    "description": "Most clean-architecture advice assumes you have a heap, an OS...",
    "url": "https://yusronizza.com/blog/clean-architecture-on-bare-metal",
    "image": "https://yusronizza.com/api/v1/og-image?path=/blog/clean-architecture-on-bare-metal",
    "type": "article",
    "published_time": "2026-05-20T00:00:00Z",
    "tags": ["embedded-systems", "architecture", "firmware"]
  }
}
```

---

## Appendix A: Endpoint Summary

| Method   | Path                                   | Auth | Description                        |
|----------|----------------------------------------|------|------------------------------------|
| `GET`    | `/api/v1/posts`                        | —    | List posts (paginated, filterable) |
| `GET`    | `/api/v1/posts/tags`                   | —    | List all tags with post counts     |
| `GET`    | `/api/v1/posts/{slug}`                 | —    | Get single post with HTML content  |
| `POST`   | `/api/v1/posts`                        | ✓    | Create post                        |
| `PATCH`  | `/api/v1/posts/{slug}`                 | ✓    | Update post                        |
| `DELETE` | `/api/v1/posts/{slug}`                 | ✓    | Delete post                        |
| `GET`    | `/api/v1/projects`                     | —    | List projects (filterable)         |
| `GET`    | `/api/v1/projects/{slug}`              | —    | Get single project                 |
| `POST`   | `/api/v1/projects`                     | ✓    | Create project                     |
| `PATCH`  | `/api/v1/projects/{slug}`              | ✓    | Update project                     |
| `DELETE` | `/api/v1/projects/{slug}`              | ✓    | Delete project                     |
| `GET`    | `/api/v1/profile`                      | —    | Get full profile / CV              |
| `GET`    | `/api/v1/profile/skills`               | —    | Get skills only                    |
| `GET`    | `/api/v1/profile/experience`           | —    | Get experience entries             |
| `GET`    | `/api/v1/profile/education`            | —    | Get education entries              |
| `GET`    | `/api/v1/profile/certifications`       | —    | Get certifications                 |
| `GET`    | `/api/v1/profile/awards`               | —    | Get awards                         |
| `PATCH`  | `/api/v1/profile`                      | ✓    | Update profile                     |
| `GET`    | `/api/v1/tools`                        | —    | List tools                         |
| `GET`    | `/api/v1/tools/{slug}`                 | —    | Get single tool                    |
| `POST`   | `/api/v1/tools`                        | ✓    | Register new tool                  |
| `PATCH`  | `/api/v1/tools/{slug}`                 | ✓    | Update tool                        |
| `DELETE` | `/api/v1/tools/{slug}`                 | ✓    | Remove tool                        |
| `GET`    | `/api/v1/pomodoro/settings`            | —    | Get Pomodoro settings              |
| `PATCH`  | `/api/v1/pomodoro/settings`            | ✓    | Update Pomodoro settings           |
| `GET`    | `/api/v1/pomodoro/stats`               | —    | Get session stats                  |
| `POST`   | `/api/v1/pomodoro/stats/sessions`      | ✓    | Record completed session           |
| `DELETE` | `/api/v1/pomodoro/stats`               | ✓    | Reset session stats                |
| `POST`   | `/api/v1/contact`                      | —    | Submit contact form (rate-limited) |
| `GET`    | `/api/v1/sitemap`                      | —    | JSON sitemap of all public URLs    |
| `GET`    | `/api/v1/meta/og`                      | —    | Open Graph metadata for a path     |

---

## Appendix B: Caching Guidance

| Endpoint                    | Cache Strategy                                   | Suggested TTL |
|-----------------------------|--------------------------------------------------|---------------|
| `GET /posts`                | Public, CDN-cacheable                            | 5 min         |
| `GET /posts/{slug}`         | Public, CDN-cacheable                            | 1 hour        |
| `GET /posts/tags`           | Public, CDN-cacheable                            | 5 min         |
| `GET /projects`             | Public, CDN-cacheable                            | 1 hour        |
| `GET /projects/{slug}`      | Public, CDN-cacheable                            | 1 hour        |
| `GET /profile`              | Public, CDN-cacheable                            | 1 hour        |
| `GET /profile/*`            | Public, CDN-cacheable                            | 1 hour        |
| `GET /tools`                | Public, CDN-cacheable                            | 1 hour        |
| `GET /pomodoro/settings`    | Private (Vary: Authorization)                    | No cache      |
| `GET /pomodoro/stats`       | Private (Vary: Authorization)                    | No cache      |
| `POST /contact`             | No cache                                         | —             |
| `GET /sitemap`              | Public, CDN-cacheable                            | 1 hour        |
| `GET /meta/og`              | Public, CDN-cacheable                            | 1 hour        |

Write endpoints (`POST`, `PATCH`, `DELETE`) must invalidate the corresponding `GET` cache keys on success.

---

## Appendix C: Implementation Notes

**Current architecture.** The site is a static Next.js export (`output: "export"`). All data is resolved at build time from local Markdown files (`content/blog/*.md`) and TypeScript data files (`lib/data/*.ts`). No runtime API server exists today.

**Path to a live API.** The straightforward migration path is:
1. Switch `next.config.ts` from `output: "export"` to a Node.js or Edge runtime deployment (Vercel, Fly.io, etc.).
2. Convert the data files to read from a database or CMS instead of the filesystem.
3. Expose the endpoints defined here as Next.js Route Handlers (`app/api/v1/.../route.ts`).

**Markdown rendering.** The `content_html` field on `Post` should be produced server-side using `remark` + `remark-gfm` (the same pipeline already in `components/blog/markdown-content.tsx`), so clients can render the full post without bundling a Markdown parser.

**Contact form delivery.** The `POST /api/v1/contact` endpoint should integrate with a transactional email provider (Resend is the recommended choice for Next.js/Vercel deployments). Never store submitted contact data in a database unless explicitly required — queue, deliver, and discard.
