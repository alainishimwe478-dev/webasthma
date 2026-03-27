import React from 'react';
import Sidebar from './Sidebar';
import ChatWidget from './ChatWidget';
import { ChatProvider } from '../context/ChatContext';

const Layout = ({ children }) => (
  <ChatProvider>
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 lg:p-8 ml-0 lg:ml-64">
        {children}
      </main>
      <ChatWidget />
    </div>
  </ChatProvider>
);

export default Layout;
