// Comprehensive debug script to check authentication status
// Run this in your React app's browser console

console.log('🔍 Debugging Authentication Status...');

// Function to check all localStorage contents
function checkAllLocalStorage() {
    console.log('📦 All localStorage contents:');
    
    const allKeys = Object.keys(localStorage);
    console.log('Total keys:', allKeys.length);
    
    allKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value ? 'Present' : 'Missing');
        
        // Show preview for token-related keys
        if (key.includes('token') || key.includes('auth') || key.includes('user')) {
            if (value) {
                console.log(`  Preview: ${value.substring(0, 50)}...`);
            }
        }
    });
    
    return allKeys;
}

// Function to check specific authentication keys
function checkAuthKeys() {
    console.log('\n🔑 Checking authentication keys:');
    
    const authKeys = [
        'token',
        'authToken',
        'jwt_token',
        'access_token',
        'user',
        'userInfo',
        'userProfile',
        'userRole',
        'user_id',
        'auth',
        'session'
    ];
    
    const foundKeys = {};
    
    authKeys.forEach(key => {
        const value = localStorage.getItem(key);
        foundKeys[key] = value;
        
        if (value) {
            console.log(`✅ ${key}: Present`);
            if (key.includes('token') || key.includes('auth')) {
                console.log(`   Preview: ${value.substring(0, 50)}...`);
            } else if (key === 'user') {
                try {
                    const userData = JSON.parse(value);
                    console.log(`   User data:`, userData);
                } catch (error) {
                    console.log(`   Raw value: ${value}`);
                }
            }
        } else {
            console.log(`❌ ${key}: Missing`);
        }
    });
    
    return foundKeys;
}

// Function to check if user is logged in
function checkLoginStatus() {
    console.log('\n👤 Checking login status:');
    
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        console.log('✅ User appears to be logged in');
        console.log('🔑 Token found:', token.substring(0, 50) + '...');
        
        try {
            const userData = JSON.parse(user);
            console.log('👤 User data:', userData);
            return { isLoggedIn: true, token, userData };
        } catch (error) {
            console.log('❌ Error parsing user data:', error);
            return { isLoggedIn: true, token, userData: null };
        }
    } else {
        console.log('❌ User appears to be logged out');
        console.log('🔑 Token:', token ? 'Present' : 'Missing');
        console.log('👤 User data:', user ? 'Present' : 'Missing');
        return { isLoggedIn: false, token, userData: null };
    }
}

// Function to check sessionStorage
function checkSessionStorage() {
    console.log('\n📋 Checking sessionStorage:');
    
    const sessionKeys = Object.keys(sessionStorage);
    console.log('Session keys:', sessionKeys);
    
    sessionKeys.forEach(key => {
        const value = sessionStorage.getItem(key);
        if (key.includes('token') || key.includes('auth') || key.includes('user')) {
            console.log(`${key}:`, value ? 'Present' : 'Missing');
            if (value) {
                console.log(`  Preview: ${value.substring(0, 50)}...`);
            }
        }
    });
}

// Function to check cookies
function checkCookies() {
    console.log('\n🍪 Checking cookies:');
    
    const cookies = document.cookie.split(';');
    console.log('All cookies:', cookies);
    
    const authCookies = cookies.filter(cookie => 
        cookie.includes('token') || 
        cookie.includes('auth') || 
        cookie.includes('session')
    );
    
    if (authCookies.length > 0) {
        console.log('🔑 Auth-related cookies:');
        authCookies.forEach(cookie => {
            console.log('  ', cookie.trim());
        });
    } else {
        console.log('❌ No auth-related cookies found');
    }
}

// Function to check current URL and domain
function checkCurrentPage() {
    console.log('\n🌐 Checking current page:');
    console.log('URL:', window.location.href);
    console.log('Domain:', window.location.hostname);
    console.log('Path:', window.location.pathname);
    console.log('Protocol:', window.location.protocol);
}

// Function to simulate login (for testing)
function simulateLogin() {
    console.log('\n🧪 Simulating login...');
    
    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    const testUser = {
        id: "123",
        name: "Test User",
        email: "test@example.com",
        role: "user"
    };
    
    localStorage.setItem('token', testToken);
    localStorage.setItem('user', JSON.stringify(testUser));
    
    console.log('✅ Test login data stored');
    console.log('🔑 Test token:', testToken);
    console.log('👤 Test user:', testUser);
}

// Function to clear all auth data
function clearAuthData() {
    console.log('\n🗑️ Clearing all auth data...');
    
    const keysToRemove = [
        'token',
        'authToken',
        'jwt_token',
        'access_token',
        'user',
        'userInfo',
        'userProfile',
        'userRole',
        'user_id',
        'auth',
        'session'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
    });
    
    console.log('✅ All auth data cleared');
}

// Function to run complete debug
function runCompleteDebug() {
    console.log('🚀 Running complete authentication debug...');
    
    checkCurrentPage();
    checkAllLocalStorage();
    checkAuthKeys();
    checkSessionStorage();
    checkCookies();
    
    const loginStatus = checkLoginStatus();
    
    console.log('\n📊 Summary:');
    console.log('Login status:', loginStatus.isLoggedIn ? 'Logged In' : 'Logged Out');
    console.log('Token available:', loginStatus.token ? 'Yes' : 'No');
    console.log('User data available:', loginStatus.userData ? 'Yes' : 'No');
    
    return loginStatus;
}

// Export functions for use in console
window.authDebug = {
    checkAllLocalStorage,
    checkAuthKeys,
    checkLoginStatus,
    checkSessionStorage,
    checkCookies,
    checkCurrentPage,
    simulateLogin,
    clearAuthData,
    runCompleteDebug
};

console.log('✅ Authentication debug functions loaded!');
console.log('📝 Available functions:');
console.log('  - window.authDebug.checkAllLocalStorage()');
console.log('  - window.authDebug.checkAuthKeys()');
console.log('  - window.authDebug.checkLoginStatus()');
console.log('  - window.authDebug.checkSessionStorage()');
console.log('  - window.authDebug.checkCookies()');
console.log('  - window.authDebug.checkCurrentPage()');
console.log('  - window.authDebug.simulateLogin()');
console.log('  - window.authDebug.clearAuthData()');
console.log('  - window.authDebug.runCompleteDebug()');

// Auto-run complete debug
runCompleteDebug(); 