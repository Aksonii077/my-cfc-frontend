import React, { useEffect } from 'react';
import { Button, Typography, Tag } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { theme } from '@/lib/theme';

const { Title, Paragraph } = Typography;

interface WelcomeStepProps {
  onNext: () => void;
  onBack?: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onBack }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  return (
    <div className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f6f8ff', minHeight: '100vh', paddingTop: '1rem', paddingBottom: '1rem' }}>
      {/* Founding Mentor Tag */}
      <div className="mb-4 sm:mb-6">
        <Tag 
          className="text-white text-xs sm:text-sm px-6 sm:px-8 lg:px-12 py-1 sm:py-2 rounded-full border-none mb-2"
          style={{ background: theme.gradients.primary }}
        >
          Founding Mentor
        </Tag>
        <div>
          <Tag 
            className="text-xs px-2 sm:px-3 py-1 mt-2 sm:mt-4 rounded-full border-none"
            style={{ 
              backgroundColor: '#3ae5a7',
              color: theme.colors.primary 
            }}
          >
            Invite only
          </Tag>
        </div>
      </div>

      {/* Group 115 Image */}
      <div className="mb-4 sm:mb-6 mt-8 sm:mt-0">
        <img 
          src="/Group 115.svg" 
          alt="Welcome illustration" 
          className="mx-auto max-w-full"
        />
      </div>

      {/* Description */}
      <Paragraph className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-xl sm:max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
        You're now part of an invite-only circle shaping the future of entrepreneurship in India. 
        Your incubator journey starts here.
      </Paragraph>

      {/* What Happens Next Section */}
      <div className="mt-8 sm:mt-12">
        <Title level={2} className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 text-gray-800">
          What Happens Next
        </Title>

        {/* Back Button - Left Aligned */}
        {onBack && (
          <div className="text-left mb-4 sm:mb-6 px-2 sm:px-0">
            <Button
              onClick={onBack}
              icon={<LeftOutlined />}
              className="text-gray-600 text-sm sm:text-base"
              size="small"
            >
              Back
            </Button>
          </div>
        )}

        {/* Group 114 Image */}
        <div className="mb-4 sm:mb-6">
          <img 
            src="/Group 114.svg" 
            alt="Next steps illustration" 
            className="mx-auto"
          />
        </div>

        {/* Description with Primary Color */}
        <Paragraph 
          className="text-sm sm:text-base lg:text-lg max-w-xl sm:max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0"
          style={{ color: theme.colors.primary }}
        >
          You're now part of an exclusive community shaping India's entrepreneurial ecosystem
        </Paragraph>
      </div>
    </div>
  );
};

export default WelcomeStep;