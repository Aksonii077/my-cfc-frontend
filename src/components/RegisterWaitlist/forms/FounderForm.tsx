import React from 'react';
import { Form, Input, Select, Radio, Checkbox } from 'antd';
import { RoleFormProps } from '../types';
import { INDUSTRY_OPTIONS, STARTUP_STAGE_OPTIONS, TEAM_SIZE_OPTIONS } from '../constants';

const FounderForm: React.FC<RoleFormProps> = () => {
  return (
    <>
      <Form.Item
        label="Industry"
        name="industry"
        rules={[{ required: true, message: 'Please select your industry' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your industry" 
          size="large"
          options={INDUSTRY_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Startup Stage"
        name="startupStage"
        rules={[{ required: true, message: 'Please select your startup stage' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your startup stage" 
          size="large"
          options={STARTUP_STAGE_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Team Size"
        name="teamSize"
        rules={[{ required: true, message: 'Please select your team size' }]}
        className="mb-4"
      >
        <Select 
          placeholder="Select your team size" 
          size="large"
          options={TEAM_SIZE_OPTIONS}
          className="text-sm sm:text-base"
        />
      </Form.Item>

      <Form.Item
        label="Founder Type"
        name="founderType"
        rules={[{ required: true, message: 'Please select your founder type' }]}
        className="mb-4"
      >
        <Radio.Group size="large" className="flex flex-col sm:flex-row gap-2">
          <Radio value="idea" className="text-sm sm:text-base">I have Idea</Radio>
          <Radio value="startup" className="text-sm sm:text-base">I have Startup</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="Startup URL"
        name="startupUrl"
        rules={[
          { type: 'url', message: 'Please enter a valid URL' }
        ]}
        className="mb-4"
      >
        <Input 
          placeholder="https://your-startup.com" 
          size="large"
          className="text-sm sm:text-base" 
        />
      </Form.Item>

      <Form.Item
        name="registerPitchTank"
        valuePropName="checked"
        className="mb-4"
      >
        <Checkbox className="text-sm sm:text-base">Register for Pitch Tank</Checkbox>
      </Form.Item>
    </>
  );
};

export default FounderForm;