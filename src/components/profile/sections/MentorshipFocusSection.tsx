import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Space, Typography, Tag, Form, Input, Select } from 'antd';
import { EditOutlined, TeamOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { theme } from '@/lib/theme';

const { Title, Text } = Typography;

interface MentorshipFocusData {
  industryVerticals: string[];
  functionalAreas: string[];
  availability: string;
}

interface MentorshipFocusSectionProps {
  data: MentorshipFocusData;
  onSave: (data: Partial<MentorshipFocusData>) => void;
}

const MentorshipFocusSection: React.FC<MentorshipFocusSectionProps> = ({ data, onSave }) => {
  // Predefined options
  const industryVerticals = [
    'Banking', 'Digital Payments', 'UPI', 'BNPL', 'Lending', 'Microfinance',
    'Credit Scoring', 'InsurTech', 'Wealth Management', 'Investment', 'Trading',
    'Crypto', 'Payments'
  ];

  const functionalAreas = [
    'Marketing', 'Growth Marketing', 'Performance Marketing', 'Brand Marketing',
    'Content Marketing', 'Social Media Marketing', 'Sales', 'Sales Development',
    'Account Management', 'Customer Success', 'Partnership', 'Business Development'
  ];

  const availabilityOptions = [
    '1-2 hr/ wk', '3-5 hr/ wk', '6-10 hr/ wk', '10+ hr/ wk'
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [selectedIndustryVerticals, setSelectedIndustryVerticals] = useState(data.industryVerticals);
  const [selectedFunctionalAreas, setSelectedFunctionalAreas] = useState(data.functionalAreas);
  const [selectedAvailability, setSelectedAvailability] = useState(data.availability);
  const [customIndustryInput, setCustomIndustryInput] = useState('');
  const [customFunctionalInput, setCustomFunctionalInput] = useState('');

  const toggleIndustryVertical = (vertical: string) => {
    if (selectedIndustryVerticals.includes(vertical)) {
      setSelectedIndustryVerticals(selectedIndustryVerticals.filter(item => item !== vertical));
    } else {
      setSelectedIndustryVerticals([...selectedIndustryVerticals, vertical]);
    }
  };

  const toggleFunctionalArea = (area: string) => {
    if (selectedFunctionalAreas.includes(area)) {
      setSelectedFunctionalAreas(selectedFunctionalAreas.filter(item => item !== area));
    } else {
      setSelectedFunctionalAreas([...selectedFunctionalAreas, area]);
    }
  };

  const addCustomIndustryVertical = () => {
    if (customIndustryInput && !selectedIndustryVerticals.includes(customIndustryInput)) {
      setSelectedIndustryVerticals([...selectedIndustryVerticals, customIndustryInput]);
      setCustomIndustryInput('');
    }
  };

  const addCustomFunctionalArea = () => {
    if (customFunctionalInput && !selectedFunctionalAreas.includes(customFunctionalInput)) {
      setSelectedFunctionalAreas([...selectedFunctionalAreas, customFunctionalInput]);
      setCustomFunctionalInput('');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSelectedIndustryVerticals(data.industryVerticals);
    setSelectedFunctionalAreas(data.functionalAreas);
    setSelectedAvailability(data.availability);
  };

  const handleSave = () => {
    onSave({
      industryVerticals: selectedIndustryVerticals,
      functionalAreas: selectedFunctionalAreas,
      availability: selectedAvailability
    });
    setIsEditing(false);
  };

  // Load initial data when component mounts
  useEffect(() => {
    setSelectedIndustryVerticals(data.industryVerticals);
    setSelectedFunctionalAreas(data.functionalAreas);
    setSelectedAvailability(data.availability);
  }, [data]);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const renderDisplayView = () => (
    <div className="flex flex-col gap-4 sm:gap-6 w-full">
      {/* Industry Focus */}
      <div>
        <Title level={5} className="mb-2 text-base sm:text-lg">
          Industry Focus
        </Title>
        <div className="flex flex-wrap gap-2">
          {data.industryVerticals.length > 0 ? (
            data.industryVerticals.map((industry, index) => (
              <Tag 
                key={index} 
                className="text-xs sm:text-sm text-white"
                style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }}
              >
                {industry}
              </Tag>
            ))
          ) : (
            <Text type="secondary" className="text-xs sm:text-sm">No industry verticals selected</Text>
          )}
        </div>
      </div>

      {/* Functional Expertise */}
      <div>
        <Title level={5} className="mb-2 text-base sm:text-lg">
          Functional Expertise
        </Title>
        <div className="flex flex-wrap gap-2">
          {data.functionalAreas.length > 0 ? (
            data.functionalAreas.map((area, index) => (
              <Tag 
                key={index} 
                className="text-xs sm:text-sm text-white"
                style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }}
              >
                {area}
              </Tag>
            ))
          ) : (
            <Text type="secondary" className="text-xs sm:text-sm">No functional areas selected</Text>
          )}
        </div>
      </div>

      {/* Availability */}
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <Text strong className="text-green-600 text-sm sm:text-base">
            Availability:
          </Text>
          <Text className="text-sm sm:text-base">
            {data.availability || 'Not specified'}
          </Text>
        </div>
      </div>
    </div>
  );

  const renderEditView = () => (
    <Form form={form} layout="vertical" className="w-full">
      {/* Industry Verticals Section */}
      <div className="mb-6">
        <Title level={5} className="mb-3">
          Industry verticals
        </Title>

        {/* Selected Industry Verticals Display */}
        {selectedIndustryVerticals.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {selectedIndustryVerticals.map((vertical, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => toggleIndustryVertical(vertical)}
                  className="text-xs sm:text-sm text-white"
                  style={{
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                    color: "white",
                  }}
                  closeIcon={<CloseOutlined style={{ color: "white" }} />}
                >
                  {vertical}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Predefined Industry Options */}
        <div className="flex flex-wrap gap-2 mb-4">
          {industryVerticals.map((vertical) => (
            <Button
              key={vertical}
              size="small"
              icon={<PlusOutlined />}
              className={`text-xs ${
                selectedIndustryVerticals.includes(vertical) ? "opacity-50" : ""
              }`}
              disabled={selectedIndustryVerticals.includes(vertical)}
              onClick={() => toggleIndustryVertical(vertical)}
            >
              {vertical}
            </Button>
          ))}
        </div>

        {/* Add Custom Industry Vertical */}
        <Text className="text-gray-500 mb-2 block">
          Add custom industry vertical
        </Text>
        <div className="flex gap-2">
          <Input
            placeholder="Enter custom industry vertical"
            value={customIndustryInput}
            onChange={(e) => setCustomIndustryInput(e.target.value)}
            onPressEnter={addCustomIndustryVertical}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: theme.colors.primary }}
            onClick={addCustomIndustryVertical}
          />
        </div>
      </div>

      {/* Functional Areas Section */}
      <div className="mb-6">
        <Title level={5} className="mb-3">
          Functional areas
        </Title>

        {/* Selected Functional Areas Display */}
        {selectedFunctionalAreas.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {selectedFunctionalAreas.map((area, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => toggleFunctionalArea(area)}
                  className="text-xs sm:text-sm text-white"
                  style={{
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                    color: "white",
                  }}
                  closeIcon={<CloseOutlined style={{ color: "white" }} />}
                >
                  {area}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Predefined Functional Area Options */}
        <div className="flex flex-wrap gap-2 mb-4">
          {functionalAreas.map((area) => (
            <Button
              key={area}
              size="small"
              icon={<PlusOutlined />}
              className={`text-xs ${
                selectedFunctionalAreas.includes(area) ? "opacity-50" : ""
              }`}
              disabled={selectedFunctionalAreas.includes(area)}
              onClick={() => toggleFunctionalArea(area)}
            >
              {area}
            </Button>
          ))}
        </div>

        {/* Add Custom Functional Area */}
        <Text className="text-gray-500 mb-2 block">
          Add custom functional areas
        </Text>
        <div className="flex gap-2">
          <Input
            placeholder="Enter custom functional area"
            value={customFunctionalInput}
            onChange={(e) => setCustomFunctionalInput(e.target.value)}
            onPressEnter={addCustomFunctionalArea}
            className="flex-1"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: theme.colors.primary }}
            onClick={addCustomFunctionalArea}
          />
        </div>
      </div>

      {/* Availability Section */}
      <div className="mb-6">
        <Title level={5} className="mb-3">
          Availability
        </Title>
        <Select
          placeholder="Select your availability"
          className="w-full max-w-xs"
          value={selectedAvailability}
          onChange={setSelectedAvailability}
        >
          {availabilityOptions.map((option) => (
            <Select.Option key={option} value={option}>
              {option}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          onClick={handleSave}
          style={{ backgroundColor: theme.colors.primary }}
          className="w-full sm:w-auto min-w-[120px]"
        >
          Save
        </Button>
      </div>
    </Form>
  );

  return (
    <Card
      title={
        <Space>
          <Avatar
            size="small"
            icon={<TeamOutlined />}
            className="bg-blue-600"
          />
          <span>Mentorship Focus</span>
        </Space>
      }
      extra={
        isEditing ? (
          <Button type="text" icon={<CloseOutlined />} onClick={handleCancel}>
          </Button>
        ) : (
          <Button type="text" icon={<EditOutlined />} onClick={handleEdit}>
            Edit
          </Button>
        )
      }
      className="mb-6 shadow-lg rounded-3xl"
    >
      {isEditing ? renderEditView() : renderDisplayView()}
    </Card>
  );
};

export default MentorshipFocusSection;