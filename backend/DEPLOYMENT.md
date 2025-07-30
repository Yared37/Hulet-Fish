# Hulet Fish Tourism API - Deployment Guide

## Overview
This guide covers deploying the Hulet Fish Tourism API to various cloud platforms.

## Environment Variables

### Required Environment Variables
\`\`\`bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/huletfish
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-api-domain.com
BCRYPT_SALT_ROUNDS=12
\`\`\`

### Email Configuration
\`\`\`bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_NAME=Hulet Fish Tourism
FROM_EMAIL=noreply@huletfish.com
\`\`\`

### Payment Configuration
\`\`\`bash
# Stripe
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Chapa (Ethiopian Payment Gateway)
CHAPA_PUBLIC_KEY=CHASECK_LIVE-your_chapa_key
CHAPA_SECRET_KEY=CHASECK_LIVE-your_chapa_secret
CHAPA_WEBHOOK_SECRET=your_chapa_webhook_secret
CHAPA_BASE_URL=https://api.chapa.co/v1
\`\`\`

## Deployment Platforms

### 1. Render Deployment

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `huletfish-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Choose based on needs (Starter for development)

3. **Environment Variables**
   - Add all required environment variables in Render dashboard
   - Use Render's PostgreSQL add-on or external MongoDB Atlas

4. **Database Setup**
   - Create MongoDB database (Atlas recommended)
   - Add connection string to `MONGODB_URI`

### 2. Railway Deployment

1. **Deploy with Railway**
   \`\`\`bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   \`\`\`

2. **Configure Environment**
   \`\`\`bash
   railway variables set NODE_ENV=production
   railway variables set MONGODB_URI=your_mongodb_uri
   railway variables set JWT_SECRET=your_jwt_secret
   # Add other variables...
   \`\`\`

3. **Custom Domain**
   \`\`\`bash
   railway domain add your-api-domain.com
   \`\`\`

### 3. Vercel Deployment (Serverless)

1. **Install Vercel CLI**
   \`\`\`bash
   npm install -g vercel
   \`\`\`

2. **Create vercel.json**
   \`\`\`json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   \`\`\`

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### 4. Heroku Deployment

1. **Create Heroku App**
   \`\`\`bash
   heroku create huletfish-api
   \`\`\`

2. **Add MongoDB Add-on**
   \`\`\`bash
   heroku addons:create mongolab:sandbox
   \`\`\`

3. **Set Environment Variables**
   \`\`\`bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_secret
   # Add other variables...
   \`\`\`

4. **Deploy**
   \`\`\`bash
   git push heroku main
   \`\`\`

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create new cluster
   - Choose region closest to your API deployment

2. **Configure Access**
   - Add IP whitelist (0.0.0.0/0 for cloud deployments)
   - Create database user
   - Get connection string

3. **Seed Database**
   \`\`\`bash
   npm run seed
   npm run seed:bookings
   npm run seed:cultural
   \`\`\`

## SSL/HTTPS Configuration

### Automatic SSL (Recommended)
Most cloud platforms provide automatic SSL certificates:
- Render: Automatic SSL
- Railway: Automatic SSL
- Vercel: Automatic SSL
- Heroku: Automatic SSL

### Custom SSL
For custom domains, configure SSL through your platform's dashboard.

## CORS Configuration

Update CORS settings for production:

\`\`\`javascript
// In server.js
app.use(cors({
  origin: [
    'https://huletfish.vercel.app',
    'https://your-custom-domain.com',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
\`\`\`

## Monitoring and Logging

### Health Checks
The API includes a health check endpoint at `/health`:

\`\`\`bash
curl https://your-api-domain.com/health
\`\`\`

### Logging
- Development: Console logging with Morgan
- Production: Consider services like LogRocket, Sentry, or platform-specific logging

### Performance Monitoring
- Use APM tools like New Relic, DataDog, or platform-specific monitoring
- Monitor response times, error rates, and database performance

## Security Considerations

### Production Security Checklist
- [ ] Use HTTPS only
- [ ] Set secure environment variables
- [ ] Enable rate limiting
- [ ] Use strong JWT secrets
- [ ] Validate all inputs
- [ ] Implement proper CORS
- [ ] Use helmet.js for security headers
- [ ] Regular security updates

### Rate Limiting
Configure rate limiting for production:

\`\`\`javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP'
});
\`\`\`

## Testing Deployment

### API Testing
\`\`\`bash
# Test health endpoint
curl https://your-api-domain.com/health

# Test authentication
curl -X POST https://your-api-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"tourist"}'

# Test protected endpoint
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-api-domain.com/api/auth/me
\`\`\`

### Load Testing
Use tools like Artillery or k6 for load testing:

\`\`\`bash
npm install -g artillery
artillery quick --count 10 --num 5 https://your-api-domain.com/health
\`\`\`

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check MongoDB URI format
   - Verify IP whitelist settings
   - Ensure database user has correct permissions

2. **CORS Errors**
   - Verify frontend URL in CORS configuration
   - Check environment variables

3. **JWT Errors**
   - Ensure JWT_SECRET is set and consistent
   - Check token expiration settings

4. **Payment Webhook Issues**
   - Verify webhook URLs in payment provider dashboards
   - Check webhook secret configuration
   - Test webhook endpoints

### Logs and Debugging
\`\`\`bash
# Railway logs
railway logs

# Render logs
# Available in Render dashboard

# Heroku logs
heroku logs --tail
\`\`\`

## Scaling Considerations

### Horizontal Scaling
- Use load balancers for multiple instances
- Implement session management for stateless operations
- Consider Redis for session storage

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for read-heavy operations
- Database indexing optimization

### Caching
- Implement Redis for caching
- Use CDN for static assets
- Cache frequently accessed data

## Backup and Recovery

### Database Backups
- MongoDB Atlas automatic backups
- Manual backup scripts
- Point-in-time recovery

### Code Backups
- Git repository backups
- Environment variable backups
- Documentation backups

## Support and Maintenance

### Regular Maintenance
- Security updates
- Dependency updates
- Performance monitoring
- Database optimization

### Support Channels
- API documentation: `/api-docs`
- Health monitoring: `/health`
- Error tracking and alerting
