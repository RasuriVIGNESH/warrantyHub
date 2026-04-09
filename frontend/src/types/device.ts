export type DeviceCategory = {
  id: string;
  name: string;
  icon?: string;
};

export type Room = {
  id: string;
  name: string;
  devices: string[]; // device IDs
};

export type Priority = 'high' | 'medium' | 'low';

export type Device = {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice?: number;
  warrantyStartDate: string;
  warrantyEndDate: string;
  warrantyProvider?: string;
  warrantyStatus: 'active' | 'expiring-soon' | 'expired';
  warrantyDocument?: string;
  notes?: string;
  category: string;
  room?: string;
  priority: Priority;
  maintenanceHistory: MaintenanceRecord[];
  documents: Document[];
};

export type MaintenanceRecord = {
  id: string;
  date: string;
  type: 'repair' | 'maintenance' | 'inspection';
  description: string;
  cost?: number;
  serviceProvider?: string;
  partsReplaced?: string[];
  nextScheduledDate?: string;
};

export type Document = {
  id: string;
  type: 'receipt' | 'warranty' | 'manual' | 'service_record';
  name: string;
  url: string;
  uploadDate: string;
};

export const DEFAULT_ROOMS = [
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'living-room', name: 'Living Room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'bathroom', name: 'Bathroom' },
  { id: 'office', name: 'Home Office' },
  { id: 'garage', name: 'Garage' },
  { id: 'outdoor', name: 'Outdoor' },
  { id: 'other', name: 'Other' }
] as const;

export const DEVICE_CATEGORIES = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'appliances', name: 'Appliances' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'tools', name: 'Tools & Equipment' },
  { id: 'other', name: 'Other' }
] as const; 