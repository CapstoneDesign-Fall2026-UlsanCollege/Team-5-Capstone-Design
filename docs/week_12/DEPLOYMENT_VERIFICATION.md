# Week 12 — GitHub Fork & Official Course Vercel Deployment Verification

**Responsible:** Nabin Khadka (`liftupkhadka555-spec`)  
**Last Verified:** November 23, 2026  
**Related Issue:** [#59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59)  
**Overall Deployment Verification Status:** **BLOCKED (Authoritative SHA Unobtainable Locally) + BUNDLE MISMATCH DETECTED**

---

## 1. Repository Baseline (`origin/main`)

- **Course Repository:** `CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design`
- **Current `origin/main` Commit SHA:** `e9f86df1703a568b7efbb5d30f073936bc2b2aa0` (`Update weekly-report.md`, Nov 23, 2026)
- **Active QA Fix Branch:** `week12/release-readiness-qa-fixes` (branched cleanly from `e9f86df`, unmerged pending review)

## 2. Official Course Vercel Project vs. Personal Fork Check (November 23, 2026)

| Target | URL | Environment | Observed HTTP / Bundle Evidence (Nov 23, 2026) | Authoritative SHA Verification |
|---|---|---|---|---|
| **Official Course Deployment** | `https://team-5-capstone-design.vercel.app/` | Production (Course/Team URL) | `HTTP/2 200`, `etag: "e6cce49db1d3fbd659ee860ed84f94f2"`, `last-modified: Mon, 23 Nov 2026 11:52:40 GMT`, serves `assets/main-C9nMNtAi.js` + `assets/main-BFX0WH0o.css` (contains `#view-ai-tutor`) | **BLOCKED** locally (no Vercel CLI/API token; org GitHub App approval in [Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59) pending) |
| **Personal Fork Deployment** | `https://team-5-capstone-design-761v.vercel.app/` | Production (Fork project `team-5-capstone-design-761v`) | `HTTP/2 200`, identical `etag: "e6cce49db1d3fbd659ee860ed84f94f2"`, `last-modified: Mon, 23 Nov 2026 03:13:30 GMT`, serves `assets/main-C9nMNtAi.js` (fork `main` synced earlier to `03ae6a4`) | **MISMATCH vs `e9f86df`** (bundle hash matches `03ae6a4`, prior to Nov 23 documentation/peer-review commits on `e9f86df` and prior to `week12/release-readiness-qa-fixes` UI/QA fixes) |

### Key Conclusions
1. **SHA Verification is BLOCKED locally:** `vercel` CLI is not installed on this workstation and no authorized Vercel API token is available to query the course project's deployment metadata directly.
2. **Fork sync ≠ official course deployment:** Even though both URLs currently return identical Vite asset hashes (`main-C9nMNtAi.js` / `etag: "e6cce49db1d3fbd659ee860ed84f94f2"`), a fork build (`03ae6a4`) must **not** be treated as verified production release proof for the course project, and it does **not** contain the November 23 UI fixes (`#79`, `#80`, `#83`, `#84`, `.quiz-setup-controls[hidden]`).
3. **Production was NOT redeployed** without authorization.

## 3. Exact Verification Steps for an Authorized Team Member

An authorized member with access to the Vercel course organization / project dashboard should perform these steps:
1. Approve or verify the Vercel GitHub App connection on `CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design` ([Issue #59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59)).
2. Open the **official course Vercel project** (linked to `CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design`, **not** `team-5-capstone-design-761v`).
3. Inspect **Deployments → Production (Current)** or run locally after authenticating:
   ```bash
   npx vercel ls <course-project-name> --prod
   npx vercel inspect <production-deployment-url>
   ```
4. Capture a screenshot or CLI output showing the **Git Commit SHA**, **Repository**, **Environment (`Production`)**, and **Timestamp**, and compare the SHA against the target release commit on `main`.
5. Only after explicit release approval should production be redeployed to pick up `week12/release-readiness-qa-fixes`.

---

## 4. Historical Snapshot (November 20, 2026 — Preserved)

- Earlier fork sync check (`Nov 20, 2026`) recorded `liftupkhadka555-spec/Team-5-Capstone-Design` `main` synced to `4183944fcf89ab6167ff3d7e2f38e72c2dcd1dc5` before PRs `#72`, `#75`, and `#78`, and later synced to `03ae6a4`.
- Build configuration (`vercel.json` / `vite.config.js`): Vite root `public/`, build `npm run build` (`vite build`), output `dist/` (6 HTML entry points).
