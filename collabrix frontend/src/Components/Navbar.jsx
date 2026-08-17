import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeTransition from './ThemeTransition';
const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);
const [isAnimating, setIsAnimating] = useState(false);
const [animationType, setAnimationType] = useState(null);

  React.useEffect(() => {
    document.documentElement.classList.add('dark');
    setDarkMode(true);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
 

  

const toggleDarkMode = () => {
  const newMode = !darkMode;

  // Decide which object should appear
  setAnimationType(newMode ? "moon" : "sun");

  // Start animation
  setIsAnimating(true);

  // Change actual theme while the object is travelling
  setTimeout(() => {
    setDarkMode(newMode);

    document.documentElement.classList.toggle(
      "dark",
      newMode
    );
  }, 700);

  // Remove animation after it reaches the top
  setTimeout(() => {
    setIsAnimating(false);
    setAnimationType(null);
  }, 1400);
};




  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      path: '/mainpage',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'projects',
      label: 'Workspace',
      path: '/projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'messages',
      label: 'Messages',
      path: '/messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: 'connection',
      label: 'Network',
      path: '/connection',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Alerts',
      path: '/notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <>
   <ThemeTransition
  type={animationType}
  isAnimating={isAnimating}
/>


    <nav className="bg-sky-300 border-b border-slate-200 sticky top-0 z-50   dark:bg-black dark:border-slate-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 gap-4">
        
        {/* Logo & Search */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/mainpage')}
            className="flex items-center gap-2 dark:text-white text-slate-800 hover:text-sky-600 transition-colors"
          >
            {/* Logo Icon: C in Sky-Blue to Teal */}
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              C
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight dark:text-white">
              Collabrix
            </span>
          </button>

          {/* Search Box */}
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-1.5 w-48 sm:w-60">
            <svg className="w-4 h-4 text-slate-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent outline-none text-xs dark:text-white text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  flex flex-col items-center justify-center px-3 h-14 transition-colors dark:text-white
                  ${isActive ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-800 hover:text-sky-600'}
                `}
              >
                {item.icon}
                <span className="text-[10px] font-medium mt-1 hidden sm:block">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Profile, Theme, Logout */}
        <div className="flex items-center gap-2 shrink-0 border-l border-slate-200 pl-3">
          
          {/* Profile Button */}
          <button
            onClick={() => navigate('/profile')}
            className="flex flex-col items-center justify-center px-2 text-slate-800 hover:text-sky-600 dark:text-white"
          >
            <div className="w-6 h-6 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
              H
            </div>
            <span className="text-[10px] font-medium mt-0.5 hidden sm:block">Me</span>
          </button>

          {/* Dark/Light Mode Button */}
         {/* Dark/Light Mode Button */}
        
{/* ================= THEME TOGGLE ================= */}

<button
  onClick={toggleDarkMode}
  title="Toggle Theme"
  className="
    relative
    w-9
    h-9
    overflow-hidden
    rounded-lg
    text-black
    dark:text-white
    hover:bg-slate-100
    dark:hover:bg-zinc-800
    transition-colors
    duration-500
  "
>
  {/* Moon */}
  <svg
    className={`
      absolute
      left-1/2
      top-1/2
      w-5
      h-5
      -translate-x-1/2
      transition-all
      duration-500
      ease-in-out
      ${
        darkMode
          ? "-translate-y-1/2 opacity-100"
          : "translate-y-6 opacity-0"
      }
    `}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20.354 15.354A9.003 9.003 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>

  {/* Sun */}
  <svg
    className={`
      absolute
      left-1/2
      top-1/2
      w-5
      h-5
      -translate-x-1/2
      transition-all
      duration-500
      ease-in-out
      text-amber-400
      ${
        darkMode
          ? "-translate-y-7 opacity-0"
          : "-translate-y-1/2 opacity-100"
      }
    `}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
</button>



          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="p-1.5 text-slate-800 dark:text-white hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>

        </div>

      </div>
    </nav>
    </>
  );
};

export default DashboardNavbar;
