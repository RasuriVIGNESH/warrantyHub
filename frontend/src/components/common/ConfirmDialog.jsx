import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
}) {
  const typeStyles = {
    danger: {
      icon: 'text-red-600 dark:text-red-400',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: 'text-yellow-600 dark:text-yellow-400',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    info: {
      icon: 'text-blue-600 dark:text-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
  };

  const styles = typeStyles[type] || typeStyles.danger;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`mr-3 ${styles.icon}`}>
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                    >
                      {title}
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message}
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                  <Button
                    className={styles.button}
                    onClick={onConfirm}
                    isLoading={isLoading}
                  >
                    {confirmText}
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['danger', 'warning', 'info']),
  isLoading: PropTypes.bool,
}; 