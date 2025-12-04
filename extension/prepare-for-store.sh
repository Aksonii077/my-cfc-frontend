#!/bin/bash

# Prepare LinkedIn Connections Fetcher for Chrome Web Store
echo "🚀 Preparing extension for Chrome Web Store..."

# Create icons directory if it doesn't exist
mkdir -p icons

# Check if PNG icons exist
if [ ! -f "icons/icon16.png" ] || [ ! -f "icons/icon48.png" ] || [ ! -f "icons/icon128.png" ]; then
    echo "⚠️  PNG icons not found. Please:"
    echo "1. Open create-icons.html in your browser"
    echo "2. Right-click each canvas and save as:"
    echo "   - icons/icon16.png"
    echo "   - icons/icon48.png" 
    echo "   - icons/icon128.png"
    echo ""
    echo "Or install ImageMagick and run:"
    echo "convert icons/icon.svg -resize 16x16 icons/icon16.png"
    echo "convert icons/icon.svg -resize 48x48 icons/icon48.png"
    echo "convert icons/icon.svg -resize 128x128 icons/icon128.png"
    echo ""
    read -p "Press Enter after creating the PNG icons..."
fi

# Copy production manifest from deployment
echo "📝 Using deployment manifest..."
cp deployment/manifest.json manifest.json

# Create ZIP package
echo "📦 Creating ZIP package..."
zip -r linkedin-extension-prod.zip deployment icons manifest.json \
    -x "*.md" -x "test-*" -x "build-*" -x ".DS_Store" -x "*.log"

echo "✅ Extension package created: linkedin-extension-prod.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole/"
echo "2. Pay $5 registration fee (one-time)"
echo "3. Click 'Add new item'"
echo "4. Upload linkedin-connections-fetcher.zip"
echo "5. Fill in store listing details"
echo "6. Submit for review (1-3 business days)"
echo ""
echo "📸 Required screenshots:"
echo "- Extension popup (main interface)"
echo "- Extension popup (settings panel)" 
echo "- Extension popup (during sync)"
echo "- Extension popup (connected status)"
echo ""
echo "🔗 Don't forget to:"
echo "- Update API URLs to production"
echo "- Create privacy policy"
echo "- Test thoroughly before submission" 