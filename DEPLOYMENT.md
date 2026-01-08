# Production Deployment Guide

This guide explains how to deploy your Todo + Users application in production where everything runs on a single port from the Node.js server.

## Architecture

In production:
- **Single Port**: Everything runs on port 3001 (or PORT environment variable)
- **Static Files**: React app is built to `dist/` folder and served by Express
- **API Routes**: All `/api/*` requests are handled by Node.js backend
- **Routing**: React Router handles client-side routing, Express serves index.html for all non-API routes

```
Client Request → Node.js Server (Port 3001)
                      ↓
                 /api/* → API Routes (todos, users, health)
                      ↓
                 /* → Serve React App (dist/index.html)
```

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Git (for deployment from repository)

## Local Production Build and Test

### For Linux/Mac:

```bash
# 1. Install dependencies
npm install

# 2. Build the React app
npm run build

# 3. Start the production server
npm start

# Or combine both steps
npm run build:start
```

### For Windows:

```bash
# 1. Install dependencies
npm install

# 2. Build the React app
npm run build

# 3. Start the production server
npm run start:win

# Or combine both steps
npm run build:start:win
```

The application will be available at `http://localhost:3001`

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
PORT=3001
NODE_ENV=production
```

## Deployment Steps

### 1. Prepare for Deployment

```bash
# Ensure all changes are committed
git status
git add .
git commit -m "Prepare for production deployment"

# Build the production bundle
npm run build
```

The build will create a `dist/` folder with:
- `index.html` - The main HTML file
- `bundle.js` - Minified JavaScript bundle
- All optimized assets

### 2. Deploy to Traditional Server (VPS/Dedicated Server)

#### A. Using PM2 (Recommended)

PM2 is a production process manager for Node.js applications.

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
pm2 start server/index.js --name "todo-app" --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# View logs
pm2 logs todo-app

# Monitor
pm2 monit

# Restart
pm2 restart todo-app

# Stop
pm2 stop todo-app
```

#### B. Using systemd (Linux)

Create a systemd service file: `/etc/systemd/system/todo-app.service`

```ini
[Unit]
Description=Todo App
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/path/to/WebpackTodo
Environment="NODE_ENV=production"
Environment="PORT=3001"
ExecStart=/usr/bin/node server/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Start the service:

```bash
sudo systemctl enable todo-app
sudo systemctl start todo-app
sudo systemctl status todo-app
```

### 3. Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create your-app-name

# Add buildpack
heroku buildpacks:add heroku/nodejs

# Create Procfile in root directory
echo "web: npm run build && npm start" > Procfile

# Deploy
git push heroku main

# Open the app
heroku open
```

**Note**: Heroku automatically sets the PORT environment variable.

### 4. Deploy to Render

1. Create a `render.yaml` file in root:

```yaml
services:
  - type: web
    name: todo-app
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

2. Push to GitHub
3. Connect repository in Render dashboard
4. Deploy will happen automatically

### 5. Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Open app
railway open
```

### 6. Deploy to DigitalOcean App Platform

1. Push code to GitHub
2. Create new app in DigitalOcean App Platform
3. Connect your repository
4. Configure build command: `npm install && npm run build`
5. Configure run command: `npm start`
6. Deploy

### 7. Deploy to AWS EC2

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd WebpackTodo

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start server/index.js --name todo-app --env production
pm2 startup
pm2 save

# Configure nginx as reverse proxy (optional)
sudo apt-get install nginx
```

Nginx configuration (`/etc/nginx/sites-available/todo-app`):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. Deploy with Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "start"]
```

Create `.dockerignore`:

```
node_modules
dist
.git
.env
```

Build and run:

```bash
# Build image
docker build -t todo-app .

# Run container
docker run -p 3001:3001 -e NODE_ENV=production todo-app

# Or use docker-compose
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    restart: unless-stopped
```

Run with docker-compose:

```bash
docker-compose up -d
```

## Nginx Reverse Proxy (Production)

If you want to serve on port 80/443:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Important Files for Deployment

Make sure these files are committed:

```
WebpackTodo/
├── dist/                 # Generated by npm run build
│   ├── index.html
│   └── bundle.js
├── server/
│   └── index.js         # Main server file
├── src/                 # React source files
├── package.json         # Dependencies and scripts
├── webpack.config.js    # Webpack configuration
└── .gitignore          # Exclude node_modules, .env
```

Add to `.gitignore`:

```
node_modules/
dist/
.env
.DS_Store
*.log
```

## Production Checklist

- [ ] Build the React app: `npm run build`
- [ ] Test production build locally
- [ ] Set NODE_ENV=production
- [ ] Configure environment variables
- [ ] Set up process manager (PM2)
- [ ] Configure reverse proxy (Nginx) if needed
- [ ] Set up SSL/TLS certificate (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Configure automatic restarts
- [ ] Set up backup strategy
- [ ] Test all routes (/, /users, /api/*)

## Testing Production Build

```bash
# Windows
npm run build:start:win

# Linux/Mac
npm run build:start

# Test these URLs:
# http://localhost:3001/           - Todos page
# http://localhost:3001/users      - Users page
# http://localhost:3001/api/todos  - API endpoint
# http://localhost:3001/api/users  - API endpoint
```

## Troubleshooting

### Issue: "Cannot GET /" in production

**Solution**: Make sure the dist folder exists and contains index.html. Run `npm run build` first.

### Issue: React Router routes return 404

**Solution**: The catch-all route in server/index.js should serve index.html for all non-API routes. This is already configured.

### Issue: API calls failing

**Solution**: Make sure all API routes start with `/api/` prefix.

### Issue: Static files not loading

**Solution**: Check that `publicPath: '/'` is set in webpack.config.js.

## Performance Optimization

1. **Enable Gzip Compression**:

```javascript
// Add to server/index.js
const compression = require('compression');
app.use(compression());
```

2. **Add Cache Headers**:

```javascript
// In production mode
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../dist'), {
    maxAge: '1y',
    etag: false
  }));
}
```

3. **Use PM2 Cluster Mode**:

```bash
pm2 start server/index.js -i max --name "todo-app"
```

## Monitoring

### Check application status:

```bash
# Using PM2
pm2 status
pm2 logs todo-app

# Using systemd
sudo systemctl status todo-app
sudo journalctl -u todo-app -f
```

## Security Considerations

1. Use HTTPS in production (Let's Encrypt)
2. Set secure headers (helmet.js)
3. Rate limiting for API endpoints
4. Input validation and sanitization
5. Keep dependencies updated
6. Use environment variables for secrets
7. Configure CORS properly for production domain

## Support

For issues or questions:
- Check logs: `pm2 logs todo-app`
- Review this documentation
- Check the GitHub repository for updates
