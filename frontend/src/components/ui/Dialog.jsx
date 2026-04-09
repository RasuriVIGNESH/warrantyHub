// src/components/ui/Dialog.jsx

import { X } from 'lucide-react';
import { forwardRef } from 'react';

// Main Dialog component to manage state and rendering
export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="relative z-50">
      {/* Backdrop */}
      <div 
        onClick={() => onOpenChange(false)} 
        className="fixed inset-0 bg-black/70 transition-opacity"
      />
      
      {/* Centering Wrapper */}
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          {children}
        </div>
      </div>
    </div>
  );
};

// The content panel that appears in the center
export const DialogContent = forwardRef(({ className, children, ...props }, ref) => (
  <div 
    ref={ref} 
    className={`relative w-full max-w-lg transform rounded-xl bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all ${className}`} 
    {...props}
  >
    {children}
  </div>
));
DialogContent.displayName = "DialogContent";

// Header section for the dialog
export const DialogHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 ${className}`}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

// Footer section for the dialog
export const DialogFooter = ({ className, ...props }) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl ${className}`}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

// Title for the dialog header
export const DialogTitle = forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-50 ${className}`}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

// Description for the dialog header
export const DialogDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

// A simple close button
export const DialogClose = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
);