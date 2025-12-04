# Chrome Web Store Publishing Guide

## Step 1: Prepare Your Extension

### 1.1 Create Production Icons
You need PNG icons in these sizes:
- 16x16 px
- 48x48 px  
- 128x128 px

Convert the SVG icon to PNG:
```bash
# Using ImageMagick (install if needed)
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

### 1.2 Update Manifest for Production
Update `manifest.json` to use PNG icons:
```json
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```

### 1.3 Create Store Assets
You'll need:
- **Screenshots** (1280x800 or 640x400 px)
- **Promotional tile images** (440x280 px)
- **App icon** (128x128 px)
- **Detailed description**
- **Privacy policy URL**

### 1.4 Update API URLs
Change localhost URLs to your production API:
```javascript
// In popup.html, change default API URL
value="https://your-production-api.com/linkedin/connections"
```

## Step 2: Create ZIP Package

1. **Select all extension files** (excluding development files)
2. **Create ZIP archive**:
   ```bash
   cd extension
   zip -r linkedin-connections-fetcher.zip . -x "*.md" "test-*" "build-*"
   ```

Required files:
- manifest.json
- popup.html
- popup.js
- content.js
- background.js
- icons/ (folder with PNG icons)
- web-app-integration.js
- integration-example.jsx

## Step 3: Chrome Web Store Submission

### 3.1 Create Developer Account
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Pay one-time $5 registration fee
3. Complete developer account setup

### 3.2 Submit Extension
1. Click "Add new item"
2. Upload your ZIP file
3. Fill in store listing details
4. Submit for review

### 3.3 Store Listing Requirements

**App Name**: LinkedIn Connections Fetcher

**Short Description**: 
Sync your LinkedIn connections to your app with one click.

**Detailed Description**:
```
🔗 LinkedIn Connections Fetcher

Automatically sync your LinkedIn network to your application with just one click.

FEATURES:
• One-click LinkedIn connection sync
• Secure authentication with your web app
• Real-time progress tracking
• Automatic data extraction
• Professional LinkedIn-themed interface
• Sync history and status tracking

HOW IT WORKS:
1. Log into your web app
2. Navigate to LinkedIn
3. Click "Connect LinkedIn" in the extension
4. Watch your connections sync automatically

SECURITY:
• Uses your existing authentication tokens
• No data stored on third-party servers
• Direct API communication to your backend
• Secure token management

Perfect for professionals who want to integrate their LinkedIn network with their business applications.
```

**Category**: Productivity

**Language**: English

**Privacy Policy**: [Your privacy policy URL]

### 3.4 Screenshots
Take screenshots of:
1. Extension popup (main interface)
2. Extension popup (settings panel)
3. Extension popup (during sync)
4. Extension popup (connected status)

### 3.5 Promotional Images
Create promotional tiles showing:
- Extension icon with LinkedIn branding
- "Sync LinkedIn Connections" messaging
- Professional design with your brand colors

## Step 4: Review Process

**Timeline**: 1-3 business days
**Review Criteria**:
- Functionality works as described
- No malicious code
- Follows Chrome Web Store policies
- Privacy policy is adequate
- Screenshots match functionality

## Step 5: After Approval

1. **Extension goes live** on Chrome Web Store
2. **Users can install** directly from store
3. **Automatic updates** when you publish new versions
4. **Analytics and reviews** available in dashboard

## Step 6: Updates

To update your extension:
1. Increment version in `manifest.json`
2. Create new ZIP package
3. Upload to Chrome Web Store
4. Submit for review

## Important Notes

- **API Endpoint**: Must be HTTPS in production
- **Privacy Policy**: Required for data collection
- **Permissions**: Only request necessary permissions
- **Testing**: Test thoroughly before submission
- **Compliance**: Follow Chrome Web Store policies 