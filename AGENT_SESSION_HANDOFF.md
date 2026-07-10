# Agent Session Handoff — Dunakeszi Masszázs

> **For a new AI session:** Read this file first. Optional detail: `CHAT_HISTORY_EXPORT.md`.  
> **Original session:** `019ed9c3-389f-7601-9156-843bc162a22c` (saved at `~/.grok/sessions/...`)  
> **Exported:** 2026-07-07

---

## How to continue

In your **new** chat (any model), say:

```
Read dunakeszimasszazs/AGENT_SESSION_HANDOFF.md and CHAT_HISTORY_EXPORT.md.
We were working on dunakeszimasszazs.hu — booking site, admin panel, SEO/PageSpeed fixes.
Continue from the "Current state" and "Open decisions" sections.
```

Also read: `SETUP.md`, `HANDOVER.md` (older, some URLs stale — prefer this handoff).

---

## User goal

Keep **https://www.dunakeszimasszazs.hu** running reliably: online booking (Stripe + bank transfer), admin tools for Edina, good SEO/PageSpeed scores, and fixes deployed without breaking the Google Apps Script backend.

---

## Infrastructure

| Item | Value |
|------|--------|
| **Live site** | https://www.dunakeszimasszazs.hu |
| **Repo** | `makijoe/dunakeszimasszazs` |
| **Local path** | `/Users/zoltanmakra/dunakeszimasszazs` |
| **Frontend** | Vite + React 19 + TypeScript + Tailwind (`app/`) |
| **Deploy** | Vercel from `main`; **`app/dist` is committed** — always `npm run build` then commit `dist` |
| **Backend** | Google Apps Script → Google Sheets (`google-apps-script-complete.txt`) |
| **GAS Web App URL** | `https://script.google.com/macros/s/AKfycbyNNnfTYIlEcuJFD2DaHJcPkv-ErX34TRaxmuc3mFxLVksuoYqs4_GLhilMxHmS3Eg/exec` |
| **Admin** | `/#admin` — password `Edina2025!` |
| **GA** | `G-GPBVK15P0N` (async in `<head>` since `3f1b58c`) |
| **GAS desktop copy** | `~/Desktop/dunakeszi-google-apps-script-COPY-THIS.txt` (update after GAS changes) |

---

## Current state (as of 2026-07-07)

### Latest deploy

- **Branch:** `main` @ `3f1b58c` — `fix(seo): address SEO Site Checkup report failures`
- Vercel auto-deploys on push to `main`

### SEO Site Checkup (PDF: `~/Downloads/SEO Report _ SEO Site Checkup.pdf`)

**Score before fixes:** 86/100 — 6 failed, 2 warnings

| Issue | Status |
|-------|--------|
| Google Analytics not detected | **Fixed** — async gtag in `app/index.html` `<head>` |
| Plaintext emails in HTML | **Fixed** — removed from JSON-LD + prerender; `EmailLink` in React |
| Image aspect ratio mismatch | **Fixed** — `aspect-ratio` containers match intrinsic dimensions |
| Images not properly sized | **Partially fixed** — `sizes` tuned; re-audit after deploy |
| Render-blocking resources | **Not fixed** — SPA architecture; low priority |
| CDN usage | **Skipped** — Vercel edge already serves assets |
| CLS warning (0.1172) | **Improved** — hero/gallery reserve space via aspect-ratio |

**After deploy:** user should re-run check at seositecheckup.com (~2–3 min after Vercel).

### Features completed this session arc

1. **Admin “Új foglalás”** (`71f3c14`) — treatment picker, live slots, optional confirmation email; GAS `adminCreateBooking_`
2. **Admin session persistence** (`7df9a5c`) — 30-day `localStorage` via `app/src/lib/admin-auth.ts`
3. **Weekly block (Zárolás) duplication fix** (`3b82621`) — `replaceExisting` deletes old `Foglalt – heti` before recreate; Tuesday 08:30–20:00 in `EDINA_WEEKLY_PRESET`
4. **Footer map** (`dac9915`) — OpenStreetMap embed (`MapEmbed.tsx`); Google iframe blocked by CSP
5. **PageSpeed** (`ff1e70a`) — removed unused preconnect; nav CTA contrast `#9A4A18`; webp quality 50 for `professional-products`
6. **Payment fix** (`5c758e1`) — booking payments via GET through `callScriptAction()` (POST body lost on GAS redirect)
7. **SEO report fixes** (`3f1b58c`) — GA, emails, images, CLS

### Google Apps Script — **must redeploy for backend changes**

Any change to `google-apps-script-complete.txt` requires:

1. Copy all code into Google Apps Script editor → Save
2. **Deploy → New deployment** (not just Save)
3. Copy updated file to `~/Desktop/dunakeszi-google-apps-script-COPY-THIS.txt`

**Pending user action if not done:** redeploy GAS for admin booking + block replace features.

### Stripe

