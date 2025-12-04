import React, { useState } from 'react';
import { Form, Input, Card, Checkbox, Upload, message, Spin } from 'antd';
import { TabComponentProps } from '../types';
import { SUPPORT_AREAS } from '../constants';

const { TextArea } = Input;

const GrowthSupportTab: React.FC<TabComponentProps> = ({ form }) => {
  const [videoUploading, setVideoUploading] = useState(false);
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Form Heading */}
      <div className="text-center mb-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Growth & Support Needs
        </h2>
        <p className="text-gray-600">
          Show us your creativity and tell us how we can help
        </p>
      </div>

      {/* Creative Growth Strategy Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Creative Growth Strategy
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="creativeGrowthStrategy"
          label="Share one unconventional or creative growth idea you've implemented or plan to try"
          rules={[
            { required: true, message: 'Please share your creative growth strategy' }
          ]}
          help="Be specific about the mechanics and expected outcome."
          className="mb-6"
        >
          <TextArea 
            placeholder="WhatsApp micro-influencers in housing societies; coupon stacks tied to milk-delivery routes."
            size="large"
            rows={4}
            showCount
          />
        </Form.Item>
      </Card>

      {/* Funding Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Funding
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="fundingAmount"
          label="Are you raising? If yes, how much? (Optional)"
          help="State currency and round (e.g., '₹50L pre-seed')."
          className="mb-6"
        >
          <Input 
            placeholder="₹50L pre-seed"
            size="large"
          />
        </Form.Item>
      </Card>

      {/* Support Needed Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Support Needed
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="supportNeeded"
          label="Which areas do you need the most help with right now?"
          rules={[
            { required: true, message: 'Please select at least one support area' },
            {
              validator: (_, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(new Error('Please select at least one support area'));
                }
                if (value.length > 5) {
                  return Promise.reject(new Error('Please select maximum 5 support areas'));
                }
                return Promise.resolve();
              }
            }
          ]}
          help="Select up to 5. Helps us match mentors, partners, and programs."
          className="mb-6"
        >
          <Checkbox.Group 
            options={SUPPORT_AREAS.map(area => ({ label: area, value: area }))}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          />
        </Form.Item>
      </Card>

      {/* References Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            References (Optional)
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <div className="text-gray-600 text-sm mb-4">
          Add up to 2 people who can vouch for your work (mentor, customer, partner).
        </div>
        
        <Form.List
          name="references_input"
          initialValue={[{ name: '', relationship: '', email: '', phone: '', linkedin: '' }]}
        >
          {(fields, { add, remove }) => (
            <div className="space-y-6">
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={key} className="border rounded-lg p-4 sm:p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Reference {index + 1}</h4>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(name)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      label="Name"
                      className="mb-4"
                    >
                      <Input 
                        placeholder="John Smith"
                        size="large"
                        className="text-sm sm:text-base"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'relationship']}
                      label="Relationship & Company"
                      className="mb-4"
                    >
                      <Input 
                        placeholder="CEO of TechCorp (customer)"
                        size="large"
                        className="text-sm sm:text-base"
                      />
                    </Form.Item>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'email']}
                      label="Email"
                      rules={[
                        { type: 'email', message: 'Please enter a valid email' }
                      ]}
                      className="mb-4"
                    >
                      <Input 
                        placeholder="john@techcorp.com"
                        size="large"
                        className="text-sm sm:text-base"
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'phone']}
                      label="Phone"
                      className="mb-4"
                    >
                      <Input 
                        placeholder="+1 555 123 4567"
                        size="large"
                        className="text-sm sm:text-base"
                      />
                    </Form.Item>
                  </div>

                  <Form.Item
                    {...restField}
                    name={[name, 'linkedin']}
                    label="LinkedIn"
                    rules={[
                      {
                        pattern: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
                        message: 'Please enter a valid LinkedIn profile URL'
                      }
                    ]}
                    className="mb-0"
                  >
                    <Input 
                      placeholder="linkedin.com/in/johnsmith"
                      size="large"
                      className="text-sm sm:text-base"
                    />
                  </Form.Item>
                </div>
              ))}
              
              {fields.length < 2 && (
                <button
                  type="button"
                  onClick={() => add({ name: '', relationship: '', email: '', phone: '', linkedin: '' })}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
                >
                  + Add Another Reference
                </button>
              )}
            </div>
          )}
        </Form.List>
      </Card>

      {/* 60-Second Pitch Video Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            60-Second Pitch Video
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="pitchVideoUrl"
          label="Pitch Video URL (Optional)"
          help="If you have a pitch video, paste the link (YouTube, Vimeo, Google Drive, etc.). Otherwise, you can skip this."
          className="mb-6"
        >
          <Input
            placeholder="https://youtube.com/watch?v=..."
            size="large"
          />
        </Form.Item>

        {/* Optional: Keep the old upload component but make it optional */}
        <Form.Item
          name="pitchVideo"
          label="Or upload your 60‑second pitch video (Optional)"
          help="MP4 or MOV, up to 200MB. Record vertically or horizontally. Keep it crisp. Good audio beats fancy visuals. Outline: Problem → Solution → Why now → Ask."
          className="mb-6"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e && e.fileList;
          }}
        >
          <Upload.Dragger
            name="video"
            multiple={false}
            accept=".mp4,.mov"
            maxCount={1}
            beforeUpload={() => false}
            className="upload-dragger"
            disabled={videoUploading}
            onChange={async (info) => {
              try {
                const file = info.file?.originFileObj as File | undefined;
                if (!file) return;
                setVideoUploading(true);
                const hide = message.loading('Uploading video...', 0);
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                const userId = user?.id || localStorage.getItem('user_id');
                if (!userId) {
                  message.error('User not found. Please log in again.');
                  hide();
                  setVideoUploading(false);
                  return;
                }
                const formData = new FormData();
                formData.append('file', file);
                formData.append('user_id', String(userId));
                // Upload to backend to store in cloud and return URL using fetch to avoid multipart boundary issues
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';
                const token = localStorage.getItem('token');
                const response = await fetch(`${baseUrl}/api/waitlist/pitch-tank/upload-video`, {
                  method: 'POST',
                  // DO NOT set Content-Type; the browser will set the proper multipart boundary
                  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                  credentials: 'include',
                  body: formData,
                });
                if (!response.ok) {
                  throw new Error(`Upload failed with status ${response.status}`);
                }
                const resp = await response.json();
                const videoUrl = (resp as any)?.video_url;
                if (videoUrl) {
                  localStorage.setItem('pitch_video_url', videoUrl);
                  hide();
                  message.success('Video uploaded successfully');
                } else {
                  hide();
                  message.warning('Upload completed but no video URL returned');
                }
                setVideoUploading(false);
              } catch (err) {
                console.error('Video upload failed:', err);
                message.error('Video upload failed. Please try again.');
                setVideoUploading(false);
              }
            }}
          >
            {videoUploading ? (
              <div className="py-6 text-center">
                <Spin />
                <div className="mt-2">Uploading video...</div>
              </div>
            ) : (
              <>
                <p className="ant-upload-drag-icon">
                  <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support MP4 or MOV files up to 200MB
                </p>
              </>
            )}
          </Upload.Dragger>
        </Form.Item>
      </Card>
    </div>
  );
};

export default GrowthSupportTab;