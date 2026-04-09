// src/components/device/WarrantyStatusPanel.jsx

import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ShieldCheck, Clock, ShieldOff, Wrench, ShoppingCart, ExternalLink } from 'lucide-react';

const statusConfig = {
  active: {
    Icon: ShieldCheck,
    title: 'Warranty Active',
    description: "Your device is fully covered under the manufacturer's warranty. No action is needed at this time.",
    colorClasses: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300',
    iconColor: 'text-green-600',
  },
  'expiring-soon': {
    Icon: Clock,
    title: 'Warranty Expiring Soon',
    description: "Your warranty is ending soon. Review your options to ensure continued protection for your device.",
    colorClasses: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
    iconColor: 'text-yellow-600',
  },
  expired: {
    Icon: ShieldOff,
    title: 'Warranty Expired',
    description: "This device is no longer covered by its warranty. You are now responsible for the full cost of any repairs.",
    colorClasses: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300',
    iconColor: 'text-red-600',
  },
};

export function WarrantyStatusPanel({ device }) {
  const normalizedStatus = (device.warrantyStatus || '').toLowerCase().replace(' ', '-');
  const config = statusConfig[normalizedStatus] || statusConfig.active; // Default to active if unknown

  return (
    <Card className={`border-none ${config.colorClasses}`}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <config.Icon className={`w-8 h-8 flex-shrink-0 ${config.iconColor}`} />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{config.title}</h3>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{config.description}</p>
          </div>
        </div>

        {/* Action Buttons for "Expiring Soon" */}
        {normalizedStatus === 'expiring-soon' && (
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/10">
              <ExternalLink className="w-4 h-4 mr-2" />
              Check for Extended Warranty
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/10">
            <Wrench className="w-4 h-4 mr-2" />
            Schedule Final Check-up
            </Button>
          </div>
        )}

        {/* Action Buttons for "Expired" */}
        {normalizedStatus === 'expired' && (
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/10">
            <Wrench className="w-4 h-4 mr-2" />
            Find a Repair Shop
            </Button>
            <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/10">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Look for Replacement
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}