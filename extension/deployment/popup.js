document.addEventListener('DOMContentLoaded', function() {
    // UI Elements
    const connectButton = document.getElementById('connectButton');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const lastSync = document.getElementById('lastSync');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const syncCounter = document.getElementById('syncCounter');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const loginLink = document.getElementById('loginLink');

    // Check if all required elements are found
    const requiredElements = {
        connectButton,
        statusIndicator,
        statusText,
        lastSync,
        progressFill,
        progressText,
        errorMessage,
        successMessage,
        syncCounter,
        userProfile,
        userAvatar,
        userName,
        userEmail,
        loginLink
    };

    const missingElements = Object.entries(requiredElements)
        .filter(([name, element]) => !element)
        .map(([name]) => name);

    if (missingElements.length > 0) {
        console.error('Missing DOM elements:', missingElements);
        console.error('This might be due to HTML structure changes or loading issues.');
    } else {
        console.log('All DOM elements found successfully');
    }

    let isConnected = false;
    let isSyncing = false;
    let totalConnections = 0;
    let processedConnections = 0;

    // Load saved sync status
    chrome.storage.local.get(['authToken', 'lastSyncTime', 'connectionStatus', 'userInfo'], function(result) {
        // Load sync status
        if (result.lastSyncTime) {
            updateLastSync(result.lastSyncTime);
        }
        
        if (result.connectionStatus) {
            updateConnectionStatus(result.connectionStatus);
        }
        
        // Show user info if available
        if (result.userInfo) {
            showUserInfo(result.userInfo);
        }
    });

    // Try to get JWT token from the main app
    async function tryGetJWTFromApp() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Execute script in the webpage to get token from localStorage
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const token = localStorage.getItem('token');
                    const userData = localStorage.getItem('user');
                    // Try to detect API base from the app
                    const apiBase = localStorage.getItem('VITE_API_BASE_URL') 
                        || (window.__ENV__ && window.__ENV__.VITE_API_BASE_URL)
                        || (window.env && window.env.VITE_API_BASE_URL)
                        || (window.VITE_API_BASE_URL);
                    
                    if (token && userData) {
                        try {
                            const userInfo = JSON.parse(userData);
                            return {
                                token: token,
                                apiBase: apiBase || null,
                                userInfo: {
                                    name: userInfo.name || userInfo.first_name || userInfo.full_name || 'User',
                                    email: userInfo.email || userInfo.email_address || '',
                                    id: userInfo.id || userInfo.user_id || '',
                                    avatar: userInfo.avatar || userInfo.profile_picture || '',
                                    ...userInfo
                                }
                            };
                        } catch (e) {
                            return { token: token, apiBase: apiBase || null, userInfo: { name: 'User', email: '' } };
                        }
                    }
                    return { token: null, apiBase };
                }
            });
            
            if (results && results[0]) {
                const res = results[0].result;
                if (res && res.token) {
                    const { token, userInfo, apiBase } = res;
                    
                    console.log('✅ Found token and user info from React app');
                    console.log('Token:', token.substring(0, 20) + '...');
                    if (apiBase) {
                        console.log('🔧 Detected API base:', apiBase);
                    }
                    
                    // Store in extension storage
                    const storePayload = {
                        authToken: token,
                        userInfo: userInfo,
                        lastAuthCheck: new Date().toISOString()
                    };
                    if (apiBase) {
                        storePayload.apiUrlBase = apiBase;
                        storePayload.apiUrl = `${apiBase.replace(/\/$/, '')}/linkedin/connections`;
                    }
                    await chrome.storage.local.set(storePayload);
                    
                    console.log('✅ Token (and API base if available) stored in extension storage');
                    
                    // Show user info in popup
                    showUserInfo(userInfo);
                    updateConnectionStatus('connected');
                    
                    showSuccessMessage('✅ Token synced from app!');
                } else {
                    console.log('❌ No token found in app localStorage');
                    if (res && res.apiBase) {
                        await chrome.storage.local.set({
                            apiUrlBase: res.apiBase,
                            apiUrl: `${res.apiBase.replace(/\/$/, '')}/linkedin/connections`
                        });
                        console.log('🔧 Stored API base from app:', res.apiBase);
                    }
                    showErrorMessage('Please log into your app first');
                    
                    // Show login button when no token is found
                    if (connectButton) {
                        connectButton.innerHTML = `
                            <svg class="linkedin-icon" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            Login to App
                        `;
                        connectButton.onclick = () => {
                            chrome.tabs.create({ url: 'http://localhost:3000/auth' });
                        };
                    }
                    updateConnectionStatus('disconnected');
                }
            } else {
                console.log('❌ No token found in React app localStorage');
                showErrorMessage('Please log into your React app first');
                
                // Show login button when no token is found
                if (connectButton) {
                    connectButton.innerHTML = `
                        <svg class="linkedin-icon" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Login to App
                    `;
                    connectButton.onclick = () => {
                        chrome.tabs.create({ url: 'http://localhost:3000/auth' });
                    };
                }
                updateConnectionStatus('disconnected');
            }
        } catch (error) {
            console.log('Error getting JWT from app:', error);
            showErrorMessage('Could not access React app. Make sure you are logged in.');
            
            // Show login button when there's an error
            if (connectButton) {
                connectButton.innerHTML = `
                    <svg class="linkedin-icon" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Login to App
                `;
                connectButton.onclick = () => {
                    chrome.tabs.create({ url: 'http://localhost:3000/auth' });
                };
            }
            updateConnectionStatus('disconnected');
        }
    }

    // Try to get JWT when popup opens
    tryGetJWTFromApp();
    
    // Periodically check for authentication (every 5 seconds when popup is open)
    const authCheckInterval = setInterval(async () => {
        const authToken = await getAuthToken();
        if (authToken) {
            // User is authenticated, update UI
            if (connectButton) {
                connectButton.innerHTML = `
                    <svg class="linkedin-icon" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Import Connections
                `;
                connectButton.onclick = startSyncing;
            }
            updateConnectionStatus('connected');
            clearInterval(authCheckInterval);
        }
    }, 5000);
    
    // Clear interval when popup closes
    window.addEventListener('beforeunload', () => {
        clearInterval(authCheckInterval);
    });
    
    // Note: Content script testing removed for fully automated experience
    
    // Note: Manual buttons removed for fully automated experience

    // Sync Button Click Handler
    connectButton.addEventListener('click', async function() {
        if (isSyncing) {
            // Stop syncing
            await stopSyncing();
            return;
        }

        // Start syncing LinkedIn connections
        await startSyncing();
    });

    async function startSyncing() {
        if (isSyncing) {
            console.log('🔄 Sync already in progress, ignoring duplicate request');
            return;
        }
        
        console.log('🚀 Starting LinkedIn sync process...');
        
        try {
            // Get JWT token
            const jwtToken = await getAuthToken();
            if (!jwtToken) {
                showErrorMessage('❌ Authentication failed. Please log in to your app first.');
                return;
            }
            
            console.log('✅ JWT token obtained:', jwtToken.substring(0, 20) + '...');
            
            // Check existing connections first
            let existingCount = 0;
            try {
                existingCount = await checkExistingConnections(jwtToken);
                console.log('📊 Existing connections:', existingCount);
            } catch (error) {
                if (error.message.includes('Authentication expired')) {
                    showErrorMessage('❌ Your session has expired. Redirecting to login...');
                    // Clear user info and reset UI
                    if (userProfile) {
                        userProfile.classList.add('hidden');
                    }
                    updateConnectionStatus('disconnected');
                    
                    // Redirect to React app login page after a short delay
                    setTimeout(() => {
                        chrome.tabs.create({ 
                            url: 'http://localhost:3000/auth' 
                        });
                    }, 2000);
                    return;
                }
                throw error;
            }
            
            // Get current tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('linkedin.com')) {
                showErrorMessage('❌ Please navigate to LinkedIn to sync connections.');
                return;
            }
            
            console.log('✅ LinkedIn tab detected:', tab.url);
            
            // Check if content script is loaded
            const contentScriptStatus = await checkContentScriptLoaded();
            console.log('📋 Content script status:', contentScriptStatus);
            
            if (!contentScriptStatus.loaded) {
                console.log('🔄 Content script not detected. Reloading page to trigger declarative injection...');
                await chrome.tabs.reload(tab.id, { bypassCache: true });
                // Give the page time to reload and scripts to attach
                await new Promise(resolve => setTimeout(resolve, 2000));
                const pingAfterReload = await checkContentScriptLoaded();
                console.log('📋 Ping after reload:', pingAfterReload);
                if (!pingAfterReload.loaded) {
                    showErrorMessage('❌ Failed to load content script. Please refresh the page and try again.');
                    return;
                }
            }
            
            // Set syncing state
            isSyncing = true;
            updateConnectionStatus('syncing');
            
            // Update button to show syncing state and disable it
            if (connectButton) {
                connectButton.disabled = true;
                connectButton.style.opacity = '0.6';
                connectButton.style.cursor = 'not-allowed';
                connectButton.innerHTML = `
                    <div class="spinner"></div>
                    Syncing Connections...
                `;
            }
            
            // Reset progress
            processedConnections = existingCount;
            totalConnections = existingCount;
            updateProgress(0, `Found ${existingCount} existing connections`);
            updateSyncCounter(existingCount, existingCount);
            
            console.log('📤 Sending sync message to content script...');
            
            // Send message to content script to start syncing
            chrome.tabs.sendMessage(tab.id, {
                action: 'startSync',
                jwtToken: jwtToken,
                // Resolve API from storage or fallback to production URL
                apiUrl: await (async () => {
                  const cfg = await chrome.storage.local.get(['apiUrl']);
                  return cfg.apiUrl || 'https://api.cofounder-circle.com/linkedin/connections';
                })(),
                existingCount: existingCount
            }, (response) => {
                console.log('📥 Response from content script:', response);
                
                if (chrome.runtime.lastError) {
                    console.error('❌ Error from content script:', chrome.runtime.lastError);
                    showErrorMessage('❌ Failed to start sync. Please refresh the page and try again.');
                    resetUI();
                } else if (response && response.success) {
                    console.log('✅ Sync started successfully');
                    showSuccessMessage('🔄 Sync started! Processing connections invisibly...');
                } else {
                    console.error('❌ Sync failed to start:', response);
                    showErrorMessage('❌ Failed to start sync. Please try again.');
                    resetUI();
                }
            });
            
        } catch (error) {
            console.error('❌ Error in startSyncing:', error);
            showErrorMessage('❌ An error occurred while starting sync. Please try again.');
            resetUI();
        }
    }

    async function stopSyncing() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        chrome.tabs.sendMessage(tab.id, {
            action: 'stopFetching'
        });

        resetUI();
        updateConnectionStatus('disconnected');
    }

    async function getAuthToken() {
        // Get from extension storage (set by web app)
        return new Promise((resolve) => {
            chrome.storage.local.get(['authToken'], function(result) {
                if (result.authToken) {
                    console.log('Using auth token from extension storage');
                    resolve(result.authToken);
                } else {
                    resolve(null);
                }
            });
        });
    }

    function updateConnectionStatus(status) {
        isConnected = status === 'connected';
        
        // Update indicator with null check
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${status}`;
        }
        
        // Update text with null check
        if (statusText) {
            statusText.className = `status-text ${status}`;
            
            switch (status) {
                case 'connected':
                    statusText.textContent = 'Connected';
                    break;
                case 'disconnected':
                    statusText.textContent = 'Not Connected';
                    break;
                case 'syncing':
                    statusText.textContent = 'Syncing...';
                    break;
            }
        }

        // Save status
        chrome.storage.local.set({ connectionStatus: status });
    }

    function updateLastSync(timestamp) {
        if (!lastSync) return;
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeAgo;
        if (diffMins < 1) {
            timeAgo = 'Just now';
        } else if (diffMins < 60) {
            timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else {
            timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }

        lastSync.textContent = `Last synced: ${timeAgo}`;
    }

    function updateProgress(percent, message) {
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
        }
        if (progressText) {
            progressText.textContent = message || '';
        }
    }

    function updateSyncCounter(current, total) {
        if (syncCounter) {
            if (total > 0) {
                syncCounter.textContent = `${current}/${total} connections synced`;
                syncCounter.style.display = 'block';
            } else {
                syncCounter.style.display = 'none';
            }
        }
    }

    function resetUI() {
        isSyncing = false;
        if (connectButton) {
            connectButton.disabled = false;
            connectButton.style.opacity = '1';
            connectButton.style.cursor = 'pointer';
            connectButton.innerHTML = `
                <svg class="linkedin-icon" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Sync LinkedIn Connections
            `;
            connectButton.onclick = startSyncing;
        }
        updateProgress(0, '');
        updateSyncCounter(0, 0);
    }

    function showErrorMessage(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
        if (successMessage) {
            successMessage.style.display = 'none';
        }
        
        setTimeout(() => {
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    }

    function showSuccessMessage(message) {
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.style.display = 'block';
        }
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
        
        setTimeout(() => {
            if (successMessage) {
                successMessage.style.display = 'none';
            }
        }, 3000);
    }

    function showUserInfo(userInfo) {
        if (userInfo) {
            // Show user profile section
            if (userProfile) {
                userProfile.classList.remove('hidden');
            }
            
            // Update user details
            if (userInfo.name) {
                if (userName) {
                    userName.textContent = userInfo.name;
                }
                // Set avatar initials
                const initials = userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase();
                if (userAvatar) {
                    userAvatar.textContent = initials.substring(0, 2);
                }
            }
            
            if (userInfo.email) {
                if (userEmail) {
                    userEmail.textContent = userInfo.email;
                }
            } else {
                if (userEmail) {
                    userEmail.textContent = 'Email not available';
                }
            }
            
            if (successMessage) {
                showSuccessMessage(`✅ Welcome back, ${userInfo.name || 'User'}!`);
            }
            updateConnectionStatus('connected');
        } else {
            // Hide user profile section if no user info
            if (userProfile) {
                userProfile.classList.add('hidden');
            }
        }
    }

    // Listen for storage changes (when user logs out from React app)
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local') {
            if (changes.authToken && !changes.authToken.newValue) {
                // User logged out
                console.log('User logged out from React app');
                showErrorMessage('❌ You have been logged out. Redirecting to login...');
                if (userProfile) {
                    userProfile.classList.add('hidden');
                }
                updateConnectionStatus('disconnected');
                resetUI();
                
                // Redirect to React app login page after a short delay
                setTimeout(() => {
                    chrome.tabs.create({ 
                        url: 'http://localhost:3000/auth' 
                    });
                }, 2000);
            } else if (changes.authToken && changes.authToken.newValue) {
                // User logged in
                console.log('User logged in to React app');
                showUserInfo(changes.userInfo?.newValue);
                updateConnectionStatus('connected');
            }
        }
    });

    // Listen for messages from content script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.type === 'status') {
            if (request.status === 'success') {
                showSuccessMessage(request.message);
            } else if (request.status === 'error') {
                showErrorMessage(request.message);
            }
        } else if (request.type === 'progress') {
            // Parse progress from message (e.g., "Processed 5 connections")
            const match = request.message.match(/Processed (\d+) connections/);
            if (match) {
                processedConnections = parseInt(match[1]);
                if (totalConnections === 0) {
                    // Estimate total based on current page
                    totalConnections = Math.max(processedConnections, 20);
                }
                const percent = Math.round((processedConnections / totalConnections) * 100);
                updateProgress(percent, request.message);
                updateSyncCounter(processedConnections, totalConnections);
            } else {
                updateProgress(0, request.message);
            }
        } else if (request.type === 'complete') {
            const timestamp = new Date().toISOString();
            chrome.storage.local.set({ lastSyncTime: timestamp });
            updateLastSync(timestamp);
            updateConnectionStatus('connected');
            updateProgress(100, 'Sync completed!');
            showSuccessMessage(request.message);
            resetUI();
        } else if (request.type === 'error') {
            showErrorMessage(request.message);
            updateConnectionStatus('disconnected');
            resetUI();
        } else if (request.type === 'authDetected') {
            // Handle automatic authentication detection
            showUserInfo(request.user);
        }
    });

    // Check if content script is loaded on current tab
    async function checkContentScriptLoaded() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('linkedin.com')) {
                return { loaded: false, reason: 'not_linkedin' };
            }
            
            // Try to ping the content script
            return new Promise((resolve) => {
                chrome.tabs.sendMessage(tab.id, { action: 'ping' }, (response) => {
                    if (chrome.runtime.lastError) {
                        resolve({ loaded: false, reason: 'not_loaded' });
                    } else {
                        resolve({ loaded: true, response });
                    }
                });
            });
        } catch (error) {
            return { loaded: false, reason: 'error', error: error.message };
        }
    }

    // Check existing connections count from backend
    async function checkExistingConnections(jwtToken) {
        try {
            const cfg = await chrome.storage.local.get(['apiUrl']);
            const base = cfg.apiUrl || 'https://api.cofounder-circle.com/linkedin/connections';
            const response = await fetch(`${base}?all=true`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.length || 0;
            } else if (response.status === 401) {
                console.log('JWT token expired or invalid');
                // Clear the expired token
                chrome.storage.local.remove(['authToken', 'userInfo']);
                throw new Error('Authentication expired. Please log in again.');
            } else {
                console.log('Failed to fetch existing connections:', response.status);
                return 0;
            }
        } catch (error) {
            console.log('Error checking existing connections:', error);
            if (error.message.includes('Authentication expired')) {
                throw error; // Re-throw to handle in calling function
            }
            return 0;
        }
    }

    // Update popup content based on content script status
    async function updatePopupStatus() {
        const status = await checkContentScriptLoaded();
        
        if (!status.loaded) {
            if (status.reason === 'not_linkedin') {
                if (connectButton) {
                    connectButton.innerHTML = `
                        <svg class="linkedin-icon" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Go to LinkedIn
                    `;
                    connectButton.onclick = () => {
                        chrome.tabs.create({ url: 'https://www.linkedin.com/mynetwork/invite-connect/connections/' });
                    };
                }
                if (statusText) {
                    statusText.textContent = 'Navigate to LinkedIn';
                }
                showErrorMessage('Please navigate to LinkedIn to use this extension');
            } else if (status.reason === 'not_loaded') {
                if (connectButton) {
                    connectButton.innerHTML = `
                        <svg class="linkedin-icon" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Refresh Page
                    `;
                    connectButton.onclick = () => {
                        chrome.tabs.reload();
                    };
                }
                if (statusText) {
                    statusText.textContent = 'Extension Not Loaded';
                }
                showErrorMessage('Extension not loaded on this page. Please refresh the page.');
            }
        } else {
            // Content script is loaded, restore normal functionality
            if (connectButton) {
                connectButton.innerHTML = `
                    <svg class="linkedin-icon" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    Connect LinkedIn
                `;
                connectButton.onclick = startSyncing;
            }
            if (statusText) {
                statusText.textContent = 'Ready to Sync';
            }
        }
    }

    // Check content script status when popup opens
    updatePopupStatus();
}); 