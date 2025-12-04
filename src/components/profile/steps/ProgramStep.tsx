import React from 'react';
import { Button, Typography, Card } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { theme } from '@/lib/theme';

const { Title, Paragraph, Text } = Typography;

interface ProgramStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const ProgramStep: React.FC<ProgramStepProps> = ({ onNext, onPrev }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#f6f8ff', minHeight: '100vh', paddingTop: '1rem', paddingBottom: '1rem' }}>
      {/* Program Details Header */}
      <div className="text-center mb-8 sm:mb-12">
        <Title level={1} className="text-xl sm:text-2xl lg:text-3xl mb-4">
          Program Details
        </Title>
        <Paragraph className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          At CoFounder Circle, mentors don't just give advice, they share in the
          upside. You'll incubate startups, earn sweat equity, and access the
          same AI-powered playbooks that founders use.
        </Paragraph>
      </div>

      {/* Pricing Cards */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {/* Subscription Fee Card */}
        <Card className="text-center p-4 sm:p-6 rounded-2xl bg-white border-blue-300 shadow-lg">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-lg sm:text-xl font-bold">₹</span>
          </div>
          <Title level={4} className="text-gray-800 mb-2 text-base sm:text-lg">
            Subscription Fee
          </Title>
          <div className="mb-2">
            <Text className="text-lg sm:text-xl text-gray-800 line-through">
              ₹1.2L annually
            </Text>
          </div>
          <Text className="text-gray-500 text-xs sm:text-sm block mb-1">
            Subscription fee for first year waived
          </Text>
          <Text className="text-gray-500 text-xs sm:text-sm">
            for Founding Mentors
          </Text>
        </Card>

        {/* CoFounder Circle Carry Card */}
        <Card className="text-center p-4 sm:p-6 rounded-2xl bg-white border-blue-300 shadow-lg">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <Title level={4} className="text-gray-800 mb-2 text-base sm:text-lg">
            CoFounder Circle Carry
          </Title>
          <div className="mb-2">
            <Text className="text-lg sm:text-xl text-gray-800">20%</Text>
          </div>
          <Text className="text-gray-500 text-xs sm:text-sm">
            of whatever sweat equity you receive
          </Text>
        </Card>
      </div>

      {/* How It Works Section */}
      <Card className="mb-8 sm:mb-12 p-4 sm:p-6 lg:p-8 rounded-2xl bg-gray-50 border-blue-300 shadow-lg">
        {/* Section Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
            </svg>
          </div>
          <Title
            level={2}
            className="m-0 text-gray-800 text-lg sm:text-xl lg:text-2xl"
          >
            How It Works
          </Title>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 sm:space-y-8">
          {/* Subscription Fee Section */}
          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
              <Title
                level={4}
                className="m-0 text-gray-800 text-sm sm:text-base lg:text-lg"
              >
                Subscription Fee
              </Title>
            </div>
            <Paragraph className="text-gray-700 ml-6 sm:ml-7 text-sm sm:text-base leading-relaxed">
              There is a Rs 1.2 lacs annual (Rs 9.99k per month) subscription
              fee for Mentors. However, as a founding mentor, your first year
              subscription is completely waived.
            </Paragraph>
          </div>

          {/* Carry Section */}
          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
              <Title
                level={4}
                className="m-0 text-gray-800 text-sm sm:text-base lg:text-lg"
              >
                Carry
              </Title>
            </div>
            <Paragraph className="text-gray-700 ml-6 sm:ml-7 text-sm sm:text-base leading-relaxed">
              You will earn sweat equity in startups you mentor and incubate. As
              its carry, CoFounder Circle takes 20% of whatever sweat equity you
              receive.
            </Paragraph>
          </div>

          {/* Exit & Monetization Section */}
          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
              <Title
                level={4}
                className="m-0 text-gray-800 text-sm sm:text-base lg:text-lg"
              >
                Exit & Monetization
              </Title>
            </div>
            <Paragraph className="text-gray-700 ml-6 sm:ml-7 text-sm sm:text-base leading-relaxed">
              CoFounder Circle will help you monetize your sweat equity. Every
              startup you incubate builds your portfolio, and through our
              Investor Module, we help you track, value, and ultimately exit
              your investments. You're not just giving back - you're building
              wealth alongside the founders you support.
            </Paragraph>
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-3 mt-8 sm:mt-12">
        <Button
          size="large"
          onClick={onPrev}
          icon={<LeftOutlined />}
          className="min-w-[100px] sm:min-w-[120px]"
        >
          Back
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={onNext}
          className="min-w-[140px] sm:min-w-[160px] border-none"
          style={{ backgroundColor: theme.colors.primary }}
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default ProgramStep;