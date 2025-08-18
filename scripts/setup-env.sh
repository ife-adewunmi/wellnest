#!/bin/bash

# Vercel Environment Setup Script
# This script automatically sets up environment variables for Vercel deployment

set -e

echo "🔧 Vercel Environment Setup Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to create env file from example
create_env_from_example() {
    local env_file=$1
    local example_file=$2
    
    if [ -f "$example_file" ]; then
        if [ ! -f "$env_file" ]; then
            cp "$example_file" "$env_file"
            echo -e "${GREEN}✓${NC} Created $env_file from $example_file"
        else
            echo -e "${YELLOW}ℹ${NC} $env_file already exists, skipping..."
        fi
    else
        echo -e "${RED}✗${NC} $example_file not found"
    fi
}

# Check if Vercel CLI is installed
if ! command_exists vercel; then
    echo -e "${YELLOW}⚠${NC} Vercel CLI not found. Installing..."
    npm install -g vercel@latest
    echo -e "${GREEN}✓${NC} Vercel CLI installed"
else
    echo -e "${GREEN}✓${NC} Vercel CLI is already installed"
fi

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo -e "${RED}✗${NC} Not in a git repository. Please initialize git first."
    exit 1
fi

# Create environment files from examples
echo ""
echo "Setting up environment files..."
echo "-------------------------------"

# Development environment
create_env_from_example ".env.development" ".env.development.example"

# Production environment
create_env_from_example ".env.production" ".env.production.example"

# Local environment
create_env_from_example ".env.local" ".env.local.example"

# Check if project is linked to Vercel
echo ""
echo "Checking Vercel project link..."
echo "-------------------------------"

if [ ! -f ".vercel/project.json" ]; then
    echo -e "${YELLOW}ℹ${NC} Project not linked to Vercel"
    echo ""
    read -p "Would you like to link this project to Vercel now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel link
        echo -e "${GREEN}✓${NC} Project linked to Vercel"
    else
        echo -e "${YELLOW}ℹ${NC} You'll need to link the project later using: vercel link"
    fi
else
    echo -e "${GREEN}✓${NC} Project is already linked to Vercel"
fi

# Extract Vercel project info if available
if [ -f ".vercel/project.json" ]; then
    echo ""
    echo "Vercel Project Information:"
    echo "---------------------------"
    PROJECT_ID=$(grep -o '"projectId":"[^"]*' .vercel/project.json | grep -o '[^"]*$')
    ORG_ID=$(grep -o '"orgId":"[^"]*' .vercel/project.json | grep -o '[^"]*$')
    
    echo -e "${BLUE}Project ID:${NC} $PROJECT_ID"
    echo -e "${BLUE}Organization ID:${NC} $ORG_ID"
    
    echo ""
    echo "GitHub Secrets Required:"
    echo "------------------------"
    echo "Add these secrets to your GitHub repository:"
    echo ""
    echo -e "${YELLOW}VERCEL_TOKEN${NC}        - Your Vercel personal access token"
    echo -e "${YELLOW}VERCEL_ORG_ID${NC}       - $ORG_ID"
    echo -e "${YELLOW}VERCEL_PROJECT_ID${NC}   - $PROJECT_ID"
    
    echo ""
    echo "To add these secrets:"
    echo "1. Go to your GitHub repository"
    echo "2. Navigate to Settings > Secrets and variables > Actions"
    echo "3. Click 'New repository secret' and add each secret"
    
    # Save to file for reference
    cat > .github/SECRETS_REQUIRED.md << EOF
# GitHub Secrets Required for CI/CD

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- **VERCEL_TOKEN**: Your Vercel personal access token
  - Get it from: https://vercel.com/account/tokens
  
- **VERCEL_ORG_ID**: \`$ORG_ID\`

- **VERCEL_PROJECT_ID**: \`$PROJECT_ID\`

## How to add secrets:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click 'New repository secret'
4. Add each secret with the exact name and value

## Environments

Make sure to create these environments in GitHub:
- \`production\` - For main branch deployments
- \`preview\` - For develop branch and PR deployments
EOF
    echo ""
    echo -e "${GREEN}✓${NC} Secrets information saved to .github/SECRETS_REQUIRED.md"
fi

echo ""
echo "Environment Variable Setup:"
echo "---------------------------"
echo "You can manage environment variables in Vercel using:"
echo ""
echo -e "${BLUE}1. Vercel Dashboard:${NC}"
echo "   - Go to your project in Vercel"
echo "   - Navigate to Settings > Environment Variables"
echo "   - Add variables for each environment (Production, Preview, Development)"
echo ""
echo -e "${BLUE}2. Vercel CLI:${NC}"
echo "   - List: vercel env ls"
echo "   - Add: vercel env add"
echo "   - Remove: vercel env rm"
echo "   - Pull: vercel env pull"
echo ""

# Create a helper script for pulling env vars
cat > scripts/pull-env.sh << 'EOF'
#!/bin/bash
# Pull environment variables from Vercel

echo "Pulling environment variables from Vercel..."

# Pull for development
vercel env pull .env.development --environment=development

# Pull for production
vercel env pull .env.production --environment=production

# Pull for preview
vercel env pull .env.preview --environment=preview

echo "✓ Environment variables pulled successfully"
EOF

chmod +x scripts/pull-env.sh
echo -e "${GREEN}✓${NC} Created helper script: scripts/pull-env.sh"

echo ""
echo "=================================="
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "-----------"
echo "1. Add the required secrets to your GitHub repository"
echo "2. Set up environment variables in Vercel"
echo "3. Commit and push your changes"
echo "4. Your CI/CD pipeline is ready to use!"
echo ""
echo "Commands:"
echo "---------"
echo "• Deploy to production: git push origin main"
echo "• Deploy to preview: git push origin develop"
echo "• Pull env vars: ./scripts/pull-env.sh"
echo ""
