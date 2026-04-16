import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
};
