// Debug script to check React app localStorage and sync to extension
// Run this in your React app's browser console

console.log('🔍 Debugging React App Storage and Extension Sync...');

// Function to check React app localStorage
function checkReactAppStorage() {
    console.log('📦 React App localStorage contents:');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('user_id');
    
    console.log('🔑 token:', token ? 'Present' : 'Missing');
    console.log('👤 user:', user ? 'Present' : 'Missing');
    console.log('🎭 userRole:', userRole);
    console.log('🆔 user_id:', userId);
    
    if (token) {
        console.log('🔑 Token preview:', token.substring(0, 50) + '...');
    }
    
    if (user) {
        try {
            const userData = JSON.parse(user);
            console.log('👤 User data:', userData);
        } catch (error) {
            console.log('❌ Error parsing user data:', error);
        }
    }
    
    return { token, user, userRole, userId };
}

// Function to get extension ID (you need to replace this)
function getExtensionId() {
    // You need to get this from chrome://extensions/
    // Look for "LinkedIn Connections Fetcher" and copy the ID
    const extensionId = 'your-extension-id-here'; // REPLACE THIS!
    
    console.log('⚠️ Please replace the extension ID in this script!');
    console.log('📝 Go to chrome://extensions/ and copy the ID for "LinkedIn Connections Fetcher"');
    
    return extensionId;
}

// Function to manually sync token to extension
async function syncTokenToExtension() {
    const extensionId = getExtensionId();
    const reactData = checkReactAppStorage();
    
    if (!reactData.token) {
        console.log('❌ No token found in React app localStorage');
        console.log('💡 Make sure you are logged into your React app');
        return;
    }
    
    console.log('📤 Manually syncing token to extension...');
    
    try {
        // Parse user data
        let userData = null;
        if (reactData.user) {
            try {
                userData = JSON.parse(reactData.user);
            } catch (error) {
                console.log('❌ Error parsing user data:', error);
                userData = { name: 'Unknown User', email: 'unknown@example.com' };
            }
        }
        
        // Send to extension
        const response = await window.chrome.runtime.sendMessage(extensionId, {
            type: 'SEND_PROFILE_DATA',
            profile: userData,
            token: reactData.token
        });
        
        console.log('📥 Extension response:', response);
        
        if (response && response.success) {
            console.log('✅ Token successfully synced to extension!');
        } else {
            console.log('❌ Failed to sync token:', response?.message);
        }
        
    } catch (error) {
        console.log('❌ Error syncing token:', error);
        console.log('💡 Make sure:');
        console.log('   1. Extension is installed and loaded');
        console.log('   2. Extension ID is correct');
        console.log('   3. You are on the correct domain');
    }
}

// Function to check if extension is available
async function checkExtensionAvailability() {
    const extensionId = getExtensionId();
    
    console.log('🔍 Checking if extension is available...');
    
    try {
        const response = await window.chrome.runtime.sendMessage(extensionId, {
            action: 'ping'
        });
        
        console.log('📥 Extension ping response:', response);
        
        if (response && response.status === 'ok') {
            console.log('✅ Extension is available and responding');
            return true;
        } else {
            console.log('❌ Extension is not responding properly');
            return false;
        }
        
    } catch (error) {
        console.log('❌ Extension is not available:', error);
        console.log('💡 Make sure the extension is installed and loaded');
        return false;
    }
}

// Function to check extension storage after sync
async function checkExtensionStorageAfterSync() {
    const extensionId = getExtensionId();
    
    console.log('🔍 Checking extension storage after sync...');
    
    try {
        const response = await window.chrome.runtime.sendMessage(extensionId, {
            type: 'CHECK_TOKEN_STATUS'
        });
        
        console.log('📥 Extension storage status:', response);
        
        if (response && response.success) {
            if (response.hasToken) {
                console.log('✅ Extension has token stored');
            } else {
                console.log('❌ Extension has no token stored');
            }
        } else {
            console.log('❌ Failed to check extension storage:', response?.message);
        }
        
    } catch (error) {
        console.log('❌ Error checking extension storage:', error);
    }
}

// Function to run complete debug process
async function runCompleteDebug() {
    console.log('🚀 Running complete debug process...');
    
    // Step 1: Check React app storage
    console.log('\n📋 Step 1: Checking React app storage');
    const reactData = checkReactAppStorage();
    
    // Step 2: Check extension availability
    console.log('\n📋 Step 2: Checking extension availability');
    const extensionAvailable = await checkExtensionAvailability();
    
    if (!extensionAvailable) {
        console.log('❌ Extension not available, stopping debug');
        return;
    }
    
    // Step 3: Sync token to extension
    console.log('\n📋 Step 3: Syncing token to extension');
    await syncTokenToExtension();
    
    // Step 4: Check extension storage
    console.log('\n📋 Step 4: Checking extension storage');
    await checkExtensionStorageAfterSync();
    
    console.log('\n✅ Debug process completed!');
}

// Export functions for use in console
window.debugExtensionSync = {
    checkReactAppStorage,
    syncTokenToExtension,
    checkExtensionAvailability,
    checkExtensionStorageAfterSync,
    runCompleteDebug
};

console.log('✅ Debug functions loaded!');
console.log('📝 Available functions:');
console.log('  - window.debugExtensionSync.checkReactAppStorage()');
console.log('  - window.debugExtensionSync.syncTokenToExtension()');
console.log('  - window.debugExtensionSync.checkExtensionAvailability()');
console.log('  - window.debugExtensionSync.checkExtensionStorageAfterSync()');
console.log('  - window.debugExtensionSync.runCompleteDebug()');

console.log('\n⚠️ IMPORTANT: You need to update the extension ID in this script!');
console.log('📝 Go to chrome://extensions/ and copy the ID for "LinkedIn Connections Fetcher"');
console.log('📝 Then replace "your-extension-id-here" in the getExtensionId() function');

// Auto-run React app storage check
checkReactAppStorage(); 