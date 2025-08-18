# CI/CD Pipeline Documentation

This project uses GitHub Actions and Vercel for continuous integration and deployment.

## 📁 Project Structure

```
.github/
├── workflows/
│   ├── deploy-production.yml  # Main branch → Production
│   └── deploy-preview.yml     # Develop branch & PRs → Preview
├── SECRETS_REQUIRED.md        # GitHub secrets documentation
└── README_CICD.md             # This file

scripts/
├── setup-env.sh               # Environment setup script
└── pull-env.sh                # Pull env vars from Vercel

vercel.json                    # Vercel configuration
.env.*.example                 # Environment variable templates
```

## 🚀 Quick Start

### 1. Initial Setup

Run the setup script to configure your environment:

```bash
./scripts/setup-env.sh
```

This script will:
- Install Vercel CLI if not present
- Create environment files from examples
- Link your project to Vercel (optional)
- Display required GitHub secrets
- Create helper scripts

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `VERCEL_TOKEN` - Get from [Vercel Tokens](https://vercel.com/account/tokens)
   - `VERCEL_ORG_ID` - Found in `.vercel/project.json` after linking
   - `VERCEL_PROJECT_ID` - Found in `.vercel/project.json` after linking

### 3. Create GitHub Environments

1. Go to **Settings** → **Environments**
2. Create two environments:
   - `production` - For main branch deployments
   - `preview` - For develop branch and PR deployments

## 🔄 Deployment Workflows

### Production Deployment (Main Branch)

- **Trigger**: Push to `main` branch
- **Environment**: Production
- **URL**: Your production domain
- **Workflow**: `.github/workflows/deploy-production.yml`

```bash
git checkout main
git merge develop
git push origin main
```

### Preview Deployment (Develop Branch)

- **Trigger**: Push to `develop` branch or PR creation/update
- **Environment**: Preview/Staging
- **URL**: Auto-generated preview URL
- **Workflow**: `.github/workflows/deploy-preview.yml`

```bash
git checkout develop
git push origin develop
```

### Pull Request Previews

Every pull request automatically gets:
- A preview deployment
- Comment with preview URL
- Automatic updates on new commits

## 🔐 Environment Variables

### Managing Environment Variables

#### Via Vercel Dashboard
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add variables for each environment:
   - Production
   - Preview
   - Development

#### Via Vercel CLI

```bash
# List all environment variables
vercel env ls

# Add a new variable
vercel env add

# Remove a variable
vercel env rm

# Pull variables to local files
./scripts/pull-env.sh
```

### Environment Files

| File | Purpose | Git Ignored |
|------|---------|-------------|
| `.env.development.example` | Development template | ❌ |
| `.env.production.example` | Production template | ❌ |
| `.env.local.example` | Local overrides template | ❌ |
| `.env.development` | Development values | ✅ |
| `.env.production` | Production values | ✅ |
| `.env.local` | Local overrides | ✅ |

## 📋 Common Tasks

### Deploy to Production

```bash
# Ensure you're on main branch
git checkout main

# Merge latest changes from develop
git merge develop

# Push to trigger deployment
git push origin main
```

### Deploy Preview

```bash
# Work on develop branch
git checkout develop

# Make your changes
git add .
git commit -m "Your changes"

# Push to trigger preview deployment
git push origin develop
```

### Create a Feature Branch

```bash
# Create from develop
git checkout develop
git checkout -b feature/your-feature

# Work on your feature
git add .
git commit -m "Add feature"

# Push and create PR
git push origin feature/your-feature
# Create PR on GitHub → Automatic preview deployment
```

### Update Environment Variables

```bash
# Add via CLI
vercel env add

# Pull latest to local
./scripts/pull-env.sh

# Or update in Vercel Dashboard
# https://vercel.com/dashboard → Your Project → Settings → Environment Variables
```

## 🛠️ Configuration

### Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Modify this file to:
- Change build commands
- Update output directory
- Configure redirects/rewrites
- Set headers
- Configure functions

### GitHub Actions Configuration

The workflows use:
- Node.js 20
- Vercel CLI
- GitHub environments for deployment protection

Modify workflow files to:
- Change Node version
- Add build steps
- Include tests
- Add notifications

## 🐛 Troubleshooting

### Build Failures

1. Check build logs in GitHub Actions
2. Verify environment variables are set
3. Ensure `package.json` scripts are correct
4. Check Vercel dashboard for errors

### Environment Variables Not Working

1. Verify variables are set in Vercel Dashboard
2. Check environment scope (Production/Preview/Development)
3. Pull latest with `./scripts/pull-env.sh`
4. Ensure variable names match in code

### Preview URLs Not Showing

1. Check if PR workflow is enabled
2. Verify GitHub secrets are set
3. Check workflow permissions in repository settings
4. Ensure Vercel project is linked

### Authentication Issues

1. Regenerate Vercel token
2. Update `VERCEL_TOKEN` secret in GitHub
3. Verify organization and project IDs
4. Check Vercel team permissions

## 📊 Monitoring

### GitHub Actions

- View runs: **Actions** tab in repository
- Check logs: Click on specific workflow run
- Re-run failed jobs: Use "Re-run jobs" button

### Vercel Dashboard

- View deployments: [Vercel Dashboard](https://vercel.com/dashboard)
- Check functions logs: Project → Functions tab
- Monitor analytics: Project → Analytics tab

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Environment Variables in Vercel](https://vercel.com/docs/environment-variables)

## 📝 Best Practices

1. **Never commit sensitive data** - Use environment variables
2. **Use branch protection** - Require PR reviews for main
3. **Test locally first** - Run builds before pushing
4. **Keep secrets secure** - Rotate tokens regularly
5. **Monitor deployments** - Check logs for errors
6. **Document changes** - Update this README when modifying CI/CD

## 🤝 Contributing

1. Create feature branch from `develop`
2. Make changes and test locally
3. Push branch and create PR
4. Wait for preview deployment
5. Get PR reviewed and approved
6. Merge to `develop` for staging
7. Merge to `main` for production

## 📞 Support

For issues with:
- **CI/CD Pipeline**: Check this documentation and workflow files
- **Vercel**: Contact Vercel support or check their documentation
- **GitHub Actions**: Check GitHub status page and documentation
- **Project-specific**: Contact your team lead or DevOps engineer
