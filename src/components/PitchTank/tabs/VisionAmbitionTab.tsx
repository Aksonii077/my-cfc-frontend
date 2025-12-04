import React from 'react';
import { Form, Input, Card } from 'antd';
import { TabComponentProps } from '../types';

const { TextArea } = Input;

const VisionAmbitionTab: React.FC<TabComponentProps> = ({ form }) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Vision & Ambition
        </h2>
        <p className="text-gray-600">
          Paint the picture of where you're going
        </p>
      </div>

      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Long-Term Vision
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="longTermVision"
          label="What is the long-term vision if this works?"
          rules={[{ required: true, message: 'Please describe your long-term vision' }]}
          help="Paint the end-state. Think big."
          className="mb-6"
        >
          <TextArea 
            placeholder="Transform the $500B global grocery supply chain by making fresh produce accessible to every kirana through AI-powered inventory management and sustainable logistics networks."
            size="large"
            rows={4}
            showCount
          />
        </Form.Item>
      </Card>

      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Five-Year Outlook
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="fiveYearOutlook"
          label="Where do you see the startup in 5 years?"
          rules={[{ required: true, message: 'Please describe your five-year outlook' }]}
          help="Targets, footprint, products."
          className="mb-6"
        >
          <TextArea 
            placeholder="₹150cr ARR; 50k stores; South & West India; embedded credit."
            size="large"
            rows={3}
            showCount
          />
        </Form.Item>
      </Card>
    </div>
  );
};

export default VisionAmbitionTab;