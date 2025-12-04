import React from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { theme } from '@/lib/theme';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    localStorage.clear();
    onClose();
    navigate('/');
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width="90%"
      style={{ maxWidth: 600 }}
      className="pitch-tank-success-modal"
      closable={false}
    >
      <div className="text-center py-4 px-2 sm:py-8 sm:px-0">
        {/* Success Icon */}
        <div className="mb-4 sm:mb-6">
          <CheckCircleOutlined 
            style={{ 
              fontSize: '48px', 
              color: '#52c41a' 
            }} 
            className="text-5xl sm:text-6xl"
          />
        </div>

        {/* Success Message */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            Congrats, your submission is in!
          </h2>
          
          <div className="text-gray-700 leading-relaxed space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg px-2">
            <p>
              You've just taken your first big step toward getting incubated and maybe even funded.
            </p>
            
            <p>
              Starting 15th October, we'll be selecting one founder every week to join our 'Get ready for Demo Day' incubation program and gear up for their big moment on Demo Day where you will get to pitch to leading Investors.
            </p>
            
            <p>
              Winners will be announced on our social channels and website, so keep an eye out.
            </p>
            
            <p className="font-semibold text-gray-900">
              This is just the beginning. The Tank is heating up.
            </p>
          </div>
        </div>

        {/* Back to Home Button */}
        <Button
          type="primary"
          size="large"
          onClick={handleBackToHome}
          className="px-6 sm:px-8 py-2 sm:py-3 h-auto font-medium text-base sm:text-lg w-full sm:w-auto"
          style={{
            background: theme.gradients.primary,
            border: 'none',
            borderRadius: '8px'
          }}
        >
          Back to CoFounder Circle
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;