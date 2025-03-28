import React, { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ChatSidebar from './ChatSidebar';
import { isMobile } from '../../services/aiService';

interface AppLayoutProps {
  children: ReactNode;
  showChatSidebar?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showChatSidebar = true 
}) => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  useEffect(() => {
    // 检测是否为移动设备
    const checkMobile = () => {
      const mobileDetect = isMobile();
      setIsMobileDevice(mobileDetect);
      
      // 添加移动设备类到body
      if (mobileDetect) {
        document.body.classList.add('mobile-device');
      } else {
        document.body.classList.remove('mobile-device');
      }
    };
    
    // 初始检测
    checkMobile();
    
    // 窗口大小变化时重新检测
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        {!isMobileDevice && <Sidebar />}
        <div className="content">
          <div className="page-content">
            {children}
          </div>
          {showChatSidebar && !isMobileDevice && (
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