import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Typography, Tag, message, Modal, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { theme } from '@/lib/theme';
import { apiClient } from '@/utils/api';
import BasicInformationSection from '../sections/BasicInformationSection';
import AboutSection from '../sections/AboutSection';
import ExperienceSection from '../sections/ExperienceSection';
import MentorshipFocusSection from '../sections/MentorshipFocusSection';
import SocialsSection from '../sections/SocialsSection';

const { Title, Text, Paragraph } = Typography;

interface ExperienceData {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  summary: string;
}

interface ApiExperienceData {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  summary: string;
}

interface FormData {
  basicInformation: {
    profileImage?: File | string;
    fullName: string;
    professionalHeadline: string;
    city: string;
    country: string;
  };
  about: string;
  experiences: ExperienceData[];
  mentorshipFocus: {
    industryVerticals: string[];
    functionalAreas: string[];
    availability: string;
  };
  socials: {
    linkedinProfile: string;
    twitterProfile: string;
    personalWebsite: string;
    angelListProfile: string;
  };
  recommendations: {
    recommendation_1_name: string | null;
    recommendation_1_email: string | null;
    recommendation_1_text: string | null;
    recommendation_2_name: string | null;
    recommendation_2_email: string | null;
    recommendation_2_text: string | null;
  };
}

