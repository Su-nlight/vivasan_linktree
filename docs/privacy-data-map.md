# Privacy Data Map — vivasan\_linktree

**Site type:** Pure static front-end — no server-side processing, no database  
**Last updated:** 2026-10-11

---

## 1  Data Inventory

### 1.1  Owner's Personal Data (Published Intentionally)

This data is embedded in the site's source code (`script.js`) and is publicly visible to anyone who visits the site. Publishing it is an intentional decision by the owner.

| Data Item | Location in Code | Displayed On Page | Sensitive? |
|-----------|------------------|-------------------|------------|
| Full name: "Sanjana Kumari" | `script.js` `PROFILE.name` | Yes — `<h1>` heading | No (published by choice) |
| Online handle: "Vivacious\_San" | Page title, URL slug | Yes | No |
| Tagline: "Architecture Student · Design Enthusiast · Creative Thinker" | `script.js` `PROFILE.tagline` | Yes | No |
| Avatar photo | `image/avatar.jpeg` | Yes | Medium — personal photo |
| Instagram profile URL | `script.js` `SOCIALS` array | Yes | No (public profile) |
| LinkedIn profile URL | `script.js` `SOCIALS` array | Yes | No (public profile) |
| Card images (front/back) | `image/card/front.png`, `image/card/back.png` | Currently hidden (feature in progress) | Low |

> [!NOTE]
> **Avatar photo verification:** The avatar photo (`image/avatar.jpeg`) was audited; it contains zero EXIF/GPS/device metadata. It is safe for public presentation.

---

### 1.2  Visitor Data — Collected by This Site

The site itself **does not collect, store, process, or transmit** any visitor personal data. Specifically:

| What | Collected? | Notes |
|------|------------|-------|
| Name | ❌ No | No sign-up or form |
| Email | ❌ No | No contact form |
| IP address | ❌ No (by this site) | See §1.3 — hosting provider collects it |
| Cookies | ❌ No | No cookies set by this site |
| localStorage | ✅ Yes (functional only) | See §1.2.1 |
| Session data | ❌ No | No sessions |
| Analytics | ❌ No | No analytics script |
| Location | ❌ No | Permissions-Policy blocks Geolocation API |
| Device fingerprint | ❌ No | No fingerprinting script |
| Form submissions | ❌ No | No forms exist |

#### 1.2.1  localStorage — Theme Preference

| Item | Key | Value | Purpose | Persistent? |
|------|-----|-------|---------|-------------|
| Dark/light theme | `theme` | `"dark"` or `"light"` or absent | Remembers visitor's theme toggle choice | Until cleared by visitor |

This data never leaves the visitor's browser. It is not transmitted to any server. It is not personal data under any reasonable legal definition — it is a UI preference with no identifying value.

---

### 1.3  Visitor Data — Collected by Third Parties

When a visitor loads the page, the browser makes sub-resource requests to external servers. Those servers receive standard HTTP request metadata, which typically includes the visitor's IP address and User-Agent.

**This site does not control what those third parties do with that data. Their privacy policies apply.**

