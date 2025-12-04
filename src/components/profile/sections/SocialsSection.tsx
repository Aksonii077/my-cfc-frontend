import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Space, Typography, Form, Input } from 'antd';
import { EditOutlined, ShareAltOutlined, CloseOutlined, InstagramOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import { theme } from '@/lib/theme';

const { Title } = Typography;

interface SocialsData {
  linkedinProfile: string;
  twitterProfile: string;
  personalWebsite: string;
  angelListProfile: string;
}

interface SocialsSectionProps {
  data: SocialsData;
  onSave: (data: Partial<SocialsData>) => void;
}

const SocialsSection: React.FC<SocialsSectionProps> = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      linkedinProfile: data.linkedinProfile,
      twitterProfile: data.twitterProfile,
      personalWebsite: data.personalWebsite,
      angelListProfile: data.angelListProfile
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      onSave(values);
      setIsEditing(false);
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Load initial data when component mounts
  useEffect(() => {
    form.setFieldsValue({
      linkedinProfile: data.linkedinProfile,
      twitterProfile: data.twitterProfile,
      personalWebsite: data.personalWebsite,
      angelListProfile: data.angelListProfile
    });
  }, [data, form]);

  const renderDisplayView = () => (
    <div className="flex gap-4 sm:gap-6 justify-center sm:justify-start">
      <Avatar
        size={{ xs: 48, sm: 56, md: 64 }}
        icon={<InstagramOutlined />}
        className="text-white"
        style={{
          background:
            "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
        }}
      />
      <Avatar
        size={{ xs: 48, sm: 56, md: 64 }}
        icon={<LinkedinOutlined />}
        className="bg-blue-700 text-white"
      />
      <Avatar
        size={{ xs: 48, sm: 56, md: 64 }}
        icon={<TwitterOutlined />}
        className="bg-black text-white"
      />
    </div>
  );

  const renderEditView = () => (
    <Form form={form} layout="vertical" className="w-full">
      <div className="grid grid-cols-1 gap-6">
        {/* LinkedIn Profile */}
        <div>
          <Title level={5} className="mb-3 text-gray-600">
            LinkedIn Profile
          </Title>
          <Form.Item name="linkedinProfile">
            <Input
              size="large"
              placeholder="https://linkedin.com/in/yourprofile"
              className="bg-gray-50"
            />
          </Form.Item>
        </div>

        {/* Twitter / X Profile */}
        <div>
          <Title level={5} className="mb-3 text-gray-600">
            Twitter / X Profile
          </Title>
          <Form.Item name="twitterProfile">
            <Input
              size="large"
              placeholder="https://twitter.com/yourhandle"
              className="bg-gray-50"
            />
          </Form.Item>
        </div>

        {/* Personal Website */}
        <div>
          <Title level={5} className="mb-3 text-gray-600">
            Personal Website
          </Title>
          <Form.Item name="personalWebsite">
            <Input
              size="large"
              placeholder="https://yourwebsite.com"
              className="bg-gray-50"
            />
          </Form.Item>
        </div>

        {/* AngelList Profile */}
        <div>
          <Title level={5} className="mb-3 text-gray-600">
            AngelList Profile
          </Title>
          <Form.Item name="angelListProfile">
            <Input
              size="large"
              placeholder="https://angel.co/yourprofile"
              className="bg-gray-50"
            />
          </Form.Item>
        </div>
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
            icon={<ShareAltOutlined />}
            className="bg-blue-600"
          />
          <span>Socials</span>
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

export default SocialsSection;