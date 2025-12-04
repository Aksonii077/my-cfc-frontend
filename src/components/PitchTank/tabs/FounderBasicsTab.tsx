import React, { useState } from 'react';
import { Form, Input, Select, Card, Button, Checkbox, Radio, Upload, message, Spin } from 'antd';
import { InboxOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import { STAGE_OPTIONS, SECTOR_OPTIONS } from '../constants';
import { TabComponentProps } from '../types';

const { TextArea } = Input;

const FounderBasicsTab: React.FC<TabComponentProps> = ({ form }) => {
  // Check if this is a Fashion application
  const urlParams = new URLSearchParams(window.location.search);
  const isFashionApplication = urlParams.get('fef-application') === 'true';
  
  // Watch for fashion checkbox state
  const isFashionBusiness = Form.useWatch('isFashionBusiness', form);
  
  // Pitch deck upload state
  const [deckUploading, setDeckUploading] = useState(false);
  const [deckDeleted, setDeckDeleted] = useState(false);
  const hasPitchDeck = Form.useWatch('hasPitchDeck', form);
  // Watch the form field pitch_deck_url which will update when form is initialized
  const pitchDeckUrlFromForm = Form.useWatch('pitch_deck_url', form);
  const pitchDeckUrl = deckDeleted ? null : (pitchDeckUrlFromForm || localStorage.getItem('pitch_deck_url'));

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Form Heading */}
      <div className="text-center mb-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Let's start with the basics
        </h2>
        <p className="text-gray-600">Tell us about yourself and your startup</p>
      </div>

      {/* Founder Information Section */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Founder Information
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <div className="space-y-6 sm:space-y-8">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please enter your full name" }]}
            help="Enter your legal name as it appears on official documents."
            className="mb-4 sm:mb-6"
          >
            <Input
              placeholder="John Doe"
              size="large"
              className="text-sm sm:text-base"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Contact Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
            help="We'll send confirmations and updates here."
            className="mb-6"
          >
            <Input 
              placeholder="john@example.com" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            help="Include country code if outside India."
            className="mb-6"
          >
            <Input 
              placeholder="+91 9876543210" 
              size="large" 
            />
          </Form.Item>
        </div>
      </Card>

      {/* Startup Information Section */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Startup Information
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <div className="space-y-6 sm:space-y-8">
          <Form.Item
            name="startupName"
            label="Startup / Project Name"
            rules={[
              { required: true, message: "Please enter your startup name" },
            ]}
            help="Use your working name if not incorporated yet."
            className="mb-6"
          >
            <Input 
              placeholder="KiranaKart" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            name="pitch"
            label="One-line Pitch"
            rules={[
              { required: true, message: "Please enter your one-line pitch" },
            ]}
            help="Explain like a tagline. Example: 'Shopify for WhatsApp brands.'"
            className="mb-6"
          >
            <TextArea
              placeholder="10‑minute grocery delivery for tier‑2 towns."
              size="large"
              rows={2}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="website"
            label="Website or Primary Link"
            rules={[{ type: "url", message: "Please enter a valid URL" }]}
            help="Landing page, Notion, Play Store, or any live link."
            className="mb-6"
          >
            <Input 
              placeholder="https://kiranakart.in" 
              size="large" 
            />
          </Form.Item>

          <Form.List
            name="socialProductLinks"
            initialValue={['']}
          >
            {(fields, { add, remove }) => (
              <Form.Item
                label="Social / Product Links"
                help="Add GitHub, Instagram, LinkedIn, ProductHunt, etc."
                className="mb-6"
              >
                <div className="space-y-3">
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex gap-2">
                      <Form.Item
                        {...restField}
                        name={name}
                        className="mb-0 flex-1"
                      >
                        <Input
                          placeholder="https://linkedin.com/company/kiranakart"
                          size="large"
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          onClick={() => remove(name)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button 
                    type="dashed" 
                    onClick={() => add('')} 
                    className="w-full"
                  >
                    Add Another Link
                  </Button>
                </div>
              </Form.Item>
            )}
          </Form.List>

          <Form.Item
            name="stage"
            label="Current Stage"
            rules={[
              { required: true, message: "Please select your current stage" },
            ]}
            help="Pick the closest match"
            className="mb-6"
          >
            <Select
              placeholder="Select your current stage"
              size="large"
              options={STAGE_OPTIONS}
            />
          </Form.Item>

          {/* Fashion Business Checkbox - Only shown when fef-application=true */}
          {isFashionApplication && (
            <Form.Item
              name="isFashionBusiness"
              valuePropName="checked"
              className="mb-6"
            >
              <Checkbox>
                Is your business related to the field of Fashion?
              </Checkbox>
            </Form.Item>
          )}

          {/* Fashion-specific fields - Only shown when Fashion checkbox is checked */}
          {isFashionApplication && isFashionBusiness && (
            <>
              <div className="border-t border-gray-200 pt-6 mt-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9a2 2 0 00-2 2v10a4 4 0 004 4h6a2 2 0 002-2V7a2 2 0 00-2-2z" />
                  </svg>
                  Fashion Business Details
                </h3>
              </div>

              <Form.Item
                name="fashionBrandStory"
                label="Fashion brands thrive on strong narratives. What is the unique creative inspiration or cultural story behind your brand, and how do you translate this into your product design and customer experience?"
                rules={[
                  {
                    required: isFashionBusiness,
                    message: "Please describe your brand story and inspiration"
                  },
                  {
                    min: 10,
                    message: "Please provide at least 10 characters"
                  }
                ]}
                className="mb-6"
              >
                <TextArea 
                  placeholder="Describe the cultural inspiration, storytelling elements, and how they influence your design philosophy and customer journey..."
                  size="large"
                  rows={4}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="fashionDesignPhilosophy"
                label="What is your design philosophy, and how does it translate into your collections or product lines? Please share how you balance creativity with market demand."
                rules={[
                  {
                    required: isFashionBusiness,
                    message: "Please describe your design philosophy"
                  },
                  {
                    min: 10,
                    message: "Please provide at least 10 characters"
                  }
                ]}
                className="mb-6"
              >
                <TextArea 
                  placeholder="Explain your design approach, creative process, and how you balance artistic vision with commercial viability..."
                  size="large"
                  rows={4}
                  showCount
                />
              </Form.Item>

              <Form.Item
                name="fashionSustainability"
                label="Fashion is moving towards sustainability and conscious consumption. What sustainability practices, ethical sourcing methods, or material innovations (e.g., recycled fabrics, biodegradable packaging, slow-fashion models) are you building into your brand?"
                rules={[
                  {
                    required: isFashionBusiness,
                    message: "Please describe your sustainability practices"
                  },
                  {
                    min: 10,
                    message: "Please provide at least 10 characters"
                  }
                ]}
                className="mb-6"
              >
                <TextArea 
                  placeholder="Detail your sustainable practices, ethical sourcing, material innovations, and environmental initiatives..."
                  size="large"
                  rows={4}
                  showCount
                />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="sector"
            label="Sector / Vertical"
            rules={[{ required: true, message: "Please select your sector" }]}
            help="Choose your primary sector"
            className="mb-6"
          >
            <Select
              placeholder="Select your sector"
              size="large"
              options={SECTOR_OPTIONS}
            />
          </Form.Item>

          <Form.Item
            name="location"
            label="Where are you based?"
            rules={[{ required: true, message: "Please enter your location" }]}
            help="City & country for context and matchmaking."
            className="mb-6"
          >
            <Input 
              placeholder="Bengaluru, India" 
              size="large" 
            />
          </Form.Item>

          {/* Pitch Deck Upload Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <Form.Item
              name="hasPitchDeck"
              label={
                <span className="text-lg font-medium">
                  Do you have a pitch deck ready?
                </span>
              }
              rules={[{ required: true, message: "Please select an option" }]}
              className="mb-6"
            >
              <Radio.Group 
                size="large"
                onChange={(e) => {
                  if (e.target.value === 'no') {
                    // Clear pitch deck URL if user selects "No"
                    localStorage.removeItem('pitch_deck_url');
                    form.setFieldValue('pitch_deck_url', '');
                    setDeckDeleted(true);
                  } else {
                    // Reset deleted flag when user selects "Yes"
                    setDeckDeleted(false);
                  }
                }}
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </Form.Item>

            {hasPitchDeck === 'yes' && (
              <Form.Item
                name="pitch_deck_upload"
                label="Upload Your Pitch Deck"
                help="Upload a PDF file (max 10MB). Once uploaded, you'll proceed directly to Review & Submit."
                className="mb-6"
              >
                {pitchDeckUrl ? (
                  <div className="border border-green-300 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileOutlined className="text-2xl text-green-600" />
                        <div>
                          <div className="font-medium text-green-900">Pitch deck uploaded successfully</div>
                          <div className="text-sm text-green-700 mt-1">Your pitch deck is ready for review</div>
                        </div>
                      </div>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={async () => {
                          try {
                            const hide = message.loading('Deleting pitch deck...', 0);
                            const userStr = localStorage.getItem('user');
                            const user = userStr ? JSON.parse(userStr) : null;
                            const userId = user?.id || localStorage.getItem('user_id');
                            
                            if (userId) {
                              const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';
                              const token = localStorage.getItem('token');
                              await fetch(`${baseUrl}/api/waitlist/pitch-tank/user/${userId}/pitch-deck`, {
                                method: 'DELETE',
                                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                                credentials: 'include',
                              });
                            }
                            
                            // Clear all pitch deck related data
                            localStorage.removeItem('pitch_deck_url');
                            form.setFieldValue('pitch_deck_url', '');
                            form.setFieldValue('pitchDeckTempTick', Date.now());
                            setDeckDeleted(true); // Set deleted flag to hide success message
                            hide();
                            message.success('Pitch deck deleted successfully');
                          } catch (err) {
                            console.error('Delete pitch deck failed:', err);
                            message.error('Failed to delete pitch deck');
                          }
                        }}
                      >
                        Replace
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Upload.Dragger
                    name="file"
                    accept=".pdf"
                    multiple={false}
                    showUploadList={false}
                    customRequest={async ({ file, onSuccess, onError }) => {
                      try {
                        console.log('Upload triggered with file:', file);
                        
                        // Get the actual File object
                        const actualFile = file as File;
                        if (!actualFile) {
                          console.error('No file found');
                          return;
                        }
                        
                        // Validate file size (10MB max)
                        if (actualFile.size > 10 * 1024 * 1024) {
                          message.error('File size must be less than 10MB');
                          onError?.(new Error('File size must be less than 10MB'));
                          return;
                        }
                        
                        // Validate file type
                        if (!actualFile.type.includes('pdf')) {
                          message.error('Only PDF files are allowed');
                          onError?.(new Error('Only PDF files are allowed'));
                          return;
                        }
                        
                        setDeckUploading(true);
                        const hide = message.loading('Uploading pitch deck...', 0);
                        
                        const userStr = localStorage.getItem('user');
                        const user = userStr ? JSON.parse(userStr) : null;
                        const userId = user?.id || localStorage.getItem('user_id');
                        
                        if (!userId) {
                          message.error('User not found. Please log in again.');
                          hide();
                          setDeckUploading(false);
                          onError?.(new Error('User not found'));
                          return;
                        }
                        
                        console.log('Preparing upload for user:', userId);
                        
                        const formData = new FormData();
                        formData.append('file', actualFile);
                        formData.append('user_id', String(userId));
                        
                        // Upload to backend
                        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002';
                        const token = localStorage.getItem('token');
                        
                        console.log('Uploading to:', `${baseUrl}/api/waitlist/pitch-tank/upload-deck`);
                        
                        const response = await fetch(`${baseUrl}/api/waitlist/pitch-tank/upload-deck`, {
                          method: 'POST',
                          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                          credentials: 'include',
                          body: formData,
                        });
                        
                        console.log('Upload response status:', response.status);
                        
                        if (!response.ok) {
                          const errorText = await response.text();
                          console.error('Upload failed:', errorText);
                          throw new Error(`Upload failed with status ${response.status}: ${errorText}`);
                        }
                        
                        const resp = await response.json();
                        console.log('Upload response:', resp);
                        
                        const deckUrl = (resp as any)?.deck_url || (resp as any)?.pitch_deck_url;
                        
                        if (deckUrl) {
                          localStorage.setItem('pitch_deck_url', deckUrl);
                          form.setFieldValue('pitch_deck_url', deckUrl);
                          form.setFieldValue('pitchDeckTempTick', Date.now()); // Trigger re-render
                          setDeckDeleted(false); // Reset deleted flag to show success message
                          hide();
                          message.success('Pitch deck uploaded successfully');
                          onSuccess?.(resp);
                        } else {
                          hide();
                          message.warning('Upload completed but no deck URL returned');
                          onError?.(new Error('No deck URL returned'));
                        }
                        
                        setDeckUploading(false);
                      } catch (err) {
                        console.error('Pitch deck upload failed:', err);
                        message.error('Pitch deck upload failed. Please try again.');
                        setDeckUploading(false);
                        onError?.(err as Error);
                      }
                    }}
                    disabled={deckUploading}
                  >
                    {deckUploading ? (
                      <div className="py-6 text-center">
                        <Spin />
                        <div className="mt-2">Uploading pitch deck...</div>
                      </div>
                    ) : (
                      <>
                        <p className="ant-upload-drag-icon">
                          <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                        </p>
                        <p className="ant-upload-text">Click or drag PDF file to this area to upload</p>
                        <p className="ant-upload-hint">
                          Support for PDF files up to 10MB
                        </p>
                      </>
                    )}
                  </Upload.Dragger>
                )}
              </Form.Item>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FounderBasicsTab;