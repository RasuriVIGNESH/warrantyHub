import { 
  Tv, 
  Smartphone, 
  Laptop, 
  Package, 
  Refrigerator, 
  WashingMachine, 
  AirVent, 
  Droplet,
  Speaker,
  Printer,
  Monitor,
  Gamepad,
  Coffee,
  Utensils,
  Fan,
  Lamp,
  Radio,
  Camera,
  Watch,
  Tablet,
  Wifi,
  Plug,
  Microwave,
  Lock,
  Thermometer,
  HardDrive,
  Headphones,
  ScanLine,
  Video,
  DoorClosed,
  PlaySquare,
  Projector,
  Disc
} from 'lucide-react';

const DEVICE_TYPES = [
  // Mobile & Audio
  {
    id: 'smartphone',
    name: 'SMARTPHONE',
    icon: Smartphone,
    category: 'Mobile'
  },
  {
    id: 'tablet',
    name: 'TABLET',
    icon: Tablet,
    category: 'Mobile'
  },
  {
    id: 'smartwatch',
    name: 'SMARTWATCH',
    icon: Watch,
    category: 'Mobile'
  },
  {
    id: 'headphones',
    name: 'HEADPHONES',
    icon: Headphones,
    category: 'Mobile'
  },
  {
    id: 'power-bank',
    name: 'POWER BANK',
    icon: Package,
    category: 'Mobile'
  },

  // Computing & Work
  {
    id: 'laptop',
    name: 'LAPTOP',
    icon: Laptop,
    category: 'Computing'
  },
  {
    id: 'desktop',
    name: 'DESKTOP PC',
    icon: Monitor,
    category: 'Computing'
  },
  {
    id: 'printer',
    name: 'PRINTER',
    icon: Printer,
    category: 'Computing'
  },
  {
    id: 'monitor',
    name: 'MONITOR',
    icon: Monitor,
    category: 'Computing'
  },
  {
    id: 'scanner',
    name: 'SCANNER',
    icon: ScanLine,
    category: 'Computing'
  },
  {
    id: 'external-drive',
    name: 'EXTERNAL DRIVE',
    icon: HardDrive,
    category: 'Computing'
  },
  {
    id: 'webcam',
    name: 'WEBCAM',
    icon: Video,
    category: 'Computing'
  },

  // Entertainment & Media
  {
    id: 'smart-tv',
    name: 'SMART TV',
    icon: Tv,
    category: 'Entertainment'
  },
  {
    id: 'streaming-device',
    name: 'STREAMING DEVICE',
    icon: PlaySquare,
    category: 'Entertainment'
  },
  {
    id: 'soundbar',
    name: 'SOUNDBAR',
    icon: Speaker,
    category: 'Entertainment'
  },
  {
    id: 'home-theater',
    name: 'HOME THEATER',
    icon: Speaker,
    category: 'Entertainment'
  },
  {
    id: 'projector',
    name: 'PROJECTOR',
    icon: Projector,
    category: 'Entertainment'
  },
  {
    id: 'dvd-player',
    name: 'DVD PLAYER',
    icon: Disc,
    category: 'Entertainment'
  },
  {
    id: 'gaming-console',
    name: 'GAMING CONSOLE',
    icon: Gamepad,
    category: 'Entertainment'
  },
  {
    id: 'portable-speaker',
    name: 'PORTABLE SPEAKER',
    icon: Radio,
    category: 'Entertainment'
  },

  // Kitchen Appliances
  {
    id: 'smart-refrigerator',
    name: 'SMART REFRIGERATOR',
    icon: Refrigerator,
    category: 'Kitchen'
  },
  {
    id: 'refrigerator',
    name: 'REFRIGERATOR',
    icon: Refrigerator,
    category: 'Kitchen'
  },
  {
    id: 'microwave',
    name: 'MICROWAVE',
    icon: Microwave,
    category: 'Kitchen'
  },
  {
    id: 'dishwasher',
    name: 'DISHWASHER',
    icon: Utensils,
    category: 'Kitchen'
  },
  {
    id: 'coffee-maker',
    name: 'COFFEE MAKER',
    icon: Coffee,
    category: 'Kitchen'
  },
  {
    id: 'smart-display',
    name: 'SMART DISPLAY',
    icon: Monitor,
    category: 'Kitchen'
  },

  // Water & Sensors
  {
    id: 'water-purifier',
    name: 'WATER PURIFIER',
    icon: Droplet,
    category: 'Water & Sensors'
  },
  {
    id: 'water-heater',
    name: 'WATER HEATER',
    icon: Droplet,
    category: 'Water & Sensors'
  },
  {
    id: 'water-sensor',
    name: 'WATER SENSOR',
    icon: Droplet,
    category: 'Water & Sensors'
  },

  // Climate Control
  {
    id: 'air-conditioner',
    name: 'AIR CONDITIONER',
    icon: AirVent,
    category: 'Climate'
  },
  {
    id: 'air-purifier',
    name: 'AIR PURIFIER',
    icon: AirVent,
    category: 'Climate'
  },
  {
    id: 'fan',
    name: 'FAN',
    icon: Fan,
    category: 'Climate'
  },
  {
    id: 'dehumidifier',
    name: 'DEHUMIDIFIER',
    icon: Droplet,
    category: 'Climate'
  },
  {
    id: 'thermostat',
    name: 'THERMOSTAT',
    icon: Thermometer,
    category: 'Climate'
  },

  // Laundry & Cleaning
  {
    id: 'washing-machine',
    name: 'WASHING MACHINE',
    icon: WashingMachine,
    category: 'Laundry'
  },
  {
    id: 'dryer',
    name: 'DRYER',
    icon: Fan,
    category: 'Laundry'
  },
  {
    id: 'vacuum-cleaner',
    name: 'VACUUM CLEANER',
    icon: Package,
    category: 'Laundry'
  },
  {
    id: 'steam-cleaner',
    name: 'STEAM CLEANER',
    icon: Package,
    category: 'Laundry'
  },

  // Smart Home Security
  {
    id: 'smart-lighting',
    name: 'SMART LIGHTING',
    icon: Lamp,
    category: 'Smart Security'
  },
  {
    id: 'security-camera',
    name: 'SECURITY CAMERA',
    icon: Camera,
    category: 'Smart Security'
  },
  {
    id: 'video-doorbell',
    name: 'VIDEO DOORBELL',
    icon: DoorClosed,
    category: 'Smart Security'
  },
  {
    id: 'smart-lock',
    name: 'SMART LOCK',
    icon: Lock,
    category: 'Smart Security'
  },
  {
    id: 'router',
    name: 'ROUTER',
    icon: Wifi,
    category: 'Smart Security'
  },
  {
    id: 'smart-plug',
    name: 'SMART PLUG',
    icon: Plug,
    category: 'Smart Security'
  }
];

export function DeviceTypeSelector({ onSelect }) {
  // Group devices by category
  const devicesByCategory = DEVICE_TYPES.reduce((acc, device) => {
    if (!acc[device.category]) {
      acc[device.category] = [];
    }
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