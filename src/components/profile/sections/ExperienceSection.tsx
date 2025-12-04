import React, { useState, useEffect } from 'react';
import { Button, Card, Avatar, Space, Typography, Steps, Form, Input } from 'antd';
import { EditOutlined, AppstoreOutlined, PlusOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import { theme } from '@/lib/theme';

const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;

interface ExperienceData {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  summary: string;
}

interface ExperienceFormData {
  experiences: ExperienceData[];
}

interface ExperienceSectionProps {
  data: ExperienceFormData;
  onSave: (data: Partial<ExperienceFormData>) => void;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setIsEditing(true);
    // Pre-populate with existing experience data
    form.setFieldsValue({
      experiences: data.experiences.length > 0 
        ? data.experiences 
        : [{ company: '', title: '', startDate: '', endDate: '', summary: '' }]
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
    if (data.experiences.length > 0) {
      form.setFieldsValue({
        experiences: data.experiences
      });
    }
  }, [data, form]);

  const renderDisplayView = () => {
    if (data.experiences.length === 0) {
      return (
        <div className="text-center py-6 px-4">
          <Text type="secondary" className="text-sm">
            Click Edit to add your professional experience.
          </Text>
        </div>
      );
    }

    return (
      <div className="space-y-4 px-2">
        {data.experiences.map((exp, index) => (
          <div key={index} className="border-l-2 border-blue-200 pl-4 pb-4">
            <div className="space-y-1">
              <Title level={5} className="m-0 text-sm sm:text-base">
                {exp.title}
              </Title>
              <Text className="text-blue-600 font-medium text-xs sm:text-sm block">
                {exp.company}
              </Text>
              <Text type="secondary" className="text-xs block">
                {exp.startDate} - {exp.endDate || 'Present'}
              </Text>
              <Paragraph className="m-0 text-xs sm:text-sm mt-2">
                {exp.summary}
              </Paragraph>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEditView = () => (
    <Form form={form} layout="vertical" className="w-full mx-auto">
      <Form.List name="experiences">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div key={key} className="mb-6 p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <Title level={5} className="mb-0 text-sm sm:text-base">
                    Experience {index + 1}
                  </Title>
                  {fields.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => remove(name)}
                    />
                  )}
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'company']}
                      label="Company"
                      rules={[{ required: true, message: 'Please enter company name' }]}
                    >
                      <Input placeholder="e.g. PayNext Solutions" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      label="Title"
                      rules={[{ required: true, message: 'Please enter job title' }]}
                    >
                      <Input placeholder="e.g. Co-Founder & CEO" />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Form.Item
                      {...restField}
                      name={[name, 'startDate']}
                      label="Start Date"
                      rules={[{ required: true, message: 'Please enter start date' }]}
                    >
                      <Input placeholder="e.g. 2019" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'endDate']}
                      label="End Date"
                    >
                      <Input placeholder="Present" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, 'summary']}
                    label="Summary"
                    rules={[{ required: true, message: 'Please enter job summary' }]}
                  >
                    <TextArea
                      rows={3}
                      placeholder="Describe your role and achievements..."
                      className="resize-none"
                      showCount
                      maxLength={200}
                    />
                  </Form.Item>
                </div>
              </div>
            ))}
            
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                className="mb-4"
              >
                Add Experience
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

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
            icon={<AppstoreOutlined />}
            className="bg-blue-600"
          />
          <span>Experience</span>
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

export default ExperienceSection;