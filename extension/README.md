# Happenstance LinkedIn Extension - Local Testing Guide

## 🚀 Quick Start for Local Testing

### 1. **Load the Extension in Chrome**

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `extension/` folder from this project
5. The extension should appear in your toolbar with the LinkedIn icon

### 2. **Start Your React App**

```bash
# In the main project directory
npm run dev
# or
bun dev
```

Your app should be running at `http://localhost:3000`

### 3. **Test the Integration**

1. Go to `http://localhost:3000/my-network?tab=import`
2. Click "Install Chrome Extension" 
3. Follow the development setup instructions
4. The extension will auto-detect your authentication

## 🔧 Extension Features

### **Auto-Authentication Detection**
- Automatically detects JWT tokens from your React app
- Checks localStorage, sessionStorage, and cookies
- Stores authentication state in extension storage

### **LinkedIn Connection Fetching**
- Fetches connections from LinkedIn profile
- Sends data to your API endpoint
- Real-time progress updates
- Error handling and retry logic

### **Integration Points**
- **Content Script**: Runs on LinkedIn pages
- **Background Script**: Handles API communication
- **Popup**: User interface for connection management

## 🧪 Testing Scenarios

### **Scenario 1: Fresh Installation**
1. Load extension in Chrome
2. Go to your React app and log in
3. Navigate to network import page
4. Click "Install Chrome Extension"
5. Verify extension detects authentication

### **Scenario 2: LinkedIn Connection Sync**
1. Ensure you're logged into LinkedIn
2. Go to your LinkedIn connections page
3. Click the extension icon
4. Click "Connect LinkedIn"
5. Monitor the sync progress
6. Check your React app for imported connections

### **Scenario 3: Error Handling**
1. Test with invalid JWT token
2. Test with network connectivity issues
3. Test with LinkedIn rate limiting
4. Verify error messages are displayed

## 📁 File Structure

```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── content.js            # LinkedIn page integration
├── background.js         # Background service worker
├── icons/                # Extension icons
└── README.md            # This file
```

## 🔗 API Integration

The extension communicates with your React app through:

1. **JWT Token Detection**: Automatically finds auth tokens
2. **API Endpoints**: Sends LinkedIn data to your backend
3. **Storage Sync**: Shares authentication state

### **Expected API Endpoints**
- `POST /api/linkedin/connections` - Save LinkedIn connections
- `GET /api/user/profile` - Get user profile info
- `POST /api/auth/verify` - Verify JWT token

## 🐛 Debugging

### **Chrome DevTools**
1. Right-click extension icon → "Inspect popup"
2. Check Console for error messages
3. Monitor Network tab for API calls

### **Content Script Debugging**
1. Go to LinkedIn page
2. Open DevTools → Console
3. Look for extension logs

### **Background Script Debugging**
1. Go to `chrome://extensions/`
2. Find your extension
3. Click "service worker" link
4. Debug in the new DevTools window

## 🔄 Development Workflow

1. **Make changes** to extension files
2. **Reload extension** in `chrome://extensions/`
3. **Test changes** in your React app
4. **Iterate** until everything works
5. **Package for production** when ready

## 📦 Production Preparation

When ready for Chrome Web Store:

1. Update `manifest.json` with production settings
2. Create production icons
3. Test thoroughly
4. Package extension
5. Submit to Chrome Web Store
6. Update React app with store URL

## 🆘 Troubleshooting

### **Extension Not Loading**
- Check manifest.json syntax
- Verify all files exist
- Check Chrome console for errors

### **Authentication Not Detected**
- Ensure you're logged into React app
- Check JWT token storage location
- Verify extension permissions

### **LinkedIn Data Not Fetching**
- Check if you're on LinkedIn connections page
- Verify content script is running
- Check network connectivity

### **API Communication Issues**
- Verify API endpoints are correct
- Check CORS settings
- Monitor network requests

## 📞 Support

For issues or questions:
1. Check this README
2. Review Chrome extension documentation
3. Check browser console for errors
4. Verify all integration points

---

**Happy Testing! 🎉** 