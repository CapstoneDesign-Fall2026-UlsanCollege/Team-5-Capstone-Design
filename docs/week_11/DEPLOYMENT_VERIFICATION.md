# Deployment Verification — Week 11 MVP Assessment



**Project:** Smart Study Companion  
**Owner:** Nabin Khadka (`liftupkhadka555-spec`)  
**Targets:** Vercel (Frontend), GitHub Pages (Live Demo), Render / Railway (Backend Assessment)  
**Date:** 2026-11-15  
**Status:** Multi-page production build passes; static hosting active; architectural assessment of Render backend completed.

---

## 1. Frontend Deployment Verification (Vercel & GitHub Pages)

### Production Build Verification
The project uses Vite 6 configured for multi-page static generation across all 6 application entry points:

```bash
npm run build
```
**Observed Build Output (2026-11-15):**
```text
vite v6.4.5 building for production...
✓ 20 modules transformed.
../dist/auth/forgot-password.html             5.04 kB │ gzip:  1.73 kB
../dist/auth/login.html                       5.47 kB │ gzip:  1.74 kB
../dist/auth/verify.html                      6.54 kB │ gzip:  1.82 kB
../dist/auth/reset-password.html              8.38 kB │ gzip:  2.16 kB
../dist/auth/signup.html                     10.80 kB │ gzip:  2.57 kB
../dist/index.html                           32.52 kB │ gzip:  6.42 kB
../dist/assets/auth-init-4OFlxwQY.css        10.39 kB │ gzip:  2.99 kB
../dist/assets/main-BfxjY7k1.css             23.89 kB │ gzip:  5.51 kB
../dist/assets/auth-init-BqikSZTS.js         17.69 kB │ gzip:  5.53 kB
../dist/assets/main-Ig6ataVb.js              67.31 kB │ gzip: 19.77 kB
../dist/assets/academic-catalog-CJWTIM9n.js  79.54 kB │ gzip: 24.83 kB
✓ built in 117ms
```

### Vercel Configuration ([`vercel.json`](../../vercel.json))
The repository includes a production-ready `vercel.json` configured with:
1. **Routing Rewrites:**
   ```json
   {
     "rewrites": [
       { "source": "/auth/(.*)", "destination": "/auth/$1" },
       { "source": "/(.*)", "destination": "/$1" }
     ]
   }
   ```
2. **HTTP Security Headers:**
   - `X-Content-Type-Options: nosniff` (prevents MIME-type sniffing).
   - `X-Frame-Options: DENY` (prevents clickjacking attacks).
   - `Referrer-Policy: strict-origin-when-cross-origin` (protects user privacy on outbound links).

### Live GitHub Pages Mirror
- **Live URL:** `https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html`
- Uses ESM relative import paths (`./src/...`) ensuring asset loading succeeds on repository subpaths.

---

## 2. Backend Hosting Assessment: Render & Railway vs. Supabase

The Week 10 roadmap noted Render as a proposed backend host, with Railway as fallback. Phase 1 performed a comprehensive inspection of the `Backend/` directory to evaluate this requirement.

### Technical Analysis
1. **Inspection of `Backend/`:**
   - The directory houses mirrors of client service files (`src/services/*`), schema migrations (`supabase/migrations/*`), and Edge Functions (`supabase/functions/*`).
   - It **does not contain a runnable Node.js/Express HTTP server**, does not listen on any network port (`app.listen()`), and does not define custom REST API routes.
2. **Application Architecture:**
   - Smart Study Companion is architected as a **Serverless / BaaS Web Application**.
   - Client services interact directly with Supabase Cloud:
     - Authentication: `https://bcwwnjtmrcxggbaallon.supabase.co/auth/v1`
     - Database & RLS: `https://bcwwnjtmrcxggbaallon.supabase.co/rest/v1`
     - AI Edge Functions: `https://bcwwnjtmrcxggbaallon.supabase.co/functions/v1`
3. **Evaluation of Deploying a Redundant Express Server on Render:**
   - Creating an artificial Express proxy on Render simply to forward requests from the browser to Supabase would:
     - Introduce **50+ second cold-start spin-up latency** on Render's free tier.
     - Add an extra point of failure during the live Capstone demonstration.
     - Waste team engineering effort building duplicate API boilerplate.
   - Connecting Brevo SMTP via Supabase Auth's native SMTP integration is more secure and reliable than attempting outbound SMTP from a sleeping Render container.

### Architectural Recommendation for Team 5
- **Primary Backend:** **Supabase Cloud** (`bcwwnjtmrcxggbaallon.supabase.co`) is our official, verified backend for PostgreSQL, Auth, and Edge Functions.
- **Render / Railway Role:** If Render or Railway is deployed, it should serve as a **Static Site Web Service** (mirroring Vercel / GitHub Pages) rather than a redundant Node API server.
- **Zero Framework Bloat:** Honoring Non-Negotiable Rule 4, we do not introduce a new backend framework because the existing architecture functions cleanly without it.

---

## 3. Live Deployment Environment Matrix

| Service | Host | Role | Live URL / Status | Verification Notes |
|---|---|---|---|---|
| **Frontend Static** | GitHub Pages | Primary Online Demo | `https://capstonedesign-fall2026-ulsancollege.github.io/Team-5-Capstone-Design/public/index.html` | Not re-fetched in this audit |
| **Frontend Edge** | Vercel | Production Static Host | Configured via `vercel.json` | `dist/` bundles in 117ms |
| **Backend & Auth** | Supabase Cloud | PostgreSQL + Auth + BaaS | `https://bcwwnjtmrcxggbaallon.supabase.co` | Connected; 46 universities, 32 subjects, 345 questions live |
| **AI Compute** | Supabase Edge | Serverless Deno Functions | `.../functions/v1/generate-ai-quiz` | Code verified; CLI deploy pending |
| **Transactional Email** | Brevo SMTP | Verification & OTP Recovery | `smtp-relay.brevo.com:587` | Documented for Supabase Dashboard configuration |
| **Backend Static Mirror** | Render / Railway | Fallback Static Host | Optional secondary mirror | Supabase serves as true backend; no Node server required |

