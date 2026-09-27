// src/hooks/useFileUpload.js

import { useState, useCallback } from 'react';

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function useFileUpload({ onUpload, maxFiles = 5 }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'File type not supported. Please upload PDF, JPG, JPEG, or PNG files.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  const handleFiles = useCallback((newFiles) => {
    setError(null);
    const fileArray = Array.from(newFiles);
    
    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`);
      } else {
        validFiles.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        });
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);
  }, [files.length, maxFiles]);

  // Sends the entire array of files to onUpload
  const uploadFiles = useCallback(async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      // 1. Extract just the raw File objects from our state
      const filesToUpload = files.map(f => f.file);
      
      // 2. Call the onUpload handler with the entire array of files
      //    We are removing the per-file progress tracking for this simpler batch upload.
      await onUpload(filesToUpload);

      // 3. Clear files on success
      setFiles([]);
      setProgress({});
    } catch (err) {
      setError(err.message || 'An unknown upload error occurred.');
    } finally {
      setUploading(false);
    }
  }, [files, onUpload]);

  const removeFile = useCallback((fileId) => {
    setFiles(prev => {
      const newFiles = prev.filter(f => f.id !== fileId);
      const removedFile = prev.find(f => f.id === fileId);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return newFiles;
    });
    setProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setProgress({});
    setError(null);
  }, [files]);

  return {
    files,
    uploading,
    error,
    progress,
    handleFiles,
    uploadFiles,
    removeFile,
    clearFiles,
  };
}
