# Compliance Matrix — vivasan\_linktree

**Site type:** Pure static front-end — no backend, no database, no authentication  
**Owner jurisdiction:** India  
**Date:** 2026-10-11

> [!CAUTION]
> This document provides an honest technical assessment of compliance status. It is **not legal advice**. For definitive legal compliance guidance, consult a qualified Indian IT/privacy law practitioner. The presence of a policy document does not automatically constitute legal compliance.

---

## 1  India Digital Personal Data Protection Act 2023 (DPDPA)

The DPDPA 2023 governs processing of "digital personal data" of persons in India. It introduces the role of **Data Fiduciary** (the entity determining purpose/means of processing) and **Data Principal** (the individual whose data is processed).

### 1.1  Applicability Assessment

| Question | Answer |
|----------|--------|
| Does the site collect personal data from visitors? | **No** — no forms, no accounts, no cookies, no analytics |
| Does the site process personal data of Indian individuals? | **Indirectly** — visitor IPs are collected by third-party CDNs (Google, esm.sh, icons8), not by this site directly |
| Is the site owner a Data Fiduciary under DPDPA? | **Uncertain** — the site itself does not process personal data; third-party processors (Google etc.) do, but the owner is not their principal |
| Does the owner's published personal data (name, photo, social links) constitute personal data under DPDPA? | **Yes** — the owner's own data is published by choice; DPDPA protects data of individuals, and this is data about the owner |

**Practical conclusion:** The DPDPA 2023 has **limited direct applicability** to this site as it currently stands. The site does not collect or process visitor personal data. However, the owner should be aware of the Act as it matures and as rules are notified.

### 1.2  DPDPA Controls Assessment

| Requirement | Status | Notes |
|-------------|--------|-------|
| Notice to Data Principals | ✅ | `PRIVACY_POLICY.md` discloses what the site does and does not collect |
| Consent before processing | N/A | Site does not process visitor personal data |
| Purpose limitation | N/A | No data collected |
| Data minimisation | ✅ | localStorage used only for functional theme preference; no tracking |
| Data accuracy | N/A | No data stored |
| Storage limitation | N/A | No data stored |
| Security safeguards | ✅ Partial | XSS fixes, CSP, security headers. No server-side data to protect. |
| Grievance officer designation | ⚠️ [OWNER] | **[OWNER ACTION REQUIRED]** DPDPA requires significant data fiduciaries to designate a grievance officer. If the site grows to collect data, this becomes mandatory. Currently: not applicable. |
| Rights of Data Principals (access, correction, erasure, portability, grievance) | N/A (for visitors) | Site collects no visitor data; owner's own published data is under owner's control |
| Cross-border data transfer restrictions | ⚠️ | Third-party CDNs (Google, esm.sh, icons8) transfer visitor IPs to servers outside India. Owner does not control this. Disclosed in privacy policy. |
| Significant Data Fiduciary obligations | N/A | Site does not meet thresholds (no large-scale processing) |

> [!IMPORTANT]
> **[OWNER ACTION REQUIRED]** If you add analytics, a contact form, newsletter sign-up, or any feature that collects visitor personal data, you will become a Data Fiduciary under DPDPA and must implement the full compliance framework (consent management, rights fulfilment, grievance officer, etc.).

---

## 2  Information Technology Act 2000 (IT Act) & IT (Amendment) Act 2008

| Requirement | Status | Notes |
|-------------|--------|-------|
| S.43A — Reasonable security practices for sensitive personal data | N/A | Site does not handle "sensitive personal data or information" as defined (passwords, financial data, health data, biometrics, etc.) |
| S.66A — Publishing offensive/false information | ✅ | Site is a personal portfolio; content is factual and non-offensive |
| S.67 — Publishing obscene material | ✅ | Not applicable |
| IT (Reasonable Security Practices) Rules 2011 | N/A | No sensitive personal data handled |
| Intermediary Guidelines 2021 | N/A | Owner is not a "significant social media intermediary" |
| IT (Guidelines for Cybercafés) | N/A | Not a cybercafé |

---

## 3  CERT-In Directions 2022

The CERT-In Directions (28 April 2022) impose specific obligations primarily on:
- Service providers, intermediaries, data centres, body corporates
- Those collecting information from users

| Requirement | Applicable? | Status | Notes |
|-------------|-------------|--------|-------|
| Maintain logs of ICT systems for 180 days | ⚠️ | Not in owner's control | Hosting provider (GitHub/Netlify/Cloudflare) maintains server logs. Owner does not operate the ICT system. |
| Report cyber incidents to CERT-In within 6 hours | ⚠️ [OWNER] | **[OWNER ACTION REQUIRED]** If the site is compromised (defacement, malware injection), report to CERT-In at `incident@cert-in.org.in`. The 6-hour reporting window applies to entities operating information systems. |
| Synchronise system clocks with NTP | N/A | Static site; no servers operated by owner |
| Maintain customer records | N/A | No customer relationships |
| Designate Point of Contact | ⚠️ [OWNER] | For entities that operate ICT infrastructure. As a static site owner, obligations are minimal; however, maintaining a security contact (done via `security.txt`) is good practice. |

---

## 4  GDPR (EU General Data Protection Regulation)

GDPR may apply if the site is **targeted at** or **monitored** EU residents. A personal portfolio page without targeting indicators has limited GDPR exposure, but EU visitors' IPs will reach third-party CDNs.

| Question | Assessment |
|----------|------------|
| Is the site targeted at EU residents? | No specific targeting indicators (no EU-language content, no EU-specific marketing) |
| Does the site monitor EU individuals? | No — no analytics, no tracking |
| Do EU visitors' data reach third parties? | Yes — IPs reach Google Fonts, esm.sh, icons8 servers which may be in the EU or US |
| Is the site owner a Data Controller under GDPR? | Likely **not** for this site in its current form |

