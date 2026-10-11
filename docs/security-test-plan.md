# Security Test Plan

This document details the automated and manual security verification procedures for the **vivasan_linktree** codebase.

---

## 1. Automated Security Regression Testing

The automated test suite resides in `tests/security.test.js` and uses Node.js's native test runner (`node:test`).

### How to Run Tests
```bash
node --test tests/security.test.js
```

### Coverage Areas
1. **XSS Prevention (`escHtml`)**:
   - Encodes `<` and `>` to prevent script and tag injection.
   - Encodes `&` to prevent character entity confusion.
   - Encodes `"` and `'` to block attribute breakouts (e.g. `onerror=`, `onload=`).
   - Coerces non-string types safely.
   - Real-world payload testing against classic SVG/IMG vectors.
2. **URL Sanitization (`safeUrl`)**:
   - Rejects `javascript:` schemes (including mixed case and whitespace-prefixed variations).
   - Rejects `data:` URIs (preventing execution of base64-encoded HTML/JS).
   - Rejects `vbscript:` and `file:` schemes.
   - Rejects invalid/arbitrary protocol schemes.
   - Allows safe URL schemes: `https://`, `http://`, `mailto:`, `tel:`, and relative paths (`/`, `./`, `../`, `#`).
3. **Escaper & Sanitizer Composition**:
   - Ensures `escHtml(safeUrl(input))` handles query parameters and attributes without double-encoding flaws or escaping escapes.

---

## 2. Manual and Browser Verification

1. **Content-Security-Policy (CSP) Inspection**:
   - Open browser Developer Tools (`F12`) -> Console.
   - Reload page and check that no console warnings indicate blocked scripts or style sheets.
   - Confirm external resources load only from approved domains (`fonts.googleapis.com`, `fonts.gstatic.com`, `esm.sh`, `img.icons8.com`).
2. **Keyboard Accessibility (WCAG 2.4.1 / 2.4.7)**:
   - Press `Tab` on first page load; confirm "Skip to main content" appears and focuses correctly.
   - Verify focus indicator ring is visible on all interactive elements.
3. **HTTP Response Header Verification**:
   - Using `curl` or browser network inspector on the deployed URL:
     ```bash
     curl -I https://<your-deployed-domain>
     ```
   - Verify presence of `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, and `Permissions-Policy`.

