import { logger } from '@/utils/logger';

// LinkedIn API configuration
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || '86vhj2ctnlpeie'; // LinkedIn API client ID
const LINKEDIN_REDIRECT_URI = `${window.location.origin}/auth/linkedin-callback`;
const LINKEDIN_SCOPE = 'r_liteprofile r_emailaddress r_1st_connections w_member_social';
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

// Generate LinkedIn authorization URL
export const getLinkedInAuthUrl = () => {
  const url = new URL('https://www.linkedin.com/oauth/v2/authorization');
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('client_id', LINKEDIN_CLIENT_ID);
  url.searchParams.append('redirect_uri', LINKEDIN_REDIRECT_URI);
  url.searchParams.append('scope', LINKEDIN_SCOPE);
  url.searchParams.append('state', generateRandomState());
  
  return url.toString();
};

// Generate random state parameter for OAuth security
const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Exchange authorization code for access token
export const getAccessToken = async (code: string) => {
  try {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_CLIENT_ID,
        client_secret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET || '' // This should be stored securely
      })
    });
    
    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    logger.error('LinkedIn: Error exchanging code for token', error);
    throw error;
  }
};

// Fetch LinkedIn profile data
export const fetchLinkedInProfileData = async (token: string) => {
  try {
    // First, fetch basic profile information
    const profileResponse = await fetch(`${LINKEDIN_API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    if (!profileResponse.ok) {
      throw new Error(`LinkedIn profile API error: ${profileResponse.status}`);
    }
    
    const profileData = await profileResponse.json();
    
    // Then, fetch email address
    const emailResponse = await fetch(`${LINKEDIN_API_URL}/emailAddress?q=members&projection=(elements*(handle~))`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    if (!emailResponse.ok) {
      throw new Error(`LinkedIn email API error: ${emailResponse.status}`);
    }
    
    const emailData = await emailResponse.json();
    const email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
    
    // Fetch profile picture if available
    let profilePicture = '';
    try {
      const pictureResponse = await fetch(`${LINKEDIN_API_URL}/me?projection=(profilePicture(displayImage~:playableStreams))`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      
      if (pictureResponse.ok) {
        const pictureData = await pictureResponse.json();
        profilePicture = pictureData.profilePicture?.['displayImage~']?.elements?.[0]?.identifiers?.[0]?.identifier || '';
      }
    } catch (error) {
      logger.error('LinkedIn: Error fetching profile picture', error);
    }
    
    return {
      id: profileData.id,
      firstName: profileData.localizedFirstName,
      lastName: profileData.localizedLastName,
      profilePicture,
      email,
      // Other fields would require additional API calls
      headline: '',  // Would need a separate API call
      location: '',  // Would need a separate API call
      positions: [],  // Would need a separate API call
      skills: []     // Would need a separate API call
    };
  } catch (error) {
    logger.error('LinkedIn: Error fetching profile', error);
    throw error;
  }
};

// Fetch LinkedIn connections
export const fetchLinkedInConnections = async (token: string) => {
  try {
    const response = await fetch(`${LINKEDIN_API_URL}/connections?q=viewer&start=0&count=50`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`LinkedIn connections API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    logger.error('LinkedIn: Error fetching connections', error);
    throw error;
  }
};

// Share content to LinkedIn
export const shareToLinkedIn = (title: string, url: string, summary?: string) => {
  // Direct users to the LinkedIn sharing dialog
  // This is a simplified approach that works without requiring additional API permissions
  const linkedinUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
  linkedinUrl.searchParams.append('url', url);
  
  window.open(linkedinUrl.toString(), '_blank', 'width=600,height=600');
  
  // Return true to indicate the share window was opened
  return true;
};

// Parse LinkedIn OAuth response
export const parseLinkedInCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');
  
  return { code, state, error, errorDescription };
};

// Find matching connections
export const findMatchingConnections = async (token: string, platformUserIds: string[]) => {
  try {
    const connections = await fetchLinkedInConnections(token);
    // In a real implementation, you would compare LinkedIn IDs with your platform user IDs
    // This is a simplified version
    return connections.filter(connection => platformUserIds.includes(connection.id));
  } catch (error) {
    logger.error('LinkedIn: Error finding matching connections', error);
    return [];
  }
};

// Scrape Naukri.com for candidate data
export const scrapeNaukriCandidates = async (jobTitle: string, skills: string[]) => {
  try {
    logger.debug('LinkedIn: Initiating Naukri.com scraping', { jobTitle, skills });
    
    // In a real implementation, you would use a backend service or proxy
    // to handle the actual scraping as direct scraping from frontend 
    // may be blocked by CORS policies
    
    // Mock successful response for demonstration
    const mockCandidates = [
      {
        id: 'n1',
        name: 'Amit Patel',
        title: jobTitle,
        company: 'TechSolutions India',
        location: 'Bangalore, India',
        skills: skills.slice(0, 4),
        experience: 6,
        education: 'BTech in Computer Science, IIT Bombay',
        email: 'amit.p@example.com',
        profileUrl: 'https://naukri.com/profile/123456',
        matchScore: 89,
        skillScores: skills.slice(0, 4).map(skill => ({
          skill,
          score: 75 + Math.floor(Math.random() * 20)
        })),
        availability: '2 weeks',
        salaryExpectation: '₹22-28 LPA'
      },
      {
        id: 'n2',
        name: 'Sneha Verma',
        title: `Senior ${jobTitle}`,
        company: 'GlobalTech Services',
        location: 'Hyderabad, India',
        skills: skills.slice(1, 5),
        experience: 8,
        education: 'MTech in Information Technology, NIT Trichy',
        email: 'sneha.v@example.com',
        profileUrl: 'https://naukri.com/profile/789012',
        matchScore: 94,
        skillScores: skills.slice(1, 5).map(skill => ({
          skill,
          score: 85 + Math.floor(Math.random() * 15)
        })),
        availability: 'Immediately',
        salaryExpectation: '₹30-35 LPA'
      },
      {
        id: 'n3',
        name: 'Rajesh Kumar',
        title: jobTitle + ' Developer',
        company: 'Infosys',
        location: 'Pune, India',
        skills: skills.slice(0, 3),
        experience: 4,
        education: 'BE in Computer Engineering, Delhi University',
        email: 'rajesh.k@example.com',
        profileUrl: 'https://naukri.com/profile/345678',
        matchScore: 82,
        skillScores: skills.slice(0, 3).map(skill => ({
          skill,
          score: 70 + Math.floor(Math.random() * 20)
        })),
        availability: '1 month',
        salaryExpectation: '₹18-22 LPA'
      }
    ];
    
    logger.info('LinkedIn: Naukri.com scraping completed', { candidatesFound: mockCandidates.length });
    return mockCandidates;
  } catch (error) {
    logger.error('LinkedIn: Error scraping Naukri.com', error);
    throw new Error('Failed to scrape candidates from Naukri.com');
  }
};
