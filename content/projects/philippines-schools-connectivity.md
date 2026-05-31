---
title: Philippines Schools Internet Connectivity Monitor
slug: philippines-schools-connectivity
type: webApp
repositoryUrl: https://github.com/Jamil-007/deped-schools-connectivity
liveUrl: https://deped-schools-connectivity.vercel.app
coverImage: public/logos/dict_logo.png

shortDescription: >
  Interactive Next.js dashboard for monitoring internet connectivity across
  DepEd schools, CHED higher-education institutions, and Bayanihan SIM project
  sites in the Philippines. Built with Leaflet.js and backed by Cloud SQL
  PostgreSQL, with a password-protected admin page for inline editing of
  school records.

technologies:
  - name: Next.js
    icon: https://cdn.simpleicons.org/nextdotjs/000000
  - name: React
    icon: https://cdn.simpleicons.org/react/61DAFB
  - name: Node.js
    icon: https://cdn.simpleicons.org/nodedotjs/5FA04E
  - name: JavaScript
    icon: https://cdn.simpleicons.org/javascript/F7DF1E
  - name: PostgreSQL
    icon: https://cdn.simpleicons.org/postgresql/4169E1
  - name: Google Cloud SQL
    icon: https://cdn.simpleicons.org/googlecloud/4285F4
  - name: Leaflet
    icon: https://cdn.simpleicons.org/leaflet/199900
  - name: Vercel
    icon: https://cdn.simpleicons.org/vercel/000000
  - name: Python
    icon: https://cdn.simpleicons.org/python/3776AB
  - name: Papa Parse
  - name: Leaflet.markercluster
  - name: HTML
    icon: https://cdn.simpleicons.org/html5/E34F26
  - name: CSS
    icon: https://cdn.simpleicons.org/css3/1572B6

