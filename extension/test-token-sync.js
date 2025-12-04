// Test script to manually sync JWT token from React app to extension
// Run this in your React app's browser console

console.log('🧪 Testing JWT token sync to extension...');

// Get the extension ID (you'll need to replace this with your actual extension ID)
const EXTENSION_ID = 'your-extension-id-here'; // Replace with actual extension ID

// Function to get current user data from React app
function getCurrentUserData() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
        console.log('❌ No token found in localStorage');
        return null;
    }
    
    let userData = null;
    try {
        userData = user ? JSON.parse(user) : null;
    } catch (error) {
        console.log('❌ Error parsing user data:', error);
    }
    
    return { token, userData };
}

// Function to send token to extension
async function sendTokenToExtension() {
    const userData = getCurrentUserData();
    
    if (!userData) {
        console.log('❌ No user data available');
        return;
    }
    
    console.log('📤 Sending token to extension...');
    console.log('🔑 Token:', userData.token ? 'Present' : 'Missing');
    console.log('👤 User:', userData.userData);
    
    try {
        const response = await window.chrome.runtime.sendMessage(EXTENSION_ID, {
            type: 'SEND_PROFILE_DATA',
            profile: userData.userData,
            token: userData.token
        });
        
        console.log('📥 Extension response:', response);
        
        if (response && response.success) {
            console.log('✅ Token successfully sent to extension!');
        } else {
            console.log('❌ Failed to send token to extension:', response?.message);
        }
    } catch (error) {
        console.log('❌ Error sending token to extension:', error);
        console.log('💡 Make sure the extension is installed and loaded');
    }
}

// Function to check extension token status
async function checkExtensionTokenStatus() {
    console.log('🔍 Checking extension token status...');
    
    try {
        const response = await window.chrome.runtime.sendMessage(EXTENSION_ID, {
            type: 'CHECK_TOKEN_STATUS'
        });
        
        console.log('📥 Extension token status:', response);
        
        if (response && response.success) {
            if (response.hasToken) {
                console.log('✅ Extension has a valid token');
            } else {
                console.log('❌ Extension has no token');
            }
        } else {
            console.log('❌ Failed to check extension token status:', response?.message);
        }
    } catch (error) {
        console.log('❌ Error checking extension token status:', error);
        console.log('💡 Make sure the extension is installed and loaded');
    }
}

// Function to ping extension
async function pingExtension() {
    console.log('🏓 Pinging extension...');
    
    try {
        const response = await window.chrome.runtime.sendMessage(EXTENSION_ID, {
            action: 'ping'
        });
        
        console.log('📥 Extension ping response:', response);
        
        if (response && response.status === 'ok') {
            console.log('✅ Extension is responding');
        } else {
            console.log('❌ Extension is not responding properly');
        }
    } catch (error) {
        console.log('❌ Error pinging extension:', error);
        console.log('💡 Make sure the extension is installed and loaded');
    }
}

// Export functions for use in console
window.testExtensionSync = {
    sendTokenToExtension,
    checkExtensionTokenStatus,
    pingExtension,
    getCurrentUserData
};

console.log('✅ Test functions loaded!');
console.log('📝 Available functions:');
console.log('  - window.testExtensionSync.sendTokenToExtension()');
console.log('  - window.testExtensionSync.checkExtensionTokenStatus()');
console.log('  - window.testExtensionSync.pingExtension()');
console.log('  - window.testExtensionSync.getCurrentUserData()');

// Auto-run ping test
pingExtension(); 