import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ease-in-out transform ${
          isDarkMode ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        <div className="flex items-center justify-center w-full h-full">
          {isDarkMode ? (
            <FiMoon className="w-3 h-3 text-gray-800 animate-fadeIn" />
          ) : (
            <FiSun className="w-3 h-3 text-yellow-500 animate-fadeIn" />
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
