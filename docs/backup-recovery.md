# Backup and Disaster Recovery Plan

This document outlines the backup and recovery procedures for the **vivasan_linktree** project.

---

## 1. Architecture Context

**vivasan_linktree** is a static client-side repository.
- There are **no runtime databases**, persistent server volumes, or user sessions.
- State is entirely represented by the Git repository and static assets.

---

## 2. Backup Strategy

1. **Source Code & Assets**:
   - Primary remote: GitHub repository (`origin`).
   - Secondary offline backup: Maintain local cloned copies on workstations.
   - Asset protection: All images (avatar, cursors, card textures) are tracked directly inside the repository under `image/` and `icons/`.
2. **Version Pinning**:
   - `liquid-gooey` is already vendored locally under `vendor/liquid-gooey/`.
   - External dependencies (`react`, `react-dom`) are pinned to explicit version `18.3.1` in the `importmap` in `index.html`.

---

## 3. Disaster Recovery & Rollback

### Scenario A: Erroneous Code or Broken Link Pushed
Roll back instantly using Git:
```bash
# Revert the latest commit:
git revert HEAD

# Push back to remote:
git push origin <branch>
```
Most modern static hosts (Cloudflare Pages, Netlify, Vercel) provide instant rollback buttons in their dashboards to redeploy any previous Git commit with zero downtime.

### Scenario B: GitHub Repository Outage or Deletion
1. Use an up-to-date local Git clone.
2. Add a new remote (e.g., GitLab, Codeberg, AWS S3):
   ```bash
   git remote add backup <backup-repo-url>
   git push backup --all
   ```
3. Re-point static host or deploy static directory to S3/CloudFront or Cloudflare Pages.

