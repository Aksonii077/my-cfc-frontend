import React, { useState, useEffect } from 'react';
import { Button, Typography, Card, Tag, Input, Space, message, Spin } from 'antd';
import { CopyOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { theme } from '@/lib/theme';
import { apiClient } from '@/utils/api';
import WelcomeStep from './WelcomeStep';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface CompleteStepProps {
  onPrev: () => void;
  onHideStepper: (hide: boolean) => void;
}

const CompleteStep: React.FC<CompleteStepProps> = ({ onPrev, onHideStepper }) => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [currentMentorData, setCurrentMentorData] = useState<any>(null);
  
  // Recommendation 1 fields
  const [recommendation1Name, setRecommendation1Name] = useState('');
  const [recommendation1Email, setRecommendation1Email] = useState('');
  const [recommendation1Text, setRecommendation1Text] = useState('');
  
  // Recommendation 2 fields
  const [recommendation2Name, setRecommendation2Name] = useState('');
  const [recommendation2Email, setRecommendation2Email] = useState('');
  const [recommendation2Text, setRecommendation2Text] = useState('');

  // Fetch existing mentor data on component mount
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        console.log('Fetching mentor onboarding data...');
        const response = await apiClient.get('/mentor-onboarding/my-profile');
        console.log('Fetched mentor data:', response.data);
        
        // The API returns the current user's mentor profile object
        if (response.data) {
          const currentMentor = response.data;
          console.log('Current mentor record:', currentMentor);
          
          // Store current mentor data for later use
          setCurrentMentorData(currentMentor);
          
          // Pre-fill recommendation fields if data exists
          setRecommendation1Name(currentMentor.recommendation_1_name || '');
          setRecommendation1Email(currentMentor.recommendation_1_email || '');
          setRecommendation1Text(currentMentor.recommendation_1_text || '');
          
          setRecommendation2Name(currentMentor.recommendation_2_name || '');
          setRecommendation2Email(currentMentor.recommendation_2_email || '');
          setRecommendation2Text(currentMentor.recommendation_2_text || '');
        }
      } catch (error) {
        console.error('Error fetching mentor data:', error);
        // Don't show error message, just continue with empty form
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchMentorData();
  }, []);

  const handleSaveRecommendations = async () => {
    // Validate at least one recommendation is filled
    const hasRecommendation1 = recommendation1Name.trim() || recommendation1Email.trim() || recommendation1Text.trim();
    const hasRecommendation2 = recommendation2Name.trim() || recommendation2Email.trim() || recommendation2Text.trim();

    if (!hasRecommendation1 && !hasRecommendation2) {
      message.error('Please provide at least one recommendation');
      return;
    }

    // Validate email format if provided
    if (recommendation1Email.trim() && !recommendation1Email.includes('@')) {
      message.error('Please enter a valid email address for Recommendation 1');
      return;
    }

    if (recommendation2Email.trim() && !recommendation2Email.includes('@')) {
      message.error('Please enter a valid email address for Recommendation 2');
      return;
    }

    // Check if we have current mentor data
    if (!currentMentorData) {
      message.error('Mentor data not loaded. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Current mentor data:', currentMentorData);
      console.log('Updating recommendations:', { 
        recommendation1Name, 
        recommendation1Email, 
        recommendation1Text,
        recommendation2Name,
        recommendation2Email,
        recommendation2Text
      });
      
      // Merge current data with recommendation updates
      const payload = {
        basicInformation: currentMentorData.basic_information,
        about: currentMentorData.about,
        experiences: currentMentorData.experiences,
        mentorshipFocus: currentMentorData.mentorship_focus,
        socials: currentMentorData.socials,
        recommendation1Name: recommendation1Name.trim() || null,
        recommendation1Email: recommendation1Email.trim() || null,
        recommendation1Text: recommendation1Text.trim() || null,
        recommendation2Name: recommendation2Name.trim() || null,
        recommendation2Email: recommendation2Email.trim() || null,
        recommendation2Text: recommendation2Text.trim() || null,
      };

      console.log('Payload to send:', payload);

      // Use PUT method to update mentor-onboarding
      const response = await apiClient.put('/mentor-onboarding/', payload);
      
      console.log('Recommendations saved successfully:', response.data);
      message.success('Recommendations saved successfully!');
      
      // Redirect to mentor page after successful save
      setTimeout(() => {
        navigate('/mentor');
      }, 1000);
      
    } catch (error) {
      console.error('Error saving recommendations:', error);
      // Error message is handled by the axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToDashboard = () => {
    navigate('/ai-copilot');
  };

  const handleBackFromWelcome = () => {
    setShowWelcome(false);
    onHideStepper(false);
  };

  if (showWelcome) {
    return <WelcomeStep onNext={handleContinueToDashboard} onBack={handleBackFromWelcome} />;
  }

  // Show loading spinner while fetching data
  if (isFetchingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center" style={{ minHeight: '50vh' }}>
        <Spin size="large" />
        <p className="mt-4 text-gray-600">Loading mentor data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f6f8ff', minHeight: '100vh', paddingTop: '1rem', paddingBottom: '1rem' }}>
      {/* Invite Fellow Mentors Header */}
      <div className="text-center mb-6 sm:mb-8">
        <Title level={1} className="text-xl sm:text-2xl lg:text-3xl mb-4">
          Invite Fellow Mentors
        </Title>
        <Paragraph className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          As our Founding Mentor, you can invite two peers who you believe have the ability to shape the future of India's startups. 
          When your Referred Mentor incubates their first startup, CoFounder Circle will share 50% of the carry with you.
        </Paragraph>
      </div>

      {/* Referral Program Section */}
      <div className="mb-8 sm:mb-12">
        <img 
          src="You refferral program.svg" 
          alt="Your Referral Program" 
          className="w-full max-w-4xl mx-auto"
        />
      </div>

      {/* Send Invitation Section */}
      <Card className="mb-8 sm:mb-12 p-4 sm:p-6 lg:p-8 rounded-2xl border border-blue-200 bg-gray-50 shadow-lg">
        {/* Send Invitation Form */}
        <div className="max-w-3xl">
          {/* Header with Icon */}
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <SendOutlined className="text-white text-sm sm:text-base lg:text-lg" />
            </div>
            <Title level={3} className="text-gray-800 mb-0 text-base sm:text-lg lg:text-xl">
              Recommendations
            </Title>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Recommendation 1 */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <Title level={4} className="text-sm sm:text-base mb-4 text-gray-700">
                Recommendation 1
              </Title>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    placeholder="e.g. John Doe"
                    size="large"
                    className="rounded-lg"
                    value={recommendation1Name}
                    onChange={(e) => setRecommendation1Name(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. john@company.com"
                    size="large"
                    className="rounded-lg"
                    value={recommendation1Email}
                    onChange={(e) => setRecommendation1Email(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Recommendation Text
                  </label>
                  <TextArea
                    placeholder="Enter recommendation details..."
                    rows={4}
                    size="large"
                    className="rounded-lg"
                    value={recommendation1Text}
                    onChange={(e) => setRecommendation1Text(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Recommendation 2 */}
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <Title level={4} className="text-sm sm:text-base mb-4 text-gray-700">
                Recommendation 2
              </Title>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <Input
                    placeholder="e.g. Jane Smith"
                    size="large"
                    className="rounded-lg"
                    value={recommendation2Name}
                    onChange={(e) => setRecommendation2Name(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. jane@company.com"
                    size="large"
                    className="rounded-lg"
                    value={recommendation2Email}
                    onChange={(e) => setRecommendation2Email(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Recommendation Text
                  </label>
                  <TextArea
                    placeholder="Enter recommendation details..."
                    rows={4}
                    size="large"
                    className="rounded-lg"
                    value={recommendation2Text}
                    onChange={(e) => setRecommendation2Text(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-start mt-6">
            <Button
              size="large"
              onClick={onPrev}
              className="min-w-[100px] sm:min-w-[120px] rounded-lg"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="primary"
              size="large"
              className="rounded-lg border-none min-w-[140px] sm:min-w-[160px]"
              style={{ backgroundColor: theme.colors.primary }}
              onClick={handleSaveRecommendations}
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompleteStep;