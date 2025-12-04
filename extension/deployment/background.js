// Background service worker for CFC CRM

// Handle extension installation
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === 'install') {
        console.log('CFC CRM installed');
        
        // Set default settings
        // Seed API URL if not already set; replace with your production base URL
        const DEFAULT_API_URL = 'https://api.cofounder-circle.com/linkedin/connections';
        chrome.storage.local.get(['apiUrl']).then(data => {
            if (!data.apiUrl) {
                chrome.storage.local.set({ apiUrl: DEFAULT_API_URL });
            }
        });
    }
});

// Open side panel when the user clicks the action icon
chrome.runtime.onInstalled.addListener(async () => {
    try {
        if (chrome.sidePanel && chrome.sidePanel.setOptions) {
            await chrome.sidePanel.setOptions({ path: 'sidepanel.html', enabled: true });
        }
    } catch {}
});

chrome.action.onClicked.addListener(async (tab) => {
    try {
        if (chrome.sidePanel && chrome.sidePanel.open) {
            await chrome.sidePanel.open({ tabId: tab.id });
        } else {
            chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
        }
    } catch {
        chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
    }
});

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('🔔 Background script received internal message:', request);
    console.log('📨 From:', sender.tab ? `Tab ${sender.tab.id}` : 'Popup');
    console.log('📨 Message type:', request.action || request.type);
    
    // Handle content script loaded notification
    if (request.type === 'contentScriptLoaded') {
        console.log('✅ Content script loaded on:', request.url);
        console.log('📅 Loaded at:', request.timestamp);
        sendResponse({ success: true });
        return true;
    }
    
    // Handle ping from popup
    if (request.action === 'ping') {
        console.log('🏓 Ping received from popup');
        sendResponse({ status: 'ok', timestamp: new Date().toISOString() });
        return true;
    }
    
    // Handle batch API calls from content script (to avoid CORS)
    if (request.action === 'sendBatchToAPI') {
        console.log('🔔 Background script handling batch API call from content script');
        console.log('📨 Full request:', request);
        console.log('📨 Batch size:', request.connectionsBatch?.length || 0);
        
        const { connectionsBatch, jwtToken, user_id, apiUrl } = request;
        
        console.log('📤 Sending batch to API:', apiUrl);
        console.log('🔑 Using JWT token:', jwtToken ? 'Present' : 'Missing');
        console.log('👤 User ID:', user_id);
        console.log('📊 Batch size:', connectionsBatch.length);
        
        // Add timeout to prevent hanging
        const timeout = setTimeout(() => {
            console.log('⏰ Batch API call timeout, sending error response');
            sendResponse({ success: false, error: 'Batch API call timeout' });
        }, 60000); // 60 second timeout for batches
        
        // Send each connection in the batch
        const batchPromises = connectionsBatch.map(connectionData => 
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: JSON.stringify(connectionData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(errorText => {
                        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
                    });
                }
                return response.json();
            })
        );
        
        Promise.allSettled(batchPromises)
        .then(results => {
            clearTimeout(timeout);
            
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            
            console.log(`📊 Batch results: ${successful} successful, ${failed} failed`);
            
            if (failed === 0) {
                console.log('✅ All connections in batch saved successfully');
                sendResponse({ 
                    success: true, 
                    data: { 
                        total: connectionsBatch.length,
                        successful: successful,
                        failed: failed
                    } 
                });
            } else {
                console.log(`⚠️ Some connections failed: ${successful}/${connectionsBatch.length} successful`);
                sendResponse({ 
                    success: true, 
                    data: { 
                        total: connectionsBatch.length,
                        successful: successful,
                        failed: failed
                    },
                    warning: `${failed} connections failed to save`
                });
            }
        })
        .catch(error => {
            clearTimeout(timeout);
            console.error('❌ Batch API call failed:', error);
            sendResponse({ success: false, error: error.message });
        });
        
        return true; // Keep message channel open for async response
    }
    
    // Handle single API calls from content script (to avoid CORS)
    if (request.action === 'sendToAPI' || request.type === 'sendToAPI') {
        console.log('🔔 Background script handling single API call from content script');
        console.log('📨 Full request:', request);
        console.log('📨 Message format:', request.action ? 'action' : 'type');
        
        const { connectionData, jwtToken, apiUrl } = request;
        
        console.log('📤 Sending to API:', apiUrl);
        console.log('🔑 Using JWT token:', jwtToken ? 'Present' : 'Missing');
        console.log('📊 Connection data:', connectionData);
        
        // Add timeout to prevent hanging
        const timeout = setTimeout(() => {
            console.log('⏰ API call timeout, sending error response');
            sendResponse({ success: false, error: 'API call timeout' });
        }, 30000); // 30 second timeout
        
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(connectionData)
        })
        .then(response => {
            clearTimeout(timeout);
            console.log('📥 API Response status:', response.status);
            console.log('📥 API Response headers:', response.headers);
            
            if (!response.ok) {
                return response.text().then(errorText => {
                    console.log('📥 API Error response text:', errorText);
                    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
                });
            }
            
            return response.json();
        })
        .then(result => {
            console.log('✅ API call successful:', result);
            sendResponse({ success: true, data: result });
        })
        .catch(error => {
            clearTimeout(timeout);
            console.error('❌ API call failed:', error);
            sendResponse({ success: false, error: error.message });
        });
        
        return true; // Keep message channel open for async response
    }
    
    // Forward status messages from content script to popup
    if (request.type === 'status' || request.type === 'progress' || request.type === 'complete' || request.type === 'error') {
        console.log('📤 Forwarding message to popup:', request);
        // Broadcast to all listeners (popup)
        chrome.runtime.sendMessage(request);
        sendResponse({ success: true });
        return true;
    }
    
    // Default response for unhandled messages
    console.log('⚠️ Unhandled message type:', request.action || request.type);
    sendResponse({ success: false, error: 'Unhandled message type' });
    return true;
});

