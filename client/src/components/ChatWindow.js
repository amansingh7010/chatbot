import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatWindow = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSend = async () => {
    setIsLoading(true);
    const response = await axios.post(
      'https://chatbot.amansingh.dev/api/chat',
      {
        message: userInput,
      }
    );
    setChatHistory([
      ...chatHistory,
      { message: userInput, type: 'user' },
      { message: response.data.botResponse, type: 'bot' },
    ]);

    setIsLoading(false);

    setUserInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <div className="flex items-center">
          <h1 className="text-2xl mb-4">🤖 Jarvis</h1>
        </div>
        <div className="chat-box border rounded p-4 bg-gray-800 h-64 overflow-y-auto relative">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`mb-2 ${
                chat.type === 'user' ? 'text-green-400' : 'text-blue-400'
              }`}
            >
              {chat.message}
            </div>
          ))}
          {isLoading && (
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <div className="animate-ping h-2 w-2 rounded-full bg-blue-400 opacity-75"></div>
              <div className="animate-ping-delay h-2 w-2 rounded-full bg-blue-400 opacity-75"></div>
              <div className="animate-ping-delay2 h-2 w-2 rounded-full bg-blue-400 opacity-75"></div>
            </div>
          )}
        </div>

        <div className="mt-4 flex">
          <input
            ref={inputRef}
            className={`flex-grow p-2 rounded-l bg-gray-800 text-white ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className={`p-2 rounded-r bg-blue-500 hover:bg-blue-700 ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={handleSend}
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
