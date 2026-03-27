import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('chat_messages');
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
    if (!isOpen) {
      setUnreadCount((prev) => prev + 1);
    }
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  const toggleChat = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        markAsRead();
      }
      return nextState;
    });
  };

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, unreadCount, isOpen, toggleChat, markAsRead }}
    >
      {children}
    </ChatContext.Provider>
  );
};
