import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon, ChevronDown, LogOut } from 'lucide-react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { NotificationDropdown } from '../ui/NotificationDropdown';

export function Header({ onMobileMenuToggle }) {
  const { user, logout } = useAuth();
  
  // Initialize isDark state based on the actual class on the document
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section */}
          <div className="flex">
            <button
              onClick={onMobileMenuToggle}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="block h-6 w-6" aria-hidden="true" />
            </button>
            <Link
              to="/dashboard"
              className="flex-shrink-0 flex items-center px-4"
            >
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Warranty Tracker
              </span>
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationDropdown />
            
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Profile Link */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            </Link>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  onMobileMenuToggle: PropTypes.func.isRequired,
}; 