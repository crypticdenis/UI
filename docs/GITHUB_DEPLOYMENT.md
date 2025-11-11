````markdown
# GitHub Pages Deployment Guide

## 🎉 Your app is deployed!

**URL:** https://crypticdenis.github.io/UI/

## 📋 Setup Steps (One-time)

### 1. Enable GitHub Pages

1. Go to your GitHub repository: https://github.com/crypticdenis/UI
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Source", select:
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages`
   - **Folder:** `/ (root)`
5. Click **Save**

### 2. Add Password Secret

To make the password authentication work on GitHub Pages:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - **Name:** `VITE_APP_PASSWORD`
   - **Value:** Your secure password (e.g., `MySecurePassword123`)
4. Click **Add secret**

### 3. Make Repository Public (Required for GitHub Pages)

GitHub Pages requires a public repository on the free plan:

1. Go to **Settings** → **General**
2. Scroll to bottom → **Danger Zone**
3. Click **Change visibility** → **Make public**

⚠️ **Note:** Your code will be public, but your password will remain secret!

## 🚀 Deploy Commands

### Initial Deployment (Already Done!)
```bash
npm run deploy
```

### Future Deployments

Every time you push to `main`, GitHub Actions will automatically deploy:
```bash
git add -A
git commit -m "Your changes"
git push origin main
```

Or deploy manually:
```bash
npm run deploy
```

## 🔐 How Authentication Works

1. Users visit: https://crypticdenis.github.io/UI/
2. They see a login screen
3. They must enter the password you set in GitHub Secrets
4. Once logged in, they can use the app
5. Password is stored in browser session (cleared when browser closes)

## ⚙️ Updating the Password

To change the password:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click on `VITE_APP_PASSWORD`
3. Click **Update secret**
4. Enter new password
5. Re-run the workflow or push a new commit

## 🔧 Troubleshooting

### Page shows 404
- Wait 2-3 minutes after first deployment
- Check that GitHub Pages is enabled in Settings
- Verify branch is set to `gh-pages`

### Authentication not working
- Make sure `VITE_APP_PASSWORD` secret is set
- Check the password doesn't have quotes around it
- Re-run the GitHub Actions workflow

### Build fails
- Check GitHub Actions tab for error logs
- Verify all dependencies are in package.json
- Make sure .env is NOT committed (it's in .gitignore)

## 📝 Local Development

```bash
# Set password in .env file
echo "VITE_APP_PASSWORD=your-password-here" > .env

# Run locally
npm run dev
```

## 🔄 Manual Deployment

If you want to deploy without auto-deployment:

```bash
# Build
npm run build

# Deploy
npm run deploy
```

## 🌐 Custom Domain (Optional)

To use your own domain:

1. Add a `CNAME` file in `/public/` with your domain
2. Update DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

## 📚 Links

- Live Site: https://crypticdenis.github.io/UI/
- Repository: https://github.com/crypticdenis/UI
- GitHub Pages Docs: https://docs.github.com/pages
- GitHub Actions Docs: https://docs.github.com/actions

## ✅ Checklist

- [x] Code pushed to GitHub
- [x] App deployed to GitHub Pages
- [ ] Enable GitHub Pages in repository settings
- [ ] Add VITE_APP_PASSWORD secret
- [ ] Make repository public (if needed)
- [ ] Test the live URL
- [ ] Share URL and password with authorized users

````