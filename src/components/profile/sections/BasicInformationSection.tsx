import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Space, Typography, Form, Input, Upload } from 'antd';
import { UserOutlined, EditOutlined, InfoCircleOutlined, CameraOutlined, CloseOutlined } from '@ant-design/icons';
import { theme } from '@/lib/theme';
import type { UploadChangeParam } from 'antd/es/upload';

const { Title, Text } = Typography;

interface BasicInformationData {
  profileImage?: File | string;
  fullName: string;
  professionalHeadline: string;
  city: string;
  country: string;
}

interface BasicInformationSectionProps {
  data: BasicInformationData;
  onSave: (data: Partial<BasicInformationData>) => void;
}

const BasicInformationSection: React.FC<BasicInformationSectionProps> = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    // Reset image preview when starting to edit
    setImagePreview(null);
    form.setFieldsValue({
      fullName: data.fullName,
      professionalHeadline: data.professionalHeadline,
      city: data.city,
      country: data.country,
      profileImage: data.profileImage
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const formData = { ...values };
      // Ensure the profileImage is properly set
      if (formData.profileImage) {
        // If it's a File object, keep it as is
        // This will be stored in the parent component state
        console.log('Saving profile image:', formData.profileImage);
      }
      onSave(formData);
      setIsEditing(false);
    });
  };

  const handleUploadChange = (info: UploadChangeParam) => {
    const { fileList } = info;
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj || fileList[0];
      form.setFieldValue('profileImage', file);
      
      // Create preview URL for the uploaded image
      if (file && file instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      form.setFieldValue('profileImage', null);
      setImagePreview(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImagePreview(null);
  };

  // Load initial data when component mounts
  useEffect(() => {
    if (data.fullName) {
      form.setFieldsValue({
        fullName: data.fullName,
        professionalHeadline: data.professionalHeadline,
        city: data.city,
        country: data.country,
      });
    }
  }, [data, form]);

  const renderDisplayView = () => {
    // Check if there's an image to display (either from data or preview)
    const displayImage = imagePreview || (data.profileImage && typeof data.profileImage === 'string' ? data.profileImage : null);
    
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        <div className="flex-shrink-0">
          <Avatar
            size={{ xs: 56, sm: 64, md: 80, lg: 80, xl: 80, xxl: 80 }}
            src={displayImage}
            icon={!displayImage ? <UserOutlined /> : undefined}
            className="border-2 border-transparent"
            style={!displayImage ? { background: theme.gradients.primary } : {}}
          />
        </div>

        <div className="flex flex-col gap-1 text-center sm:text-left">
          <Title level={4} className="m-0 text-lg sm:text-xl">
            {data.fullName || 'No name provided'}
          </Title>
          <Text className="text-sm sm:text-base">
            {data.professionalHeadline || 'No headline provided'}
          </Text>
          <div className="flex items-center justify-center sm:justify-start gap-1">
            <Text type="secondary" className="text-sm">
              {data.city && data.country 
                ? `${data.city}, ${data.country}`
                : 'No location provided'
              }
            </Text>
          </div>
        </div>
      </div>
    );
  };

  const renderEditView = () => (
    <Form form={form} layout="vertical" className="max-w-6xl mx-auto p-2 sm:p-4">
      <div className="flex flex-col items-center gap-6">
        {/* Upload Image Field */}
        <div className="flex flex-col items-center gap-3">
          <Form.Item
            name="profileImage"
            className="mb-0"
          >
            <Upload
              listType="picture-circle"
              showUploadList={false}
              beforeUpload={() => false}
              maxCount={1}
              onChange={handleUploadChange}
            >
              <div className="relative">
                <Avatar
                  size={{ xs: 80, sm: 96, md: 120, lg: 120, xl: 120, xxl: 120 }}
                  src={imagePreview}
                  icon={!imagePreview ? <UserOutlined /> : undefined}
                  className="border-2 border-gray-300"
                  style={!imagePreview ? { background: theme.gradients.primary } : {}}
                />
                <Button
                  type="primary"
                  shape="circle"
                  icon={<CameraOutlined />}
                  size="small"
                  className="absolute bottom-0 right-0 border-2 border-white"
                  style={{ backgroundColor: theme.colors.primary }}
                />
              </div>
            </Upload>
          </Form.Item>
          <Button
            type="link"
            className="text-xs text-center p-0"
            style={{ color: theme.colors.primary }}
          >
            Add photo
          </Button>
        </div>

        {/* Form Fields */}
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-4">
            {/* Full Name Field */}
            <Form.Item
              name="fullName"
              label="Full name"
              rules={[
                { required: true, message: "Please enter your full name" },
              ]}
            >
              <Input size="large" placeholder="e.g. Amit Kumar" />
            </Form.Item>

            {/* Professional Headline Field */}
            <Form.Item
              name="professionalHeadline"
              label="Professional headline"
              rules={[
                {
                  required: true,
                  message: "Please enter your professional headline",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="e.g. Serial Entrepreneur & FinTech Expert"
              />
            </Form.Item>

            {/* City and Country Fields - Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: "Please enter your city" }]}
              >
                <Input size="large" placeholder="e.g. Mumbai" />
              </Form.Item>

              <Form.Item
                name="country"
                label="Country"
                rules={[
                  { required: true, message: "Please enter your country" },
                ]}
              >
                <Input size="large" placeholder="e.g. India" />
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
        </div>
      </div>
    </Form>
  );

  return (
    <Card
      title={
        <Space>
          <InfoCircleOutlined className="text-blue-600" />
          <span>Basic Information</span>
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

export default BasicInformationSection;