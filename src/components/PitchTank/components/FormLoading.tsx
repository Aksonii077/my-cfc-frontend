import React from 'react';
import { Spin } from 'antd';

const FormLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading your application data...</p>
        </div>
      </div>
    </div>
  );
};

export default FormLoading;