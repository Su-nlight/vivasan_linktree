# Threat Model — vivasan\_linktree

**Site:** Vivacious\_San personal Linktree / portfolio landing page  
**Model type:** STRIDE-based, tailored to a static front-end site  
**Date:** 2026-10-11  
**Scope:** Client-side code, CDN dependencies, hosting platform, DNS

---

## 1  System Overview

```
Visitor's Browser
       │
       │  HTTPS
       ▼
┌──────────────────┐         ┌──────────────────┐
│  Hosting CDN     │◄────────│  GitHub / Git    │
│  (GitHub Pages / │  Deploy │  Repository      │
│   Netlify /      │         │  (source of truth│
│   Cloudflare)    │         │   for all content│
└──────────────────┘         └──────────────────┘
       │
       │  HTTP responses (HTML, CSS, JS, images)
       ▼
Browser parses & renders:
  index.html → style.css → script.js → theme.js
             → robot.js  → liquid-bg.js
             → vendor/liquid-gooey/
       │
       │  Sub-resource requests
       ├──► fonts.googleapis.com (CSS)
       ├──► fonts.gstatic.com   (font files)
       ├──► esm.sh              (React modules)
       └──► img.icons8.com      (social icons)
```

**What the system does NOT have:**
- No server-side logic
- No database
- No user accounts or authentication
- No form submissions or user input
- No server-side cookies or session tokens
- No server-side analytics

---

## 2  Assets

| Asset | Description | Owner | Sensitivity |
|-------|-------------|-------|-------------|
| **Site availability** | The page being reachable | Hosting provider | Medium |
| **Content integrity** | Links, profile data not tampered | Site owner | High |
| **Visitor privacy** | IP addresses, browsing behaviour | Visitors | Medium |
| **Owner reputation** | Site not used for phishing/scam | Site owner | High |
| **Source code** | Git repository | Site owner | Medium |
| **Avatar image** | Owner's photo | Site owner | Medium |
| **Theme preference** | `localStorage` item `theme` | Visitor | Low |

---

## 3  Threat Actors

### 3.1  Opportunistic automated scanner

- **Motivation:** Finding low-hanging vulnerabilities at scale
- **Capability:** Low to medium — runs commodity scanners
- **Likely actions:** Probe for admin panels, SQL injection endpoints, directory traversal, outdated server software
- **Relevance:** Low. The site has no dynamic endpoints. Scanners will find nothing actionable.

### 3.2  Targeted attacker (personal/social motivation)

- **Motivation:** Defacing the site, injecting malicious links, embarrassing the owner
- **Capability:** Medium
- **Likely attack paths:**
  - Compromise the owner's Git hosting account (GitHub) to push malicious commits
  - Compromise the owner's hosting platform account to inject content or redirect traffic
  - DNS hijacking if the domain registrar account is taken over
- **Relevance:** Medium for a personal site with social media presence.

### 3.3  Supply-chain / CDN attacker

- **Motivation:** Broad impact by compromising a widely-used CDN
- **Capability:** High (nation-state or well-resourced criminal)
- **Likely actions:** Serve malicious JavaScript through esm.sh; tamper with Google Fonts CSS to inject styles
- **Relevance:** Low probability, high impact. Partially mitigated by CSP.

### 3.4  Visitor / browser-side attacker

- **Motivation:** Redirecting visitors to malicious sites via injected links
- **Capability:** Low — would require a code-injection vulnerability in the site itself
- **Relevant paths:** XSS via `innerHTML` (fixed), URL injection via `href` (fixed)
- **Relevance:** Low after fixes applied.

### 3.5  Passive surveillance / data aggregator

- **Motivation:** Profiling visitors across sites
- **Capability:** Medium (third-party CDN operators can log IPs and user agents)
- **Relevance:** Medium. Mitigated by `Referrer-Policy: no-referrer` but visitor IPs reach Google, esm.sh, and icons8 servers as a natural consequence of sub-resource loading.

---

## 4  Threat Scenarios (STRIDE)

### 4.1  Spoofing

| Scenario | Vector | Likelihood | Impact | Mitigation |
|----------|--------|------------|--------|------------|
| Phishing copy of the site | Attacker hosts identical copy at lookalike domain | Medium | Medium | Out of scope (cannot prevent others hosting copies). `Referrer-Policy` reduces referrer leakage. |
| DNS hijacking redirects visitors | Domain registrar account compromise | Low | High | **[OWNER ACTION REQUIRED]** Enable MFA on domain registrar and GitHub accounts. |
| Git account takeover leads to malicious push | Credential theft or phishing of owner's GitHub account | Low | High | **[OWNER ACTION REQUIRED]** Enable MFA on GitHub. Review authorised GitHub Apps. |

### 4.2  Tampering

