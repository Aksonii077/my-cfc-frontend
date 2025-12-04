// Test script for Chrome Extension Integration
// Run this in your React app's browser console to test the integration

console.log('🧪 Testing Chrome Extension Integration...');

// Test 1: Check if extension is installed
function testExtensionInstallation() {
    console.log('\n📦 Test 1: Extension Installation');
    
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        console.log('✅ Chrome extension API available');
        
        // Try to communicate with our extension
        chrome.runtime.sendMessage({ action: 'ping' }, (response) => {
            if (chrome.runtime.lastError) {
                console.log('❌ Extension not found or not responding');
                console.log('💡 Make sure to:');
                console.log('   1. Load the extension in chrome://extensions/');
                console.log('   2. Enable Developer mode');
                console.log('   3. Click "Load unpacked" and select the extension folder');
            } else {
                console.log('✅ Extension is installed and responding');
            }
        });
    } else {
        console.log('❌ Chrome extension API not available');
    }
}

// Test 2: Check token storage in extension
function testTokenStorage() {
    console.log('\n🔐 Test 2: Token Storage in Extension');
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['authToken', 'userInfo', 'lastAuthCheck'], (result) => {
            if (result.authToken) {
                console.log('✅ JWT token found in extension storage');
                console.log('Token:', result.authToken.substring(0, 20) + '...');
                console.log('User info:', result.userInfo);
                console.log('Last auth check:', result.lastAuthCheck);
            } else {
                console.log('❌ No JWT token in extension storage');
                console.log('💡 Make sure you are logged into the React app');
                console.log('💡 The React app should automatically sync the token');
            }
        });
    } else {
        console.log('❌ Chrome storage API not available');
    }
}

// Test 3: Check API communication
function testAPICommunication() {
    console.log('\n🌐 Test 3: API Communication');
    
    const testConnection = {
        first_name: 'Test',
        last_name: 'User',
        url: 'https://linkedin.com/in/testuser',
        email_address: 'test@example.com',
        company: 'Test Company',
        position: 'Test Position',
        connected_on: new Date().toISOString()
    };
    
    // Test sending to your API
    fetch(`${import.meta.env.VITE_API_BASE_URL}/linkedin/connections`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(testConnection)
    })
    .then(response => {
        if (response.ok) {
            console.log('✅ API endpoint is working');
        } else {
            console.log('❌ API endpoint returned error:', response.status);
        }
    })
    .catch(error => {
        console.log('❌ API communication failed:', error.message);
    });
}

// Test 4: Check LinkedIn page detection
function testLinkedInDetection() {
    console.log('\n🔗 Test 4: LinkedIn Page Detection');
    
    const isLinkedIn = window.location.hostname.includes('linkedin.com');
    console.log('Current page:', window.location.href);
    console.log('Is LinkedIn:', isLinkedIn ? '✅ Yes' : '❌ No');
    
    if (isLinkedIn) {
        console.log('✅ Extension should be active on this page');
    } else {
        console.log('💡 Navigate to LinkedIn to test connection fetching');
    }
}

// Test 5: Check extension storage
function testExtensionStorage() {
    console.log('\n💾 Test 5: Extension Storage');
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['authToken', 'userInfo', 'lastAuthCheck'], (result) => {
            console.log('Extension storage contents:', result);
            
            if (result.authToken) {
                console.log('✅ Auth token found in extension storage');
            } else {
                console.log('❌ No auth token in extension storage');
            }
            
            if (result.userInfo) {
                console.log('✅ User info found in extension storage');
            } else {
                console.log('❌ No user info in extension storage');
            }
        });
    } else {
        console.log('❌ Chrome storage API not available');
    }
}

// Test 6: Simulate extension communication
function testExtensionCommunication() {
    console.log('\n📡 Test 6: Extension Communication');
    
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Test sending a message to the extension
        chrome.runtime.sendMessage({
            action: 'checkAuthStatus'
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.log('❌ Communication failed:', chrome.runtime.lastError.message);
            } else if (response) {
                console.log('✅ Extension responded:', response);
            } else {
                console.log('❌ Extension did not respond');
            }
        });
    }
}

// Test 7: Test token sync from React app
function testTokenSync() {
    console.log('\n🔄 Test 7: Token Sync from React App');
    
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('❌ No token found in React app localStorage');
        console.log('💡 Please log into the React app first');
        return;
    }
    
    console.log('✅ Token found in React app:', token.substring(0, 20) + '...');
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
        // Simulate storing token in extension storage
        chrome.storage.local.set({
            authToken: token,
            userInfo: JSON.parse(localStorage.getItem('user') || '{}'),
            lastAuthCheck: new Date().toISOString()
        }, () => {
            console.log('✅ Token stored in extension storage');
            
            // Verify it was stored
            chrome.storage.local.get(['authToken'], (result) => {
                if (result.authToken === token) {
                    console.log('✅ Token sync verified successfully');
                } else {
                    console.log('❌ Token sync verification failed');
                }
            });
        });
    } else {
        console.log('❌ Chrome storage API not available');
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting Chrome Extension Integration Tests...\n');
    
    testExtensionInstallation();
    
    setTimeout(() => {
        testTokenStorage();
    }, 1000);
    
    setTimeout(() => {
        testAPICommunication();
    }, 2000);
    
    setTimeout(() => {
        testLinkedInDetection();
    }, 3000);
    
    setTimeout(() => {
        testExtensionStorage();
    }, 4000);
    
    setTimeout(() => {
        testExtensionCommunication();
    }, 5000);
    
    setTimeout(() => {
        testTokenSync();
    }, 6000);
    
    setTimeout(() => {
        console.log('\n🎉 All tests completed!');
        console.log('\n📋 Summary:');
        console.log('- Check the results above for any ❌ errors');
        console.log('- If extension is not found, load it in chrome://extensions/');
        console.log('- If API fails, check your backend server');
        console.log('- If auth fails, make sure you\'re logged into the app');
        console.log('- If token sync fails, check the React app integration');
    }, 7000);
}

// Export functions for manual testing
window.testExtensionIntegration = {
    runAllTests,
    testExtensionInstallation,
    testTokenStorage,
    testAPICommunication,
    testLinkedInDetection,
    testExtensionStorage,
    testExtensionCommunication,
    testTokenSync
};

// Auto-run tests if this script is loaded
if (typeof window !== 'undefined') {
    console.log('🔧 Extension test script loaded. Run testExtensionIntegration.runAllTests() to test.');
}

export {
    runAllTests,
    testExtensionInstallation,
    testTokenStorage,
    testAPICommunication,
    testLinkedInDetection,
    testExtensionStorage,
    testExtensionCommunication,
    testTokenSync
}; 