| Third Party | What is Loaded | What They May Receive | Their Privacy Policy |
|-------------|---------------|----------------------|---------------------|
| **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) | Font CSS + font files (Fraunces, Sora, Space Mono) | Visitor IP, User-Agent, Referer header (mitigated — see note), timestamp | [policies.google.com/privacy](https://policies.google.com/privacy) |
| **esm.sh** | React 18 modules (react, react-dom, react/jsx-runtime) | Visitor IP, User-Agent, timestamp | [esm.sh privacy](https://esm.sh) |
| **icons8.com** (`img.icons8.com`) | Instagram and LinkedIn icon PNGs | Visitor IP, User-Agent, timestamp | [icons8.com/privacy-policy](https://icons8.com/privacy-policy) |
| **Hosting provider** (GitHub Pages / Netlify / Cloudflare Pages) | The entire site | Visitor IP, User-Agent, full request logs | Depends on chosen platform — see §1.3.1 |

> [!NOTE]
> **Referer mitigation:** Both `<meta name="referrer" content="no-referrer">` and `Referrer-Policy: no-referrer` (via `_headers`) are set. This prevents the page URL from appearing in the `Referer` header sent to these external servers. However, it does not prevent IP address collection.

#### 1.3.1  Hosting Platform Logs

**Active platform:** Netlify (`vivasan.netlify.app`). Netlify's standard logging applies:

| Platform | Access Logs | Retention | DPA Available |
|----------|-------------|-----------|---------------|
| **GitHub Pages** | GitHub collects usage data per [GitHub Privacy Statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) | Not publicly specified | GitHub DPA available for GitHub Enterprise |
| **Netlify** | Netlify logs requests per [Netlify Privacy Policy](https://www.netlify.com/privacy/) | 30 days by default | Netlify DPA available |
| **Cloudflare Pages** | Cloudflare logs per [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/) | Varies by plan | Cloudflare DPA available |

---

## 2  Data Flow Diagram

```
Visitor Browser
│
│──── GET / ──────────────────────────────────► Hosting CDN
│                                               (receives: IP, UA, timestamp)
│◄─── HTML, CSS, JS, images ─────────────────── (returns: site files)
│
│──── GET fonts.googleapis.com ───────────────► Google Fonts
│                                               (receives: IP, UA, no Referer)
│◄─── Font CSS ──────────────────────────────── (returns: CSS with font URLs)
│
│──── GET fonts.gstatic.com ─────────────────► Google Fonts CDN
│                                               (receives: IP, UA)
│◄─── Font files ────────────────────────────── (returns: Fraunces/Sora/Space Mono)
│
│──── GET https://esm.sh/react@18.3.1 ───────► esm.sh
│                                               (receives: IP, UA)
│◄─── React JS module ───────────────────────── (returns: React bundle)
│
│──── GET img.icons8.com/fluency/48/... ─────► icons8.com
│                                               (receives: IP, UA)
│◄─── Icon PNGs ─────────────────────────────── (returns: social icons)
│
│     [Within browser only — never sent anywhere]
└──── localStorage.setItem("theme", "dark")    (theme preference)
```

---

## 3  Data Retention

| Data | Retained By | Retention Period | Deletable by Visitor? |
|------|-------------|-----------------|----------------------|
| localStorage `theme` preference | Visitor's browser | Until cleared | Yes — clear browser storage |
| Owner's published profile data | Site source code (Git) | Until owner removes it | By owner only |
| Hosting server logs | Hosting provider | Platform-dependent | Via hosting provider |
| Third-party CDN logs | Google / esm.sh / icons8 | Per their policies | Via their processes |

---

## 4  Data Subject Rights (India DPDPA 2023)

Under the Digital Personal Data Protection Act 2023, visitors have rights regarding their personal data. Since this site itself does not collect or store personal data:

- **Visitor data held by this site:** None — no action needed.
- **Visitor data held by third parties:** Visitors must exercise rights directly with each third party (Google, esm.sh, icons8, hosting provider).

> [!IMPORTANT]
> **[OWNER ACTION REQUIRED]** If you add a contact form, newsletter sign-up, or analytics in the future, this data map must be updated and a formal data processing record created under DPDPA 2023.

---

## 5  Gaps and Recommendations

| Gap | Recommendation |
|-----|---------------|
| EXIF data in `image/avatar.jpeg` | Strip EXIF metadata before deploying (`exiftool -all= image/avatar.jpeg`) |
| esm.sh runtime dependency | Vendor React locally — visitor IPs would no longer reach esm.sh |
| icons8 icon requests | Replace with local SVG files — visitor IPs would no longer reach icons8 |
| Google Fonts requests | Self-host fonts — visitor IPs would no longer reach Google |
| Hosting platform DPA | Confirm platform and review their DPA if privacy compliance is required |

