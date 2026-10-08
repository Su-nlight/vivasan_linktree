# Security Audit — vivasan\_linktree

**Site:** Vivacious\_San personal Linktree / portfolio landing page  
**Owner:** Sanjana Kumari (handle: vivasan / Vivacious\_San)  
**Site type:** Pure static front-end — no server, no database, no authentication  
**Audit scope:** Client-side code, third-party dependencies, HTTP headers, hosting configuration  
**Audit date:** 2026-10-11  
**Auditor:** Internal (automated tests + manual review)

---

## 1  Executive Summary

The site is a read-only personal landing page. Its attack surface is narrow by design: there is nothing to authenticate against, no server-side processing, and no database. The primary risk categories are **client-side injection** (XSS / URL injection) and **information leakage to third-party services**.

All critical and high-severity findings discovered during this audit have been remediated. Two low-severity items remain open and are noted below.

---

## 2  Scope and Methodology

| Item | Included |
|------|----------|
| `index.html` | ✅ |
| `script.js` | ✅ |
| `theme.js` | ✅ |
| `robot.js` | ✅ |
| `liquid-bg.js` | ✅ |
| `style.css` | ✅ |
| `vendor/liquid-gooey/` | ✅ |
| `_headers` | ✅ |
| `.well-known/security.txt` | ✅ |
| `robots.txt` | ✅ |
| Third-party CDNs (Google Fonts, esm.sh, icons8) | ✅ (trust analysis only — no code access) |
| Server-side / infrastructure | ❌ (none exists) |
| Authentication / sessions | ❌ (none exists) |

**Methods used:**
- Static code review of all JavaScript files
- CSP policy analysis
- HTTP response header review against OWASP Secure Headers Project
- Third-party dependency risk assessment
- Automated regression tests (`tests/security.test.js`, 29 tests)

---

## 3  Findings

### 3.1  FIXED — Cross-Site Scripting (XSS) via innerHTML injection

| Attribute | Value |
|-----------|-------|
| **Severity** | Critical |
| **CVSS (conceptual)** | 8.8 (High — content injection via stored data in source file) |
| **Status** | ✅ Fixed |

**Finding:** `script.js` injected profile name, tagline, social labels, link labels, and subtitles directly into `innerHTML` using ES6 template literals with no output encoding. A future maintainer editing any string value to include `<script>` or event-handler attributes (e.g., `" onmouseover="...`) would silently introduce a stored XSS.

**Fix applied:** `escHtml()` function added (lines 23–30 of `script.js`). It escapes all five HTML special characters (`&`, `<`, `>`, `"`, `'`) using their HTML entity equivalents. All five injection points — `renderProfile()`, `renderSocials()`, `renderLinks()`, `renderIcon()`, and `renderCard()` — now pass every variable through `escHtml()` before placing it into `innerHTML`.

**Evidence:** 8 automated regression tests in `tests/security.test.js` (`escHtml()` suite) — all pass.

---

### 3.2  FIXED — URL/href injection (javascript: / data: URI schemes)

| Attribute | Value |
|-----------|-------|
| **Severity** | High |
| **Status** | ✅ Fixed |

**Finding:** Social icon URLs and link card `href` attributes were taken directly from the `SOCIALS` and `LINKS` arrays and placed into `href` attributes without scheme validation. Setting `url: "javascript:alert(1)"` in any array entry would execute arbitrary JS on click.

**Fix applied:** `safeUrl()` function added (lines 32–40 of `script.js`). It uses a strict allowlist regex `/^(https?:\/\/|mailto:|tel:|\/|\.\/|\.\.\/)/i` and returns `"#"` for any URL that does not match. This blocks `javascript:`, `data:`, `vbscript:`, `file:`, `ftp:`, and any other unrecognised scheme.

**Evidence:** 21 automated regression tests in `tests/security.test.js` (`safeUrl()` and composition suites) — all pass.

---

### 3.3  FIXED — Missing Content-Security-Policy

| Attribute | Value |
|-----------|-------|
| **Severity** | High |
| **Status** | ✅ Fixed |

**Finding:** No CSP was present. Any injected script would execute without restriction.

**Fix applied:**
- CSP `<meta http-equiv>` tag added to `index.html` (lines 41–52). Directive rationale is documented inline in the HTML.
- Matching `Content-Security-Policy` header added to `_headers` (line 28) for Netlify/Cloudflare Pages, where server headers take precedence.

