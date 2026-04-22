import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

let socket = null;

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  const connectSocket = useCallback(() => {
    socket = io('http://localhost:4173'); // Match server.js port

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    socket.on('message', (message) => {
      const newMsg = { id: Date.now(), ...message, timestamp: new Date().toISOString() };
      setMessages((prev) => [...prev, newMsg]);
      if (!isOpen) setUnreadCount((prev) => prev + 1);
    });

    socket.on('connect_error', (err) => {
      console.log('Connection error:', err);
    });
  }, [isOpen]);

  const sendMessage = useCallback((text) => {
    if (!socket || !connected) {
      console.warn('Socket not connected');
      return;
    }
    const message = { text, sender: 'patient', room: 'general' };
    socket.emit('message', message);
  }, [connected]);

  useEffect(() => {
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [connectSocket]);

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

  const markAsRead = () => {
    setUnreadCount(0);
  };

  const toggleChat = () => {
    setIsOpen((prev) => {
      const nextState = !prev;
      if (nextState) markAsRead();
      return nextState;
    });
  };

  const value = {
    messages,
    sendMessage,
    unreadCount,
    isOpen,
    toggleChat,
    markAsRead,
    connected,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
