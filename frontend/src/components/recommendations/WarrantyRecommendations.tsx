import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Device } from '../../types/device';
import { AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';

interface WarrantyRecommendationsProps {
  device: Device;
}

export function WarrantyRecommendations({ device }: WarrantyRecommendationsProps) {
  const daysUntilExpiry = Math.ceil(
    (new Date(device.warrantyEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getRecommendation = () => {
    if (device.warrantyStatus === 'expired') {
      return {
        type: 'critical',
        title: 'Warranty Expired',
        message: 'Your warranty has expired. Consider purchasing an extended warranty for continued protection.',
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        action: 'Get Extended Warranty'
      };
    }

    if (device.warrantyStatus === 'expiring-soon') {
      return {
        type: 'warning',
        title: 'Warranty Expiring Soon',
        message: `Your warranty will expire in ${daysUntilExpiry} days. Review extended warranty options now.`,
        icon: Clock,
        iconColor: 'text-yellow-500',
        action: 'Review Options'
      };
    }

    return {
      type: 'good',
      title: 'Warranty Active',
      message: 'Your warranty is active and provides good coverage. No action needed at this time.',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      action: 'View Details'
    };
  };

  const recommendation = getRecommendation();
  const Icon = recommendation.icon;

  const getExtendedWarrantyUrl = () => {
    // This would be replaced with actual logic to get the correct URL
    // based on the device manufacturer and model
    return `https://example.com/extended-warranty?device=${encodeURIComponent(device.manufacturer + ' ' + device.model)}`;
  };

  return (
    <Card 
      className="bg-white dark:bg-gray-800 border dark:border-gray-700"
      onClick={() => {}}
      clickable={false}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${recommendation.type === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
            recommendation.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
            'bg-green-100 dark:bg-green-900/20'}`}>
            <Icon className={`w-6 h-6 ${recommendation.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {recommendation.title}
            </h3>
            <p className="mt-1 text-gray-600 dark:text-gray-300">
              {recommendation.message}
            </p>

            {recommendation.type !== 'good' && (
              <div className="mt-4 space-y-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Recommended Actions:
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>Contact {device.manufacturer} support for warranty extension options</li>
                  <li>Review third-party warranty providers</li>
                  <li>Document current device condition</li>
                </ul>
                <Button
                  onClick={() => window.open(getExtendedWarrantyUrl(), '_blank')}
                  className="mt-4 flex items-center gap-2"
                >
                  {recommendation.action}
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
} 