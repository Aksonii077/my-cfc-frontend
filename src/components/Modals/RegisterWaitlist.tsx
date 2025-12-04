import React from 'react';
import RegisterWaitlist from '../RegisterWaitlist/RegisterWaitlist';

interface RegisterWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterWaitlistModal: React.FC<RegisterWaitlistModalProps> = ({ isOpen, onClose }) => {
  return <RegisterWaitlist isOpen={isOpen} onClose={onClose} />;
};

export default RegisterWaitlistModal;