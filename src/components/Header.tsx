import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="flex items-center justify-center py-4 px-6 relative">
        <div className="absolute left-6">
          <img 
            src="/RocketHub Logo Alt 1 Small.png" 
            alt="RocketHub Logo" 
            className="w-24 h-24 object-contain"
          />
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🚀</span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Astra Intelligence
          </h1>
        </div>
      </div>
    </header>
  );
};