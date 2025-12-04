import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import { RegisterWaitlistProps } from './types';
import { ROLE_OPTIONS } from './constants';
import { createRoleBasedPayload, submitToAPI } from './utils/payloadBuilder';
import {
  FounderForm,
  StudentForm,
  InvestorForm,
  SupplierForm,
  MentorForm,
  ProfessionalForm,
} from './forms';

const RegisterWaitlist: React.FC<RegisterWaitlistProps> = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    // Clear role-specific fields when role changes
    const fieldsToReset = [
      'industry', 'startupStage', 'teamSize', 'founderType', 'startupUrl', 'registerPitchTank',
      'serviceType', 'industryFocus', 'companySize',
      'university', 'fieldOfStudy', 'academicYear',
      'investmentStage', 'investorIndustry',
      'areaOfExpertise', 'experienceLevel', 'mentorIndustry',
      'function', 'professionalExperienceLevel', 'interestedIn'
    ];
    const currentValues = form.getFieldsValue();
    const clearedValues = { ...currentValues };
    fieldsToReset.forEach(field => {
      delete clearedValues[field];
    });
    form.setFieldsValue(clearedValues);
  };

  const handleModalClose = () => {
    onClose();
    form.resetFields();
    setSelectedRole(undefined);
  };

  const handleFormSubmit = async (values: Record<string, string | boolean>) => {
    try {
      // Create role-based payload
      const payload = createRoleBasedPayload(values, selectedRole);
      
      // Submit to API
      await submitToAPI(payload);
      
      message.success('Thank you for your interest! We will contact you soon.');
      handleModalClose();
    } catch (error) {
      console.error('Form submission error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        message.error(`Submission failed: ${errorMessage}`);
      } else {
        message.error('Something went wrong. Please try again.');
      }
    }
  };

  const renderRoleSpecificForm = () => {
    const formProps = { form, values: form.getFieldsValue() };
    
    switch (selectedRole) {
      case 'founder':
        return <FounderForm {...formProps} />;
      case 'student':
        return <StudentForm {...formProps} />;
      case 'investor':
        return <InvestorForm {...formProps} />;
      case 'supplier':
        return <SupplierForm {...formProps} />;
      case 'mentor':
        return <MentorForm {...formProps} />;
      case 'professional':
        return <ProfessionalForm {...formProps} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Join the Waitlist"
      open={isOpen}
      onCancel={handleModalClose}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: '500px' }}
    >
      {/* Description */}
      <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
        Be the first to know when CoFounder Circle launches. Tell us about yourself to get personalized updates.
      </p>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="mt-4 sm:mt-6"
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: 'Please enter your full name' }]}
          className="mb-4"
        >
          <Input 
            placeholder="Enter your full name" 
            size="large" 
            className="text-sm sm:text-base"
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
          className="mb-4"
        >
          <Input 
            placeholder="Enter your email" 
            size="large" 
            className="text-sm sm:text-base"
          />
        </Form.Item>

        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: 'Please select your role' }]}
          className="mb-4"
        >
          <Select 
            placeholder="Select your role" 
            size="large"
            options={ROLE_OPTIONS}
            onChange={handleRoleChange}
            className="text-sm sm:text-base"
          />
        </Form.Item>

        {/* Dynamic Role-Specific Forms */}
        {renderRoleSpecificForm()}

        <Form.Item className="mb-0 mt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleModalClose} 
              size="large" 
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
              style={{ background: '#114DFF' }}
            >
              Join Now
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterWaitlist;