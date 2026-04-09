import { NavLink } from 'react-router-dom';
import { Home, Package, Settings, FileText, HelpCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: Home },
  { name: 'Devices', to: '/devices', icon: Package },
  { name: 'Documents', to: '/documents', icon: FileText },
  { name: 'Settings', to: '/settings', icon: Settings },
  { name: 'Help', to: '/help', icon: HelpCircle },
];

export function Sidebar({ className }) {
  return (
    <div className={clsx('h-full bg-white dark:bg-gray-800 shadow-sm', className)}>
      <div className="h-full flex flex-col">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out'
                )
              }
            >
              <item.icon
                className={clsx(
                  'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-150 ease-in-out'
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center w-full">
            <div className="text-sm">
              <p className="font-medium text-gray-700 dark:text-gray-200">
                Need help?
              </p>
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-sm"
              >
                View documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Sidebar.propTypes = {
  className: PropTypes.string,
}; 