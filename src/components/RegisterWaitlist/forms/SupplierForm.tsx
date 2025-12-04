import React from 'react';
import { Form, Select } from 'antd';
import { RoleFormProps } from '../types';
import { SERVICE_TYPE_OPTIONS, INDUSTRY_FOCUS_OPTIONS, COMPANY_SIZE_OPTIONS } from '../constants';

const SupplierForm: React.FC<RoleFormProps> = () => {
  return (
    <>
      <Form.Item
        label="Service Type"
        name="serviceType"
        rules={[{ required: true, message: 'Please select your service type' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your service type" 
          size="large"
          options={SERVICE_TYPE_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Industry Focus"
        name="industryFocus"
        rules={[{ required: true, message: 'Please select your industry focus' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your industry focus" 
          size="large"
          options={INDUSTRY_FOCUS_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Company Size"
        name="companySize"
        rules={[{ required: true, message: 'Please select your company size' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your company size" 
          size="large"
          options={COMPANY_SIZE_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>
    </>
  );
};

export default SupplierForm;