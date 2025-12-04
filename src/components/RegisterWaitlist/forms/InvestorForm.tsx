import React from 'react';
import { Form, Select } from 'antd';
import { RoleFormProps } from '../types';
import { INVESTMENT_STAGE_OPTIONS, INDUSTRY_OPTIONS } from '../constants';

const InvestorForm: React.FC<RoleFormProps> = () => {
  return (
    <>
      <Form.Item
        label="Investment Stage"
        name="investmentStage"
        rules={[{ required: true, message: 'Please select your investment stage' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your investment stage" 
          size="large"
          options={INVESTMENT_STAGE_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Industry"
        name="investorIndustry"
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

export default InvestorForm;