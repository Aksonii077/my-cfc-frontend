import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC7ixA5yMFfBwzhW2Q96yfZYN-08bRbUCQ",
  authDomain: "cfc-auth-8d97e.firebaseapp.com",
  projectId: "cfc-auth-8d97e",
  // Add other config from your backend response if needed
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 