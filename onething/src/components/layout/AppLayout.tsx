import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatSidebar from './ChatSidebar';

interface AppLayoutProps {
  children: ReactNode;
  showChatSidebar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showChatSidebar = true 
}) => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <div className="page-content">
            {children}
          </div>
          {showChatSidebar && (
            <div className="chat-sidebar">
              <ChatSidebar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLayout; 