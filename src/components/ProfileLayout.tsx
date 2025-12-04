import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';

const ProfileLayout: React.FC = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f6f8ff' }}>
      <Header />
      <main className="pt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;