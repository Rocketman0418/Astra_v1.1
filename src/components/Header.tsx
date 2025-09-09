import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="flex items-center justify-center py-3 px-4 relative md:py-4 md:px-6">
        <div className="absolute left-4 md:left-6">
          <img 
            src="/RocketHub Logo Alt 1 Small.png" 
            alt="RocketHub Logo" 
            className="w-12 h-12 object-contain md:w-24 md:h-24"
          />
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-2xl md:text-3xl">🚀</span>
          <h1 className="text-lg font-bold text-white tracking-tight md:text-2xl">
            Astra Intelligence
          </h1>
        </div>
      </div>
    </header>
  );
};