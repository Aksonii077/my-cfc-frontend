import React from 'react';
import { Form, Input, Card, Button } from 'antd';
import { UserOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { TabComponentProps } from '../types';

const { TextArea } = Input;

const TeamTab: React.FC<TabComponentProps> = ({ form }) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Team
        </h2>
        <p className="text-gray-600">
          Tell us about the people behind this startup
        </p>
      </div>

      {/* Team Members & Roles Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <UserOutlined className="text-blue-500" />
            Team Members & Roles
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.List
          name="team_members_input"
        >
          {(fields, { add, remove }) => (
            <div className="space-y-6">
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Team Member {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        size="small"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label="Name"
                      rules={[{ required: true, message: 'Team member name is required' }]}
                      className="mb-4"
                    >
                      <Input 
                        placeholder="Alex Johnson"
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'role']}
                      label="Role"
                      rules={[{ required: true, message: 'Role is required' }]}
                      className="mb-4"
                    >
                      <Input 
                        placeholder="CEO & Co-founder"
                        size="large"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, 'background']}
                    label="Background"
                    rules={[{ required: true, message: 'Background is required' }]}
                    help="Brief background, experience, and relevant skills..."
                    className="mb-4"
                  >
                    <TextArea 
                      placeholder="Former Google PM, 8 years building B2B SaaS products, Stanford CS"
                      size="large"
                      rows={3}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'linkedin']}
                    label="LinkedIn (Optional)"
                    rules={[
                      {
                        type: 'url',
                        message: 'Please enter a valid URL'
                      },
                      {
                        pattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
                        message: 'Please enter a valid LinkedIn profile URL'
                      }
                    ]}
                    className="mb-0"
                  >
                    <Input 
                      placeholder="https://linkedin.com/in/alexjohnson"
                      size="large"
                    />
                  </Form.Item>
                </div>
              ))}
              
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={() => add({ name: '', role: '', background: '', linkedin: '' })}
                className="w-full mt-4"
                size="large"
              >
                Add Team Member
              </Button>
            </div>
          )}
        </Form.List>
      </Card>

      {/* Unique Positioning Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Unique Positioning
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="uniquePositioning"
          label="Why are you uniquely positioned to solve this?"
          rules={[{ required: true, message: 'Please explain your unique positioning' }]}
          help="Founder-market fit, unfair advantages, repeat insights."
          className="mb-6"
        >
          <TextArea 
            placeholder="Ex-Udaan ops head; cofounder ran 3 kiranas; supplier network in KA/TN."
            size="large"
            rows={3}
            showCount
          />
        </Form.Item>
      </Card>
    </div>
  );
};

export default TeamTab;