# Vercel Deployment Guide

## Prerequisites
- GitHub repository with your code
- Vercel account (free)
- Backend API deployed (e.g., on Railway, Render, or Vercel Functions)

## Environment Variables for Production

Set these environment variables in your Vercel dashboard:

```
VITE_API_BASE_URL=https://your-backend-url/api
VITE_APP_NAME=Urban Issue Reporter
VITE_APP_VERSION=1.0.0
```

## Deployment Steps

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` folder as the root directory

2. **Configure Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   - In Vercel dashboard → Project Settings → Environment Variables
   - Add the environment variables listed above
   - Make sure to set the correct backend URL

4. **Deploy**:
   - Click "Deploy"
   - Your app will be built and deployed automatically

## Important Notes

- ✅ The frontend is configured with environment variables
- ✅ Build optimization is enabled
- ✅ SPA routing is configured with rewrites
- ✅ Static assets caching is optimized
- ⚠️ Update `VITE_API_BASE_URL` to point to your deployed backend
- ⚠️ Make sure your backend allows CORS from your Vercel domain

## Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

## Troubleshooting

1. **API calls failing**: Check that VITE_API_BASE_URL is correctly set
2. **404 on refresh**: Make sure vercel.json rewrites are configured
3. **Build failing**: Check for any missing dependencies or build errors