#!/bin/bash

# Production Deployment Script for CFC CRM Extension
# This script prepares the extension for production deployment

echo "🚀 Preparing CFC CRM Extension for Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    print_error "manifest.json not found. Please run this script from the extension directory."
    exit 1
fi

# Create production directory
PROD_DIR="production"
print_status "Creating production directory: $PROD_DIR"
rm -rf "$PROD_DIR"
mkdir -p "$PROD_DIR"

# Copy necessary files
print_status "Copying extension files..."
cp manifest.json "$PROD_DIR/"
cp popup.html "$PROD_DIR/"
cp popup.js "$PROD_DIR/"
cp content.js "$PROD_DIR/"
cp background.js "$PROD_DIR/"

# Copy icons directory
if [ -d "icons" ]; then
    print_status "Copying icons..."
    cp -r icons "$PROD_DIR/"
fi

# Copy deployment directory if it exists
if [ -d "deployment" ]; then
    print_status "Copying deployment files..."
    cp -r deployment "$PROD_DIR/"
fi

# Update manifest for production
print_status "Updating manifest for production..."
sed -i.bak 's/"version": "1.0.0"/"version": "1.0.0"/' "$PROD_DIR/manifest.json"

# Create production zip file
ZIP_NAME="cfc-crm-v1.0.0.zip"
print_status "Creating production zip: $ZIP_NAME"
cd "$PROD_DIR"
zip -r "../$ZIP_NAME" . -x "*.bak" "*.DS_Store" "*.git*"
cd ..

# Clean up
rm -rf "$PROD_DIR"

print_success "Production deployment completed!"
print_status "Files created:"
echo "  📦 $ZIP_NAME - Extension package for Chrome Web Store"
echo "  📁 $PROD_DIR/ - Production files (cleaned up)"

print_warning "Next steps:"
echo "  1. Test the extension locally:"
echo "     - Go to chrome://extensions/"
echo "     - Enable Developer mode"
echo "     - Load unpacked: $PROD_DIR"
echo ""
echo "  2. Upload to Chrome Web Store:"
echo "     - Go to https://chrome.google.com/webstore/devconsole"
echo "     - Upload: $ZIP_NAME"
echo "     - Update extension ID in React app after publishing"
echo ""
echo "  3. Update React app with new extension ID:"
echo "     - Get the new extension ID from Chrome Web Store"
echo "     - Update src/components/contacts/LinkedInContacts.tsx"

print_success "🎉 Extension is ready for production deployment!" 