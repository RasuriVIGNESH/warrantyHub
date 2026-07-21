import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Tv, Smartphone, Laptop, Package, Refrigerator, WashingMachine, AirVent, Droplet,
  Speaker, Printer, Monitor, Gamepad, Coffee, Utensils, Fan, Lamp, Radio, Camera,
  Watch, Tablet, Wifi, Plug, Microwave, Lock, Thermometer, HardDrive, Headphones,
  ScanLine, Video, DoorClosed, PlaySquare, Projector, Disc
} from 'lucide-react';
import { useDevices } from '../hooks/useDevices';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

// Utility to format date as YYYY-MM-DD
function formatDateForBackend(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// 🔽 Local sub-component: only used on this page, so it lives here instead of its own file.
const DEVICE_TYPES = [
  // Mobile & Audio
  { id: 'smartphone', name: 'SMARTPHONE', icon: Smartphone, category: 'Mobile' },
  { id: 'tablet', name: 'TABLET', icon: Tablet, category: 'Mobile' },
  { id: 'smartwatch', name: 'SMARTWATCH', icon: Watch, category: 'Mobile' },
  { id: 'headphones', name: 'HEADPHONES', icon: Headphones, category: 'Mobile' },
  { id: 'power-bank', name: 'POWER BANK', icon: Package, category: 'Mobile' },

  // Computing & Work
  { id: 'laptop', name: 'LAPTOP', icon: Laptop, category: 'Computing' },
  { id: 'desktop', name: 'DESKTOP PC', icon: Monitor, category: 'Computing' },
  { id: 'printer', name: 'PRINTER', icon: Printer, category: 'Computing' },
  { id: 'monitor', name: 'MONITOR', icon: Monitor, category: 'Computing' },
  { id: 'scanner', name: 'SCANNER', icon: ScanLine, category: 'Computing' },
  { id: 'external-drive', name: 'EXTERNAL DRIVE', icon: HardDrive, category: 'Computing' },
  { id: 'webcam', name: 'WEBCAM', icon: Video, category: 'Computing' },

  // Entertainment & Media
  { id: 'smart-tv', name: 'SMART TV', icon: Tv, category: 'Entertainment' },
  { id: 'streaming-device', name: 'STREAMING DEVICE', icon: PlaySquare, category: 'Entertainment' },
  { id: 'soundbar', name: 'SOUNDBAR', icon: Speaker, category: 'Entertainment' },
  { id: 'home-theater', name: 'HOME THEATER', icon: Speaker, category: 'Entertainment' },
  { id: 'projector', name: 'PROJECTOR', icon: Projector, category: 'Entertainment' },
  { id: 'dvd-player', name: 'DVD PLAYER', icon: Disc, category: 'Entertainment' },
  { id: 'gaming-console', name: 'GAMING CONSOLE', icon: Gamepad, category: 'Entertainment' },
  { id: 'portable-speaker', name: 'PORTABLE SPEAKER', icon: Radio, category: 'Entertainment' },

  // Kitchen Appliances
  { id: 'smart-refrigerator', name: 'SMART REFRIGERATOR', icon: Refrigerator, category: 'Kitchen' },
  { id: 'refrigerator', name: 'REFRIGERATOR', icon: Refrigerator, category: 'Kitchen' },
  { id: 'microwave', name: 'MICROWAVE', icon: Microwave, category: 'Kitchen' },
  { id: 'dishwasher', name: 'DISHWASHER', icon: Utensils, category: 'Kitchen' },
  { id: 'coffee-maker', name: 'COFFEE MAKER', icon: Coffee, category: 'Kitchen' },
  { id: 'smart-display', name: 'SMART DISPLAY', icon: Monitor, category: 'Kitchen' },

  // Water & Sensors
  { id: 'water-purifier', name: 'WATER PURIFIER', icon: Droplet, category: 'Water & Sensors' },
  { id: 'water-heater', name: 'WATER HEATER', icon: Droplet, category: 'Water & Sensors' },
  { id: 'water-sensor', name: 'WATER SENSOR', icon: Droplet, category: 'Water & Sensors' },

  // Climate Control
  { id: 'air-conditioner', name: 'AIR CONDITIONER', icon: AirVent, category: 'Climate' },
  { id: 'air-purifier', name: 'AIR PURIFIER', icon: AirVent, category: 'Climate' },
  { id: 'fan', name: 'FAN', icon: Fan, category: 'Climate' },
  { id: 'dehumidifier', name: 'DEHUMIDIFIER', icon: Droplet, category: 'Climate' },
  { id: 'thermostat', name: 'THERMOSTAT', icon: Thermometer, category: 'Climate' },

  // Laundry & Cleaning
  { id: 'washing-machine', name: 'WASHING MACHINE', icon: WashingMachine, category: 'Laundry' },
  { id: 'dryer', name: 'DRYER', icon: Fan, category: 'Laundry' },
  { id: 'vacuum-cleaner', name: 'VACUUM CLEANER', icon: Package, category: 'Laundry' },
  { id: 'steam-cleaner', name: 'STEAM CLEANER', icon: Package, category: 'Laundry' },

  // Smart Home Security
  { id: 'smart-lighting', name: 'SMART LIGHTING', icon: Lamp, category: 'Smart Security' },
  { id: 'security-camera', name: 'SECURITY CAMERA', icon: Camera, category: 'Smart Security' },
  { id: 'video-doorbell', name: 'VIDEO DOORBELL', icon: DoorClosed, category: 'Smart Security' },
  { id: 'smart-lock', name: 'SMART LOCK', icon: Lock, category: 'Smart Security' },
  { id: 'router', name: 'ROUTER', icon: Wifi, category: 'Smart Security' },
  { id: 'smart-plug', name: 'SMART PLUG', icon: Plug, category: 'Smart Security' },
];

function DeviceTypeSelector({ onSelect }) {
  const devicesByCategory = DEVICE_TYPES.reduce((acc, device) => {
    if (!acc[device.category]) acc[device.category] = [];
    acc[device.category].push(device);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Select device type
      </h2>
      <div className="space-y-6">
        {Object.entries(devicesByCategory).map(([category, devices]) => (
          <div key={category}>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              {category}
            </h3>
            <div className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
              <div className="inline-flex gap-4 min-w-full md:grid md:grid-cols-4">
                {devices.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => onSelect(type)}
                      className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-700 rounded-lg border-2 border-transparent hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-600 transition-all group min-w-[150px] md:min-w-0"
                    >
                      <Icon className="w-12 h-12 mb-3 text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                        {type.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AddDevice() {
  const navigate = useNavigate();
  const { createDevice } = useDevices();
  const [loading, setLoading] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '', // ✨ FIX: Changed 'brand' to 'manufacturer'
    model: '',
    serialNumber: '',
    purchaseDate: '',
    warrantyDuration: '',
    purchasePrice: '',
    warrantyDocument: null,
    notes: '',
  });

  const handleDeviceTypeSelect = (deviceType) => {
    setSelectedDeviceType(deviceType);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange('warrantyDocument', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Calculate warranty end date
      const purchaseDate = new Date(formData.purchaseDate);
      const warrantyEndDate = new Date(purchaseDate);
      warrantyEndDate.setMonth(purchaseDate.getMonth() + parseInt(formData.warrantyDuration));

      // ✨ FIX: Correctly separate the file from the rest of the data
      const { warrantyDocument, ...deviceDetails } = formData;

      const deviceData = {
        ...deviceDetails,
        type: selectedDeviceType.id,
        purchaseDate: formatDateForBackend(formData.purchaseDate),
        warrantyDuration: parseInt(formData.warrantyDuration),
        warrantyUnit: 'MONTHS',
        warrantyEndDate: formatDateForBackend(warrantyEndDate),
        warrantyStatus: 'active',
        description: '',
      };

      // Pass both the device data and the file object to the hook
      await createDevice(deviceData, warrantyDocument);
      
      navigate('/devices');
    } catch (error) {
      console.error('Failed to create device:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] relative bg-white dark:bg-gray-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none] overflow-y-auto">
        <button
          onClick={() => navigate('/devices')}
          className="absolute top-4 right-4 p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Add New Device
          </h1>

          {!selectedDeviceType ? (
            <div className="[&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
              <DeviceTypeSelector onSelect={handleDeviceTypeSelect} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Device Name*
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder={`e.g., My ${selectedDeviceType.name}`}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                {/* ✨ FIX: Changed label and field to 'manufacturer' */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Manufacturer/Brand*
                  </label>
                  <Input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => handleChange('manufacturer', e.target.value)}
                    placeholder="e.g., Samsung"
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Model
                  </label>
                  <Input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    placeholder="e.g., Galaxy Tab S8"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Serial Number
                  </label>
                  <Input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) => handleChange('serialNumber', e.target.value)}
                    placeholder="Device serial number"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Date*
                  </label>
                  <Input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => handleChange('purchaseDate', e.target.value)}
                    required
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Warranty Duration (months)*
                  </label>
                  <Input
                    type="number"
                    value={formData.warrantyDuration}
                    onChange={(e) => handleChange('warrantyDuration', e.target.value)}
                    placeholder="e.g., 12"
                    required
                    min="1"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Purchase Price
                  </label>
                  <Input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => handleChange('purchasePrice', e.target.value)}
                    placeholder="e.g., 499.99"
                    step="0.01"
                    min="0"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 px-4 border-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Warranty Document
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary file:text-white
                      hover:file:cursor-pointer hover:file:bg-primary/90
                      dark:file:bg-primary dark:file:text-white
                      dark:hover:file:bg-primary/90
                      py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Any additional notes about the device..."
                  className="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-gray-900 dark:text-white py-2.5 px-4"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDeviceType(null)}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  disabled={loading}
                >
                  Add Device
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}