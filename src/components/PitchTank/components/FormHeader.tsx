import React from 'react';

const FormHeader: React.FC = () => {
  // Check if this is a FEF application
  const urlParams = new URLSearchParams(window.location.search);
  const isFefApplication = urlParams.get('fef-application') === 'true';

  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        {isFefApplication ? 'Apply for Season 2' : 'Pitch Tank Application'}
      </h1>
      <p className="text-sm sm:text-base text-gray-600">
        {isFefApplication 
          ? 'Complete your application to get featured on Season 2 and connect with investors.'
          : 'Complete your application to get featured on Pitch Tank and connect with investors.'
        }
      </p>
    </div>
  );
};

export default FormHeader;