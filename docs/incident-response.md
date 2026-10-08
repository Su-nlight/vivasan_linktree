# Incident Response Plan — vivasan\_linktree

**Site type:** Personal static front-end — no server infrastructure operated by owner  
**Owner:** Sanjana Kumari (Vivacious\_San)  
**Date:** 2026-10-11

> [!NOTE]
> This is a lightweight IR plan appropriate for a personal static website. It is not a full enterprise IR plan. The site's small attack surface means most "incidents" will be either defacement (via account compromise) or third-party CDN issues.

---

## 1  Incident Categories

| Category | Example | Severity |
|----------|---------|----------|
| **Account Compromise** | GitHub or hosting platform account taken over; malicious commits pushed | Critical |
| **Site Defacement** | Links, name, or images replaced with malicious content | High |
| **Malicious Redirect** | Visitors redirected to phishing/malware site | High |
| **Third-Party CDN Compromise** | esm.sh serves malicious React; icons8 serves malware | High |
| **Domain Hijacking** | DNS records modified; site redirects elsewhere | High |
| **Privacy Incident** | Unexpected data exposure (currently: very low probability given no data collection) | Medium |
| **Availability Incident** | Site goes offline (hosting CDN outage, DNS failure) | Low–Medium |

---

## 2  Contacts

> [!NOTE]
> Site owner contact details are populated below. Netlify support and CERT-In reporting contacts are pre-configured.

