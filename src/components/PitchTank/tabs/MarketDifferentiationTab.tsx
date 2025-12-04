import React from 'react';
import { Form, Input, Card } from 'antd';
import { TabComponentProps } from '../types';

const { TextArea } = Input;

const MarketDifferentiationTab: React.FC<TabComponentProps> = ({ form }) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Market & Differentiation
        </h2>
        <p className="text-gray-600">
          Show us the opportunity and your competitive advantage
        </p>
      </div>

      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Market Opportunity
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="marketOpportunity"
          label="How big is the opportunity?"
          rules={[{ required: true, message: 'Please describe the market opportunity' }]}
          help="Share TAM/SAM/SOM if known, or describe scale in plain terms."
          className="mb-6"
        >
          <TextArea 
            placeholder="~12M kiranas in India; initial SAM = 150k in KA/TN; SOM = 5k in 18 months."
            size="large"
            rows={3}
            showCount
          />
        </Form.Item>
      </Card>

      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Competition & Differentiation
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="competitionDifferentiation"
          label="Who else solves this and how are you different?"
          rules={[{ required: true, message: 'Please describe your competition and differentiation' }]}
          help="List direct competitors and what customers use today as a workaround."
          className="mb-6"
        >
          <TextArea 
            placeholder="Udaan, Ninjacart; many buy via 3–4 local agents; we aggregate supply with SLA & returns."
            size="large"
            rows={3}
            showCount
          />
        </Form.Item>
      </Card>

      <Card 
        title={
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Market Timing
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="marketTiming"
          label="Why is now the right time?"
          rules={[{ required: true, message: 'Please explain why now is the right time' }]}
          help="Regulation, tech shifts, consumer behavior, cost curves, etc."
          className="mb-6"
        >
          <TextArea 
            placeholder="Post-COVID digitization, UPI ubiquity, supplier aggregation, logistics cost down 18%."
            size="large"
            rows={3}
            showCount
          />
        </Form.Item>
      </Card>
    </div>
  );
};

export default MarketDifferentiationTab;