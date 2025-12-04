// Wrap in IIFE to avoid global scope pollution and allow early returns
(function() {
    console.log('🔧 CoFounder Circle CRM content script loading...');
    
    // Check if content script is already loaded to prevent duplicate execution
    if (window.linkedInExtensionLoaded) {
        console.log('LinkedIn extension already loaded, skipping...');
        return; // Exit early to prevent duplicate execution
    } else {
        window.linkedInExtensionLoaded = true;
        console.log('✅ CoFounder Circle CRM content script loaded successfully');
    
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

    // Function to get JWT token from extension storage and extract user_id
    async function getJWTFromExtensionStorage() {
        try {
            console.log('🔍 Checking extension storage for JWT token...');
            
            // Get from extension storage (where popup.js stores it)
            const result = await chrome.storage.local.get(['authToken', 'userInfo', 'user_id', 'lastAuthCheck']);
            
            if (result.authToken) {
                console.log('✅ Found JWT token in extension storage');
                console.log('📦 Token preview:', result.authToken.substring(0, 20) + '...');
                
                // Extract user_id from JWT token if not already stored
                let user_id = result.user_id;
                if (!user_id) {
                    user_id = extractUserIdFromToken(result.authToken);
                    console.log('👤 Extracted user_id:', user_id);
                    
                    // Store user_id for future use
                    await chrome.storage.local.set({ user_id: user_id });
                } else {
                    console.log('👤 Using stored user_id:', user_id);
                }
                
                return { 
                    token: result.authToken, 
                    user_id: user_id,
                    userInfo: result.userInfo 
                };
            }
            
            console.log('❌ No JWT token found in extension storage');
            console.log('💡 Make sure you are logged into the network-navigator app');
            return null;
        } catch (error) {
            console.log('❌ Error accessing extension storage:', error);
            return null;
        }
    }
    
    // Function to extract user_id from JWT token
    function extractUserIdFromToken(token) {
        try {
            // JWT tokens have 3 parts separated by dots
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.log('❌ Invalid JWT token format');
                return null;
            }
            
            // Decode the payload (second part)
            const payload = JSON.parse(atob(parts[1]));
            console.log('🔍 JWT payload:', payload);
            
            // Look for user_id in common fields
            const user_id = payload.user_id || payload.userId || payload.id || payload.sub;
            
            if (user_id) {
                console.log('✅ Found user_id in JWT:', user_id);
                return user_id;
            } else {
                console.log('❌ No user_id found in JWT payload');
                return null;
            }
        } catch (error) {
            console.log('❌ Error extracting user_id from token:', error);
            return null;
        }
    }

// Function to check authentication status
async function checkAuthStatus() {
    try {
            const authData = await getJWTFromExtensionStorage();
            const userInfo = await getUserInfoFromStorage();
        
        return {
            isAuthenticated: !!authData?.token,
            token: authData?.token,
            user_id: authData?.user_id,
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

// Function to get the best available auth token and user_id
async function getAuthToken(providedToken) {
    // First, try the provided token
    if (providedToken) {
        return { token: providedToken, user_id: extractUserIdFromToken(providedToken) };
    }
    
        // Then get from extension storage (set by React app)
        const authData = await getJWTFromExtensionStorage();
        if (authData?.token) {
                console.log('Using auth token from extension storage');
        return authData;
    }
    
        console.log('No auth token available');
    return null;
}

// Auto-detect authentication when page loads
async function autoDetectAuth() {
    const authStatus = await checkAuthStatus();
    
    if (authStatus.isAuthenticated) {
        console.log('Auto-detected authenticated user:', authStatus.user);
        
        // Notify popup about authentication
        chrome.runtime.sendMessage({
            type: 'authDetected',
            user: authStatus.user,
            token: authStatus.token
        });
        
        return true;
    }
    
    return false;
}

// Run auto-detection when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoDetectAuth);
} else {
    autoDetectAuth();
}

    // If running inside an iframe/preload, skip heavy logic
    if (window.top !== window) {
        console.log('Skipping scraping in iframe/preload frame');
        return;
    }

    // Listen for storage changes (when React app updates the token)
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local' && changes.authToken) {
            console.log('Auth token updated in extension storage');
        autoDetectAuth();
    }
});

    // If we were redirected here to start syncing, resume automatically
    chrome.storage.local.get(['pendingSync']).then(data => {
        if (data.pendingSync && window.location.href.includes('linkedin.com/mynetwork/invite-connect/connections/')) {
            const { jwtToken, apiUrl, existingCount } = data.pendingSync || {};
            console.log('Resuming pending sync after navigation...');
            chrome.storage.local.remove(['pendingSync']);
            startFetching(jwtToken, apiUrl, existingCount || 0);
        }
    }).catch(() => {});

    async function startFetching(jwtToken, apiUrl, existingCount = 0) {
        if (window.linkedInExtension.isFetching) return;
    
        window.linkedInExtension.isFetching = true;
        window.linkedInExtension.shouldStop = false;
    
    try {
        // Get the best available auth token and user_id
        const authData = await getAuthToken(jwtToken);
        
        if (!authData?.token) {
                throw new Error('No authentication token available. Please log into your network-navigator app first and ensure the extension is connected.');
            }
            
            console.log('Starting LinkedIn connection syncing with token:', authData.token.substring(0, 20) + '...');
            console.log('User ID:', authData.user_id);
            console.log('Existing connections count:', existingCount);
            
            // Navigate to LinkedIn connections page if not already there
            if (!window.location.href.includes('linkedin.com/mynetwork/invite-connect/connections/')) {
                try {
                    await chrome.storage.local.set({
                        pendingSync: {
                            jwtToken: authData.token,
                            apiUrl: apiUrl || null,
                            existingCount: existingCount
                        }
                    });
                } catch (e) {
                    console.log('Failed to set pendingSync flag:', e);
                }
                window.location.href = 'https://www.linkedin.com/mynetwork/invite-connect/connections/';
                return;
            }

            sendStatus('Starting to sync LinkedIn connections...', 'syncing');
            sendProgress(`Found ${existingCount} existing connections`);
            
            // Wait for the connections page to load (broadened selectors)
            try {
                await waitForAnyElement(['.mn-connections__header', LINKEDIN_SELECTORS.listContainer, LINKEDIN_SELECTORS.profileLink, '.mn-connection-card', '[data-control-name="connection_profile"]', '.entity-result__item'], 30000);
            } catch (e) {
                console.log('Proceeding without explicit ready element due to timeout');
            }
            
            // Immediate pass: process all currently visible connections first
            try {
                const visibleNodes = getConnectionElements();
                console.log(`Immediate pass: found ${visibleNodes.length} visible profiles`);
                if (visibleNodes.length > 0) {
                    const immediateBatch = [];
                    for (const el of visibleNodes) {
                        const data = extractConnectionData(el);
                        if (data) immediateBatch.push(data);
                    }
                    if (immediateBatch.length > 0) {
                        // Chunk into smaller batches of 50
                        const chunkSize = 50;
                        for (let i = 0; i < immediateBatch.length; i += chunkSize) {
                            const chunk = immediateBatch.slice(i, i + chunkSize);
                            console.log(`Sending immediate chunk of ${chunk.length}`);
                            await sendBatchToAPI(chunk, authData, apiUrl);
                        }
                        sendProgress(`${immediateBatch.length} visible connections queued`);
                    }
                }
            } catch (e) {
                console.log('Immediate pass failed:', e?.message || e);
            }
            
            // Start loading all connections
            await loadAllConnections(authData, apiUrl, existingCount);
            
            sendStatus('All connections fetched successfully!', 'connected');
            
        } catch (error) {
            console.error('Error during fetching:', error);
            sendStatus(`Error: ${error.message}`, 'disconnected');
        } finally {
            window.linkedInExtension.isFetching = false;
        }
    }

    // LinkedIn DOM selectors (user-provided; obfuscated classes may change)
    const LINKEDIN_SELECTORS = {
        listContainer: '[componentkey="ConnectionsPage_ConnectionsList"], ._05784dcd.a124af40._29d6f1be.c70af73b._9cb0f4e9.aa8df04a',
        profileLink: 'a._9404f4da._217ba59f._513d63ea._9361bb42._7825f339, a[href*="/in/"]',
        name: '._3856ee8f.bc0ac90d, .mn-connection-card__name, .entity-result__title-text',
        title: '._35ebfb84.dd1b120c._2d7dc520.fbaa9b89.bed0ac90._30811e94._295d584d._5254c79c.ab9d5006._209ad457._5d2c10c2._44bcf664._843ceebb._3ebb4b45._275629df, .mn-connection-card__occupation, .entity-result__primary-subtitle',
        connectedOn: '._35ebfb84.dd1b120c.ab9d5006._209ad457._5d2c10c2._44bcf664._843ceebb._1e7288d5._275629df',
        loadMoreBtn: 'button._2c50373a._53286099.f6bcc63b._240bdd67._3856ee8f._44bcf664.f96b49f4.e6d1d2d2.cdd9254c.aed27b35._51af2bf8.cbd991cd.c04c5435.a124af40'
    };

    function extractConnectionData(element) {
        try {
            // Try provided class-based selectors first, then fallbacks
            let nameElement = element.querySelector(LINKEDIN_SELECTORS.name)
                || element.querySelector('[data-control-name="connection_profile"]')
                || element.querySelector('a[href*="/in/"] span');
            
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
            
            // Extract profile URL
            let profileLink = element.querySelector(LINKEDIN_SELECTORS.profileLink)
                || element.querySelector('[data-control-name="connection_profile"]')
                || element.querySelector('a[href*="/in/"]');
            const profileUrl = profileLink ? (profileLink.href || ('https://www.linkedin.com' + profileLink.getAttribute('href'))) : '';
            
            // Extract company and position
            let companyElement = element.querySelector(LINKEDIN_SELECTORS.title)
                || element.querySelector('.mn-connection-card__occupation')
                || element.querySelector('.entity-result__primary-subtitle')
                || element.querySelector('[data-control-name="connection_occupation"]');
            
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
            let connectedOn = new Date().toISOString();
            const connectedEl = element.querySelector(LINKEDIN_SELECTORS.connectedOn);
            if (connectedEl) {
                const txt = connectedEl.textContent.trim();
                if (txt) connectedOn = txt;
            }
            
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
        
        // Detect the main scroll container for LinkedIn connections
        const scrollContainer = getScrollContainer();
        console.log('Using scroll container:', scrollContainer && (scrollContainer.className || scrollContainer.tagName));
        
        const hasScrollTo = typeof scrollContainer.scrollTo === 'function';
        const originalContainerScrollTop = scrollContainer.scrollTop;
        
        // Clear any existing processed markers to ensure we process all connections
        const existingProcessedElements = document.querySelectorAll('[data-processed="true"]');
        existingProcessedElements.forEach(element => {
            delete element.dataset.processed;
        });
        console.log(`🧹 Cleared ${existingProcessedElements.length} existing processed markers`);
        
        // Function to scroll the container to bottom and back
        async function scrollInvisibly() {
            const currentTop = scrollContainer.scrollTop;
            const targetTop = scrollContainer.scrollHeight;
            if (hasScrollTo) {
                scrollContainer.scrollTo(0, targetTop);
            } else {
                scrollContainer.scrollTop = targetTop;
            }
            await sleep(800);
            if (hasScrollTo) {
                scrollContainer.scrollTo(0, currentTop);
            } else {
                scrollContainer.scrollTop = currentTop;
            }
        }
        
        while (attempts < maxAttempts && !window.linkedInExtension.shouldStop) {
            // Scroll invisibly to load more connections
            await scrollInvisibly();
            tryClickLoadMore();
            
            // Extract all visible connections
            const connectionElements = getConnectionElements();
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
                        // console.log(`Skipped connection ${i + 1}: No data extracted`);
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
            
            const currentHeight = scrollContainer.scrollHeight;
            
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
        
        // Restore original position
        if (hasScrollTo) {
            scrollContainer.scrollTo(0, originalContainerScrollTop);
        } else {
            scrollContainer.scrollTop = originalContainerScrollTop;
        }
        
        console.log(`📊 Final Processing Summary:`);
        console.log(`   - Total connections found: ${totalFound}`);
        console.log(`   - Total connections processed: ${totalProcessed}`);
        console.log(`   - Success rate: ${Math.round((totalProcessed / Math.max(1,totalFound)) * 100)}%`);
        
        sendStatus(`Successfully synced ${totalProcessed} LinkedIn connections`, 'connected');
        
        // Send completion message
        chrome.runtime.sendMessage({
            type: 'complete',
            message: `Successfully synced ${totalProcessed} LinkedIn connections to your backend!`
        });
    }
    
    // Helper: pick the best scroll container for LinkedIn connections
    function getScrollContainer() {
        return document.querySelector('.scaffold-finite-scroll__content')
            || document.querySelector('.scaffold-finite-scroll')
            || document.querySelector('main')
            || document.documentElement
            || document.body;
    }
    
    // Helper: collect connection elements robustly
    function getConnectionElements() {
        const container = document.querySelector(LINKEDIN_SELECTORS.listContainer) 
            || document.querySelector('.scaffold-finite-scroll__content') 
            || document.querySelector('main') 
            || document;
        const nodes = Array.from(container.querySelectorAll('li, .mn-connection-card, .entity-result__item'));
        // Filter to those that likely reference a profile via provided link selector
        return nodes.filter(el => el.querySelector(LINKEDIN_SELECTORS.profileLink));
    }

    // Click load-more if present to expand lists
    function tryClickLoadMore() {
        const btn = document.querySelector(LINKEDIN_SELECTORS.loadMoreBtn);
        if (btn && !btn.disabled) {
            console.log('Clicking Load more button');
            btn.click();
        }
    }

    async function sendBatchToAPI(connectionsBatch, authData, apiUrl) {
        try {
            // Send batch to background script to avoid CORS issues
            console.log(`Sending batch of ${connectionsBatch.length} connections to background script for API call`);
            console.log('Using JWT token:', authData?.token ? authData.token.substring(0, 20) + '...' : 'No token');
            console.log('User ID:', authData?.user_id);
            
            // Add user_id to each connection in the batch
            const connectionsWithUserId = connectionsBatch.map(connection => ({
                ...connection,
                user_id: authData?.user_id
            }));
            
            const response = await new Promise((resolve, reject) => {
                console.log('📤 Content script sending batch message to background script...');
                console.log('📤 Batch payload:', {
                    action: 'sendBatchToAPI',
                    connectionsBatch: connectionsWithUserId,
                    batchSize: connectionsWithUserId.length,
                    jwtToken: authData?.token ? 'Present' : 'Missing',
                    user_id: authData?.user_id,
                    apiUrl: apiUrl || 'https://api.cofounder-circle.com/linkedin/connections'
                });
                
                chrome.storage.local.get(['apiUrl','apiUrlBase']).then(cfg => {
                    const resolvedBase = cfg.apiUrl || (cfg.apiUrlBase ? `${cfg.apiUrlBase.replace(/\/$/, '')}/linkedin/connections` : null);
                    const resolvedApi = apiUrl || resolvedBase || 'https://api.cofounder-circle.com/linkedin/connections';
                    chrome.runtime.sendMessage({
                        action: 'sendBatchToAPI',
                        connectionsBatch: connectionsWithUserId,
                        jwtToken: authData?.token,
                        user_id: authData?.user_id,
                        apiUrl: resolvedApi
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
                endpoint: apiUrl || 'https://api.cofounder-circle.com/linkedin/connections'
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
                    apiUrl: apiUrl || 'runtime'
                });
                
                chrome.storage.local.get(['apiUrl','apiUrlBase']).then(cfg => {
                    const resolvedBase = cfg.apiUrl || (cfg.apiUrlBase ? `${cfg.apiUrlBase.replace(/\/$/, '')}/linkedin/connections` : null);
                    const resolvedApi = apiUrl || resolvedBase || 'https://api.cofounder-circle.com/linkedin/connections';
                    chrome.runtime.sendMessage({
                        action: 'sendToAPI',
                        connectionData: connectionData,
                        jwtToken: jwtToken,
                        apiUrl: resolvedApi
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
                endpoint: apiUrl || 'https://api.cofounder-circle.com/linkedin/connections'
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

// Wait for any of the provided selectors to appear
function waitForAnyElement(selectors, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const found = selectors.map(sel => document.querySelector(sel)).find(Boolean);
        if (found) return resolve(found);

        const start = Date.now();
        const observer = new MutationObserver(() => {
            const any = selectors.map(sel => document.querySelector(sel)).find(Boolean);
            if (any) {
                observer.disconnect();
                resolve(any);
            } else if (Date.now() - start > timeout) {
                observer.disconnect();
                reject(new Error(`None of selectors appeared within ${timeout}ms`));
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            const any = selectors.map(sel => document.querySelector(sel)).find(Boolean);
            if (any) {
                observer.disconnect();
                resolve(any);
            }
        }, 250);
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