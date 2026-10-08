# Production Deployment Guide

This guide covers deploying the **vivasan_linktree** static site securely to production.

---

## 1. Supported Hosting Platforms

Because **vivasan_linktree** is a static client-side application, it can be deployed on any static web hosting platform or CDN.

### Option A: Cloudflare Pages (Recommended)
1. Link your GitHub repository to Cloudflare Pages.
2. Build Settings:
   - **Framework preset**: None
   - **Build command**: *(leave blank)*
   - **Build output directory**: `/` (repository root)
3. **Security Headers**: Cloudflare Pages automatically respects the `_headers` file in the root directory.
4. **HTTPS**: Enforced automatically with free SSL/TLS certificates and modern cipher suites.

### Option B: Netlify (Recommended)
1. Connect your repository to Netlify.
2. Build settings:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.` (root directory)
3. **Security Headers**: Netlify automatically processes the `_headers` file.
4. **HTTPS**: Automatic Let's Encrypt SSL/TLS with "Force HTTPS" toggle.

### Option C: GitHub Pages
1. Go to repository **Settings** -> **Pages**.
2. Select **Source**: Deploy from branch (`main` or `suggested-changes` / root).
3. **Caveat**: GitHub Pages does **not** support custom HTTP response headers via `_headers`. The fallback Content-Security-Policy (CSP) meta tag in `index.html` will protect clients, but headers like `X-Frame-Options` and `Permissions-Policy` won't be sent at HTTP level. For highest security, Cloudflare Pages or Netlify is preferred.

---

## 2. HTTPS & DNS Configuration

1. **Custom Domain**:
   - Configure DNS `CNAME` or `A` records according to your hosting provider's documentation.
   - Use ALIAS / ANAME or Cloudflare CNAME flattening for apex domains.
2. **Enforce HTTPS**:
   - Always ensure "Always Use HTTPS" or "Force HTTPS" is toggled ON.
3. **HSTS Notice**:
   - Do NOT submit your domain to the HSTS preload list until HTTPS is fully active and tested across all subdomains.

---

## 3. Pre-Deployment Verification

Before publishing live:
1. Run local tests:
   ```bash
   node --test tests/security.test.js
   ```
2. Verify `.well-known/security.txt` has your valid contact email.
3. Verify links and social handles in `script.js` are accurate.
4. Check browser console on initial load for any CSP violation errors.

