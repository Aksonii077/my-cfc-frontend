import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spin, Alert } from "antd";
import { useUserStore } from "@/stores/userStore";
import { checkUserExists, type UserCheckResponse } from "@/services/userService";
import { getEmailFromToken } from "@/providers/auth/tokenUtils";
import { getDefaultRedirectPath } from "@/providers/auth/redirectUtils";

const AFTER_LOGIN_REDIRECT_KEY = "afterLoginRedirectPath";
const DEFAULT_REDIRECT_PATH = "/";
const API_TIMEOUT = 10000;

interface AuthError {
  type: 'token_invalid' | 'user_not_found' | 'api_error' | 'unknown';
  message: string;
}

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<AuthError | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processAuthCallback = async (): Promise<void> => {
      try {
        // ✅ Fetch token from httpOnly cookie instead of URL
        const tokenResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002'}/auth/google/token`, {
          credentials: 'include', // Send cookie
          headers: {
            'Accept': 'application/json',
          }
        });

        if (!tokenResponse.ok) {
          throw new Error("Failed to retrieve authentication token");
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.token;

        if (!token) {
          throw new Error("No authentication token provided");
        }

        localStorage.setItem("token", token);

        const email = getEmailFromToken(token);
        if (!email) {
          throw new Error("Invalid token format");
        }

        const isNewUserParam = searchParams.get("is_new_user");
        const isNewUser = isNewUserParam === "True" || isNewUserParam === "true";

        let userResponse: UserCheckResponse;
        
        try {
          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("API request timeout")), API_TIMEOUT);
          });
          
          userResponse = await Promise.race([
            checkUserExists(email),
            timeoutPromise
          ]);
        } catch (apiError) {
          if (isNewUser) {
            navigate("/onboarding", { replace: true });
            return;
          }
          throw new Error("Unable to fetch user data");
        }
        
        if (!userResponse.exists || !userResponse.user) {
          throw new Error("User account not found");
        }

        const userData = {
          id: userResponse.user.user_id,
          email: userResponse.user.email,
          name: userResponse.user.full_name,
          role: userResponse.user.role as 'founder' | 'investor' | 'mentor',
          createdAt: userResponse.user.created_at,
          updatedAt: userResponse.user.updated_at,
          onboardingStep: userResponse.user.onboarding_step,
          isOnboarded: userResponse.user.is_onboarded || false,
          onboardingData: userResponse.user.onboarding_data,
        };

        setUser(userData);

        let finalPath: string;
        
        if (!userData.isOnboarded) {
          finalPath = "/onboarding";
        } else {
          const savedRedirectPath = sessionStorage.getItem(AFTER_LOGIN_REDIRECT_KEY);
          
          const defaultRedirect = getDefaultRedirectPath({
            currentPath: savedRedirectPath,
            userData: {
              role: userData.role,
              isOnboarded: userData.isOnboarded,
            },
            token,
          });

          if (defaultRedirect === null) {
            return;
          }
          
          finalPath = defaultRedirect || savedRedirectPath || DEFAULT_REDIRECT_PATH;
        }

        sessionStorage.removeItem(AFTER_LOGIN_REDIRECT_KEY);
        navigate(finalPath, { replace: true });
        
      } catch (error) {
        localStorage.removeItem("token");
        
        if (error instanceof Error) {
          if (error.message.includes("token")) {
            setError({ type: 'token_invalid', message: "Invalid authentication token" });
          } else if (error.message.includes("not found")) {
            setError({ type: 'user_not_found', message: "User account not found" });
          } else if (error.message.includes("timeout") || error.message.includes("fetch")) {
            setError({ type: 'api_error', message: "Server is taking too long to respond. Please try again." });
          } else {
            setError({ type: 'api_error', message: "Authentication service unavailable" });
          }
        } else {
          setError({ type: 'unknown', message: "An unexpected error occurred" });
        }
      } finally {
        setIsProcessing(false);
      }
    };

    processAuthCallback();
  }, [searchParams, navigate, setUser]);

  const handleRetry = (): void => {
    setError(null);
    setIsProcessing(true);
    window.location.reload();
  };

  const handleGoHome = (): void => {
    navigate("/", { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full space-y-4">
          <Alert
            message="Authentication Failed"
            description={error.message}
            type="error"
            showIcon
          />
          <div className="flex gap-2">
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleGoHome}
              className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Spin size="large" />
        <p className="text-gray-600">
          {isProcessing ? "Completing authentication..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;