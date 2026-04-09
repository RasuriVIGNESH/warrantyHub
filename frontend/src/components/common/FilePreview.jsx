// src/components/common/FilePreview.jsx

import PropTypes from 'prop-types';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

export function FilePreview({ file, progress, onRemove, uploading }) {
  // ✨ FIX: Access properties from the nested 'file' object (e.g., file.file.type)
  const isImage = file.file.type.startsWith('image/');
  const isPDF = file.file.type === 'application/pdf';
  const uploadProgress = progress?.[file.id] || 0;

  return (
    <div className="relative group">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Preview */}
        <div className="relative aspect-square w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
          {isImage && file.preview ? (
            <img
              src={file.preview}
              alt={file.file.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              {isPDF ? (
                <FileText className="h-12 w-12 text-gray-400" />
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-400" />
              )}
            </div>
          )}

          {/* Upload Progress Overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="w-16 h-16 relative">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    className="stroke-current text-gray-200 dark:text-gray-600"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeDasharray={`${uploadProgress}, 100`}
                    className="stroke-current text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                  {`${uploadProgress}%`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {/* ✨ FIX: Use the nested file property */}
            {file.file.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {/* ✨ FIX: Use the nested file property */}
            {(file.file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        {/* Remove Button */}
        {!uploading && (
          <button
            onClick={() => onRemove(file.id)}
            className="absolute -top-2 -right-2 p-1 bg-white dark:bg-gray-700 rounded-full shadow-md text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ✨ FIX: Updated PropTypes to reflect the correct nested object structure
FilePreview.propTypes = {
  file: PropTypes.shape({
    id: PropTypes.string.isRequired,
    file: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
    }).isRequired,
    preview: PropTypes.string,
  }).isRequired,
  progress: PropTypes.objectOf(PropTypes.number),
  onRemove: PropTypes.func.isRequired,
  uploading: PropTypes.bool,
};