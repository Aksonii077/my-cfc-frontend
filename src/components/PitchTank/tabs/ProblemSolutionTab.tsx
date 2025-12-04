import React from 'react';
import { Form, Input, Card } from 'antd';
import { TabComponentProps } from '../types';

const { TextArea } = Input;

const ProblemSolutionTab: React.FC<TabComponentProps> = ({ form }) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Form Heading */}
      <div className="text-center mb-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Problem & Solution
        </h2>
        <p className="text-gray-600">
          Help us understand what you're solving and how
        </p>
      </div>

      {/* The Problem Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            The Problem
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="problemDescription"
          label="What problem are you solving?"
          rules={[
            { required: true, message: 'Please describe the problem you are solving' }
          ]}
          help="Be concrete. Who feels the pain and when?"
          className="mb-6"
        >
          <TextArea 
            placeholder="Small kiranas run out of fresh veg by evening; suppliers are inconsistent; customers churn."
            size="large"
            rows={4}
            showCount
          />
        </Form.Item>
      </Card>

      {/* Target Customer Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Target Customer
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="targetCustomer"
          label="Who experiences this most acutely?"
          rules={[
            { required: true, message: 'Please describe your target customer' }
          ]}
          help="Describe 1–2 personas with context (role, demography, behavior)."
          className="mb-6"
        >
          <TextArea 
            placeholder="Urban kirana owners (30–55), 2–4 staff, 10–12 suppliers, WhatsApp-first ops."
            size="large"
            rows={3}
            showCount
          />
        </Form.Item>
      </Card>

      {/* Your Solution Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Your Solution
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="solutionDescription"
          label="Describe your solution in simple terms"
          rules={[
            { required: true, message: 'Please describe your solution' }
          ]}
          help="Explain as if to a consumer. Avoid jargon."
          className="mb-6"
        >
          <TextArea 
            placeholder="A single WhatsApp bot to order, track, and receive daily inventory from vetted suppliers."
            size="large"
            rows={3}
            showCount
          />
        </Form.Item>
      </Card>
    </div>
  );
};

export default ProblemSolutionTab;