# J.N. Taj Oli — Individual Contribution Evidence

**Project:** Smart Study Companion  
**Team:** 5  
**Date:** November 4, 2026  
**Contribution:** Login and Signup UI Validation Testing

## Contribution

Reviewed and tested the Login and Signup form validation in the Smart Study Companion application.

## Test environment and scope
- **Pages checked:** The Login and Signup pages.
- **Environment:** Local browser review of the auth UI pages. The exact page paths/build were not recorded.
- **Scope:** UI validation only. This check does not verify live Supabase signup or sign-in, database persistence, or end-to-end account creation.

## Tests performed and observed results

| Test case | Observed result | Status |
|---|---|---|
| Login with empty password | Error message: “Enter your password.” | Passed |
| Login with invalid email | Error message: “Enter a valid student email address.” | Passed |
| Signup with invalid email | Validation error displayed | Passed |
| Signup with weak password | Password requirements displayed | Passed |
| Signup with mismatched passwords | Error message: “Passwords do not match.” | Passed |
| Signup with incomplete required fields | Required fields warning displayed | Passed |
| Terms and conditions unchecked | Warning displayed asking the user to accept the terms | Passed |

## Evidence

<img width="1369" height="950" alt="WhatsApp Image 2026-11-04 at 1 27 38 PM" src="https://github.com/user-attachments/assets/57ace423-c31b-46fd-abef-1370ea06d70f" />
<img width="1365" height="962" alt="WhatsApp Image 2026-11-04 at 1 27 38 PM (1)" src="https://github.com/user-attachments/assets/f4ee9e59-0595-4f33-94c2-d6c1d471ce13" />
<img width="1362" height="954" alt="WhatsApp Image 2026-11-04 at 1 27 38 PM (2)" src="https://github.com/user-attachments/assets/7cd2d24a-48c4-40b1-9e60-70b4464803ea" />

## UI Design Reference

[Week 9 Authentication UI Design](auth-ui-design.md)

## Summary

I checked the Login and Signup validation states and confirmed that the interface displays appropriate error messages or guidance for invalid email, missing password, weak password, mismatched passwords, incomplete required fields, and unaccepted terms. This was a local UI review only; live Supabase authentication was not tested.
