---
id: task-21
title: Deploy to Cloudflare Pages
status: To Do
assignee: []
created_date: '2026-01-16'
labels:
  - deployment
  - cloudflare
  - infrastructure
dependencies:
  - task-3
  - task-9
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Deploy the jm-tasks PWA to Cloudflare Pages and configure it to be accessible at tasks.joemaffei.com. Set up continuous deployment, configure build settings, and verify the application is live and working correctly.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria

- [ ] Repository connected to Cloudflare Pages
- [ ] Build settings configured (build command, output directory)
- [ ] Application deployed and accessible at tasks.joemaffei.com
- [ ] Custom domain configured and SSL certificate active
- [ ] Automatic deployments on push to main branch working
- [ ] Preview deployments for pull requests working
- [ ] Production build completes successfully
- [ ] Application loads and functions correctly in production
- [ ] PWA features work in production (service worker, manifest)
- [ ] HTTPS enforced and working

## Technical Implementation

**Cloudflare Pages Setup:**

1. Connect Repository:
   - Go to Cloudflare Dashboard → Pages
   - Create new project
   - Connect GitHub/GitLab repository
   - Select repository: jm-tasks

2. Configure Build Settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (project root)
   - Node.js version: 22 (or latest LTS)

3. Environment Variables (if needed):
   - Configure any required environment variables in Cloudflare Pages dashboard
   - Separate variables for production vs preview deployments
   - No secrets should be committed to repository

4. Custom Domain Configuration:
   - Add custom domain: tasks.joemaffei.com
   - Configure DNS records (CNAME or A record)
   - Verify SSL certificate is automatically provisioned
   - Ensure HTTPS is enforced

5. Deployment Settings:
   - Enable automatic deployments on push to main branch
   - Enable preview deployments for pull requests
   - Configure branch protection if needed

**Verify Deployment:**

1. Build Verification:
   - Verify production build completes without errors
   - Check build logs for any warnings or issues
   - Ensure all assets are generated correctly

2. Application Testing:
   - Access application at tasks.joemaffei.com
   - Verify application loads correctly
   - Test core functionality (create, edit, delete tasks)
   - Verify PWA features work (service worker, manifest)
   - Test on multiple devices/browsers

3. Performance Checks:
   - Verify fast load times
   - Check Lighthouse scores
   - Verify CDN is serving assets correctly
   - Check SSL certificate is valid

**Documentation Updates:**

- Update `docs/DEPLOYMENT.md` with actual deployment details
- Document any environment variables needed
- Add troubleshooting section if issues encountered

## Dependencies

- Task 3 (Vue 3 project initialized)
- Task 9 (PWA Service Worker and Manifest configured)
- Cloudflare account with Pages access
- Domain access (tasks.joemaffei.com)
- DNS access for domain configuration
- Node.js 22 LTS
- npm 10+

## Deliverables

1. Application deployed to Cloudflare Pages
2. Custom domain configured (tasks.joemaffei.com)
3. SSL certificate active and HTTPS enforced
4. Automatic deployment pipeline working
5. Preview deployments configured
6. Updated deployment documentation
7. Verified working production application

## Testing

- Verify application is accessible at tasks.joemaffei.com
- Test all core functionality in production
- Verify PWA features work (installable, offline capable)
- Test automatic deployments (push to main triggers build)
- Test preview deployments (PR creates preview URL)
- Verify HTTPS is working and enforced
- Check Lighthouse PWA audit in production
- Test on multiple browsers and devices
- Verify build logs show no errors

## Notes

- This is the highest priority task to get the application live
- Focus on getting basic deployment working first
- Can refine build settings and optimizations later
- Ensure production build is working locally before deploying
- Keep environment variables secure (never commit secrets)
- Document any manual steps needed for future deployments
- Consider adding deployment status badges to README

**Estimated Effort:** 1-2 hours
**Priority:** High (critical for making application accessible)
**Labels:** deployment, cloudflare, infrastructure
