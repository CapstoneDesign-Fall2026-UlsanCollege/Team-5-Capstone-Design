# Decision: Selecting Vercel as the Production Frontend Deployment Platform

### Why it matters
Choosing the right frontend hosting platform dictates our CI/CD workflow, automated build performance, domain security, and routing stability for the Smart Study Companion client application. It also determines how seamlessly our client connects with the live Supabase Cloud backend and whether our HTTP security headers (CSP, HSTS, X-Content-Type) are enforced in production without extra server maintenance.

---

### Options considered

| Option | What it would look like | Main benefit | Main concern |
| :--- | :--- | :--- | :--- |
| **Vercel** | Connects to GitHub repo; automatically runs `npm run build` on push and serves `dist/` over global Edge CDN | Native Vite support, instant preview PR deployments, out-of-the-box routing rewrite support, and custom HTTP security headers via `vercel.json` | Serverless runtime execution limits (not a problem for static Vite assets) |
| **GitHub Pages** | Serves static assets directly from a GitHub branch or `/docs` folder | Free, built directly into the GitHub repository interface | Lacks support for custom HTTP response headers (CSP, HSTS), requires base path sub-directory routing hacks (`/Team-5-Capstone-Design/`), and lacks clean SPA fallback rewrites |
| **Netlify** | Connects to GitHub repo and serves static output with `netlify.toml` | Good Vite integration and edge network support | Requires authoring and maintaining duplicate header/redirect configuration files; team already standardized on `vercel.json` |

---

### Evidence

- **Source, test, sketch, or walkthrough:** Tested Vite multi-page production build (`npm run build`) and verified header compliance using existing configuration.
- **Evidence link or attachment:** 
  - Configuration: `vercel.json`
  - Deployment audit: `docs/week_11/DEPLOYMENT_VERIFICATION.md`
  - Passing build check: 6-entry Vite build completed in `117ms` outputting cleanly to `dist/`.
- **What I observed:** `vercel.json` is already authored in the repository with complete Content Security Policy (CSP), Strict-Transport-Security (HSTS), and clean URL rewrites. Local builds pass in 117ms without warnings or broken asset paths.

---

### Recommendation

I recommend **Vercel** because our repository already contains a tested, production-ready `vercel.json` with strict security headers and clean routing rules. Vercel provides instant zero-configuration builds from our `main` branch, automatic SSL, and preview URLs for every pull request, eliminating deployment overhead before the final MVP freeze.

---

### Tradeoff or remaining uncertainty

- **Tradeoff:** Environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) must be manually entered once into the Vercel Project Dashboard so client-side builds have access to production Supabase credentials.
- **Mitigation:** Fallback values are present in client code, and public anonymous keys are non-sensitive when protected by Supabase Row Level Security (RLS).

---

### Definition of Done

- [x] I compared at least two options (Vercel vs. GitHub Pages vs. Netlify).
- [x] I linked or attached evidence (`vercel.json` and `docs/week_11/DEPLOYMENT_VERIFICATION.md`).
- [x] I explained what I observed (passing 117ms Vite build and header support).
- [x] I made one recommendation (Vercel).
- [x] I named one tradeoff or remaining uncertainty (manual dashboard environment variable input).
- [x] I explained how this affects our project (ensures reliable, secure, zero-maintenance hosting for Capstone evaluation).
