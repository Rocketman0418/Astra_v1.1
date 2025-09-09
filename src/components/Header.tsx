import React from 'react';
import { Rocket } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-700 z-50">
      <div className="flex items-center justify-center py-2 px-3 md:py-4 md:px-4">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Rocket className="w-3 h-3 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-sm md:text-xl font-bold text-white">RocketHub.AI</h1>
            <p className="text-xs md:text-sm text-gray-400">Astra Intelligence</p>
          </div>
        </div>
      </div>
    </header>
  );
};