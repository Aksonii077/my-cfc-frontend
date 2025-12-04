// Script to find your extension ID and update the React app
// Run this in your React app's browser console

console.log('🔍 Finding Extension ID...');

// Function to get all installed extensions
async function getAllExtensions() {
    try {
        // This will only work if you have the chrome.management permission
        // For now, we'll use a different approach
        console.log('📝 To find your extension ID:');
        console.log('1. Go to chrome://extensions/');
        console.log('2. Find "LinkedIn Connections Fetcher"');
        console.log('3. Copy the ID (it looks like: abcdefghijklmnopqrstuvwxyz123456)');
        console.log('4. Update the EXTENSION_ID in your React app');
        
        return null;
    } catch (error) {
        console.log('❌ Cannot access extension management API');
        return null;
    }
}

// Function to test different extension IDs
async function testExtensionIds() {
    console.log('🧪 Testing common extension ID patterns...');
    
    // Common extension ID patterns (you can add more)
    const testIds = [
        'biogiaicoajalbbphmlpbfcgnlniofci', // Current ID in React app
        'abcdefghijklmnopqrstuvwxyz123456', // Example pattern
        // Add your actual extension ID here
    ];
    
    for (const id of testIds) {
        try {
            console.log(`🔍 Testing extension ID: ${id}`);
            
            const response = await window.chrome.runtime.sendMessage(id, {
                action: 'ping'
            });
            
            if (response && response.status === 'ok') {
                console.log(`✅ Found working extension ID: ${id}`);
                console.log('📝 Update your React app with this ID!');
                return id;
            } else {
                console.log(`❌ Extension ID ${id} not responding`);
            }
        } catch (error) {
            console.log(`❌ Extension ID ${id} not found or not responding`);
        }
    }
    
    console.log('❌ No working extension ID found');
    console.log('💡 Make sure the extension is installed and loaded');
    return null;
}

// Function to update React app with correct extension ID
function updateReactAppExtensionId(correctId) {
    console.log('📝 To update your React app with the correct extension ID:');
    console.log('1. Open src/components/contacts/LinkedInContacts.tsx');
    console.log('2. Find this line:');
    console.log('   const EXTENSION_ID = \'biogiaicoajalbbphmlpbfcgnlniofci\';');
    console.log('3. Replace it with:');
    console.log(`   const EXTENSION_ID = '${correctId}';`);
    console.log('4. Save the file and reload your React app');
}

// Function to manually sync with correct extension ID
async function syncWithCorrectId(extensionId) {
    console.log(`📤 Syncing with extension ID: ${extensionId}`);
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
        console.log('❌ No token found in localStorage');
        return;
    }
    
    let userData = null;
    if (user) {
        try {
            userData = JSON.parse(user);
        } catch (error) {
            console.log('❌ Error parsing user data:', error);
            return;
        }
    }
    
    try {
        const response = await window.chrome.runtime.sendMessage(extensionId, {
            type: 'SEND_PROFILE_DATA',
            profile: userData,
            token: token
        });
        
        console.log('📥 Extension response:', response);
        
        if (response && response.success) {
            console.log('✅ Token successfully synced!');
            console.log('📝 Remember to update your React app with this extension ID');
        } else {
            console.log('❌ Failed to sync token:', response?.message);
        }
        
    } catch (error) {
        console.log('❌ Error syncing with extension:', error);
    }
}

// Export functions for use in console
window.extensionIdFinder = {
    getAllExtensions,
    testExtensionIds,
    updateReactAppExtensionId,
    syncWithCorrectId
};

console.log('✅ Extension ID finder functions loaded!');
console.log('📝 Available functions:');
console.log('  - window.extensionIdFinder.getAllExtensions()');
console.log('  - window.extensionIdFinder.testExtensionIds()');
console.log('  - window.extensionIdFinder.updateReactAppExtensionId(id)');
console.log('  - window.extensionIdFinder.syncWithCorrectId(id)');

// Auto-run extension ID test
testExtensionIds(); 