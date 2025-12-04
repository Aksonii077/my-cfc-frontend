# 🔧 Quick Extension Test Guide

## 🚀 **Step 1: Reload the Extension**

1. Go to `chrome://extensions/`
2. Find "LinkedIn Connections Fetcher"
3. Click the **🔄 Reload** button
4. The extension should now have the updated code

## 🧪 **Step 2: Test Authentication Sync**

### **Option A: Automatic Sync (Recommended)**
1. Make sure you're logged into your React app (`http://localhost:3000`)
2. Go to any page in your React app (the extension content script will now run there)
3. Open browser console and check for extension messages
4. You should see logs like:
   ```
   🔍 Auto-detecting authentication...
   ✅ Found token in React app localStorage
   ✅ Token synced from React app to extension storage
   ```

### **Option B: Manual Test (If automatic doesn't work)**
1. Open your React app in the browser
2. Open browser console (F12)
3. Copy and paste this code to get your extension ID:
   ```javascript
   // Get extension ID from chrome://extensions/
   // Look for "LinkedIn Connections Fetcher" and copy the ID
   console.log('Extension ID needed for testing');
   ```
4. Copy the test script from `extension/test-token-sync.js`
5. Replace `'your-extension-id-here'` with your actual extension ID
6. Run the script in console:
   ```javascript
   window.testExtensionSync.sendTokenToExtension();
   ```

## 🔍 **Step 3: Verify the Fix**

### **Check Extension Storage**
1. Go to `chrome://extensions/`
2. Find "LinkedIn Connections Fetcher"
3. Click **"Details"**
4. Click **"Extension options"** or **"Inspect views: service worker"**
5. In the console, run:
   ```javascript
   chrome.storage.local.get(['token', 'authToken', 'userInfo'], function(result) {
       console.log('Extension storage:', result);
   });
   ```

### **Check Content Script Logs**
1. Go to your React app page
2. Open browser console
3. Look for extension logs:
   ```
   🔍 Auto-detecting authentication...
   ✅ Found token in React app localStorage
   ✅ Token synced from React app to extension storage
   ```

## 🎯 **Step 4: Test LinkedIn Integration**

1. Go to LinkedIn connections page
2. Click the extension icon
3. You should now see:
   - ✅ **Authenticated user** (instead of "Not authenticated")
   - ✅ **"Connect LinkedIn"** button enabled
   - ✅ **User profile info** displayed

## 🐛 **Troubleshooting**

### **If you still see "No JWT token found":**
1. **Check if you're logged in** to your React app
2. **Verify localStorage** has the token:
   ```javascript
   console.log('Token in localStorage:', localStorage.getItem('token'));
   console.log('User in localStorage:', localStorage.getItem('user'));
   ```
3. **Check extension ID** is correct in test script
4. **Reload the extension** again

### **If extension doesn't respond:**
1. **Check if extension is loaded** in `chrome://extensions/`
2. **Check for errors** in extension's service worker console
3. **Verify manifest.json** has correct permissions

### **If content script doesn't run on React app:**
1. **Check manifest.json** content_scripts matches include your domain
2. **Reload the extension** after any manifest changes
3. **Check browser console** for any errors

## 📝 **Expected Success Logs**

When working correctly, you should see:

```
🔍 Auto-detecting authentication...
🔍 Checking React app localStorage for token...
✅ Found token in React app localStorage
✅ Token synced from React app to extension storage
📦 Extension storage contents: {
  hasAuthToken: false,
  hasToken: true,
  hasUserInfo: true,
  tokenPreview: "eyJhbGciOiJIUzI1NiIs..."
}
✅ Found JWT token in extension storage
```

## 🎉 **Success!**

Once you see the token is properly synced, the extension should work with LinkedIn to fetch your connections and send them to your React app's backend API. 