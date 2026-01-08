# Production Quick Start Guide

## TL;DR - Deploy in 3 Steps

### Windows:
```bash
npm install
npm run build
npm run start:win
```

### Linux/Mac:
```bash
npm install
npm run build
npm start
```

Your app will be running on `http://localhost:3001` (or the PORT you set)

## What Happens in Production

1. **Build Step** (`npm run build`):
   - Webpack bundles React app into `dist/` folder
   - Creates optimized `bundle.js` and `index.html`

2. **Start Step** (`npm start` or `npm run start:win`):
   - Sets `NODE_ENV=production`
   - Node.js server starts on port 3001
   - Serves static files from `dist/` folder
   - Handles all `/api/*` routes
   - Serves `index.html` for all other routes (React Router)

## Architecture

```
http://localhost:3001/
    ├─ /                  → React App (Todos page)
    ├─ /users             → React App (Users page)
    ├─ /api/todos         → Node.js API
    ├─ /api/users         → Node.js API (external API proxy)
    └─ /api/health        → Node.js API
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development mode (React: 3000, Node: 3001) |
| `npm run build` | Build React app for production |
| `npm start` | Start production server (Linux/Mac) |
| `npm run start:win` | Start production server (Windows) |
| `npm run build:start` | Build + Start (Linux/Mac) |
| `npm run build:start:win` | Build + Start (Windows) |

## Environment Variables

Optional `.env` file:
```env
PORT=3001
NODE_ENV=production
```

## Quick Deploy Options

### 1. Using PM2 (Recommended)
```bash
npm install -g pm2
npm run build
pm2 start server/index.js --name todo-app --env production
pm2 save
```

### 2. Using Docker
```bash
docker build -t todo-app .
docker run -p 3001:3001 todo-app
```

### 3. Cloud Platforms
- **Heroku**: `git push heroku main`
- **Railway**: `railway up`
- **Render**: Connect GitHub repo
- **Vercel/Netlify**: Not suitable (need Node.js backend)

## Verification

After deployment, test these URLs:
```
http://your-domain:3001/           ✓ Todos page
http://your-domain:3001/users      ✓ Users page
http://your-domain:3001/api/todos  ✓ API response
http://your-domain:3001/api/users  ✓ API response
```

## Troubleshooting

**Issue**: "Cannot GET /"
- **Fix**: Run `npm run build` first

**Issue**: React routes return 404
- **Fix**: Already configured in server/index.js (catch-all route)

**Issue**: Port already in use
- **Fix**: Change PORT in .env or kill existing process

## Need More Details?

See `DEPLOYMENT.md` for:
- Full deployment instructions
- Multiple platform guides
- Docker setup
- Nginx configuration
- Security best practices
- Monitoring setup
