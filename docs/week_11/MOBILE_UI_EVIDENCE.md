# Week 11 — Mobile UI Evidence

**Project:** Smart Study Companion — Team 5  
**Tester:** J.N. Taj Oli (`jn-oli`)  
**Date:** 2026-11-18  
**Browser:** Google Chrome 157.0.8103.79  
**Environment:** mobile UI only  
**OS:** Windows  
**Width:** 390px  
**Account:** one signed-in test student  
**Result:** **PASS**

> This result is separate from the November 16 desktop UI result in [UI/UX Verification](UI_UX_VERIFICATION.md). It does not change or extend that desktop session's results.

## 1. What was checked

Signed in at a 390px phone width. Opened Dashboard, Study Tasks, Subjects & University, Study Analytics, and Quiz Practice in light mode and dark mode. Each view was scrolled up and down. None of the views scrolled sideways.

The console check on every view was:

```javascript
document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2
```

Every view returned `true`.

| View | Mode | Sideways scroll | Console result | Status |
|---|---|---|---|---|
| Dashboard | Light | Up and down only | `true` | PASS |
| Study Tasks | Light | Up and down only | `true` | PASS |
| Subjects & University | Light | Up and down only | `true` | PASS |
| Study Analytics | Light | Up and down only | `true` | PASS |
| Quiz Practice | Light | Up and down only | `true` | PASS |
| Dashboard | Dark | Up and down only | `true` | PASS |
| Study Tasks | Dark | Up and down only | `true` | PASS |
| Subjects & University | Dark | Up and down only | `true` | PASS |
| Study Analytics | Dark | Up and down only | `true` | PASS |
| Quiz Practice | Dark | Up and down only | `true` | PASS |

## 2. Not in this note

- Desktop UI result from 2026-11-16; see [UI/UX Verification](UI_UX_VERIFICATION.md).
- Two-student task check.
