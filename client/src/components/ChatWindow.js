import { useState } from 'react';
import axios from 'axios';

const ChatWindow = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = async () => {
    const response = await axios.post(
      'https://chatbot.amansingh.dev/api/chat',
      {
        message: userInput,
      }
    );
    setChatHistory([
      ...chatHistory,
      { message: userInput, type: 'user' },
      { message: response.data.message, type: 'bot' },
    ]);
    setUserInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl mb-4">Chatbot</h1>
        <div className="chat-box border rounded p-4 bg-gray-800 h-64 overflow-y-auto">
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
        </div>
        <div className="mt-4 flex">
          <input
            className="flex-grow p-2 rounded-l bg-gray-800 text-white"
            type="text"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            className="p-2 rounded-r bg-blue-500 hover:bg-blue-700"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