interface ProfileStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ onNext, onPrev }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMentorInfoModalOpen, setIsMentorInfoModalOpen] = useState(false);
  const [isMentorInfoSubmitted, setIsMentorInfoSubmitted] = useState(false);
  const [isSubmittingMentorInfo, setIsSubmittingMentorInfo] = useState(false);
  const [isMentorInfoSubmitDisabled, setIsMentorInfoSubmitDisabled] = useState(false);
  const [mentorInfoForm] = Form.useForm();
  const [isInitialCheckPending, setIsInitialCheckPending] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    basicInformation: {
      fullName: '',
      professionalHeadline: '',
      city: '',
      country: '',
    },
    about: '',
    experiences: [],
    mentorshipFocus: {
      industryVerticals: [],
      functionalAreas: [],
      availability: '',
    },
    socials: {
      linkedinProfile: '',
      twitterProfile: '',
      personalWebsite: '',
      angelListProfile: '',
    },
    recommendations: {
      recommendation_1_name: null,
      recommendation_1_email: null,
      recommendation_1_text: null,
      recommendation_2_name: null,
      recommendation_2_email: null,
      recommendation_2_text: null,
    },
  });

  useEffect(() => { 
    const loadDataFromAPI = async () => {
      try {
        
        const response = await apiClient.get('/mentor-onboarding/my-profile');

        

        // Map API response to form data structure
        const apiData = response.data;
        
        const formattedData: FormData = {
          basicInformation: {
            fullName: apiData.basic_information?.fullName || '',
            professionalHeadline: apiData.basic_information?.professionalHeadline || '',
            city: apiData.basic_information?.city || '',
            country: apiData.basic_information?.country || '',
          },
          about: apiData.about || '',
          experiences: apiData.experiences?.map((exp: ApiExperienceData) => {
            return {
              company: exp.company || '',
              title: exp.title || '',
              startDate: exp.startDate || '',
              endDate: exp.endDate || '',
              summary: exp.summary || '',
            };
          }) || [],
          mentorshipFocus: {
            industryVerticals: apiData.mentorship_focus?.industryVerticals || [],
            functionalAreas: apiData.mentorship_focus?.functionalAreas || [],
            availability: apiData.mentorship_focus?.availability || '',
          },
          socials: {
            linkedinProfile: apiData.socials?.linkedinProfile || '',
            twitterProfile: apiData.socials?.twitterProfile || '',
            personalWebsite: apiData.socials?.personalWebsite || '',
            angelListProfile: apiData.socials?.angelListProfile || '',
          },
          recommendations: {
            recommendation_1_name: apiData.recommendation_1_name || null,
            recommendation_1_email: apiData.recommendation_1_email || null,
            recommendation_1_text: apiData.recommendation_1_text || null,
            recommendation_2_name: apiData.recommendation_2_name || null,
            recommendation_2_email: apiData.recommendation_2_email || null,
            recommendation_2_text: apiData.recommendation_2_text || null,
          },
        };

        console.log('Formatted data for form:', formattedData);
        setFormData(formattedData);
        setProfileExists(true); // Profile exists since we successfully loaded data
        setIsInitialCheckPending(false);
        
      } catch (error: any) {
        console.error('Error fetching mentor profile data:', error);
        
        if (error.response?.status === 404) {
          // Profile doesn't exist yet; check if verification already submitted
          console.log('No existing profile found, checking verification status');
          setProfileExists(false); // Profile doesn't exist
          try {
            const verificationResp = await apiClient.get('/mentor-onboarding/verification');
            const v: any = verificationResp.data || {};
            mentorInfoForm.setFieldsValue({
              name: v.name || '',
              number: v.number || '',
              linkedin_url: v.linkedin_url || v.linkedinProfile || '',
            });
            setIsMentorInfoSubmitDisabled(true);
            setIsMentorInfoModalOpen(true);
            setIsMentorInfoSubmitted(false);
          } catch (verr) {
            // No verification found; allow fresh submission
            setIsMentorInfoSubmitDisabled(false);
            setIsMentorInfoModalOpen(true);
            setIsMentorInfoSubmitted(false);
          }
          setIsInitialCheckPending(false);
        }
        // Note: Other errors are handled by the axios interceptor
        if (error.response?.status !== 404) {
          setIsInitialCheckPending(false);
        }
      }
    };

    loadDataFromAPI();
  }, [])

  // Update functions for each section
  const updateBasicInformation = (data: Partial<FormData['basicInformation']>) => {
    setFormData(prev => ({
      ...prev,
      basicInformation: { ...prev.basicInformation, ...data }
    }));
  };

  const updateAbout = (data: { description: string }) => {
    setFormData(prev => ({
      ...prev,
      about: data.description
    }));
  };

  const updateExperience = (data: { experiences: ExperienceData[] }) => {
    setFormData(prev => ({
      ...prev,
      experiences: data.experiences
    }));
  };

  const updateMentorshipFocus = (data: Partial<FormData['mentorshipFocus']>) => {
    setFormData(prev => ({
      ...prev,
      mentorshipFocus: { ...prev.mentorshipFocus, ...data }
    }));
  };

  const updateSocials = (data: Partial<FormData['socials']>) => {
    setFormData(prev => ({
      ...prev,
      socials: { ...prev.socials, ...data }
    }));
  };

  const handleCancelMentorInfo = () => {
    setIsMentorInfoModalOpen(false);
    navigate('/mentor');
  };

  const handleSubmitMentorInfo = async () => {
    try {
      const values = await mentorInfoForm.validateFields();
      setIsSubmittingMentorInfo(true);

      const payload = {
        name: values.name,
        number: values.number,
        about: null,
        linkedin_url: values.linkedin_url,
      };

      await apiClient.post('/mentor-onboarding/verification', payload);

      setFormData(prev => ({
        ...prev,
        basicInformation: {
          ...prev.basicInformation,
          fullName: values.name || prev.basicInformation.fullName,
        },
        socials: {
          ...prev.socials,
          linkedinProfile: values.linkedin_url || prev.socials.linkedinProfile,
        },
      }));

      message.success('Thank you for registering! We will reach out to you.');
      setIsMentorInfoSubmitted(true);
      mentorInfoForm.resetFields();
    } catch (e) {
      // validation errors are surfaced by antd
    } finally {
      setIsSubmittingMentorInfo(false);
    }
  };

  // Function to save data to API
  const saveDataToAPI = async () => {
    setIsLoading(true);
    
    try {
      // Prepare the payload to match the API structure
      const payload = {
        basicInformation: {
          fullName: formData.basicInformation.fullName,
          professionalHeadline: formData.basicInformation.professionalHeadline,
          city: formData.basicInformation.city,
          country: formData.basicInformation.country,
          profileImage: formData.basicInformation.profileImage,
        },
        about: formData.about,
        experiences: formData.experiences,
        mentorshipFocus: {
          industryVerticals: formData.mentorshipFocus.industryVerticals,
          functionalAreas: formData.mentorshipFocus.functionalAreas,
          availability: formData.mentorshipFocus.availability,
        },
        socials: {
          linkedinProfile: formData.socials.linkedinProfile,
          twitterProfile: formData.socials.twitterProfile,
          personalWebsite: formData.socials.personalWebsite,
          angelListProfile: formData.socials.angelListProfile,
        },
        recommendation1Name: formData.recommendations.recommendation_1_name,
        recommendation1Email: formData.recommendations.recommendation_1_email,
        recommendation1Text: formData.recommendations.recommendation_1_text,
        recommendation2Name: formData.recommendations.recommendation_2_name,
        recommendation2Email: formData.recommendations.recommendation_2_email,
        recommendation2Text: formData.recommendations.recommendation_2_text,
      };

      console.log('Saving mentor onboarding data:', payload);
      console.log('Profile exists:', profileExists);
      
      // Use PUT if profile exists, POST if it's a new profile
      const response = profileExists 
        ? await apiClient.put('/mentor-onboarding/', payload)
        : await apiClient.post('/mentor-onboarding/', payload);

      console.log('Mentor onboarding saved successfully:', response.data);
      message.success('Profile saved successfully!');
      
      // Set profileExists to true after successful creation/update
      if (!profileExists) {
        setProfileExists(true);
      }
      
      // Proceed to next step only after successful save
      onNext();
      
    } catch (error) {
      console.error('Error saving mentor onboarding data:', error);
      // Note: Error messages are handled by the axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "#f6f8ff",
        minHeight: "100vh",
        paddingTop: "1rem",
        paddingBottom: "1rem",
      }}
    >
      <Modal
        title="Join The Cofounder Circle Mentors Program"
        open={isMentorInfoModalOpen}
        onCancel={handleCancelMentorInfo}
        footer={null}
        centered
        destroyOnClose
        maskClosable={false}
        maskStyle={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          clipPath: 'polygon(0 88px, 100% 88px, 100% 100%, 0 100%)',
          WebkitClipPath: 'polygon(0 88px, 100% 88px, 100% 100%, 0 100%)'
        }}
      >
        <Paragraph className="text-gray-600 mb-4">
          {isMentorInfoSubmitted
            ? 'Thank you for registering! We will reach out to you.'
            : 'Join the waitlist to be part of the Mentors Program.'}
        </Paragraph>

        {!isMentorInfoSubmitted ? (
          <Form form={mentorInfoForm} layout="vertical">
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input placeholder="Enter your full name" size="large" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="number"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input placeholder="e.g. +91 98765 43210" size="large" />
            </Form.Item>

            {/* About field removed as per requirement */}

            <Form.Item
              label="LinkedIn URL"
              name="linkedin_url"
              rules={[{ required: true, message: 'Please enter your LinkedIn profile URL' }]}
            >
              <Input placeholder="https://linkedin.com/in/your-profile" size="large" />
            </Form.Item>

            <div className="flex gap-3 justify-end mt-4">
              <Button onClick={handleCancelMentorInfo}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleSubmitMentorInfo} loading={isSubmittingMentorInfo} disabled={isSubmittingMentorInfo || isMentorInfoSubmitDisabled}>
                Submit
              </Button>
            </div>
          </Form>
        ) : (
          <div className="flex gap-3 justify-end mt-4">
            <Button type="primary" onClick={() => navigate('/mentor')}>
              Done
            </Button>
          </div>
        )}
      </Modal>
      {/* Show content as soon as initial check completes (even if modal is open) */}
      {(!isInitialCheckPending) && (<>
      <Card className="mb-8 shadow-lg rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
          <div className="flex-shrink-0 mx-auto sm:mx-0 flex flex-col items-center gap-3">
            <Tag
              className="text-white text-xs sm:text-sm px-3 sm:px-4 py-1 rounded-full border-none"
              style={{ background: theme.gradients.primary }}
            >
              Founding Mentor
            </Tag>
            <Avatar
              size={{ xs: 80, sm: 96, md: 128, lg: 128, xl: 128, xxl: 128 }}
              icon={<UserOutlined />}
              className="border-2 border-transparent"
              style={{ background: theme.gradients.primary }}
            />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-4">
              <div className="flex-1">
                <Title
                  level={2}
                  className="m-0 text-blue-600 text-xl sm:text-2xl lg:text-3xl"
                >
                  {formData.basicInformation.fullName || "Demo User"}
                </Title>
                <Text className="text-sm sm:text-base text-gray-600 block mt-1">
                  {formData.basicInformation.professionalHeadline || "Serial Entrepreneur & FinTech Expert"}
                </Text>
                <Paragraph className="mt-2 mb-0 text-sm sm:text-base">
                  Review and update your profile information below. Each section
                  can be edited independently.
                </Paragraph>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Basic Information Section */}
      <BasicInformationSection 
        data={formData.basicInformation}
        onSave={updateBasicInformation}
      />

      {/* About Section */}
      <AboutSection 
        data={{ description: formData.about }}
        onSave={updateAbout}
      />

      {/* Experience Section */}
      <ExperienceSection 
        data={{ experiences: formData.experiences }}
        onSave={updateExperience}
      />

      {/* Mentorship Focus Section */}
      <MentorshipFocusSection 
        data={formData.mentorshipFocus}
        onSave={updateMentorshipFocus}
      />

      {/* Socials Section */}
      <SocialsSection 
        data={formData.socials}
        onSave={updateSocials}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-3 mt-6">
        <Button
          type="primary"
          size="large"
          onClick={saveDataToAPI}
          loading={isLoading}
          disabled={isLoading}
          className="min-w-[140px] sm:min-w-[160px] border-none"
          style={{ backgroundColor: theme.colors.primary }}
          icon={isLoading ? <LoadingOutlined /> : undefined}
        >
          {isLoading ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
      </>)}
    </div>
  );
};

export default ProfileStep;