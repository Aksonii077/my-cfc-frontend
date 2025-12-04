import React from 'react';
import { Form, Select } from 'antd';
import { RoleFormProps } from '../types';
import { AREA_OF_EXPERTISE_OPTIONS, EXPERIENCE_LEVEL_OPTIONS, INDUSTRY_OPTIONS } from '../constants';

const MentorForm: React.FC<RoleFormProps> = () => {
  return (
    <>
      <Form.Item
        label="Area of Expertise"
        name="areaOfExpertise"
        rules={[{ required: true, message: 'Please select your area of expertise' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your area of expertise" 
          size="large"
          options={AREA_OF_EXPERTISE_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Experience Level"
        name="experienceLevel"
        rules={[{ required: true, message: 'Please select your experience level' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your experience level" 
          size="large"
          options={EXPERIENCE_LEVEL_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Industry"
        name="mentorIndustry"
        rules={[{ required: true, message: 'Please select your industry focus' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your industry focus" 
          size="large"
          options={INDUSTRY_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>
    </>
  );
};

export default MentorForm;