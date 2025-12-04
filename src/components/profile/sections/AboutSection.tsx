import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Space, Typography, Form, Input } from 'antd';
import { EditOutlined, FileTextOutlined, CloseOutlined } from '@ant-design/icons';
import { theme } from '@/lib/theme';

const { TextArea } = Input;
const { Paragraph } = Typography;

interface AboutData {
  description: string;
}

interface AboutSectionProps {
  data: AboutData;
  onSave: (data: Partial<AboutData>) => void;
}

const AboutSection: React.FC<AboutSectionProps> = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      description: data.description
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
    if (data.description) {
      form.setFieldsValue({
        description: data.description
      });
    }
  }, [data, form]);

  const renderDisplayView = () => (
    <div className="text-center sm:text-left px-2">
      <Paragraph className="text-sm sm:text-base leading-relaxed">
        {data.description || 'Click Edit to add your professional background and interests.'}
      </Paragraph>
    </div>
  );

  const renderEditView = () => (
    <Form form={form} layout="vertical" className="w-full mx-auto">
      <Form.Item
        name="description"
        label="About yourself"
        rules={[{ required: true, message: 'Please enter your about information' }]}
      >
        <TextArea
          rows={4}
          placeholder="Tell us about yourself, your experience, and what you're passionate about..."
          className="resize-none"
          showCount
          maxLength={500}
        />
      </Form.Item>
      <div className="flex justify-end pt-2">
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
            icon={<FileTextOutlined />}
            className="bg-blue-600"
          />
          <span>About</span>
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

export default AboutSection;