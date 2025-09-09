import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="flex flex-col items-center justify-center py-1 px-4 md:py-2 md:px-6">
        {/* Title and rocket emoji */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <span className="text-2xl md:text-3xl">🚀</span>
          <h1 className="text-base md:text-xl font-bold text-white tracking-tight">
            Astra Intelligence
          </h1>
        </div>
        
        {/* Centered company logo */}
        <div className="flex items-center justify-center mt-1">
          <img 
            src="/RocketHub Logo Alt 1 Small.png" 
            alt="RocketHub Logo" 
            className="w-12 h-12 md:w-16 md:h-16 object-contain"
          />
        </div>
      </div>
    </header>
  );
};