| Scenario | Vector | Likelihood | Impact | Mitigation |
|----------|--------|------------|--------|------------|
| Malicious commit replaces links with scam URLs | GitHub account compromise | Low | High | MFA on GitHub; review commit history regularly |
| CDN content tampering (esm.sh serves malicious React) | Supply-chain attack on esm.sh | Very Low | High | CSP limits script execution to `'self'` and `https://esm.sh`. SRI not yet applied (browser support gap). Vendoring React locally would eliminate this risk. |
| localStorage `theme` key tampered by another page | XSS on this page, or another page on same origin | Low | Very Low | Only sets `data-theme` attribute; no code is read back from localStorage and executed. |

### 4.3  Repudiation

| Scenario | Vector | Likelihood | Impact | Mitigation |
|----------|--------|------------|--------|------------|
| Attacker claims ownership of site | No per-page authentication | Low | Low | Git commit history provides authorship evidence. |

### 4.4  Information Disclosure

| Scenario | Vector | Likelihood | Impact | Mitigation |
|----------|--------|------------|--------|------------|
| Visitor IP disclosed to Google Fonts | Sub-resource request to `fonts.googleapis.com` | Certain | Low | Disclosed in privacy policy. No mitigation short of self-hosting fonts. |
| Visitor IP disclosed to esm.sh | Sub-resource request to `https://esm.sh` | Certain | Low | Disclosed in privacy policy. Mitigated by vendoring React locally. |
| Visitor IP disclosed to icons8.com | `<img>` requests to `https://img.icons8.com` | Certain | Low | Disclosed in privacy policy. Mitigated by using local SVG icons. |
| Visitor's full Referer URL leaks to external sites | Clicking a link | Mitigated | Low | `Referrer-Policy: no-referrer` on both meta tag and `_headers`. `rel="noopener noreferrer"` on all `target="_blank"` links. |
| Visitor browser fingerprinting by third parties | Third-party JS or fonts | Low | Low | CSP restricts what scripts can run; Google Fonts is CSS-only from this page. |

### 4.5  Denial of Service

| Scenario | Vector | Likelihood | Impact | Mitigation |
|----------|--------|------------|--------|------------|
| DDoS against hosting CDN | Volumetric attack | Low | Medium | Hosting CDN (GitHub Pages / Netlify / Cloudflare) provides built-in DDoS mitigation. Out of scope for site owner. |
| Hotlinking of avatar image drains bandwidth | External sites embedding `image/avatar.jpeg` directly | Low | Very Low | No server-side enforcement possible for static sites. Could add CSP `frame-ancestors` (done) to prevent iframe embedding. |

### 4.6  Elevation of Privilege

| Scenario | Vector | Likelihood | Impact | Mitigation |
|----------|--------|------------|--------|------------|
| XSS payload gains same-origin JS execution | Injected `<script>` via `innerHTML` | Mitigated | High | `escHtml()` prevents injection; CSP `script-src` has no `'unsafe-inline'`. |
| Clickjacking overlays the site in an iframe | Attacker embeds page in their site | Mitigated | Medium | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'`. |
| Open redirect via malicious `href` | `javascript:` or `data:` URL in source arrays | Mitigated | Medium | `safeUrl()` allowlist-validates all URLs. |

---

## 5  Attack Tree: Most Realistic Path to Site Defacement

```
Goal: Serve malicious content to visitors

OR
├── 1. Compromise owner's GitHub account
│       ├── Phishing email → credential theft
│       └── No MFA → brute force / credential stuffing
│           → Push malicious commit → auto-deploys
│
├── 2. Compromise hosting platform account
│       ├── Same credential as GitHub (password reuse)
│       └── No MFA on Netlify / Cloudflare
│           → Modify deployment settings or redirects
│
└── 3. Supply-chain attack on esm.sh (CDN)
        ├── Very low likelihood
        └── React module replaced with malicious JS
            → Executes in visitor browsers (within CSP constraints)
```

**Most likely realistic scenario:** GitHub account takeover via credential theft (no MFA). Defense: enable MFA on GitHub and the hosting platform.

---

## 6  Residual Risks (Accepted)

| Risk | Reason Accepted |
|------|----------------|
| Visitor IPs logged by Google Fonts, esm.sh, icons8 | Disclosed in privacy policy; inherent to CDN usage |
| `'unsafe-inline'` in `style-src` | `script-src` is clean; CSS injection alone cannot execute JS |
| SRI not applied to esm.sh importmap | Browser support gap; vendoring React is the long-term fix |
| No rate limiting on the page | Static site; no endpoints to rate-limit |

---

## 7  Recommendations

**Priority 1 (Owner action required):**
- Enable MFA on GitHub account
- Enable MFA on hosting platform account (Netlify / Cloudflare / GitHub Pages)
- Enable MFA on domain registrar (if using custom domain)

**Priority 2 (Code changes):**
- Vendor React locally — eliminates esm.sh runtime CDN dependency
- Replace icons8 icon `<img>` tags with local SVGs — eliminates `img-src https://img.icons8.com` rule

**Priority 3 (Long-term):**
- Apply SRI hashes once importmap SRI has broad browser support
- Self-host Google Fonts — eliminates `fonts.googleapis.com` and `fonts.gstatic.com` privacy exposure

