# Vercel Deployment Report & Provenance Record — Smart Study Companion

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Reconciliation Date:** November 17, 2026  
**Primary Owner:** Nabin Khadka (`liftupkhadka555-spec`)  
**Deployment Platform:** Vercel  
**Status:** **PROVENANCE DISCLOSED — Temporary Preview Deployed; Permanent CI/CD Pipeline Configured via Personal Fork**

---

## 1. Deployment Provenance & Repository Details

Due to third-party GitHub App installation restrictions on the course organization (`CapstoneDesign-Fall2026-UlsanCollege`), deployment verification was executed in two stages:

| Attribute | Temporary Preview Deployment | Dashboard CI/CD Project | Course Organization Repo |
| :--- | :--- | :--- | :--- |
| **Target URL** | [`https://rapid-oxygen-cicusvj.tmp.now`](https://rapid-oxygen-cicusvj.tmp.now) | `https://team-5-capstone-design-761v.vercel.app` | `https://team-5-capstone-design.vercel.app` (Target) |
| **Deployment Type** | Temporary Preview (CLI) | Git-integrated Project (Dashboard) | Course Production (Pending Org Approval) |
| **Connected Repo** | Local working copy | [`liftupkhadka555-spec/Team-5-Capstone-Design`](https://github.com/liftupkhadka555-spec/Team-5-Capstone-Design) | [`CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design`](https://github.com/CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design) |
| **Source Branch** | Working tree (synced to `main`) | `main` | `main` |
| **Project Name** | `smart-study-companion` | `team-5-capstone-design-761v` | `team-5-capstone-design` |
| **Build Status** | **VERIFIED (HTTP 200)** | **Created on Dashboard** | **Pending Org Admin App Approval** |
| **Source Commit SHA** | Synced to `0dc6372` / `b8d229c` | Synced to `9810a83` | `d274332143ad1727e8aa1bd126bc7d4e2bd834b8` |
| **Visual Evidence** | CLI output log | [`W11-VERCEL-01-project-creation.png`](Evidence/Nabin-Khadka/W11-VERCEL-01-project-creation.png) | Admin authorization screen |

> **Important Provenance Distinction:** An HTTP 200 response on `rapid-oxygen-cicusvj.tmp.now` establishes that Vite's multi-page build and `vercel.json` headers work on the Vercel Edge Network. It does **not** prove that the latest course repository commit (`d274332`) is automatically deployed. Direct deployment of the course organization repo requires university admin approval.

---

## 2. Route Verification Evidence (Temporary Deployment)

All 6 application and authentication routes were probed directly against the live Vercel deployment:

| Route | HTTP Status | Headers Verified | Content Length |
| :--- | :---: | :--- | :---: |
| `/` (Dashboard / Main App) | **200 OK** | `nosniff`, `DENY`, `strict-origin` | 32,521 bytes |
| `/auth/login.html` | **200 OK** | `nosniff`, `DENY`, `strict-origin` | 5,468 bytes |
| `/auth/signup.html` | **200 OK** | `nosniff`, `DENY`, `strict-origin` | 10,796 bytes |
| `/auth/verify.html` | **200 OK** | `nosniff`, `DENY`, `strict-origin` | 6,543 bytes |
| `/auth/forgot-password.html` | **200 OK** | `nosniff`, `DENY`, `strict-origin` | 5,038 bytes |
| `/auth/reset-password.html` | **200 OK** | `nosniff`, `DENY`, `strict-origin` | 8,382 bytes |

---

## 3. Environment Variables

The live frontend connects directly to Supabase Cloud using public anonymous client credentials configured in Vercel project settings:

| Environment Variable Name | Injected / Used | Role / Sensitivity |
| :--- | :---: | :--- |
| `VITE_SUPABASE_URL` | Configured | Public Supabase endpoint (`https://bcwwnjtmrcxggbaallon.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Configured | Public client publishable key (Protected server-side by Supabase RLS) |

> **Security Confirmation:** No private credentials, Gemini API keys, service-role keys, or SMTP passwords are exposed to the client bundle.

---

## 4. Supabase Auth Production Redirect Configuration

Configure the following in **Supabase Dashboard &rarr; Authentication &rarr; URL Configuration**:

- **Site URL:**
  ```text
  https://team-5-capstone-design-761v.vercel.app
  ```
- **Redirect URLs (Allowed Callback URLs):**
  ```text
  https://team-5-capstone-design-761v.vercel.app/**
  https://team-5-capstone-design-761v.vercel.app/auth/verify.html
  https://team-5-capstone-design-761v.vercel.app/auth/reset-password.html
  https://team-5-capstone-design-761v.vercel.app/auth/login.html
  https://rapid-oxygen-cicusvj.tmp.now/**
  ```

---

## 5. Outstanding Deployment Acceptance Actions

1. **Vercel Dashboard Inspection:** Confirm whether the build for `team-5-capstone-design-761v` completed successfully on the dashboard and record its exact build ID.
2. **Organization Access Approval:** Have the university organization administrator approve the Vercel GitHub App for `CapstoneDesign-Fall2026-UlsanCollege` so that automatic CI/CD can be pointed directly to the upstream repository.
