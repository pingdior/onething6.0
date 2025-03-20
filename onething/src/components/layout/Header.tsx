import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
        <span className="ml-2">OneThing</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center cursor-pointer">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold cursor-pointer">
          <span>张</span>
        </div>
      </div>
      <div className="absolute top-4 right-4 z-50">
        <select 
          className="px-2 py-1 rounded border border-gray-300 bg-white"
          defaultValue="zh"
          onChange={(e) => console.log(e.target.value)}
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="ar">العربية</option>
        </select>
      </div>
    </header>
  );
};

export default Header; 