import React from 'react';
import { Form, Card, Checkbox, Switch } from 'antd';
import { CheckCircleOutlined, RobotOutlined } from '@ant-design/icons';
import { TabComponentProps } from '../types';

const ReviewSubmitTab: React.FC<TabComponentProps> = ({ form }) => {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center mb-8 mt-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Review & Submit
        </h2>
        <p className="text-gray-600">
          Final review of your application and submission options
        </p>
      </div>

      {/* Terms and Privacy Policy Agreement Section */}
      <Card
        title={
          <div className="flex items-center gap-2">
            <CheckCircleOutlined className="text-green-500" />
            Terms & Privacy Agreement
          </div>
        }
        className="shadow-sm border-l-4 border-l-blue-500"
      >
        <Form.Item
          name="termsAgreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "You must agree to the terms and privacy policy to continue"
                      )
                    ),
            },
          ]}
          className="mb-0"
        >
          <Checkbox
            className="text-gray-700"
          >
            I agree to the Pitch Tank{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </a>
            <span className="text-red-500 ml-1">*</span>
          </Checkbox>
        </Form.Item>
      </Card>

      {/* Application Summary Info */}
      <Card className="shadow-sm border-l-4 border-l-blue-500">
        <div className="flex items-start gap-3">
          <CheckCircleOutlined className="text-blue-500 mt-1" />
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Ready to Submit</h4>
            <p className="text-gray-600 text-sm mb-2">
              Please review all sections of your application before submitting.
              You can navigate back to any previous tab to make changes.
            </p>
            <p className="text-gray-600 text-sm">
              Congrats! You're amongst the first to apply - we will start coming
              back to applicants 15th October onwards - do watch out our social
              media for more!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReviewSubmitTab;