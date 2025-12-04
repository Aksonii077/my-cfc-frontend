import React from 'react';
import { Button } from 'antd';

interface FormNavigationProps {
  activeTab: string;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  activeTab,
  isSubmitting,
  onPrevious,
  onNext,
  onSubmit
}) => {
  const isFirstTab = activeTab === '1';
  const isLastTab = activeTab === '8';

  return (
    <div className="flex justify-between items-center mt-6 sm:mt-8">
      <Button
        size="large"
        htmlType="button"
        disabled={isFirstTab || isSubmitting}
        onClick={onPrevious}
        className="h-10 sm:h-12 text-sm sm:text-base"
      >
        Previous
      </Button>
      
      {isLastTab ? (
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={isSubmitting}
          onClick={onSubmit}
          style={{ background: '#114DFF' }}
          className="h-10 sm:h-12 text-sm sm:text-base"
        >
          Submit Application
        </Button>
      ) : (
        <Button
          type="primary"
          size="large"
          htmlType="button"
          loading={isSubmitting}
          onClick={onNext}
          style={{ background: '#114DFF' }}
          className="h-10 sm:h-12 text-sm sm:text-base"
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;