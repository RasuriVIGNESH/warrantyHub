import React, { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Camera, Share2, QrCode } from 'lucide-react';
import { Device } from '../../types/device';

interface MobileFeaturesProps {
  device: Device;
  onImageCapture: (file: File) => void;
}

export function MobileFeatures({ device, onImageCapture }: MobileFeaturesProps) {
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageCapture(file);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${device.manufacturer} ${device.model} Warranty Details`,
          text: `Warranty Details for ${device.manufacturer} ${device.model}\n` +
                `Status: ${device.warrantyStatus}\n` +
                `Expires: ${new Date(device.warrantyEndDate).toLocaleDateString()}`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 md:hidden">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        className="hidden"
      />
      
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="rounded-full p-3"
        variant="primary"
      >
        <Camera className="w-6 h-6" />
      </Button>

      <Button
        onClick={handleShare}
        className="rounded-full p-3"
        variant="secondary"
      >
        <Share2 className="w-6 h-6" />
      </Button>

      {/* QR Code Scanner button - implementation would require a QR code scanning library */}
      <Button
        onClick={() => {/* Implement QR code scanning */}}
        className="rounded-full p-3"
        variant="outline"
      >
        <QrCode className="w-6 h-6" />
      </Button>
    </div>
  );
} 