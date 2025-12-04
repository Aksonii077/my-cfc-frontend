// React Component Example for Extension Integration
// Add this to your React app to integrate with the LinkedIn Connections Fetcher extension

import React, { useState, useEffect } from 'react';

// Extension Integration Hook
function useExtensionIntegration() {
    const [isInstalled, setIsInstalled] = useState(false);
    const [extensionStatus, setExtensionStatus] = useState('checking');

    useEffect(() => {
        // Check if extension is available
        const checkExtension = async () => {
            try {
                if (window.chrome && window.chrome.runtime) {
                    // Try to send a ping to the extension
                    await window.chrome.runtime.sendMessage({
                        type: 'PING'
                    });
                    setIsInstalled(true);
                    setExtensionStatus('installed');
                } else {
                    setExtensionStatus('not_available');
                }
            } catch (error) {
                setIsInstalled(false);
                setExtensionStatus('not_installed');
            }
        };

        checkExtension();
    }, []);

    const sendToken = async (token) => {
        if (!isInstalled) return false;
        
        try {
            await window.chrome.runtime.sendMessage({
                type: 'SET_TOKEN',
                token: token
            });
            return true;
        } catch (error) {
            console.error('Failed to send token to extension:', error);
            return false;
        }
    };

    const clearToken = async () => {
        if (!isInstalled) return false;
        
        try {
            await window.chrome.runtime.sendMessage({
                type: 'CLEAR_TOKEN'
            });
            return true;
        } catch (error) {
            console.error('Failed to clear token from extension:', error);
            return false;
        }
    };

    return { isInstalled, extensionStatus, sendToken, clearToken };
}

// Extension Status Component
function ExtensionStatus() {
    const { isInstalled, extensionStatus } = useExtensionIntegration();

    const getStatusMessage = () => {
        switch (extensionStatus) {
            case 'installed':
                return {
                    text: '✅ LinkedIn Connections Fetcher extension is installed',
                    color: 'text-green-600',
                    bgColor: 'bg-green-50'
                };
            case 'not_installed':
                return {
                    text: '⚠️ Install the LinkedIn Connections Fetcher extension for seamless integration',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-50'
                };
            case 'not_available':
                return {
                    text: 'ℹ️ Extension integration not available in this browser',
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-50'
                };
            default:
                return {
                    text: '⏳ Checking extension status...',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-50'
                };
        }
    };

    const status = getStatusMessage();

    return (
        <div className={`p-3 rounded-lg border ${status.bgColor} ${status.color}`}>
            <p className="text-sm font-medium">{status.text}</p>
            {extensionStatus === 'not_installed' && (
                <p className="text-xs mt-1 opacity-75">
                    The extension will automatically receive your auth token when you log in.
                </p>
            )}
        </div>
    );
}

// Login Component with Extension Integration
function LoginWithExtension() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState('');
    
    const { isInstalled, sendToken, clearToken } = useExtensionIntegration();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLoginStatus('');

        try {
            // Simulate login API call
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const { token, user } = await response.json();
                
                // Store token in your app
                localStorage.setItem('authToken', token);
                
                // Send token to extension if installed
                if (isInstalled) {
                    const sent = await sendToken(token);
                    if (sent) {
                        setLoginStatus('success');
                    } else {
                        setLoginStatus('extension_error');
                    }
                } else {
                    setLoginStatus('success');
                }
                
                // Redirect or update app state
                console.log('Logged in successfully:', user);
            } else {
                setLoginStatus('error');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        // Clear token from your app
        localStorage.removeItem('authToken');
        
        // Clear token from extension
        if (isInstalled) {
            await clearToken();
        }
        
        setLoginStatus('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            
            {/* Extension Status */}
            <div className="mb-4">
                <ExtensionStatus />
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Status Messages */}
            {loginStatus === 'success' && (
                <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md">
                    ✅ Login successful! {isInstalled && 'Auth token sent to extension.'}
                </div>
            )}
            
            {loginStatus === 'extension_error' && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
                    ⚠️ Login successful, but failed to send token to extension.
                </div>
            )}
            
            {loginStatus === 'error' && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                    ❌ Login failed. Please check your credentials.
                </div>
            )}

            {/* Logout Button */}
            {loginStatus === 'success' && (
                <button
                    onClick={handleLogout}
                    className="w-full mt-4 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                    Logout
                </button>
            )}
        </div>
    );
}

// Auto-integration function
export function setupExtensionIntegration() {
    // Listen for auth token changes
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        
        // Send token to extension when stored
        if (key === 'authToken' && window.chrome && window.chrome.runtime) {
            window.chrome.runtime.sendMessage({
                type: 'SET_TOKEN',
                token: value
            }).catch(() => {
                // Extension not installed or not available
            });
        }
    };

    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
        originalRemoveItem.apply(this, arguments);
        
        // Clear token from extension when removed
        if (key === 'authToken' && window.chrome && window.chrome.runtime) {
            window.chrome.runtime.sendMessage({
                type: 'CLEAR_TOKEN'
            }).catch(() => {
                // Extension not installed or not available
            });
        }
    };

    // Send existing token on page load
    const existingToken = localStorage.getItem('authToken');
    if (existingToken && window.chrome && window.chrome.runtime) {
        window.chrome.runtime.sendMessage({
            type: 'SET_TOKEN',
            token: existingToken
        }).catch(() => {
            // Extension not installed or not available
        });
    }
}

export { ExtensionStatus, LoginWithExtension, useExtensionIntegration }; 