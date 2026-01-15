# Deployment

## Overview

jm-tasks is deployed using Cloudflare Pages, providing fast global distribution, automatic HTTPS, and seamless
integration with Cloudflare's ecosystem.

## Domain Configuration

- **Production Domain**: tasks.joemaffei.dev
- **DNS**: Managed through Cloudflare
- **SSL/TLS**: Automatic via Cloudflare (Always On HTTPS)

## Cloudflare Pages Setup

### Initial Configuration

1. Connect repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `npm run build` (or appropriate build command)
   - Build output directory: `dist` (or appropriate output directory)
   - Root directory: `/` (or project root)

### Environment Variables

- Configure environment variables in Cloudflare Pages dashboard
- Separate variables for production, preview deployments
- Never commit secrets to repository
  - `VITE_SYNC_API_BASE_URL` for the frontend to reach Workers sync API
  - `VITE_SYNC_API_TOKEN` (optional) for sync API authentication

### Build Configuration

- Automatic builds on push to main branch
- Preview deployments for pull requests
- Build optimization and caching

## Deployment Workflow

### Automatic Deployment

```text
Git Push → Cloudflare Pages Build → Deploy to Production
```

### Manual Deployment

- Trigger builds from Cloudflare dashboard if needed
- Rollback capability for previous deployments

## Cloudflare Services Integration

### Data Storage Options

- **Cloudflare Workers**: Serverless functions for API endpoints
- **Cloudflare KV**: Key-value storage for simple data
- **Cloudflare Durable Objects**: Strongly consistent storage
- **Cloudflare R2**: Object storage (S3-compatible)
- **Sync Backend**: Workers + Durable Objects (Cloudflare-only sync)

### Initial Implementation

- Workers sync endpoints are required for `VITE_SYNC_API_BASE_URL`
- Durable Objects are recommended as the authoritative store for sync

### Workers Sync Backend

- Deploy the Worker from the `workers/` directory
- Configure secrets via Wrangler:
  - `SYNC_API_TOKEN` (optional)
  - `SYNC_CORS_ORIGINS` (optional)

## CI/CD Considerations

### Continuous Integration

- Run tests before deployment
- Lint and format checks
- Build verification

### Continuous Deployment

- Automatic deployment on successful builds
- Preview deployments for feature branches
- Production deployment from main branch

### Deployment Pipeline

1. Code pushed to repository
2. Cloudflare Pages detects changes
3. Build process runs
4. Tests execute (if configured)
5. Build artifacts created
6. Deployment to Cloudflare edge network
7. DNS and SSL automatically configured

## Performance Optimization

### Build Optimization

- Code splitting
- Tree shaking
- Minification
- Asset optimization

### Runtime Optimization

- Cloudflare CDN for static assets
- Edge caching strategies
- Compression (Brotli/Gzip)
- Image optimization

## Monitoring and Analytics

### Cloudflare Analytics

- Page views and performance metrics
- Error tracking
- Real-time monitoring

### Application Monitoring

- Error logging and tracking
- Performance monitoring
- User analytics (if implemented)

## Rollback Strategy

- Keep previous deployment versions available
- Quick rollback through Cloudflare dashboard
- Version history for troubleshooting

## Environment Management

### Production

- Main branch → Production deployment
- tasks.joemaffei.dev domain
- Production environment variables

### Preview/Staging

- Feature branches → Preview deployments
- Unique preview URLs
- Staging environment variables (if needed)

## Security Headers

Configure security headers via Cloudflare:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security (HSTS)
- Referrer-Policy

## Backup and Recovery

- Regular backups of data storage
- Version control for code
- Deployment history for recovery
- Data export capabilities

## Future Considerations

- Multi-region deployment if needed
- A/B testing capabilities
- Canary deployments
- Advanced monitoring and alerting
