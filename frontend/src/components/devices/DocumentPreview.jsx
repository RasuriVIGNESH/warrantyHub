// src/components/devices/DocumentPreview.jsx

import { useState } from 'react';
import { FileText, Image as ImageIcon, Download } from 'lucide-react';

export function DocumentPreview({ documents, onDocumentClick }) {
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  if (!documents || documents.length === 0) {
    return null;
  }

  const handleDocumentClick = async (doc) => {
    const docId = doc?.id;
    if (docId) setDownloadingIds(prev => new Set([...prev, docId]));
    try {
      // Prefer the provided fileUrl; pass the whole document object so callers
      // can decide how to handle it (we open fileUrl in hooks now).
      await onDocumentClick(doc);
    } finally {
      if (docId) setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Documents</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {documents.map((doc) => {
          const isDownloading = downloadingIds.has(doc.id);
          return (
              <div 
              key={doc.id} 
              onClick={() => !isDownloading && handleDocumentClick(doc)}
              className={`group relative cursor-pointer overflow-hidden rounded-lg border bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-2 text-center transition-all hover:shadow-md hover:border-primary/50 ${
                isDownloading ? 'opacity-50 cursor-wait' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center h-24">
                {isDownloading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                ) : (
                  <>
                    {/* Check if it's an image based on file extension or MIME type */}
                    {(doc.name && (doc.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/) || 
                         (doc.fileType && doc.fileType.startsWith('image/')))) ? (
                      doc.fileUrl ? (
                        <div className="w-full h-full p-2">
                          <img src={doc.fileUrl} alt={doc.name} className="object-cover h-full w-full rounded-md" />
                        </div>
                      ) : (
                        <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-primary" />
                      )
                    ) : (
                      <FileText className="w-10 h-10 text-gray-400 group-hover:text-primary" />
                    )}
                  </>
                )}
              </div>
              <p className="mt-2 truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                {isDownloading ? 'Downloading...' : doc.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}