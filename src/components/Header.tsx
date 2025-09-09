import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg py-2 px-4">
      <div className="flex items-center justify-center space-x-3">
        {/* Company logo */}
        <img 
          src="/RocketHub Logo Alt 1 Small.png" 
          alt="RocketHub Logo" 
          className="w-16 h-16 md:w-20 md:h-20 object-contain"
        />
        
        {/* Title and rocket emoji */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl md:text-3xl">🚀</span>
          <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">
            Astra Intelligence
          </h1>
        </div>
      </div>
    </header>
  );
};