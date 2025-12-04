#!/bin/bash

echo "🚀 Preparing CFC CRM Extension for Chrome Web Store Deployment"

# Create deployment directory
mkdir -p deployment

# Use production manifest
echo "📝 Using production manifest..."
cp manifest-production.json deployment/manifest.json

# Ensure production-ready files are used (files already in deployment/)
echo "📁 Ensuring deployment files are in place (popup.js, content.js, background.js, popup.html)"
if [ ! -f "deployment/popup.html" ] || [ ! -f "deployment/popup.js" ] || [ ! -f "deployment/content.js" ] || [ ! -f "deployment/background.js" ]; then
    echo "⚠️  Missing deployment scripts. Please ensure deployment/ contains production-ready popup.html, popup.js, content.js, and background.js"
    exit 1
fi

# Copy icons (if they exist)
if [ -f "icons/icon16.png" ]; then
    mkdir -p deployment/icons
    cp icons/icon16.png deployment/icons/
    cp icons/icon48.png deployment/icons/
    cp icons/icon128.png deployment/icons/
    echo "✅ Icons copied"
else
    echo "⚠️  Icons not found. Please run create-icons.html first to generate them."
fi

# Create zip file
echo "📦 Creating deployment package..."
cd deployment
zip -r ../cfc-crm-v1.0.0.zip .
cd ..

echo "✅ Deployment package created: cfc-crm-v1.0.0.zip"
echo ""
echo "📋 Next steps:"
echo "1. Open create-icons.html in your browser"
echo "2. Download the 16x16, 48x48, and 128x128 PNG icons"
echo "3. Place them in the deployment/icons/ folder"
echo "4. Re-run this script to include the icons"
echo "5. Upload cfc-crm-v1.0.0.zip to Chrome Web Store"