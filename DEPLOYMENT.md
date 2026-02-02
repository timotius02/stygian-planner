# Deploying Stygian Planner to Cloudflare Pages

This guide covers two methods to deploy your Vite + React app to Cloudflare Pages.

## Prerequisites

- A Cloudflare account (free tier works fine)
- Node.js installed locally
- Git repository (already initialized)

## Files Created for Deployment

### 1. `wrangler.toml`
Configuration file for Cloudflare Pages with build settings and headers.

### 2. `public/_redirects`
Handles SPA routing and API proxying to Enka Network.

### 3. Updated `src/services/enkaApi.ts`
Modified to always use `/api/enka` path, which works with both Vite dev proxy and Cloudflare Pages redirects.

---

## Method 1: Wrangler CLI (Quick Deploy)

### Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### Step 3: Deploy

```bash
# Build the project first
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist
```

### Step 4: (Optional) Set up for CI/CD

Create a `.github/workflows/deploy.yml` file for GitHub Actions:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: stygian-planner
          directory: dist
```

Then add these secrets in your GitHub repository settings:
- `CLOUDFLARE_API_TOKEN`: Create at https://dash.cloudflare.com/profile/api-tokens (use "Edit Cloudflare Workers" template)
- `CLOUDFLARE_ACCOUNT_ID`: Found on the right sidebar of your Cloudflare dashboard

---

## Method 2: Git Integration (Recommended for Continuous Deployment)

This method automatically deploys when you push to GitHub.

### Step 1: Push to GitHub

If not already done:

```bash
# Add the Cloudflare config files
git add wrangler.toml public/_redirects src/services/enkaApi.ts DEPLOYMENT.md
git commit -m "chore: add Cloudflare Pages deployment configuration"
git push origin main
```

### Step 2: Connect Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create application** → **Pages**
3. Click **Connect to Git**
4. Select your GitHub account and the `stygian-planner` repository
5. Click **Begin setup**

### Step 3: Configure Build Settings

In the setup page, configure:

| Setting | Value |
|---------|-------|
| **Project name** | `stygian-planner` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

### Step 4: Environment Variables (Optional)

If you need any environment variables, add them in the **Environment variables** section or later in the project settings.

### Step 5: Save and Deploy

Click **Save and Deploy**. Cloudflare will:
1. Build your project
2. Deploy it to a `*.pages.dev` domain
3. Set up automatic deployments for future pushes to `main`

---

## API Proxy Configuration

The Enka Network API proxy is configured to work in both development and production:

### Development (Vite Dev Server)
- Vite's dev proxy in [`vite.config.ts`](vite.config.ts:14) handles `/api/enka/*` → `https://enka.network/api/*`

### Production (Cloudflare Pages)
- The [`public/_redirects`](public/_redirects:5) file handles the same proxying
- The [`src/services/enkaApi.ts`](src/services/enkaApi.ts:6) uses `/api/enka` for both environments

---

## Verifying the Deployment

1. Visit your deployed site (e.g., `https://stygian-planner.pages.dev`)
2. Test the UID import feature - it should successfully fetch data from Enka Network
3. Check browser DevTools Network tab to confirm `/api/enka/*` requests are working

---

## Troubleshooting

### 404 on page refresh
- The `_redirects` file handles SPA routing
- Ensure `/* /index.html 200` is at the end of the file

### API requests failing
- Check that `_redirects` has the API proxy rule: `/api/enka/* https://enka.network/api/:splat 200`
- The order in `_redirects` matters - API rules should come before SPA catch-all

### Build failures
- Ensure `dist` folder is in `.gitignore` (it should be already)
- Check that `vite.config.ts` doesn't have syntax errors

---

## Custom Domain (Optional)

1. In Cloudflare Dashboard, go to your Pages project
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Follow the instructions to add your domain

---

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#cloudflare-pages)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
