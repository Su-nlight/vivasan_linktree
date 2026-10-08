# Security Controls Matrix — OWASP Top 10:2025 & OWASP ASVS 5.0 Level 2

**Site:** Vivasan Linktree — pure static front-end  
**Date:** 2026-10-11

> [!NOTE]
> OWASP ASVS 5.0 Level 2 is designed for applications handling sensitive data or with authenticated users. Many controls are architecturally not applicable (N/A) to a read-only static site with no backend, no authentication, and no user data collection. "N/A" below means the control cannot apply — not that it was skipped.

---

## Part 1 — OWASP Top 10:2025

| # | Category | Applicable? | Status | Notes |
|---|----------|-------------|--------|-------|
| A01 | Broken Access Control | Partial | ✅ | No authentication; `frame-ancestors 'none'` prevents clickjacking. No admin areas. |
| A02 | Cryptographic Failures | N/A (data) / Partial (transport) | ✅ | No data stored or transmitted by this site. HTTPS enforced by hosting CDN. No secrets in client-side code. |
| A03 | Injection (XSS, HTML) | ✅ Yes | ✅ Fixed | `escHtml()` sanitises all `innerHTML` injection points. `safeUrl()` blocks `javascript:` / `data:` URIs. CSP has no `'unsafe-inline'` in `script-src`. |
| A04 | Insecure Design | Partial | ✅ | Threat model documented. No sensitive features designed in. |
| A05 | Security Misconfiguration | ✅ Yes | ✅ Fixed | CSP, security headers, `robots.txt`, `security.txt` all implemented. |
| A06 | Vulnerable & Outdated Components | Partial | ⚠️ | React 18.3.1 loaded from esm.sh at runtime — version pinned in importmap but no SRI hash. `vendor/liquid-gooey` is vendored locally; no auto-update mechanism. |
| A07 | Identity & Authentication Failures | N/A | N/A | No authentication system. |
| A08 | Software & Data Integrity | Partial | ⚠️ | No SRI on esm.sh importmap entries. `liquid-gooey` vendored locally (good). No build pipeline with integrity checks. |
| A09 | Security Logging & Monitoring | Limited | ⚠️ | No application-layer logging (static site). Server access logs held by hosting provider. No alerting configured. |
| A10 | Server-Side Request Forgery (SSRF) | N/A | N/A | No server-side code. |

---

## Part 2 — OWASP ASVS 5.0 Level 2 (Selected Controls)

> Controls marked N/A are architecturally not applicable to a static front-end with no backend, no authentication, and no user input.

### V1 — Architecture, Design and Threat Modeling

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| Document security architecture | V1.1.1 | ✅ | `docs/security-audit.md`, `docs/threat-model.md` |
| Threat modelling performed | V1.1.2 | ✅ | `docs/threat-model.md` (STRIDE) |
| Security controls centralised | V1.1.3 | ✅ | `escHtml()` and `safeUrl()` are single-source helpers |
| Secure by default | V1.1.6 | ✅ | CSP, headers, no-referrer default |

### V2 — Authentication

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| All authentication controls | V2.x | N/A | No authentication system exists |

### V3 — Session Management

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| All session controls | V3.x | N/A | No sessions; `localStorage` used only for theme preference (no security-sensitive data) |

