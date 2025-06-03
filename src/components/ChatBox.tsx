import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isConnected: boolean;
  className?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ 
  messages, 
  onSendMessage, 
  isConnected,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (newMessage.trim() && isConnected) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Format timestamp to HH:MM
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`${className}`}>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-4 left-4 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 transition-all duration-300"
        title={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageSquare size={24} />
        {messages.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
            {messages.length}
          </span>
        )}
      </button>

      {/* Chat panel */}
      <div 
        className={`absolute bottom-20 left-4 w-72 bg-gray-800 rounded-lg shadow-lg transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Chat messages */}
        <div className="h-60 overflow-y-auto p-3 flex flex-col gap-2">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              {isConnected ? "No messages yet. Say hello!" : "Connect with someone to start chatting"}
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`max-w-[80%] ${msg.sender === 'me' ? 'ml-auto' : 'mr-auto'}`}
              >
                <div 
                  className={`px-3 py-2 rounded-lg ${
                    msg.sender === 'me' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-gray-700 text-white rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
                <div 
                  className={`text-xs text-gray-400 mt-1 ${
                    msg.sender === 'me' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="p-2 border-t border-gray-700 flex">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Type a message..." : "Connect to chat..."}
            disabled={!isConnected}
            className="flex-1 bg-gray-700 text-white rounded-l-lg px-3 py-2 outline-none placeholder:text-gray-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !newMessage.trim()}
            className="bg-indigo-600 text-white rounded-r-lg px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;