import React from 'react';
import { Form, Input, Select } from 'antd';
import { RoleFormProps } from '../types';
import { FIELD_OF_STUDY_OPTIONS, ACADEMIC_YEAR_OPTIONS } from '../constants';

const StudentForm: React.FC<RoleFormProps> = () => {
  return (
    <>
      <Form.Item
        label="University"
        name="university"
        rules={[{ required: true, message: 'Please enter your university name' }]}
        className="mb-4"
      >
        <Input 
          placeholder="Enter your university name" 
          size="large"
          className="text-sm sm:text-base" 
        />
      </Form.Item>

      <Form.Item
        label="Field of Study"
        name="fieldOfStudy"
        rules={[{ required: true, message: 'Please select your field of study' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your field of study" 
          size="large"
          options={FIELD_OF_STUDY_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Academic Year"
        name="academicYear"
        rules={[{ required: true, message: 'Please select your academic year' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your academic year" 
          size="large"
          options={ACADEMIC_YEAR_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>
    </>
  );
};

export default StudentForm;