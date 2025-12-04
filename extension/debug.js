// Chrome Extension Debug Script (Webpage Context)
// Copy and paste this entire script into your browser console on LinkedIn

(function() {
    console.log('🔧 Chrome Extension Debug Script (Webpage Context)');
    
    // Check if extension is installed (indirect method)
    function checkExtension() {
        console.log('\n📦 Checking Extension Installation...');
        
        // Check if chrome extension API is available
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            console.log('✅ Chrome extension API available');
            
            // Try to detect if our extension is loaded by checking for specific elements
            // This is an indirect method since we can't directly message from webpage
            console.log('💡 Extension should be loaded if you see it in chrome://extensions/');
            console.log('💡 Check chrome://extensions/ for "LinkedIn Connections Sync" extension');
        } else {
            console.log('❌ Chrome extension API not available');
        }
    }

    // Check if we're on LinkedIn and the right page
    function checkLinkedIn() {
        console.log('\n🔗 Checking LinkedIn Page...');
        
        const isLinkedIn = window.location.hostname.includes('linkedin.com');
        console.log('Current page:', window.location.href);
        console.log('Is LinkedIn:', isLinkedIn ? '✅ Yes' : '❌ No');
        
        if (isLinkedIn) {
            console.log('✅ Extension should be active on this page');
            
            // Check if we're on the connections page
            const isConnectionsPage = window.location.href.includes('/mynetwork/invite-connect/connections/');
            console.log('Is connections page:', isConnectionsPage ? '✅ Yes' : '❌ No');
            
            if (isConnectionsPage) {
                // Check for connection elements
                const connectionElements = document.querySelectorAll('.mn-connection-card');
                console.log('Connection elements found:', connectionElements.length);
                
                if (connectionElements.length > 0) {
                    console.log('✅ Connection elements are present');
                    console.log('Sample connection:', connectionElements[0].textContent.substring(0, 100) + '...');
                } else {
                    console.log('❌ No connection elements found');
                    console.log('💡 Try scrolling down to load more connections');
                }
            } else {
                console.log('💡 Navigate to: https://www.linkedin.com/mynetwork/invite-connect/connections/');
            }
        } else {
            console.log('💡 Navigate to LinkedIn to test connection fetching');
        }
    }

    // Test connection extraction
    function testConnectionExtraction() {
        console.log('\n🔍 Testing Connection Extraction...');
        
        const connectionElements = document.querySelectorAll('.mn-connection-card');
        if (connectionElements.length > 0) {
            const firstElement = connectionElements[0];
            console.log('Testing extraction on first connection element...');
            
            // Simulate the extraction logic
            const nameElement = firstElement.querySelector('.mn-connection-card__name');
            const companyElement = firstElement.querySelector('.mn-connection-card__occupation');
            const profileLink = firstElement.querySelector('a[href*="/in/"]');
            
            console.log('Name element:', nameElement ? nameElement.textContent.trim() : 'Not found');
            console.log('Company element:', companyElement ? companyElement.textContent.trim() : 'Not found');
            console.log('Profile link:', profileLink ? profileLink.getAttribute('href') : 'Not found');
            
            if (nameElement) {
                console.log('✅ Connection extraction should work');
                
                // Show what data would be extracted
                const fullName = nameElement.textContent.trim();
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                
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
                
                console.log('📊 Extracted data would be:');
                console.log('  - First Name:', firstName);
                console.log('  - Last Name:', lastName);
                console.log('  - Position:', position);
                console.log('  - Company:', company);
                console.log('  - Profile URL:', profileLink ? 'https://www.linkedin.com' + profileLink.getAttribute('href') : 'N/A');
            } else {
                console.log('❌ Connection extraction may fail - name element not found');
                console.log('💡 LinkedIn may have changed their page structure');
            }
        } else {
            console.log('❌ No connection elements to test extraction');
        }
    }

    // Check for extension popup or UI elements
    function checkExtensionUI() {
        console.log('\n🎨 Checking for Extension UI...');
        
        // Look for any elements that might be added by our extension
        const extensionElements = document.querySelectorAll('[data-extension]');
        console.log('Extension UI elements found:', extensionElements.length);
        
        if (extensionElements.length > 0) {
            console.log('✅ Extension UI elements detected');
        } else {
            console.log('💡 No extension UI elements found (this is normal)');
        }
    }

    // Test manual connection extraction
    function testManualExtraction() {
        console.log('\n🛠️ Testing Manual Connection Extraction...');
        
        const connectionElements = document.querySelectorAll('.mn-connection-card');
        if (connectionElements.length > 0) {
            console.log(`Found ${connectionElements.length} connections on page`);
            
            // Extract first 3 connections as example
            const sampleConnections = Array.from(connectionElements.slice(0, 3)).map((element, index) => {
                const nameElement = element.querySelector('.mn-connection-card__name');
                const companyElement = element.querySelector('.mn-connection-card__occupation');
                const profileLink = element.querySelector('a[href*="/in/"]');
                
                return {
                    index: index + 1,
                    name: nameElement ? nameElement.textContent.trim() : 'N/A',
                    company: companyElement ? companyElement.textContent.trim() : 'N/A',
                    profileUrl: profileLink ? 'https://www.linkedin.com' + profileLink.getAttribute('href') : 'N/A'
                };
            });
            
            console.log('📋 Sample connections:');
            sampleConnections.forEach(conn => {
                console.log(`  ${conn.index}. ${conn.name} - ${conn.company}`);
            });
            
            console.log('✅ Manual extraction working - extension should work too!');
        } else {
            console.log('❌ No connections found to extract');
        }
    }

    // Test token storage
    function testTokenStorage() {
        console.log('\n🔐 Testing Token Storage...');
        
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['authToken', 'userInfo', 'lastAuthCheck'], (result) => {
                console.log('📦 Extension storage contents:');
                console.log('  - Has authToken:', !!result.authToken);
                console.log('  - Has userInfo:', !!result.userInfo);
                console.log('  - Last auth check:', result.lastAuthCheck);
                
                if (result.authToken) {
                    console.log('  - Token preview:', result.authToken.substring(0, 20) + '...');
                }
                
                if (result.userInfo) {
                    console.log('  - User info:', result.userInfo);
                }
                
                if (result.authToken) {
                    console.log('✅ Token found in extension storage');
                } else {
                    console.log('❌ No token found in extension storage');
                    console.log('💡 Make sure you are logged into the React app');
                }
            });
        } else {
            console.log('❌ Chrome storage API not available');
        }
    }

    // Test manual token storage (for debugging)
    function testManualTokenStorage() {
        console.log('\n🛠️ Testing Manual Token Storage...');
        
        // Get token from localStorage (React app)
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        console.log('📱 React app localStorage:');
        console.log('  - Has token:', !!token);
        console.log('  - Has user data:', !!userData);
        
        if (token) {
            console.log('  - Token preview:', token.substring(0, 20) + '...');
        }
        
        if (userData) {
            try {
                const user = JSON.parse(userData);
                console.log('  - User data:', user);
            } catch (e) {
                console.log('  - User data (raw):', userData);
            }
        }
        
        // Try to store in extension storage
        if (typeof chrome !== 'undefined' && chrome.storage && token) {
            console.log('🔄 Attempting to store token in extension storage...');
            
            const userInfo = userData ? JSON.parse(userData) : {};
            const completeUserInfo = {
                name: userInfo.name || userInfo.first_name || userInfo.full_name || 'User',
                email: userInfo.email || userInfo.email_address || '',
                id: userInfo.id || userInfo.user_id || '',
                avatar: userInfo.avatar || userInfo.profile_picture || '',
                ...userInfo
            };
            
            chrome.storage.local.set({
                authToken: token,
                userInfo: completeUserInfo,
                lastAuthCheck: new Date().toISOString()
            }, () => {
                console.log('✅ Token stored in extension storage');
                
                // Verify storage
                chrome.storage.local.get(['authToken', 'userInfo'], (result) => {
                    console.log('🔍 Verification:');
                    console.log('  - Stored token:', !!result.authToken);
                    console.log('  - Stored user info:', !!result.userInfo);
                    
                    if (result.authToken) {
                        console.log('✅ Token storage successful!');
                    } else {
                        console.log('❌ Token storage failed');
                    }
                });
            });
        } else {
            console.log('❌ Cannot store token - missing requirements');
        }
    }

    // Run all checks
    function runAllChecks() {
        console.log('🚀 Running all extension checks...\n');
        
        checkExtension();
        
        setTimeout(() => {
            checkLinkedIn();
        }, 1000);
        
        setTimeout(() => {
            testConnectionExtraction();
        }, 2000);
        
        setTimeout(() => {
            checkExtensionUI();
        }, 3000);
        
        setTimeout(() => {
            testManualExtraction();
        }, 4000);
        
        setTimeout(() => {
            testTokenStorage();
        }, 5000);
        
        setTimeout(() => {
            testManualTokenStorage();
        }, 6000);
        
        setTimeout(() => {
            console.log('\n🎉 All checks completed!');
            console.log('\n📋 Summary:');
            console.log('- If extension is not found, load it in chrome://extensions/');
            console.log('- If not on LinkedIn connections page, navigate there');
            console.log('- If extraction fails, LinkedIn may have changed their page structure');
            console.log('- If manual extraction works, the extension should work too!');
            console.log('- If token storage fails, check React app authentication');
            console.log('\n🔧 Next Steps:');
            console.log('1. Make sure extension is loaded in chrome://extensions/');
            console.log('2. Ensure you are logged into the React app');
            console.log('3. Run extensionDebug.testManualTokenStorage() to manually sync token');
            console.log('4. Click the extension icon in your toolbar');
            console.log('5. Click "Connect LinkedIn" to start syncing');
            console.log('6. Watch the console for extension logs');
        }, 7000);
    }

    // Make functions available globally
    window.extensionDebug = {
        runAllChecks,
        checkExtension,
        checkLinkedIn,
        testConnectionExtraction,
        checkExtensionUI,
        testManualExtraction,
        testTokenStorage,
        testManualTokenStorage
    };
    
    console.log('🔧 Extension debug script loaded. Run extensionDebug.runAllChecks() to test.');
})(); 