skills:
  - name: Full-stack Apps
    evidence: Next.js App Router serves a Leaflet dashboard plus REST API routes under app/api/* backed by PostgreSQL via lib/db.js.
  - name: API Development
    evidence: Five JSON endpoints in app/api (schools, ched, admin/auth, admin/schools list and PUT by id) with input validation against whitelisted enums.
  - name: Database Design
    evidence: Reads a deped table with normalized fields (connectivity int, classification, bid_award, type_of_connection, lot_no) and a separate ched table; admin PUT route validates against VALID_CONNECTION_TYPES and VALID_CLASSIFICATIONS.
  - name: Authentication
    evidence: lib/adminAuth.js implements HMAC-SHA256 signed cookie tokens with 24h expiry and timing-safe comparison, gating /api/admin/* routes.
  - name: Geospatial Visualization
    evidence: public/app.js renders 2,400+ lines of Leaflet logic — clustered markers, connectivity-aware pie-chart cluster icons, synchronized tower pulse animations, and an SVG regional labels overlay.
  - name: Performance Optimization
    evidence: Marker pooling (_markerPool), pre-loaded markers for instant project switching, cluster percentage caching, RAF-based animation controller for tower pulses, and in-place marker diff updates in public/app.js.
  - name: Cloud Deployment
    evidence: vercel.json configures Next.js deployment on Vercel; lib/db.js connects to Google Cloud SQL PostgreSQL with pooled connections and SSL.
  - name: Data Pipelines
    evidence: Python scripts (update_connectivity.py, export_deped.py, check_inconsistencies.py) sync, export, and audit the deped table against CSV snapshots.
  - name: Responsive UI
    evidence: public/styles.css implements light/dark theme via CSS custom properties and a mobile-first layout with collapsible filter panel and sidebars.
  - name: Resilient Data Loading
    evidence: Dashboard falls back to public/dict_schools_masterlist.csv parsed with Papa Parse when /api/schools fails (app.js loadDataFromDbOrCsv).

activity:
  lastCommit: 2026-03-04
  commitCount: 46
  primaryLanguage: JavaScript
---

## What it is

A Next.js dashboard that visualizes Philippines school internet connectivity on an interactive Leaflet map. It serves three project modes — DepEd Free Wi-Fi (clustered markers with online/offline pie chart), CHED higher-education institutions (separate sidebar and dataset), and Bayanihan SIM (unclustered tower markers with synchronized pulse animations and a regional labels overlay). A password-protected `/admin` page lets operators search, filter, and inline-edit connectivity and provisioning fields on individual school records.

## System overview

The Next.js App Router serves both the dashboard (rewritten from `/` to `/index.html` via `next.config.mjs`) and the API surface under `app/api/*`. The dashboard is a single-page Leaflet app (`public/app.js`, ~2,467 lines) controlled by a `SchoolConnectivityMonitor` class that loads two datasets in parallel, pre-builds all markers during the loading screen, and swaps marker layers when the user switches project modes. A separate React-based admin page (`app/admin/page.js`) talks to authenticated admin API routes for inline edits.

```
Browser  ──GET /─────────────►  Next.js (rewrite to /index.html)
         ──GET /api/schools──►  app/api/schools/route.js
                                  └── lib/db.js (pg Pool)
                                        └── Cloud SQL: deped table
         ──GET /api/ched─────►  app/api/ched/route.js → ched table

Admin    ──POST /api/admin/auth──►  HMAC token (lib/adminAuth.js) → HttpOnly cookie
         ──PUT /api/admin/schools/:id──► isAuthenticated() → UPDATE deped
```

- Single Next.js deployment on Vercel (`vercel.json` framework: nextjs)
- Cloud SQL PostgreSQL accessed via `pg` Pool with SSL
- Static dashboard assets served from `public/`; CSV file (`dict_schools_masterlist.csv`) is the fallback when the API call fails

## Tech stack

| Layer | Choice | From | Notes |
| --- | --- | --- | --- |
| Framework | Next.js 15 (App Router) | package.json | API routes + rewrite to static dashboard |
| Runtime | React 19 | package.json | Used by `/admin` client page; dashboard is plain JS |
| Database | PostgreSQL (Cloud SQL) | lib/db.js | `pg` Pool, max 10 connections, SSL on |
| Auth | HMAC-signed cookies | lib/adminAuth.js | Node `crypto`, 24h expiry, timing-safe verify |
| Mapping | Leaflet 1.9.4 + markercluster 1.4.1 | public/index.html | CDN-loaded |
| Data parsing | Papa Parse 5.4.1 | public/index.html | CSV fallback only |
| Deploy | Vercel | vercel.json | `framework: nextjs` |
| Ops scripts | Python | update_connectivity.py, export_deped.py | One-off data sync/export tools |

## Key features

- Three project modes (DepEd Free Wi-Fi / CHED / Bayanihan SIM) with mode-specific sidebars, filters, and marker rendering
- Connectivity-aware cluster icons — color-coded markers and SVG conic-gradient pie charts for mixed-connectivity clusters
- Synchronized tower pulse animations driven by a single RAF controller, with eased radius and opacity over 2s
- Regional labels overlay (Bayanihan mode only) — SVG pane with connecting lines and tower counts per region
- Marker pooling and pre-loading so project switches are instant; in-place diff updates avoid clearing/recreating the cluster layer
- Light/dark theme toggle persisted to `localStorage`, with CSS custom properties applied to map controls
- Mobile-first responsive layout with collapsible filter panel
- Password-protected `/admin` page with paginated search (50/page), region and connectivity filters, and inline editing of `connectivity`, `classification`, `bid_award`, and `type_of_connection`
- CSV fallback when the database is unreachable

## API surface

```
GET  /api/schools                 — DepEd schools (Cloud SQL → mapped JSON)
GET  /api/ched                    — CHED institutions
POST /api/admin/auth              — Admin login, sets HttpOnly HMAC cookie
GET  /api/admin/schools           — Paginated school search
                                    (search, region, connectivity, page, limit)
PUT  /api/admin/schools/:id       — Update connectivity / classification /
                                    bid_award / type_of_connection
```

## Data model

```sql
-- Inferred from app/api/schools/route.js and app/api/admin/schools/[id]/route.js
deped (
  id                  -- primary key
  school_name         text
  longitude           numeric
  latitude            numeric
  connectivity        int        -- 1 = online, 0 = offline
  municipality        text
  region              text
  province            text
  lot_no              text       -- Bayanihan SIM site identifier
  classification      text       -- 'unserved' | 'underserved' | ''
  bid_award           text       -- provider name (free text)
  type_of_connection  text       -- cable | dsl | fiber | mobile data |
                                 -- others | point-to-point | satellite |
                                 -- starlink | wireless broadband | ''
  updated_at          timestamp  -- set by admin PUT
)

ched (
  institution_name    text
  latitude            numeric
  longitude           numeric
  region              text
  connectivity        int
)
```

## External integrations

- **Google Cloud SQL (PostgreSQL)** — env: `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`. Primary data store for both `deped` and `ched` tables.
- **Vercel** — deployment platform; `vercel.json` declares `framework: nextjs`.
- **Admin auth secrets** — env: `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`. Used by `lib/adminAuth.js` to sign session cookies.
- **CDN-hosted libraries** — Leaflet, markercluster, Papa Parse, XLSX, Font Awesome, Google Fonts (Inter, Poppins) loaded directly from CDNs in `public/index.html`.

## Operations

- Deployment: Vercel via `vercel.json` (`next build`)
- Database: Cloud SQL PostgreSQL, connected through `pg` Pool with `ssl: { rejectUnauthorized: false }` and a 10-connection cap
- Environment: `.env.local` with PG credentials plus `ADMIN_PASSWORD` and `ADMIN_TOKEN_SECRET`
- Fallback: dashboard reads `public/dict_schools_masterlist.csv` if `/api/schools` fails
- One-off Python tools (not part of runtime): `update_connectivity.py` (CSV → Cloud SQL sync), `export_deped.py` (DB → CSV dump), `check_inconsistencies.py` (data audit), `revert_connectivity.py`

## Screenshots

- public/logos/dict_logo.png
- public/logos/deped_logo.png
- public/logos/ched_logo.png
- public/photo1.JPG — Kalawakan Elementary School (featured in Bayanihan sidebar)
- public/photo2.png — Coto High School (featured in Bayanihan sidebar)
- public/placeholder.jpg — default photo for non-featured Bayanihan schools
