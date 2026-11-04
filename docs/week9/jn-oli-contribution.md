# J.N. Taj Oli — Individual Contribution Evidence

**Project:** Smart Study Companion — Team 5  
**Date:** November 4, 2026  
**Contribution:** Login and Signup UI Validation Testing

## Contribution

Reviewed and tested the Login and Signup form validation in the Smart Study Companion application.

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

- Week 9 Login UI validation screenshots.
- Week 9 Signup UI validation screenshot.

## UI Design Reference

[Week 9 Authentication UI Design](auth-ui-design.md)

## Summary

I checked the Login and Signup validation states and confirmed that the interface displays appropriate error messages or guidance for invalid email, missing password, weak password, mismatched passwords, and incomplete required fields. Screenshots were captured as evidence of the observed validation states.

**Scope note:** These checks verify the displayed UI validation messages only. They do not establish successful account creation, backend authentication, or live Supabase behavior.
