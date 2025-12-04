// Script to check extension storage
// Run this in the browser console to see what's stored in the extension

console.log('🔍 Checking Extension Storage...');

// Function to check extension storage
async function checkExtensionStorage() {
    try {
        // Get all stored data from extension
        const result = await chrome.storage.local.get(null);
        
        console.log('📦 All Extension Storage Data:');
        console.log(result);
        
        // Check specific keys
        const tokenData = await chrome.storage.local.get([
            'authToken', 
            'token', 
            'userInfo', 
            'userProfile',
            'lastAuthCheck',
            'lastSync',
            'tokenSource'
        ]);
        
        console.log('\n🔑 Token-related Data:');
        console.log('authToken:', tokenData.authToken ? 'Present' : 'Missing');
        console.log('token:', tokenData.token ? 'Present' : 'Missing');
        console.log('userInfo:', tokenData.userInfo ? 'Present' : 'Missing');
        console.log('userProfile:', tokenData.userProfile ? 'Present' : 'Missing');
        console.log('lastAuthCheck:', tokenData.lastAuthCheck);
        console.log('lastSync:', tokenData.lastSync);
        console.log('tokenSource:', tokenData.tokenSource);
        
        // Show token previews
        if (tokenData.authToken) {
            console.log('authToken preview:', tokenData.authToken.substring(0, 50) + '...');
        }
        if (tokenData.token) {
            console.log('token preview:', tokenData.token.substring(0, 50) + '...');
        }
        
        // Check if any token exists
        const hasAnyToken = tokenData.authToken || tokenData.token;
        console.log('\n✅ Has any token:', hasAnyToken ? 'YES' : 'NO');
        
        return tokenData;
        
    } catch (error) {
        console.error('❌ Error checking extension storage:', error);
        return null;
    }
}

// Function to clear extension storage (for testing)
async function clearExtensionStorage() {
    try {
        await chrome.storage.local.clear();
        console.log('🗑️ Extension storage cleared');
    } catch (error) {
        console.error('❌ Error clearing extension storage:', error);
    }
}

// Function to manually set a test token
async function setTestToken() {
    try {
        const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        
        await chrome.storage.local.set({
            token: testToken,
            userInfo: { name: 'Test User', email: 'test@example.com' },
            lastAuthCheck: new Date().toISOString()
        });
        
        console.log('✅ Test token set in extension storage');
    } catch (error) {
        console.error('❌ Error setting test token:', error);
    }
}

// Export functions for use in console
window.extensionStorage = {
    check: checkExtensionStorage,
    clear: clearExtensionStorage,
    setTestToken: setTestToken
};

console.log('✅ Extension storage functions loaded!');
console.log('📝 Available functions:');
console.log('  - window.extensionStorage.check()');
console.log('  - window.extensionStorage.clear()');
console.log('  - window.extensionStorage.setTestToken()');

// Auto-run check
checkExtensionStorage(); 