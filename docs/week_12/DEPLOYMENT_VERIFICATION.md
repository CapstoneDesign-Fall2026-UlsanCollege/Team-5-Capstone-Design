# Week 12 — GitHub Fork & Vercel Deployment Verification

**Responsible:** Nabin Khadka (`liftupkhadka555-spec`)  
**Date:** November 20, 2026  
**Related Issue:** [#59](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design/issues/59)

---

## 1. Fork Synchronization Check
This is a dated November 20 snapshot. The Week 12 fix work was subsequently merged into the organization repository through PRs #72 and #75; the fork synchronization recorded below does not establish that the fork or Vercel includes those merges.
- **Upstream Course Repo (`CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design` `main`):** `4183944`
- **Personal Fork (`liftupkhadka555-spec/Team-5-Capstone-Design` `main`):** `4183944fcf89ab6167ff3d7e2f38e72c2dcd1dc5` (verified via `git ls-remote` on Nov 20, 2026)
- **Result:** **IN SYNC** at `4183944` (includes Study Analytics 2.0, Quiz Repetition Fix, Wireframes link removal, and Retake Quiz fix). *(Note: Changes on `week12/p0-p1-verification-and-fixes` are not on `main` until merged.)*

## 2. Vercel Deployment Status
- **Vercel Project:** `team-5-capstone-design-761v`
- **Target URL:** `https://team-5-capstone-design-761v.vercel.app/`
- **Build Config (`vercel.json` / `vite.config.js`):** Vite root `public/`, build `npm run build` (`vite build`), output `dist/` (6 HTML entry points).
- **Live Build/Commit Verification:** **UNVERIFIED** from Vercel Dashboard API in this session (confirm active deployment SHA equals `4183944` in Vercel Dashboard → Deployments).

## 3. Course Organization GitHub App Approval (Issue #59)
- **Status:** **PENDING ORG ADMIN APPROVAL**
- **Action Required:** A university organization administrator for `CapstoneDesign-Fall2026-UlsanCollege` must approve the Vercel GitHub App installation so production auto-deploy can point directly to the course repository instead of the personal fork.
