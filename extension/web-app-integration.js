// Web App Integration Helper
// Add this to your React app to automatically send auth tokens to the extension

class ExtensionIntegration {
    constructor(extensionId = null) {
        this.extensionId = extensionId;
        this.isExtensionInstalled = false;
        this.checkExtensionAvailability();
    }

    // Check if the extension is installed
    async checkExtensionAvailability() {
        try {
            // Try to send a ping message to the extension
            if (chrome && chrome.runtime) {
                const response = await chrome.runtime.sendMessage(this.extensionId, {
                    type: 'PING'
                });
                this.isExtensionInstalled = true;
                console.log('LinkedIn Connections Fetcher extension detected');
            }
        } catch (error) {
            console.log('LinkedIn Connections Fetcher extension not installed');
            this.isExtensionInstalled = false;
        }
    }

    // Send auth token to extension
    async sendAuthToken(token) {
        if (!this.isExtensionInstalled) {
            console.log('Extension not installed, skipping token send');
            return false;
        }

        try {
            const response = await chrome.runtime.sendMessage(this.extensionId, {
                type: 'SET_TOKEN',
                token: token
            });
            
            console.log('Auth token sent to extension:', response);
            return true;
        } catch (error) {
            console.error('Failed to send auth token to extension:', error);
            return false;
        }
    }

    // Clear auth token from extension
    async clearAuthToken() {
        if (!this.isExtensionInstalled) {
            return false;
        }

        try {
            const response = await chrome.runtime.sendMessage(this.extensionId, {
                type: 'CLEAR_TOKEN'
            });
            
            console.log('Auth token cleared from extension:', response);
            return true;
        } catch (error) {
            console.error('Failed to clear auth token from extension:', error);
            return false;
        }
    }

    // Get extension status
    getStatus() {
        return {
            installed: this.isExtensionInstalled,
            extensionId: this.extensionId
        };
    }
}

// React Hook for Extension Integration
export function useExtensionIntegration(extensionId = null) {
    const [extension, setExtension] = React.useState(null);
    const [isInstalled, setIsInstalled] = React.useState(false);

    React.useEffect(() => {
        const ext = new ExtensionIntegration(extensionId);
        setExtension(ext);
        
        // Check installation status
        const checkStatus = async () => {
            await ext.checkExtensionAvailability();
            setIsInstalled(ext.isExtensionInstalled);
        };
        
        checkStatus();
    }, [extensionId]);

    const sendToken = React.useCallback(async (token) => {
        if (extension) {
            return await extension.sendAuthToken(token);
        }
        return false;
    }, [extension]);

    const clearToken = React.useCallback(async () => {
        if (extension) {
            return await extension.clearAuthToken();
        }
        return false;
    }, [extension]);

    return {
        isInstalled,
        sendToken,
        clearToken,
        extension
    };
}

// Example usage in React component:
/*
import { useExtensionIntegration } from './web-app-integration';

function App() {
    const { isInstalled, sendToken, clearToken } = useExtensionIntegration();
    const [authToken, setAuthToken] = useState(null);

    // Send token when user logs in
    const handleLogin = async (userToken) => {
        setAuthToken(userToken);
        
        // Store in localStorage
        localStorage.setItem('authToken', userToken);
        
        // Send to extension
        if (isInstalled) {
            await sendToken(userToken);
        }
    };

    // Clear token when user logs out
    const handleLogout = async () => {
        setAuthToken(null);
        localStorage.removeItem('authToken');
        
        if (isInstalled) {
            await clearToken();
        }
    };

    return (
        <div>
            {isInstalled && (
                <div className="extension-status">
                    ✅ LinkedIn Connections Fetcher extension detected
                </div>
            )}
            {!isInstalled && (
                <div className="extension-status">
                    ⚠️ Install the LinkedIn Connections Fetcher extension for seamless integration
                </div>
            )}
        </div>
    );
}
*/

// Auto-integration script (add to your app's main entry point)
export function autoIntegrateExtension() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined' || !window.chrome) {
        return;
    }

    const extension = new ExtensionIntegration();
    
    // Listen for auth token changes in localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        
        if (key === 'authToken' || key === 'jwt_token' || key === 'token') {
            extension.sendAuthToken(value);
        }
    };

    // Listen for auth token removal
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
        originalRemoveItem.apply(this, arguments);
        
        if (key === 'authToken' || key === 'jwt_token' || key === 'token') {
            extension.clearAuthToken();
        }
    };

    // Check for existing token on page load
    const existingToken = localStorage.getItem('authToken') || 
                         localStorage.getItem('jwt_token') || 
                         localStorage.getItem('token');
    
    if (existingToken) {
        extension.sendAuthToken(existingToken);
    }
}

// Export for use in different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ExtensionIntegration, useExtensionIntegration, autoIntegrateExtension };
} else if (typeof window !== 'undefined') {
    window.ExtensionIntegration = ExtensionIntegration;
    window.autoIntegrateExtension = autoIntegrateExtension;
} 