| Role | Contact | Notes |
|------|---------|-------|
| Site owner / primary responder | `asyncvivasan@gmail.com` | |
| GitHub support | [support.github.com](https://support.github.com) | For account recovery |
| Netlify support | [netlify.com/support](https://www.netlify.com/support/) | Hosted on Netlify (`vivasan.netlify.app`) |
| Cloudflare support | [support.cloudflare.com](https://support.cloudflare.com) | If hosted on Cloudflare Pages |
| Domain registrar support | **[OWNER: your registrar's emergency contact]** | |
| CERT-In incident reporting | `incident@cert-in.org.in` / +91-1800-11-4949 | Mandatory for significant cyber incidents under CERT-In Directions 2022 |

---

## 3  Detection

Because the site is static and the owner has no server-side logging, detection relies on:

1. **Visual inspection** — visit the live site regularly; check that links and profile data look correct.
2. **Git commit history** — review recent commits on GitHub; any commit not made by you is a red flag.
3. **Hosting platform activity logs** — check the deployment history in Netlify/Cloudflare Pages dashboard for unexpected deployments.
4. **Domain/DNS monitoring** — use [dnschecker.org](https://dnschecker.org) to verify DNS records periodically if using a custom domain.
5. **External security scanners** — periodically run [Mozilla Observatory](https://observatory.mozilla.org) or [securityheaders.com](https://securityheaders.com) against the live URL.
6. **Visitor reports** — visitors may report suspicious behaviour via the `security.txt` contact email (once populated).

**Recommended monitoring cadence:**
- Visual inspection: weekly
- Git history review: after every push; otherwise weekly
- Hosting deployment review: weekly
- DNS check: monthly (or whenever DNS changes are made)

---

## 4  Response Procedures

### 4.1  Site Defacement or Malicious Content

```
1. DETECT  — Notice incorrect/malicious content on the live site.
2. CONTAIN — Immediately roll back to the last known-good commit:
             git revert HEAD  (or use hosting dashboard "rollback deployment")
3. VERIFY  — Confirm the good version is live.
4. ERADICATE — Identify how the attacker got in:
             a. Check GitHub account activity → enable MFA if not already set.
             b. Check hosting platform activity log for unauthorised deployments.
             c. Review all GitHub personal access tokens and OAuth apps; revoke unknown ones.
             d. Change passwords on all related accounts (GitHub, hosting, domain registrar).
5. REPORT  — If incident is significant, report to CERT-In:
             incident@cert-in.org.in (within 6 hours of discovery for reportable incidents).
6. RECOVER — Redeploy clean version; verify all security headers and CSP are intact.
7. DOCUMENT — Record what happened, how it was discovered, and what was done.
```

### 4.2  GitHub Account Compromise

```
1. DETECT  — Notification of unknown login, or commits you didn't make.
2. CONTAIN — Use GitHub account recovery to regain access:
             https://github.com/settings/security
             Enable MFA immediately.
3. ERADICATE — Revoke all active sessions, personal access tokens, and OAuth apps.
             Review SSH keys; remove any you didn't add.
             Change password.
4. VERIFY  — Check all repository contents; revert any malicious commits.
5. REPORT  — Contact GitHub support if account recovery is needed:
             support.github.com
             Report to CERT-In if appropriate.
```

### 4.3  Domain / DNS Hijacking

```
1. DETECT  — Site redirects elsewhere, or SSL certificate mismatch.
2. CONTAIN — Contact domain registrar emergency support immediately.
3. ERADICATE — Restore correct DNS records via registrar.
             Enable registrar lock on the domain.
             Enable MFA on registrar account.
4. VERIFY  — Confirm DNS propagation with dnschecker.org.
5. REPORT  — Report to CERT-In. Consider filing a complaint with the domain registrar.
```

### 4.4  Third-Party CDN Compromise (esm.sh / icons8 / Google Fonts)

```
1. DETECT  — Unusual behaviour in browser console, security scanner alerts,
             public news of CDN compromise.
2. CONTAIN — Edit index.html to remove the affected CDN's importmap entry or
             <link> / <img> reference. Replace with local/vendored alternative.
             Deploy the change immediately.
3. ERADICATE — For esm.sh: vendor React locally (vendor/react/).
             For icons8: replace <img> tags with local SVG files.
             For Google Fonts: download and self-host font files.
4. VERIFY  — Confirm the affected CDN is no longer referenced.
5. DOCUMENT — Note the incident and update the threat model.
```

### 4.5  Availability Incident (Site Offline)

```
1. DETECT  — Site not reachable; confirmed via second network/device.
2. DIAGNOSE — Check hosting platform status page:
             • GitHub: githubstatus.com
             • Netlify: netlifystatus.com
             • Cloudflare: cloudflarestatus.com
3. If hosting outage: wait for platform resolution; no owner action needed.
4. If DNS issue: verify records via dnschecker.org; correct via registrar if needed.
5. If deployment issue: check hosting dashboard; re-deploy from last known-good commit.
```

---

## 5  Post-Incident Review

After every significant incident, document:

| Field | Contents |
|-------|----------|
| Date / time of discovery | |
| Date / time incident began (estimated) | |
| Category | |
| How it was detected | |
| Root cause | |
| Actions taken (containment, eradication, recovery) | |
| Time to recovery | |
| Lessons learned | |
| Preventive measures implemented | |

Store this record in a private location (e.g., encrypted personal notes, not in the public repository).

---

## 6  Preventive Hardening Checklist

Run this checklist periodically (at minimum: quarterly and after any major change):

- [ ] MFA enabled on GitHub account
- [ ] MFA enabled on hosting platform account (Netlify / Cloudflare)
- [ ] MFA enabled on domain registrar account
- [ ] GitHub: no unknown SSH keys or personal access tokens
- [ ] GitHub: no unknown OAuth apps authorised
- [ ] Hosting platform: no unknown team members or build hooks
- [ ] `security.txt` `Expires` date is in the future
- [ ] Security headers verified at [securityheaders.com](https://securityheaders.com)
- [ ] CSP verified at [Mozilla Observatory](https://observatory.mozilla.org)
- [ ] No `console.error` or CSP violation reports in browser console
- [ ] Site content visually correct
- [ ] All dependency versions reviewed (React version in importmap, liquid-gooey vendor)

---

## 7  CERT-In Reporting

Under CERT-In Directions 2022, significant cyber incidents should be reported within 6 hours of discovery. For a personal static site, the threshold for mandatory reporting is high (serious data breach, sustained attack, widespread malware distribution). However, best practice is to report:

- Website defacement that served malware to visitors
- Domain hijacking
- Any incident involving disclosure of personal data

**Report to:** `incident@cert-in.org.in`  
**Phone:** +91-1800-11-4949 (toll-free)  
**Web:** [cert-in.org.in](https://www.cert-in.org.in)

