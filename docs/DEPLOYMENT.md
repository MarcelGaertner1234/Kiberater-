# Deployment Guide

## 🚀 Quick Deploy

### Frontend (Vercel)
```bash
# Automatic deployment on push to main
git push origin main

# Manual deployment
vercel --prod
```

### Backend (AWS ECS)
```bash
# Build & push Docker image
npm run docker:build
npm run docker:push

# Deploy via AWS CLI
npm run deploy:backend
```

## 📋 Pre-Deployment Checklist

```markdown
[ ] Tests passing (npm test)
[ ] Lint clean (npm run lint)
[ ] Build successful (npm run build)
[ ] Environment variables set
[ ] Database migrations ready
[ ] API version bumped if breaking changes
```

## 🔧 Environment Setup

### Production Variables (Vercel)
```
NEXT_PUBLIC_API_URL=https://api.ki-beratung.de
NEXTAUTH_URL=https://app.ki-beratung.de
NEXTAUTH_SECRET=<generate-with-openssl>
```

### Production Variables (AWS)
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<generate-secure>
NODE_ENV=production
```

## 🔄 Deployment Flow

### 1. Frontend (Vercel)
- Push to `main` → Auto deploy
- Preview on PRs
- Rollback: Vercel Dashboard

### 2. Backend (AWS ECS)
```bash
# 1. Update task definition
aws ecs register-task-definition --cli-input-json file://task-def.json

# 2. Update service
aws ecs update-service --cluster prod --service api --task-definition api:latest

# 3. Monitor
aws ecs wait services-stable --cluster prod --services api
```

### 3. Database Migrations
```bash
# Always backup first!
npm run db:backup

# Run migrations
npm run db:migrate:prod

# Verify
npm run db:status
```

## 🚨 Rollback Procedure

### Frontend
1. Vercel Dashboard → Deployments
2. Select previous deployment
3. Click "Promote to Production"

### Backend
```bash
# Quick rollback to previous task definition
aws ecs update-service --cluster prod --service api --task-definition api:PREVIOUS_VERSION

# Database rollback (if needed)
npm run db:rollback
```

## 📊 Monitoring

### Health Checks
- Frontend: `https://app.ki-beratung.de/api/health`
- Backend: `https://api.ki-beratung.de/health`
- Database: `npm run db:health`

### Logs
- Frontend: Vercel Dashboard → Functions → Logs
- Backend: AWS CloudWatch → Log Groups → `/ecs/api`

### Alerts
- Uptime: StatusPage.io
- Errors: Sentry
- Performance: Vercel Analytics

## 🔐 Security

### SSL/TLS
- Frontend: Automatic via Vercel
- Backend: AWS Certificate Manager
- Force HTTPS everywhere

### Secrets Management
- Vercel: Environment Variables (encrypted)
- AWS: Secrets Manager / Parameter Store
- Never commit secrets!

## 🎯 Performance

### CDN Setup
- Static assets: Vercel Edge Network
- API responses: CloudFront for GET requests

### Caching Headers
```typescript
// Static assets (1 year)
Cache-Control: public, max-age=31536000, immutable

// API responses (varies)
Cache-Control: private, max-age=0, must-revalidate
```

## 📝 Post-Deployment

1. **Smoke Tests**
   ```bash
   npm run test:smoke
   ```

2. **Monitor Metrics**
   - Response times
   - Error rates
   - Resource usage

3. **Update Status Page**
   - Mark deployment complete
   - Note any issues

## 🆘 Emergency Contacts

- **DevOps Lead**: [Phone/Email]
- **AWS Support**: [Case URL]
- **Vercel Support**: [Ticket System]

## Common Issues

### "502 Bad Gateway"
- Check ECS task logs
- Verify health check endpoint
- Check security groups

### "Database Connection Failed"
- Verify DATABASE_URL
- Check VPC/Security Groups
- Confirm RDS is running

### "Build Failed on Vercel"
- Check build logs
- Verify environment variables
- Clear cache and retry