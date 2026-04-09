import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function Menu({ trigger, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTriggerClick = () => {
    if (!isOpen) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX - 100, // Align right edge with trigger
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick}>
        {trigger}
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="absolute z-50 w-36 py-1 mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {items.map((item, index) => (
              <button
                key={index}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  item.className || 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
} 