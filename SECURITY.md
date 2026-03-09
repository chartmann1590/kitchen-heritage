# Security Policy

## Supported Versions

This is a static, client-only app. The latest commit on the `main` branch is supported.

## Reporting a Vulnerability

Please use **GitHub Security Advisories** for private disclosure (Security tab → “Report a vulnerability”).
If the issue is non-sensitive, you can also open a public GitHub issue.

## Notes & Threat Model

- Kitchen Heritage has **no backend**; all data stays in the browser (IndexedDB).
- Voice transcription uses the browser’s **Web Speech API**. Some browsers may process audio via a vendor service.
- Share links **encode recipe text in the URL**. Treat shared URLs as public and avoid sensitive data.

If you self-host, serve over HTTPS and consider common static-site security headers (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy).