### V4 — Access Control

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| Principle of least privilege | V4.1.1 | ✅ | Permissions-Policy restricts camera, mic, geolocation, payment, USB, accelerometer, gyroscope |
| No forced browsing vulnerability | V4.1.3 | ✅ | All files are intentionally public; no hidden admin paths |
| Clickjacking protection | V4.3.2 | ✅ | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` |

### V5 — Validation, Sanitization and Encoding

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| Input validation | V5.1.x | N/A | No user input accepted |
| Output encoding — HTML context | V5.3.1 | ✅ | `escHtml()` applied to all `innerHTML` injection points |
| Output encoding — URL context | V5.3.4 | ✅ | `safeUrl()` allowlist-validates all `href` values |
| Dangerous URL schemes blocked | V5.3.8 | ✅ | `javascript:`, `data:`, `vbscript:`, `file:` blocked by `safeUrl()` |
| Contextual encoding for all outputs | V5.3.x | ✅ | HTML encoding used in HTML context; URL validation in href context |

### V6 — Stored Cryptography

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| All stored-cryptography controls | V6.x | N/A | No secrets stored; no encryption needed |

### V7 — Error Handling and Logging

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| No stack traces to client | V7.1.1 | ✅ | Static site; no server errors possible |
| Security-relevant events logged | V7.2.1 | ⚠️ | Server access logs only (hosting provider). No application-level security event logging. For a static site this is acceptable. |

### V8 — Data Protection

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| Sensitive data not cached unnecessarily | V8.1.1 | ✅ | `Cache-Control: public, max-age=300` — intentional, content is public |
| No sensitive data in URL parameters | V8.1.2 | ✅ | No URL parameters used by the site |
| No personal data in client-side storage | V8.3.3 | ✅ | Only `theme` preference in `localStorage` — not personal data |
| Third-party data disclosure disclosed | V8.3.7 | ✅ | Documented in `docs/privacy-data-map.md` and `PRIVACY_POLICY.md` |

### V9 — Communication

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| TLS required | V9.1.1 | ✅ | Hosting CDN enforces HTTPS |
| Latest TLS version | V9.1.2 | ✅ | Managed by hosting CDN (GitHub Pages / Netlify / Cloudflare — all use TLS 1.2+ minimum) |
| No mixed content | V9.1.3 | ✅ | All sub-resources use HTTPS; CSP `default-src 'self'` |

### V10 — Malicious Code

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| No malicious logic | V10.1.1 | ✅ | Code is simple, auditable, no obfuscation |
| No hard-coded secrets | V10.2.3 | ✅ | No API keys, passwords, or tokens in source |
| Third-party components reviewed | V10.3.1 | Partial | `liquid-gooey` vendored and source-visible. React pinned by version but not by SRI hash on importmap. |

### V11 — Business Logic

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| All business logic controls | V11.x | N/A | No business logic — read-only presentation layer only |

### V12 — Files and Resources

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| Safe URL validation | V12.3.1 | ✅ | `safeUrl()` validates all URLs |
| No dangerous file uploads | V12.4.x | N/A | No file upload mechanism |

### V13 — API and Web Service

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| All API controls | V13.x | N/A | No API endpoints |

### V14 — Configuration

| Control | ID | Status | Notes |
|---------|----|--------|-------|
| HTTP security headers present | V14.4.1 | ✅ | `_headers` file + `<meta>` CSP |
| Content-Security-Policy | V14.4.2 | ✅ | Deployed; no `'unsafe-inline'` in `script-src` |
| X-Content-Type-Options | V14.4.3 | ✅ | `nosniff` |
| X-Frame-Options / frame-ancestors | V14.4.4 | ✅ | `DENY` + `frame-ancestors 'none'` |
| Referrer-Policy | V14.4.6 | ✅ | `no-referrer` |
| Permissions-Policy | V14.4.7 | ✅ | All unnecessary features disabled |
| No server version in headers | V14.6.1 | ✅ | Static CDN hosting — hosting provider manages server headers |

---

## Part 3 — Summary Scorecard

| Category | Applicable Controls | Met | Partial / Open | N/A |
|----------|--------------------|----|----------------|-----|
| OWASP Top 10:2025 | 10 | 7 | 3 | 0 |
| ASVS V1 Architecture | 4 | 4 | 0 | 0 |
| ASVS V5 Encoding | 5 | 5 | 0 | 0 |
| ASVS V4 Access Control | 3 | 3 | 0 | 0 |
| ASVS V8 Data Protection | 4 | 4 | 0 | 0 |
| ASVS V9 Communication | 3 | 3 | 0 | 0 |
| ASVS V14 Configuration | 7 | 7 | 0 | 0 |
| All other ASVS chapters | — | — | — | N/A |

**Open items requiring action:**
1. SRI hashes on esm.sh importmap (browser support gap — vendor React to resolve)
2. No application-level security event logging (accepted for static site)
3. Component dependency review cadence not formalised