- Test keys may still be placeholders in Script Properties — see `SETUP.md`
- Webhook: `checkout.session.completed` → GAS URL
- Bank transfer flow is heavily used; admin confirms in **Függőben** tab

---

## Key files

| Area | Path |
|------|------|
| Main UI | `app/src/App.tsx` |
| Admin / booking portal | `app/src/pages/portal-pages.tsx` |
| GAS API wrapper | `app/src/lib/script-api.ts` — **use GET via `callScriptAction()`** for actions that broke on POST |
| Admin auth | `app/src/lib/admin-auth.ts` |
| Map | `app/src/components/MapEmbed.tsx` |
| Images | `app/src/components/ResponsiveImage.tsx`, `app/src/lib/images.ts` |
| Email obfuscation | `app/src/lib/email.ts`, `app/src/components/EmailLink.tsx` |
| SEO | `app/src/lib/seo.ts`, `app/scripts/seo-static-content.mjs`, `app/scripts/prerender-routes.mjs` |
| CSP / headers | `app/vercel.json` |
| GAS backend | `google-apps-script-complete.txt` |
| Build | `npm run build` in `app/` (images + tsc + vite + prerender) |

---

## Build & deploy workflow

```bash
cd /Users/zoltanmakra/dunakeszimasszazs/app
npm run build
cd ..
git add -A && git commit -m "..." && git push
```

- `dist/` must be committed (Vercel builds from repo but team pattern commits dist)
- Prerender generates 13 routes (home, privacy, 11 service pages)

---

## Architecture notes

### SPA routing

- Hash sections on home: `#fooldal`, `#kezelesek`, `#idopont`, `#kapcsolat`, etc.
- Service pages: `/kezelesek/{slug}` — e.g. `/kezelesek/frissito`
- Admin: `/#admin` (lazy-loaded `portal-pages.tsx`)

### GAS API pattern

- **GET** reliable for `callScriptAction()` — query params survive redirects
- **POST** loses body on Google redirect — avoid for payments/booking mutations unless tested
- Block APIs moved to GET (`replaceExisting` for weekly blocks)

### Images

- Responsive variants: `*-480w.webp`, `*-800w.webp`, `*-1200w.webp` via `scripts/generate-responsive-images.mjs`
- `getImageAspectRatio()` — use on container `style={{ aspectRatio: ... }}` to pass Lighthouse checks

### Email in HTML

- Static/prerender HTML: no plaintext `dunakeszimasszor@gmail.com` (links to `/#kapcsolat` instead)
- Live React UI: `EmailLink` still shows clickable email for visitors
- JSON-LD: email field removed from `HealthAndBeautyBusiness` schema

---

## Open decisions / next steps

1. **Re-run SEO Site Checkup** after Vercel deploy — confirm score improvement
2. **Redeploy GAS** if user hasn’t since admin booking + block replace (`3b82621`, `71f3c14`)
3. **Stripe live keys** — user may want real payments; see `SETUP.md` Script Properties
4. **Content SEO** (optional) — report suggested FAQ expansion, treatment depth — not implemented
5. **Render-blocking** — would need critical CSS / code-splitting investment; only if user asks
6. **Remove `.seo-report-pages/`** from repo — 27 PNGs accidentally committed in `3f1b58c` (cleanup optional)

---

## User preferences

- **Execute yourself** — run builds, commits, pushes; don’t just tell user what to run
- **Commit `app/dist`** after every frontend change
- **Copy GAS to Desktop** after backend edits
- **Remind GAS redeploy** when backend changes ship
- Hungarian UI copy — site is for Makra Edina’s massage salon in Dunakeszi
- Focused diffs — no drive-by refactors

---

## Troubleshooting quick reference

| Symptom | Check |
|---------|--------|
| Payment fails / HTML error from GAS | POST vs GET — use `callScriptAction()` |
| Stripe “Invalid API Key” | Script Properties `STRIPE_SECRET_KEY` placeholder |
| Booking paid but no calendar entry | Stripe webhook `checkout.session.completed` + `STRIPE_WEBHOOK_SECRET` |
| Admin login lost on refresh | Should persist 30d — check `admin-auth.ts` / localStorage |
| Duplicate weekly blocks | `replaceExisting: true` (default ON in UI) — needs GAS redeploy |
| Map “content blocked” | Should be OSM now — not Google iframe |
| PageSpeed contrast on nav CTA | `#9A4A18` on Időpontfoglalás button |

---

## Related export files

| File | Purpose |
|------|---------|
| `AGENT_SESSION_HANDOFF.md` | **This file** — curated context |
| `CHAT_HISTORY_EXPORT.md` | User questions + work log from this session arc |
| `HANDOVER.md` | Older handover (stale Kimi URL; use live domain above) |
| `SETUP.md` | Stripe + GAS + bank transfer setup |
| `~/.grok/sessions/.../updates.jsonl` | Full raw transcript — only if deep archaeology needed |
| `.seo-report-pages/page-*.png` | Extracted SEO report pages (committed in `3f1b58c`) |