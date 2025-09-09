import React, { KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled
}) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend(value);
    }
  };

  const handleSubmit = () => {
    if (value.trim() && !disabled) {
      onSend(value);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-3 safe-area-padding-bottom md:p-4">
      <div className="flex items-end space-x-3 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message to Astra....."
            disabled={disabled}
            className="w-full resize-none rounded-2xl border border-gray-600 bg-gray-800 text-white px-3 py-2 pr-12 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none disabled:bg-gray-700 disabled:cursor-not-allowed max-h-32 min-h-[44px] text-sm leading-relaxed placeholder-gray-400 md:px-4 md:py-3 md:min-h-[48px] md:text-base"
            rows={1}
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#3b82f6 #374151'
            }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation md:p-3 md:min-h-[48px] md:min-w-[48px]"
        >
          <Send className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};