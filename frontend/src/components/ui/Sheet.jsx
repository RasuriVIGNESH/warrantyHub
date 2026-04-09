// src/components/ui/Sheet.jsx

import { X } from 'lucide-react';
import { forwardRef } from 'react';

// Main Sheet component to manage state and rendering
export const Sheet = ({ open, onOpenChange, children }) => {
  if (!open) {
    return null;
  }

  return (
    // Portal can be added here for better accessibility if needed
    <div className="relative z-50">
      {/* Backdrop */}
      <div 
        onClick={() => onOpenChange(false)} 
        className="fixed inset-0 bg-black/60 transition-opacity"
      />
      
      {/* Sheet Content */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// The content panel that slides in
export const SheetContent = forwardRef(({ className, children, ...props }, ref) => (
  <div 
    ref={ref} 
    className={`pointer-events-auto relative w-screen max-w-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-xl transition ease-in-out duration-500 sm:duration-700 ${className}`} 
    {...props}
  >
    <div className="flex h-full flex-col overflow-y-scroll">
      {children}
    </div>
  </div>
));
SheetContent.displayName = "SheetContent";

// Header section for the sheet
export const SheetHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-2 text-center sm:text-left p-6 border-b dark:border-gray-700 ${className}`}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

// Footer section for the sheet
export const SheetFooter = ({ className, ...props }) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t dark:border-gray-700 ${className}`}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

// Title for the sheet header
export const SheetTitle = forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={`text-lg font-semibold ${className}`}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

// Description for the sheet header
export const SheetDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// A simple close button
export const SheetClose = forwardRef(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={`absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none ${className}`}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
));
SheetClose.displayName = "SheetClose";