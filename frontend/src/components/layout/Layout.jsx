import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Home, Package, User, LogOut, Sun, Moon, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const { logout } = useAuth();
  const location = useLocation();

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Devices', href: '/devices', icon: Package },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 absolute left-4"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link to="/" className="text-xl font-bold text-primary flex-1 text-center flex items-center justify-center gap-2">
            <svg width="30" height="30" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <g id="logo-warrantyhub-icon-mobile">
                <g id="icon" transform="translate(5, 5)">
                  <path d="M25 0 L50 10 V25 C 50 37.5, 25 50, 25 50 C 25 50, 0 37.5, 0 25 V10 L25 0 Z" 
                        fill="none" 
                        stroke="#2563EB" 
                        strokeWidth="3" />
                  <path d="M13 24 L22 33 L38 17" 
                        stroke="#FFFFFF" 
                        strokeWidth="4" 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                </g>
              </g>
            </svg>
            <span>WarrantyHub</span>
          </Link>
        </div>

        {isMobileMenuOpen && (
          <div className="bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700">
            <nav className="px-4 py-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 mr-3" />
                ) : (
                  <Moon className="h-5 w-5 mr-3" />
                )}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <div className={`bg-white dark:bg-gray-800 shadow-lg h-screen fixed transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <div className="flex flex-col h-full">
            <div className={`p-6 ${isSidebarCollapsed ? 'px-4' : ''}`}>
              <Link to="/" className="flex items-center gap-3">
                <svg width="40" height="40" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <g id="logo-warrantyhub-icon-desktop">
                    <g id="icon" transform="translate(5, 5)">
                      <path d="M25 0 L50 10 V25 C 50 37.5, 25 50, 25 50 C 25 50, 0 37.5, 0 25 V10 L25 0 Z" 
                            fill="none" 
                            stroke="#2563EB" 
                            strokeWidth="3" />
                      <path d="M13 24 L22 33 L38 17" 
                            stroke="#FFFFFF" 
                            strokeWidth="4" 
                            fill="none" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"/>
                    </g>
                  </g>
                </svg>
                {!isSidebarCollapsed && (
                  <div>
                    <div className="text-xl font-bold text-primary">WarrantyHub</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Never Miss a Warranty Again.
                    </p>
                  </div>
                )}
              </Link>
            </div>

            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-16 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-700"
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-4'} py-3 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <item.icon className={`h-5 w-5 ${!isSidebarCollapsed && 'mr-3'}`} />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>

            <div className={`p-4 border-t dark:border-gray-700`}>
              <button
                onClick={toggleDarkMode}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-4'} py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md w-full`}
                title={isSidebarCollapsed ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : undefined}
              >
                {isDarkMode ? (
                  <Sun className={`h-5 w-5 ${!isSidebarCollapsed && 'mr-3'}`} />
                ) : (
                  <Moon className={`h-5 w-5 ${!isSidebarCollapsed && 'mr-3'}`} />
                )}
                {!isSidebarCollapsed && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
              </button>
              <button
                onClick={logout}
                className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'px-4'} py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md w-full`}
                title={isSidebarCollapsed ? 'Logout' : undefined}
              >
                <LogOut className={`h-5 w-5 ${!isSidebarCollapsed && 'mr-3'}`} />
                {!isSidebarCollapsed && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>

        <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile content */}
      <div className="lg:hidden">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 