**Key policy decisions:**
- `script-src 'self' https://esm.sh` — no `'unsafe-inline'`, no `'unsafe-eval'`. External scripts are pinned to a single CDN.
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` — `'unsafe-inline'` required for two legitimate uses: (a) the custom cursor sets `element.style` properties dynamically; (b) the React liquid-gooey component applies inline `style` props. This is an accepted residual risk because `script-src` has no `'unsafe-inline'`, which is the primary XSS vector.
- `frame-ancestors 'none'` — equivalent to X-Frame-Options DENY; prevents clickjacking.
- `object-src 'none'` — disables Flash/plugin embedding.
- `base-uri 'self'` — prevents `<base href>` injection.

---

### 3.4  FIXED — Missing security response headers

| Attribute | Value |
|-----------|-------|
| **Severity** | Medium |
| **Status** | ✅ Fixed |

**Finding:** No `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy` headers were being served.

**Fix applied:** `_headers` file created at repository root. Headers applied to all responses (`/*`):

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Anti-clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME confusion prevention |
| `Referrer-Policy` | `no-referrer` | Visitor URL privacy |
| `Permissions-Policy` | camera, mic, geo, payment, usb, accelerometer, gyroscope all `()` | Reduce attack surface |
| `Cross-Origin-Opener-Policy` | `same-origin` | Spectre/CORP mitigations |
| `Cross-Origin-Resource-Policy` | `same-origin` | Prevent cross-origin reads |
| `Cache-Control` | `public, max-age=300, must-revalidate` | Balanced freshness |

> [!NOTE]
> GitHub Pages does not support custom response headers. On GitHub Pages only the CSP `<meta>` tag is effective. All other headers only apply on Netlify and Cloudflare Pages. See `docs/production-deployment.md`.

---

### 3.5  FIXED — Missing security.txt

| Attribute | Value |
|-----------|-------|
| **Severity** | Low |
| **Status** | ✅ Fixed |

**Finding:** No `/.well-known/security.txt` existed, making it harder for ethical security researchers to report findings.

**Fix applied:** `.well-known/security.txt` created per RFC 9116 and populated with the owner's contact email (`asyncvivasan@gmail.com`).

---

### 3.6  FIXED — Missing skip navigation link (WCAG 2.4.1)

| Attribute | Value |
|-----------|-------|
| **Severity** | Low (accessibility) |
| **Status** | ✅ Fixed |

**Finding:** No skip-navigation link existed. Keyboard users had to tab through the decorative theme toggle and aurora chrome before reaching main content.

**Fix applied:** `<a class="skip-link" href="#main">Skip to main content</a>` added as the first focusable element in `<body>`. Visible only on `:focus-visible` via CSS.

---

### 3.7  FIXED — Duplicate `applyCursorMode()` call

| Attribute | Value |
|-----------|-------|
| **Severity** | Low |
| **Status** | ✅ Fixed |

**Finding:** `applyCursorMode()` was called twice in quick succession at page load, causing the custom cursor `<img>` to be appended to the DOM twice on mouse-capable devices.

**Fix applied:** Deduplicated to a single call inside `DOMContentLoaded`.

---

### 3.8  OPEN — `'unsafe-inline'` in `style-src`

| Attribute | Value |
|-----------|-------|
| **Severity** | Low (residual) |
| **Status** | ⚠️ Open — accepted risk |

**Finding:** `style-src` includes `'unsafe-inline'`. An XSS payload could use CSS injection for UI redressing (phishing overlay). However, since `script-src` has no `'unsafe-inline'` and no `eval`, an attacker cannot execute JavaScript via an injected `<style>` block alone.

**Remediation path (if desired):** Move all dynamic inline styles set by JS (`cursor`, liquid-gooey) to CSS custom properties and update the CSP `style-src` to remove `'unsafe-inline'`, replacing it with a `'nonce-...'` or hash if any remaining inline styles are needed. This is a medium-effort refactor.

**Current decision:** Accepted. The XSS risk vector that matters (`script-src`) is clean.

---

### 3.9  OPEN — Third-party CDN trust (esm.sh, icons8.com)

| Attribute | Value |
|-----------|-------|
| **Severity** | Low (supply chain) |
| **Status** | ⚠️ Open — partially mitigated |

**Finding:** React 18 modules are loaded from `https://esm.sh` at runtime. `icons8.com` serves social icons. Both are external CDNs whose content can change. A supply-chain compromise of either CDN could serve malicious code or images.

**Partial mitigation:** CSP pins script origins to `'self'` and `https://esm.sh` only. Subresource Integrity (SRI) hashes are **not** applied to the importmap entries or icon `<img>` tags. SRI is not currently supported for ES module importmaps by all major browsers.

**Remediation path:** Vendor React locally (alongside the already-vendored `liquid-gooey`) to eliminate the esm.sh runtime dependency. Replace icons8 icon `<img>` tags with locally-stored SVG files or inline SVGs.

**Current decision:** Accepted. The site owner should revisit if esm.sh is de-listed or shows signs of compromise.

---

## 4  Test Results Summary

```
Tests run:   node --test tests/security.test.js
Tests pass:  29 / 29
Tests fail:  0
```

| Suite | Tests | Pass |
|-------|-------|------|
| `escHtml()` — XSS prevention | 8 | 8 |
| `safeUrl()` — URL injection prevention | 18 | 18 |
| `escHtml(safeUrl())` composition | 3 | 3 |

---

## 5  Risk Register

| ID | Finding | Severity | Status |
|----|---------|----------|--------|
| SEC-01 | XSS via innerHTML | Critical | ✅ Fixed |
| SEC-02 | URL/href injection | High | ✅ Fixed |
| SEC-03 | Missing CSP | High | ✅ Fixed |
| SEC-04 | Missing security headers | Medium | ✅ Fixed |
| SEC-05 | Missing security.txt | Low | ✅ Fixed (needs owner email) |
| SEC-06 | Missing skip-nav | Low | ✅ Fixed |
| SEC-07 | Duplicate cursor init | Low | ✅ Fixed |
| SEC-08 | `unsafe-inline` style-src | Low | ⚠️ Accepted |
| SEC-09 | CDN supply-chain trust | Low | ⚠️ Accepted |

---

## 6  Recommendations for Future Work

1. **Vendor React locally** — eliminate the esm.sh runtime CDN dependency.
2. **Replace icons8 icons** — use local SVG files instead; removes the `img-src https://img.icons8.com` CSP rule.
3. **Add SRI hashes** — when browser support for importmap SRI matures, pin React module hashes.
4. **Annual security review** — re-run this audit whenever dependencies are updated or new features are added.
5. **Fill security.txt** — add a real contact email and update the `Expires` date annually.

