import React from 'react';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 bg-white z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <div className="p-4 flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Chat with Kali</h2>
        <div className="flex flex-col space-y-2 h-full overflow-y-auto border p-2 rounded">
          {/* Example Chat Messages */}
          <div className="text-gray-700 bg-gray-100 p-2 rounded self-start">Hi! How can I help you?</div>
          <div className="text-white bg-green-600 p-2 rounded self-end">What are my calorie stats?</div>
        </div>
        <div className="mt-4 flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 text-sm"
          />
          <button className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;