// Listen for external messages from web app
chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    console.log('🔔 Received external message from:', sender.origin);
    console.log('📨 Message type:', request.type);
    console.log('📨 Message content:', request);
    
    // Handle profile data from web app
    if (request.type === 'SEND_PROFILE_DATA') {
        console.log('Received profile data from web app');
        
        const userProfile = request.profile || {};
        const authToken = request.token;
        
        if (!authToken) {
            sendResponse({ success: false, message: 'No auth token provided' });
            return;
        }
        
        // Store user profile and auth token
        chrome.storage.local.set({
            userProfile: userProfile,
            authToken: authToken,
            tokenSource: 'web_app',
            lastSync: new Date().toISOString()
        }).then(() => {
            console.log('Profile data stored successfully');
            sendResponse({ success: true, message: 'Profile data stored successfully' });
        }).catch((error) => {
            console.error('Failed to store profile data:', error);
            sendResponse({ success: false, message: 'Failed to store profile data' });
        });
        
        return true; // Keep message channel open for async response
    }
    
    // Handle token clearing
    if (request.type === 'CLEAR_TOKEN') {
        console.log('Clearing auth token from web app request');
        chrome.storage.local.remove(['authToken', 'userProfile', 'tokenSource', 'lastSync']).then(() => {
            sendResponse({ success: true, message: 'Token cleared successfully' });
        }).catch((error) => {
            console.error('Failed to clear token:', error);
            sendResponse({ success: false, message: 'Failed to clear token' });
        });
        
        return true; // Keep message channel open for async response
    }
    
    // Handle token status check
    if (request.type === 'CHECK_TOKEN_STATUS') {
        chrome.storage.local.get(['authToken', 'userProfile', 'lastSync']).then((data) => {
            sendResponse({ 
                success: true, 
                hasToken: !!data.authToken,
                hasProfile: !!data.userProfile,
                lastSync: data.lastSync
            });
        }).catch((error) => {
            console.error('Failed to check token status:', error);
            sendResponse({ success: false, message: 'Failed to check token status' });
        });
        
        return true; // Keep message channel open for async response
    }
    
    // Note: API calls from content script are handled in the internal message listener above
    // This external listener is only for web app communication
});

// Handle tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    console.log('🔍 Tab updated:', tab.url, 'Status:', changeInfo.status);
    
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('linkedin.com')) {
        console.log('📥 Injecting content script into LinkedIn page...');
        
        // Inject content script
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).then(() => {
            console.log('✅ Content script injected successfully');
        }).catch(err => {
            console.log('❌ Content script injection failed:', err.message);
            // Try again after a short delay
            setTimeout(() => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                }).then(() => {
                    console.log('✅ Content script injected on retry');
                }).catch(retryErr => {
                    console.log('❌ Content script injection failed on retry:', retryErr.message);
                });
            }, 1000);
        });
    }
});

// Listen for storage changes
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local' && changes.authToken) {
        console.log('Auth token updated:', changes.authToken.newValue ? 'Token set' : 'Token cleared');
    }
}); 