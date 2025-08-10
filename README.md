# WO/WNSC Summary Dashboard (Next.js PWA)

Offline-first PWA for Oman Oil (WO) and NAMA (WNSC) records. Works fully offline **after the first online visit**.
Deployed easily on **Vercel** from **GitHub**.

## Features
- IndexedDB (Dexie) storage for records + compressed photos.
- Dashboard with KPI cards, Completed Over Time (auto day/week/month buckets), WO Status Breakdown, and WNSC Duration histogram.
- Export **PNG**, **CSV**, and **Monthly PDF** — all offline.
- A11y: respects `prefers-reduced-motion`; high-contrast chart lines and labels.
- Asia/Muscat timezone for grouping.

## Quick Start
```bash
npm i
npm run dev
```

## Build & Deploy (Vercel)
1. Create a new GitHub repo and push this folder.
2. In Vercel: **New Project → Import GitHub Repo**.
3. Root directory: repo root; build command: `next build`; output: `.next` (default).
4. Ensure **next-pwa** is enabled (auto in production).

## Add to Home Screen (iOS)
1. Open the deployed site in Safari.
2. Share → **Add to Home Screen** → Open from the icon. (Works offline after first launch online.)

## Notes
- Images/fonts cached with Workbox; offline fallback route: `/offline`.
- CSV exports include all records; Monthly PDF summarises completions by month.
- Icons are placeholders; replace `/public/icons/*` for your branding.

## Tests
- `vitest` unit tests for validators, bucketing, and duration calc (see `tests/unit`).
- Playwright basic E2E (offline dashboard render, CRUD, exports).

## License
MIT
