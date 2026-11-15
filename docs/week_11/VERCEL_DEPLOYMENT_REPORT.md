# Vercel Deployment Report — Smart Study Companion

**Project:** Smart Study Companion — Team 5 (Ulsan College)  
**Date:** November 16, 2026 (KST) / November 15, 2026 (UTC)  
**Deployment Platform:** Vercel  
**Status:** **DEPLOYED**

---

## 1. Deployment Summary

| Field | Configuration / Value |
| :--- | :--- |
| **Deployment Status** | **DEPLOYED (Active & Verified)** |
| **Live Vercel URL** | [https://rapid-oxygen-cicusvj.tmp.now](https://rapid-oxygen-cicusvj.tmp.now) |
| **Vercel Claim Link** | [Claim Deployment to Vercel Account](https://vercel.com/claim-deployment?code=62008a49-0b55-4807-9dc8-9417b0745521) |
| **Vercel Project Name** | `smart-study-companion` |
| **GitHub Repository** | `CapstoneDesign-Fall2026-UlsanCollege/Team-5-Capstone-Design` |
| **Production Branch** | `main` |
| **Root Directory** | `./` (with `public/` as Vite app root) |
| **Install Command** | `npm ci` (or `npm install`) |
| **Build Command** | `npm run build` (`vite build`) |
| **Output Directory** | `dist` |
| **Preset Detected** | Vite (Multi-page rollup: 6 HTML entry points) |

---

## 2. Route Verification Evidence

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

The live frontend connects directly to Supabase Cloud using public anonymous client credentials.

| Environment Variable Name | Injected / Used | Role / Sensitivity |
| :--- | :---: | :--- |
| `VITE_SUPABASE_URL` | Configured | Public Supabase endpoint (`https://bcwwnjtmrcxggbaallon.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Configured | Public client publishable key (Protected server-side by Supabase RLS) |

> **Security Confirmation:** No private credentials, Gemini API keys, service-role keys, or SMTP passwords are exposed to the client bundle.

---

## 4. Supabase Auth Production Redirect Configuration

Add the following URLs to **Supabase Dashboard &rarr; Authentication &rarr; URL Configuration**:

- **Site URL:**
  ```text
  https://rapid-oxygen-cicusvj.tmp.now
  ```
- **Redirect URLs (Allowed Callback URLs):**
  ```text
  https://rapid-oxygen-cicusvj.tmp.now/**
  https://rapid-oxygen-cicusvj.tmp.now/auth/verify.html
  https://rapid-oxygen-cicusvj.tmp.now/auth/reset-password.html
  https://rapid-oxygen-cicusvj.tmp.now/auth/login.html
  ```
  *(If you claim a custom domain or `smart-study-companion.vercel.app`, also append `https://smart-study-companion.vercel.app/**` to the redirect list).*

---

## 5. Remaining Steps to Permanently Link to Vercel Account

1. Open the claim link: [https://vercel.com/claim-deployment?code=62008a49-0b55-4807-9dc8-9417b0745521](https://vercel.com/claim-deployment?code=62008a49-0b55-4807-9dc8-9417b0745521).
2. Log in with your GitHub account (`liftupkhadka555-spec`).
3. Select your GitHub repository `Team-5-Capstone-Design` to link automatic Git continuous deployment on every push to `main`.