| GDPR Requirement | Status | Notes |
|-----------------|--------|-------|
| Lawful basis for processing | N/A | Site does not process EU visitor data directly |
| Privacy notice | ✅ Partial | `PRIVACY_POLICY.md` discloses third-party data flows |
| Cookie consent | N/A | No cookies |
| Data subject rights | N/A for site; Google/esm.sh/icons8 handle via their own mechanisms | |
| DPA registration | N/A | Site owner not established in EU |
| Data transfers outside EU | Noted | Third-party CDNs handle this under their own SCCs/frameworks |

**Assessment:** GDPR is unlikely to apply directly to the site owner in its current form. If analytics or a contact form are added targeting EU users, a full GDPR assessment is required.

---

## 5  WCAG 2.2 Level AA

| Criterion | ID | Status | Notes |
|-----------|----|--------|-------|
| Non-text Content (alt text) | 1.1.1 | ✅ | Avatar `<img>` has `alt="{name}"`. Social icon `<img>` tags have empty `alt=""` (decorative, labelled by `aria-label`). |
| Audio/Video Captions | 1.2.x | N/A | No audio/video content |
| Info and Relationships | 1.3.1 | ✅ | Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, headings |
| Meaningful Sequence | 1.3.2 | ✅ | DOM order matches visual order |
| Sensory Characteristics | 1.3.3 | ✅ | Instructions not based on colour alone |
| Use of Colour | 1.4.1 | ✅ | Information not conveyed by colour alone |
| Contrast (Minimum) | 1.4.3 | ⚠️ [OWNER] | **[OWNER ACTION REQUIRED]** Contrast ratios for text on glass card backgrounds and gradient aurora have not been formally measured. Run `axe` or `Lighthouse` to verify ≥ 4.5:1 for normal text, ≥ 3:1 for large text. |
| Resize Text | 1.4.4 | ✅ | No text in images; CSS uses relative units |
| Images of Text | 1.4.5 | ✅ | No text embedded in images |
| Reflow (320 CSS px) | 1.4.10 | ✅ Partial | Responsive layout present; formal 320px reflow not tested |
| Non-text Contrast | 1.4.11 | ⚠️ [OWNER] | UI component (theme toggle) contrast against background not formally measured |
| Text Spacing | 1.4.12 | ✅ | No CSS blocks text spacing overrides |
| Content on Hover or Focus | 1.4.13 | N/A | No tooltips that appear on hover |
| Keyboard Accessible | 2.1.1 | ✅ | All links and theme toggle are keyboard-focusable |
| No Keyboard Trap | 2.1.2 | ✅ | No modal or focus trap present |
| Skip Navigation | 2.4.1 | ✅ | `<a class="skip-link" href="#main">Skip to main content</a>` implemented |
| Page Titled | 2.4.2 | ✅ | `<title>Vivacious_San — Links</title>` |
| Focus Order | 2.4.3 | ✅ | Logical DOM order; skip link as first element |
| Link Purpose | 2.4.4 | ✅ | `aria-label` on social pills; visible text on link cards |
| Focus Visible | 2.4.7 | ✅ | `:focus-visible` styles present in CSS |
| Focus Not Obscured | 2.4.11 | ⚠️ | Sticky elements / overlays may partially obscure focus; not formally tested |
| Dragging Movements | 2.5.7 | N/A | No required drag gestures for content |
| Target Size (Minimum) | 2.5.8 | ⚠️ [OWNER] | Social icon pills should be ≥ 24×24 CSS pixels. Verify touch target sizes. |
| Language of Page | 3.1.1 | ✅ | `<html lang="en">` |
| On Focus | 3.2.1 | ✅ | Focus doesn't trigger unexpected context changes |
| On Input | 3.2.2 | N/A | No input controls |
| Error Identification | 3.3.1 | N/A | No forms |
| Parsing | 4.1.1 | ✅ | Valid HTML structure |
| Name, Role, Value | 4.1.2 | ✅ | Theme toggle: `role="switch"`, `aria-checked`, `aria-label`. Nav: `aria-label`. |
| Status Messages | 4.1.3 | N/A | No status messages |
| Reduced Motion | — | ✅ | `prefers-reduced-motion` respected for cursor trail; aurora CSS uses `@media (prefers-reduced-motion: reduce)` |

**Formal WCAG 2.2 AA conformance claim:** ❌ **Not yet formally claimed.** Several criteria (contrast ratios 1.4.3, 1.4.11; target sizes 2.5.8; reflow 1.4.10) have not been formally audited with automated tools. Conducting a full Lighthouse / axe / NVDA screen reader test is recommended before making a public conformance claim.

---

## 6  Overall Compliance Summary

| Framework | Applicability | Status |
|-----------|--------------|--------|
| India DPDPA 2023 | Limited (no visitor data collected) | ✅ Adequate for current scope |
| IT Act 2000 / 2008 | Low (no sensitive data) | ✅ No violations identified |
| CERT-In 2022 | Limited (owner doesn't operate ICT infra) | ⚠️ Know incident reporting obligation |
| GDPR | Very limited (no targeting) | ✅ Low risk; disclose third-party flows |
| WCAG 2.2 AA | Applicable | ⚠️ Partially implemented; formal audit needed |

> [!WARNING]
> This compliance matrix reflects the site **as currently built**. Any new feature that collects user data, adds a contact form, or involves payment processing will substantially change the compliance obligations. Update this document whenever material changes are made to the site.

