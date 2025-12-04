// Debug script for testing externally_connectable messaging
// Paste this into your React app console to test extension communication

console.log('🔧 DEBUG: Testing externally_connectable messaging...');

// Extension ID - replace with your actual extension ID
const EXTENSION_ID = 'biogiaicoajalbbphmlpbfcgnlniofci'; // TODO: Replace with actual extension ID from chrome://extensions/

// Test 1: Check if Chrome runtime API is available
console.log('Test 1: Chrome runtime API available:', typeof window !== 'undefined' && !!window.chrome?.runtime?.sendMessage);

// Test 2: Get token and user data from localStorage
const token = localStorage.getItem('token');
const userData = localStorage.getItem('user');

console.log('Test 2: Token available:', !!token);
console.log('Test 3: User data available:', !!userData);

if (token && userData) {
  let userInfo = {};
  try {
    userInfo = JSON.parse(userData);
  } catch (e) {
    console.log('❌ Failed to parse user data');
  }
  
  const userProfile = {
    name: userInfo.name || userInfo.first_name || userInfo.full_name || 'User',
    email: userInfo.email || userInfo.email_address || '',
    id: userInfo.id || userInfo.user_id || '',
    avatar: userInfo.avatar || userInfo.profile_picture || '',
    ...userInfo
  };
  
  console.log('Test 4: User profile prepared:', userProfile);
  
  // Test 3: Send profile data to extension
  if (typeof window !== 'undefined' && window.chrome?.runtime?.sendMessage) {
    console.log('Test 5: Sending profile data to extension...');
    
    window.chrome.runtime.sendMessage(EXTENSION_ID, {
      type: 'SEND_PROFILE_DATA',
      profile: userProfile,
      token: token
    }).then(response => {
      console.log('✅ Extension response:', response);
      if (response && response.success) {
        console.log('🎉 Profile data sent successfully!');
      } else {
        console.log('❌ Failed to send profile data:', response?.message);
      }
    }).catch(error => {
      console.log('❌ Error sending to extension:', error);
    });
  } else {
    console.log('❌ Chrome runtime API not available');
  }
  
  // Test 4: Check token status
  if (typeof window !== 'undefined' && window.chrome?.runtime?.sendMessage) {
    console.log('Test 6: Checking token status...');
    
    window.chrome.runtime.sendMessage(EXTENSION_ID, {
      type: 'CHECK_TOKEN_STATUS'
    }).then(response => {
      console.log('✅ Token status response:', response);
      if (response && response.success) {
        console.log('🎉 Extension has token:', response.hasToken);
        console.log('🎉 Extension has profile:', response.hasProfile);
        console.log('🎉 Last sync:', response.lastSync);
      } else {
        console.log('❌ Failed to check token status:', response?.message);
      }
    }).catch(error => {
      console.log('❌ Error checking token status:', error);
    });
  }
} else {
  console.log('❌ No token or user data available for testing');
}

// Helper function to manually send profile data
window.sendProfileToExtension = async () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (!token || !userData) {
    console.log('❌ No token or user data available');
    return;
  }
  
  let userInfo = {};
  try {
    userInfo = JSON.parse(userData);
  } catch (e) {
    console.log('❌ Failed to parse user data');
    return;
  }
  
  const userProfile = {
    name: userInfo.name || userInfo.first_name || userInfo.full_name || 'User',
    email: userInfo.email || userInfo.email_address || '',
    id: userInfo.id || userInfo.user_id || '',
    avatar: userInfo.avatar || userInfo.profile_picture || '',
    ...userInfo
  };
  
  if (typeof window !== 'undefined' && window.chrome?.runtime?.sendMessage) {
    try {
      const response = await window.chrome.runtime.sendMessage(EXTENSION_ID, {
        type: 'SEND_PROFILE_DATA',
        profile: userProfile,
        token: token
      });
      
      console.log('✅ Manual send response:', response);
      return response;
    } catch (error) {
      console.log('❌ Manual send error:', error);
      return null;
    }
  } else {
    console.log('❌ Chrome runtime API not available');
    return null;
  }
};

console.log('🔧 DEBUG: Use window.sendProfileToExtension() to manually send profile data'); 