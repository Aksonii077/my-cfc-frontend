import React, { useEffect } from 'react';
import { Form, Input, Card, Button } from 'antd';
import { TabComponentProps } from '../types';

const { TextArea } = Input;

const TractionValidationTab: React.FC<TabComponentProps> = ({ form }) => {
  // Force re-render when form values change to ensure Form.List items are created
  const keyMetrics = form.getFieldValue('key_metrics_input');
  
  useEffect(() => {
    if (keyMetrics && Array.isArray(keyMetrics) && keyMetrics.length > 0) {
      // Force form to re-render the list
      form.setFieldsValue({ key_metrics_input: keyMetrics });
    }
  }, [keyMetrics, form]);
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Traction & Validation
        </h2>
        <p className="text-gray-600">
          Show us evidence that people want what you're building
        </p>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Evidence People Want This
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="tractionEvidence"
          label="What proof do you have that people want this?"
          rules={[
            { required: true, message: "Please provide evidence of traction" },
          ]}
          help="Customers, pilots, revenue, waitlists, surveys, preorders, LOIs, partnerships."
          className="mb-6"
        >
          <TextArea
            placeholder="26 pilot stores, 88% reorder rate, ₹6.2L MRR, 2 distributor LOIs."
            size="large"
            rows={4}
            showCount
          />
        </Form.Item>
      </Card>

      <Card
        title={
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Pre-Traction Experiments
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="preTractionExperiments"
          label="If pre-traction, what experiments have you run?"
          help="MVPs, surveys, fake‑door, smoke tests, concierge trials."
          className="mb-6"
        >
          <TextArea
            placeholder="Ran a ₹500 ad test; 263 clicks; 91 signups; 28 phone interviews; pivoted to WhatsApp bot."
            size="large"
            rows={3}
            showCount
          />
        </Form.Item>
      </Card>

      <Card
        title={
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Key Metrics (Optional)
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <div className="mb-4">
          <p className="text-gray-600 text-sm mb-6">
            Add up to 8 key metrics. Examples: MRR, CAC, LTV, AOV, GMV, Retention.
          </p>

          <Form.List
            name="key_metrics_input"
            initialValue={keyMetrics && Array.isArray(keyMetrics) && keyMetrics.length > 0 ? keyMetrics : [{ metric: '', value: '' }]}
          >
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Form.Item
                      {...restField}
                      name={[name, 'metric']}
                      label="Metric"
                      className="mb-4"
                    >
                      <Input
                        placeholder="e.g., MRR, Beta Users, Retention Rate"
                        size="large"
                      />
                    </Form.Item>

                    <div className="flex gap-2 items-end">
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        label="Value"
                        className="mb-4 flex-1"
                      >
                        <Input
                          placeholder="e.g., $15K, 50, 92%"
                          size="large"
                          className="w-full"
                        />
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          onClick={() => remove(name)}
                          size="large"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {fields.length < 8 && (
                  <Button
                    type="dashed"
                    onClick={() => add({ metric: '', value: '' })}
                    className="w-full"
                    size="large"
                  >
                    Add Key Metric
                  </Button>
                )}
              </div>
            )}
          </Form.List>
        </div>
      </Card>
    </div>
  );
};

export default TractionValidationTab;