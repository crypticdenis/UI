````markdown
# Deployment Guide with Authentication

## Overview
Your app now has password protection. Anyone trying to access it will need to enter a password first.

## Step 1: Set Your Password

Edit the `.env` file and change the password:
```bash
VITE_APP_PASSWORD=YourSecurePasswordHere123
```

## Step 2: Deploy to Vercel (Recommended)

### A. Via Vercel CLI (Command Line)

1. Login to Vercel:
```bash
vercel login
```

2. Deploy the project:
```bash
vercel
```

3. Set the password as an environment variable in Vercel:
```bash
vercel env add VITE_APP_PASSWORD
```
(Paste your password when prompted, select "Production")

4. Deploy to production:
```bash
vercel --prod
```

### B. Via Vercel Dashboard (Web Interface)

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. In "Environment Variables" section, add:
   - Key: `VITE_APP_PASSWORD`
   - Value: Your secure password
5. Click "Deploy"

## Step 3: Push to GitHub

```bash
# Add all files
git add -A

# Commit changes
git commit -m "Add authentication and deployment config"

# Push to GitHub
git push origin main
```

## Alternative Options

### Option B: Netlify with Password Protection

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Add environment variable in Netlify dashboard:
   - Go to Site Settings > Environment Variables
   - Add `VITE_APP_PASSWORD` with your password

### Option C: GitHub Pages with Cloudflare Access

1. Deploy to GitHub Pages normally
2. Use Cloudflare Access (free tier) for authentication
3. Requires domain name and Cloudflare setup

## Security Notes

⚠️ **Important:**
- Never commit the `.env` file (it's in .gitignore)
- Change the default password immediately
- Share the password securely (not via email/slack)
- Use a strong password (12+ characters, mixed case, numbers, symbols)
- The password is stored in session storage and cleared when browser closes

## Testing Locally

```bash
npm run dev
```
Visit http://localhost:5173 and you'll see the login page.

## Updating the Password

1. Change it in your deployment platform's environment variables
2. Redeploy the application
3. All users will need to re-authenticate with the new password

## Advanced: IP Whitelisting

For even more security, you can add IP whitelisting in Vercel:
1. Go to your project settings
2. Navigate to "Firewall"
3. Add allowed IP addresses

## Support

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

````