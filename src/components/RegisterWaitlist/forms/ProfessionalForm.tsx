import React from 'react';
import { Form, Select } from 'antd';
import { RoleFormProps } from '../types';
import { FUNCTION_OPTIONS, PROFESSIONAL_EXPERIENCE_LEVEL_OPTIONS, INTERESTED_IN_OPTIONS } from '../constants';

const ProfessionalForm: React.FC<RoleFormProps> = () => {
  return (
    <>
      <Form.Item
        label="Function"
        name="function"
        rules={[{ required: true, message: 'Please select your function' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your function" 
          size="large"
          options={FUNCTION_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Experience Level"
        name="professionalExperienceLevel"
        rules={[{ required: true, message: 'Please select your experience level' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your experience level" 
          size="large"
          options={PROFESSIONAL_EXPERIENCE_LEVEL_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Interested In"
        name="interestedIn"
        rules={[{ required: true, message: 'Please select what you are interested in' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select what you are interested in" 
          size="large"
          options={INTERESTED_IN_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>
    </>
  );
};

export default ProfessionalForm;