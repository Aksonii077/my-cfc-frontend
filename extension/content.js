// Wrap in IIFE to avoid global scope pollution and allow early returns
(function() {
    // Check if content script is already loaded to prevent duplicate execution
    if (window.linkedInExtensionLoaded) {
        console.log('LinkedIn extension already loaded, skipping...');
        return; // Exit early to prevent duplicate execution
    } else {
        window.linkedInExtensionLoaded = true;
    
    // Use window object to avoid variable conflicts
    window.linkedInExtension = {
        isFetching: false,
        shouldStop: false
    };

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log('🔔 Content script received message:', request);
        console.log('📨 Message action:', request.action);
        
        try {
            if (request.action === 'startSync') {
                console.log('🚀 Starting sync process...');
                startFetching(request.jwtToken, request.apiUrl, request.existingCount)
                    .then(() => {
                        console.log('✅ Sync process started successfully');
                        sendResponse({ success: true, message: 'Sync started' });
                    })
                    .catch((error) => {
                        console.error('❌ Error starting sync:', error);
                        sendResponse({ success: false, error: error.message });
                    });
                return true; // Keep message channel open for async response
            } else if (request.action === 'startFetching') {
                console.log('🚀 Starting fetch process...');
                startFetching(request.jwtToken, request.apiUrl)
                    .then(() => {
                        console.log('✅ Fetch process started successfully');
                        sendResponse({ success: true, message: 'Fetching started' });
                    })
                    .catch((error) => {
                        console.error('❌ Error starting fetch:', error);
                        sendResponse({ success: false, error: error.message });
                    });
                return true; // Keep message channel open for async response
    } else if (request.action === 'stopFetching') {
                console.log('🛑 Stopping fetch process...');
                window.linkedInExtension.shouldStop = true;
                sendResponse({ success: true, message: 'Fetching stopped' });
    } else if (request.action === 'getJWTFromApp') {
                console.log('🔍 Getting JWT from extension storage...');
                // Get JWT from extension storage (set by React app)
                getJWTFromExtensionStorage().then(token => {
                    console.log('✅ JWT retrieved:', token ? 'Found' : 'Not found');
            sendResponse({ token: token });
                }).catch(error => {
                    console.error('❌ Error getting JWT:', error);
                    sendResponse({ token: null, error: error.message });
        });
        return true; // Keep message channel open for async response
    } else if (request.type === 'SEND_PROFILE_DATA') {
                console.log('📤 Received profile data from React app');
                console.log('👤 Profile data:', request.profile);
                console.log('🔑 Token:', request.token ? 'Present' : 'Missing');
                
                // Store the token and profile data
                chrome.storage.local.set({
                    token: request.token,
                    userInfo: request.profile,
                    lastAuthCheck: new Date().toISOString()
                }).then(() => {
                    console.log('✅ Token and profile data stored in extension');
                    sendResponse({ success: true, message: 'Token and profile stored successfully' });
                }).catch(error => {
                    console.error('❌ Error storing token:', error);
                    sendResponse({ success: false, error: error.message });
                });
                return true; // Keep message channel open for async response
    } else if (request.type === 'CHECK_TOKEN_STATUS') {
                console.log('🔍 Checking token status from React app');
                getJWTFromExtensionStorage().then(token => {
                    const hasToken = !!token;
                    console.log('✅ Token status:', hasToken ? 'Valid' : 'Missing');
                    sendResponse({ 
                        success: true, 
                        hasToken: hasToken,
                        message: hasToken ? 'Token found' : 'No token found'
                    });
                }).catch(error => {
                    console.error('❌ Error checking token status:', error);
                    sendResponse({ success: false, error: error.message });
                });
                return true; // Keep message channel open for async response
    } else if (request.action === 'checkAuthStatus') {
                console.log('🔍 Checking auth status...');
                // Check authentication status from extension storage
        checkAuthStatus().then(status => {
                    console.log('✅ Auth status:', status);
            sendResponse(status);
                }).catch(error => {
                    console.error('❌ Error checking auth status:', error);
                    sendResponse({ isAuthenticated: false, error: error.message });
                });
                return true; // Keep message channel open for async response
            } else if (request.action === 'ping') {
                console.log('🏓 Ping received, responding...');
                // Simple ping to check if extension is available
                sendResponse({ status: 'ok', timestamp: new Date().toISOString() });
            } else {
                console.log('❓ Unknown action:', request.action);
                sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('❌ Error in message handler:', error);
            sendResponse({ success: false, error: error.message });
        }
    });

    // Function to get JWT token from extension storage
    async function getJWTFromExtensionStorage() {
        try {
            console.log('🔍 Checking extension storage for JWT token...');
            const result = await chrome.storage.local.get(['authToken', 'token', 'userInfo', 'lastAuthCheck']);
            
            console.log('📦 Extension storage contents:', {
                hasAuthToken: !!result.authToken,
                hasToken: !!result.token,
                hasUserInfo: !!result.userInfo,
                lastAuthCheck: result.lastAuthCheck,
                authTokenPreview: result.authToken ? result.authToken.substring(0, 20) + '...' : 'Not found',
                tokenPreview: result.token ? result.token.substring(0, 20) + '...' : 'Not found'
            });
            
            // Check for token in multiple possible keys
            const token = result.authToken || result.token;
            
            if (token) {
                console.log('✅ Found JWT token in extension storage');
                return token;
            }
            
            console.log('❌ No JWT token found in extension storage');
            console.log('💡 Make sure you are logged into the React app and the extension is connected');
        return null;
    } catch (error) {
            console.log('❌ Error accessing extension storage:', error);
        return null;
    }
}

// Function to check authentication status
async function checkAuthStatus() {
    try {
            const token = await getJWTFromExtensionStorage();
            const userInfo = await getUserInfoFromStorage();
        
        return {
            isAuthenticated: !!token,
            token: token,
            user: userInfo,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.log('Error checking auth status:', error);
        return {
            isAuthenticated: false,
            error: error.message
        };
    }
}

    // Function to get user info from extension storage
    async function getUserInfoFromStorage() {
        try {
            const result = await chrome.storage.local.get(['userInfo']);
            return result.userInfo || null;
    } catch (error) {
            console.log('Error getting user info from storage:', error);
        return null;
    }
}

// Function to get the best available auth token
async function getAuthToken(providedToken) {
    // First, try the provided token
    if (providedToken) {
        return providedToken;
    }
    
        // Then get from extension storage (set by React app)
        const extensionToken = await getJWTFromExtensionStorage();
        if (extensionToken) {
                console.log('Using auth token from extension storage');
        return extensionToken;
    }
    
        console.log('No auth token available');
    return null;
}

// Auto-detect authentication when page loads
async function autoDetectAuth() {
    console.log('🔍 Auto-detecting authentication...');
    
    // First check extension storage
    const authStatus = await checkAuthStatus();
    
    if (authStatus.isAuthenticated) {
        console.log('✅ Auto-detected authenticated user from extension storage:', authStatus.user);
        
        // Notify popup about authentication
        chrome.runtime.sendMessage({
            type: 'authDetected',
            user: authStatus.user,
            token: authStatus.token
        });
        
        return true;
    }
    
    // If not found in extension storage, try to get from React app's localStorage
    console.log('🔍 Checking React app localStorage for token...');
    try {
        // This will only work if the content script is running on the same domain as your React app
        const reactAppToken = localStorage.getItem('token');
        const reactAppUser = localStorage.getItem('user');
        
        if (reactAppToken) {
            console.log('✅ Found token in React app localStorage');
            
            // Store in extension storage
            const userData = reactAppUser ? JSON.parse(reactAppUser) : null;
            await chrome.storage.local.set({
                token: reactAppToken,
                userInfo: userData,
                lastAuthCheck: new Date().toISOString()
            });
            
            console.log('✅ Token synced from React app to extension storage');
            
            // Notify popup about authentication
            chrome.runtime.sendMessage({
                type: 'authDetected',
                user: userData,
                token: reactAppToken
            });
            
            return true;
        } else {
            console.log('❌ No token found in React app localStorage');
        }
    } catch (error) {
        console.log('❌ Error accessing React app localStorage:', error);
    }
    
    return false;
}

// Run auto-detection when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoDetectAuth);
} else {
    autoDetectAuth();
}

    // Listen for storage changes (when React app updates the token)
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local' && changes.authToken) {
            console.log('Auth token updated in extension storage');
        autoDetectAuth();
    }
});

    async function startFetching(jwtToken, apiUrl, existingCount = 0) {
        if (window.linkedInExtension.isFetching) return;
    
        window.linkedInExtension.isFetching = true;
        window.linkedInExtension.shouldStop = false;
    
    try {
        // Get the best available auth token
        const authToken = await getAuthToken(jwtToken);
        
        if (!authToken) {
                throw new Error('No authentication token available. Please log into your web app first and ensure the extension is connected.');
            }
            
            console.log('Starting LinkedIn connection syncing with token:', authToken.substring(0, 20) + '...');
            console.log('Existing connections count:', existingCount);
            
            // Navigate to LinkedIn connections page if not already there
            if (!window.location.href.includes('linkedin.com/mynetwork/invite-connect/connections/')) {
            window.location.href = 'https://www.linkedin.com/mynetwork/invite-connect/connections/';
            return;
        }

            sendStatus('Starting to sync LinkedIn connections...', 'syncing');
            sendProgress(`Found ${existingCount} existing connections`);
            
            // Wait for the connections page to load
            await waitForElement('.mn-connections__header', 10000);
            
            // Start loading all connections
            await loadAllConnections(authToken, apiUrl, existingCount);
            
            sendStatus('All connections fetched successfully!', 'connected');
            
        } catch (error) {
            console.error('Error during fetching:', error);
            sendStatus(`Error: ${error.message}`, 'disconnected');
        } finally {
            window.linkedInExtension.isFetching = false;
        }
    }

    function extractConnectionData(element) {
        try {
            // Try multiple selectors for name extraction
            let nameElement = element.querySelector('.mn-connection-card__name');
            if (!nameElement) {
                nameElement = element.querySelector('[data-control-name="connection_profile"]');
            }
            if (!nameElement) {
                nameElement = element.querySelector('a[href*="/in/"] span');
            }
            if (!nameElement) {
                nameElement = element.querySelector('.entity-result__title-text');
            }
            
            if (!nameElement) {
                console.log('No name element found for connection');
                return null;
            }
            
            const fullName = nameElement.textContent.trim();
            if (!fullName) {
                console.log('Empty name found for connection');
                return null;
            }
            
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
            // Extract profile URL with multiple selectors
            let profileLink = element.querySelector('a[href*="/in/"]');
            if (!profileLink) {
                profileLink = element.querySelector('[data-control-name="connection_profile"]');
            }
        const profileUrl = profileLink ? 'https://www.linkedin.com' + profileLink.getAttribute('href') : '';
        
            // Extract company and position with multiple selectors
            let companyElement = element.querySelector('.mn-connection-card__occupation');
            if (!companyElement) {
                companyElement = element.querySelector('.entity-result__primary-subtitle');
            }
            if (!companyElement) {
                companyElement = element.querySelector('[data-control-name="connection_occupation"]');
            }
            
        let company = '';
        let position = '';
        
        if (companyElement) {
            const occupationText = companyElement.textContent.trim();
            const parts = occupationText.split(' at ');
            if (parts.length >= 2) {
                position = parts[0].trim();
                company = parts[1].trim();
            } else {
                position = occupationText;
            }
        }
        
        // Extract email (if available in hover card)
        let email = '';
        try {
            const emailElement = element.querySelector('[data-control-name="hovercard_email"]');
            if (emailElement) {
                email = emailElement.textContent.trim();
            }
        } catch (e) {
            // Email not available
        }
        
        // Get connection date (approximate)
        const connectedOn = new Date().toISOString();
        
            const connectionData = {
            first_name: firstName,
            last_name: lastName,
            url: profileUrl,
            email_address: email,
            company: company,
            position: position,
            connected_on: connectedOn
        };
        
            console.log(`✅ Extracted connection: ${firstName} ${lastName} - ${position} at ${company}`);
            return connectionData;
        
    } catch (error) {
        console.error('Error extracting connection data:', error);
        return null;
    }
}

    async function loadAllConnections(authToken, apiUrl, existingCount = 0) {
    let previousHeight = 0;
    let attempts = 0;
    const maxAttempts = 10;
        let totalProcessed = existingCount; // Start with existing count
        let totalFound = 0;
        let batchSize = 300; // Process 300 connections at a time
        let currentBatch = [];
        
        console.log('Starting to load all connections in batches...');
        console.log('Starting with existing connections:', existingCount);
        
        // Create a completely invisible scrolling mechanism
        const originalScrollTo = window.scrollTo;
        const originalScrollY = window.scrollY;
        const originalScrollBy = window.scrollBy;
        const originalScrollIntoView = Element.prototype.scrollIntoView;
        
        // Override all scroll methods to make them completely invisible
        window.scrollTo = function(x, y) {
            // Do nothing - completely invisible scrolling
            return;
        };
        
        window.scrollBy = function(x, y) {
            // Do nothing - completely invisible scrolling
            return;
        };
        
        Element.prototype.scrollIntoView = function(options) {
            // Do nothing - completely invisible scrolling
            return;
        };
        
        // Clear any existing processed markers to ensure we process all connections
        const existingProcessedElements = document.querySelectorAll('[data-processed="true"]');
        existingProcessedElements.forEach(element => {
            delete element.dataset.processed;
        });
        console.log(`🧹 Cleared ${existingProcessedElements.length} existing processed markers`);
        
        // Function to scroll invisibly using a different approach
        async function scrollInvisibly() {
            const currentScrollY = window.scrollY;
            const targetScrollY = document.body.scrollHeight;
            
            // Use the original scrollTo function for actual scrolling
            originalScrollTo.call(window, 0, targetScrollY);
            
            // Wait for content to load (reduced from 2000ms to 800ms for speed)
            await sleep(800);
            
            // Return to original position
            originalScrollTo.call(window, 0, currentScrollY);
        }
        
        while (attempts < maxAttempts && !window.linkedInExtension.shouldStop) {
            // Scroll invisibly to load more connections
            await scrollInvisibly();
            
            // Extract all visible connections
            const connectionElements = document.querySelectorAll('.mn-connection-card');
            totalFound = connectionElements.length;
            console.log(`Found ${connectionElements.length} connection elements`);
            
            // Process each connection
            let skippedAlreadyProcessed = 0;
            let skippedNoData = 0;
            let processedSuccessfully = 0;
            
            for (let i = 0; i < connectionElements.length; i++) {
                if (window.linkedInExtension.shouldStop) break;
                
                const element = connectionElements[i];
                
                // Skip if already processed (add a data attribute to track)
                if (element.dataset.processed === 'true') {
                    skippedAlreadyProcessed++;
                    continue;
                }
                
                try {
                    const connectionData = extractConnectionData(element);
                    if (connectionData) {
                        // Add to current batch
                        currentBatch.push(connectionData);
                        
                        // Mark as processed
                        element.dataset.processed = 'true';
                        processedSuccessfully++;
                        
                        // If batch is full, send it
                        if (currentBatch.length >= batchSize) {
                            console.log(`Sending batch of ${currentBatch.length} connections...`);
                            sendProgress(`Syncing batch ${Math.floor((totalProcessed - existingCount) / batchSize) + 1} (${currentBatch.length} connections)`);
                            
                            const batchResult = await sendBatchToAPI(currentBatch, authToken, apiUrl);
                            
                            if (batchResult) {
                                totalProcessed += currentBatch.length;
                                console.log(`Successfully processed batch: ${totalProcessed} total connections`);
                                sendProgress(`${totalProcessed} connections synced`);
                            } else {
                                console.log('Failed to save batch to API, but continuing...');
                            }
                            
                            // Clear batch
                            currentBatch = [];
                            
                            // Small delay between batches (reduced from 500ms to 200ms for speed)
                            await sleep(200);
                        }
                    } else {
                        skippedNoData++;
                        console.log(`Skipped connection ${i + 1}: No data extracted`);
                    }
                } catch (error) {
                    console.error('Error processing connection:', error);
                    skippedNoData++;
                }
            }
            
            // Log detailed statistics
            console.log(`📊 Processing Statistics:`);
            console.log(`   - Total elements found: ${connectionElements.length}`);
            console.log(`   - Already processed: ${skippedAlreadyProcessed}`);
            console.log(`   - No data extracted: ${skippedNoData}`);
            console.log(`   - Successfully processed: ${processedSuccessfully}`);
            console.log(`   - Current batch size: ${currentBatch.length}`);
        
        const currentHeight = document.body.scrollHeight;
        
        if (currentHeight === previousHeight) {
            attempts++;
                console.log(`No new content loaded, attempt ${attempts}/${maxAttempts}`);
        } else {
            attempts = 0;
            previousHeight = currentHeight;
                console.log('New content loaded, continuing...');
            }
        }
        
        // Send remaining connections in the last batch
        if (currentBatch.length > 0) {
            console.log(`Sending final batch of ${currentBatch.length} connections...`);
            sendProgress(`Syncing final batch (${currentBatch.length} connections)`);
            
            const batchResult = await sendBatchToAPI(currentBatch, authToken, apiUrl);
            
            if (batchResult) {
                totalProcessed += currentBatch.length;
                console.log(`Successfully processed final batch: ${totalProcessed} total connections`);
            }
        }
        
        // Restore original scroll functions
        window.scrollTo = originalScrollTo;
        window.scrollBy = originalScrollBy;
        Element.prototype.scrollIntoView = originalScrollIntoView;
        
        console.log(`📊 Final Processing Summary:`);
        console.log(`   - Total connections found: ${totalFound}`);
        console.log(`   - Total connections processed: ${totalProcessed}`);
        console.log(`   - Success rate: ${Math.round((totalProcessed / totalFound) * 100)}%`);
        
        if (totalProcessed < totalFound) {
            console.log(`⚠️  ${totalFound - totalProcessed} connections were not processed. This could be due to:`);
            console.log(`   - Duplicate connection cards in the DOM`);
            console.log(`   - Connection cards without proper name elements`);
            console.log(`   - LinkedIn's dynamic loading causing element changes`);
        }
        
        sendStatus(`Successfully synced ${totalProcessed} LinkedIn connections`, 'connected');
        
        // Send completion message
        chrome.runtime.sendMessage({
            type: 'complete',
            message: `Successfully synced ${totalProcessed} LinkedIn connections to your backend!`
        });
    }

    async function sendBatchToAPI(connectionsBatch, jwtToken, apiUrl) {
        try {
            // Send batch to background script to avoid CORS issues
            console.log(`Sending batch of ${connectionsBatch.length} connections to background script for API call`);
            console.log('Using JWT token:', jwtToken ? jwtToken.substring(0, 20) + '...' : 'No token');
            
            const response = await new Promise((resolve, reject) => {
                console.log('📤 Content script sending batch message to background script...');
                console.log('📤 Batch payload:', {
                    action: 'sendBatchToAPI',
                    connectionsBatch: connectionsBatch,
                    batchSize: connectionsBatch.length,
                    jwtToken: jwtToken ? 'Present' : 'Missing',
                    apiUrl: apiUrl || `${import.meta.env.VITE_API_BASE_URL}/linkedin/connections`
                });
                
                chrome.runtime.sendMessage({
                    action: 'sendBatchToAPI',
                    connectionsBatch: connectionsBatch,
                    jwtToken: jwtToken,
                    apiUrl: apiUrl || `${import.meta.env.VITE_API_BASE_URL}/linkedin/connections`
                }, function(response) {
                    console.log('📥 Content script received batch response from background script:', response);
                    console.log('📥 Chrome runtime error:', chrome.runtime.lastError);
                    
                    if (chrome.runtime.lastError) {
                        console.error('❌ Chrome runtime error:', chrome.runtime.lastError);
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        console.log('✅ Batch response received successfully:', response);
                        resolve(response);
                    }
                });
            });
            
            console.log('Batch API Response:', response);
            
            if (response.success) {
                console.log(`Batch of ${connectionsBatch.length} connections saved successfully:`, response.data);
                return response.data;
            } else {
                console.error('Batch API Error:', response.error);
                throw new Error(response.error);
            }
            
        } catch (error) {
            console.error('Error sending batch to API:', error);
            console.error('Full batch error details:', {
                message: error.message,
                stack: error.stack,
                batchSize: connectionsBatch.length,
                endpoint: apiUrl || `${import.meta.env.VITE_API_BASE_URL}/linkedin/connections`
            });
            // Don't throw here, just log the error and continue with other batches
            // This prevents one bad batch from stopping the entire process
            return null;
        }
    }

    async function sendToAPI(connectionData, jwtToken, apiUrl) {
        try {
            // Send to background script to avoid CORS issues
            console.log('Sending connection to background script for API call');
            console.log('Connection data:', connectionData);
            console.log('Using JWT token:', jwtToken ? jwtToken.substring(0, 20) + '...' : 'No token');
            
            const response = await new Promise((resolve, reject) => {
                console.log('📤 Content script sending message to background script...');
                console.log('📤 Message payload:', {
                    action: 'sendToAPI',
                    connectionData: connectionData,
                    jwtToken: jwtToken ? 'Present' : 'Missing',
                    apiUrl: apiUrl || `${import.meta.env.VITE_API_BASE_URL}/linkedin/connections`
                });
                
                chrome.runtime.sendMessage({
                    action: 'sendToAPI',
                    connectionData: connectionData,
                    jwtToken: jwtToken,
                    apiUrl: apiUrl || `${import.meta.env.VITE_API_BASE_URL}/linkedin/connections`
                }, function(response) {
                    console.log('📥 Content script received response from background script:', response);
                    console.log('📥 Chrome runtime error:', chrome.runtime.lastError);
                    
                    if (chrome.runtime.lastError) {
                        console.error('❌ Chrome runtime error:', chrome.runtime.lastError);
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        console.log('✅ Response received successfully:', response);
                        resolve(response);
                    }
                });
            });
            
            console.log('API Response:', response);
            
            if (response.success) {
                console.log('Connection saved successfully:', response.data);
                return response.data;
            } else {
                console.error('API Error:', response.error);
                throw new Error(response.error);
            }
        
    } catch (error) {
        console.error('Error sending to API:', error);
            console.error('Full error details:', {
                message: error.message,
                stack: error.stack,
                connectionData: connectionData,
                endpoint: apiUrl || `${import.meta.env.VITE_API_BASE_URL}/linkedin/connections`
            });
            // Don't throw here, just log the error and continue with other connections
            // This prevents one bad connection from stopping the entire process
            return null;
    }
}

function sendStatus(message, status) {
    chrome.runtime.sendMessage({
        type: 'status',
        message: message,
        status: status
    });
}

function sendProgress(message) {
    chrome.runtime.sendMessage({
        type: 'progress',
        message: message
    });
}

function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 

    console.log('✅ LinkedIn extension content script loaded successfully');
    console.log('🔍 Content script debug info:');
    console.log('  - Page URL:', window.location.href);
    console.log('  - Chrome API available:', typeof chrome !== 'undefined');
    console.log('  - Chrome runtime available:', typeof chrome?.runtime !== 'undefined');
    console.log('  - Message listener attached:', true);
    
    // Send a message to background script to confirm loading
    try {
        chrome.runtime.sendMessage({
            type: 'contentScriptLoaded',
            url: window.location.href,
            timestamp: new Date().toISOString()
        });
        console.log('✅ Content script loaded notification sent');
    } catch (error) {
        console.log('❌ Failed to send loaded notification:', error);
    }
    } // Close the else block
})(); // Close the IIFE 