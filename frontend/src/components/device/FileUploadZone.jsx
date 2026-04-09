import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Upload } from 'lucide-react';
import { useFileUpload } from '../../hooks/useFileUpload';
import { FilePreview } from '../common/FilePreview';
import { Button } from '../ui/Button';

export function FileUploadZone({ onUpload, maxFiles = 5 }) {
  const dropZoneRef = useRef(null);
  const {
    files,
    uploading,
    error,
    progress,
    handleFiles,
    uploadFiles,
    removeFile,
    clearFiles,
  } = useFileUpload({ onUpload, maxFiles });

  const onDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
    
    dropZoneRef.current?.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/10');
  }, [handleFiles]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/10');
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneRef.current?.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/10');
  }, []);

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        ref={dropZoneRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 transition-colors duration-150 ease-in-out"
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-300">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-semibold text-blue-600 dark:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
            >
              <span>Upload files</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFiles(e.target.files)}
                disabled={uploading}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            PDF, JPG, JPEG, PNG up to 5MB
          </p>
          {maxFiles > 1 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum {maxFiles} files
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 whitespace-pre-line">
          {error}
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file) => (
              <FilePreview
                key={file.id}
                file={file}
                progress={progress}
                onRemove={removeFile}
                uploading={uploading}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={clearFiles}
              disabled={uploading}
            >
              Clear All
            </Button>
            <Button
              onClick={uploadFiles}
              isLoading={uploading}
              disabled={files.length === 0}
            >
              {uploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

FileUploadZone.propTypes = {
  onUpload: PropTypes.func.isRequired,
  maxFiles: PropTypes.number,
}; 