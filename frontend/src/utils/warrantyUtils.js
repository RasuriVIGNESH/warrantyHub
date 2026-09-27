import { calculateWarrantyEndDate, getWarrantyStatus } from './dateUtils';

export const DEVICE_TYPES = {
  TV: { label: 'TV', icon: 'tv' },
  REFRIGERATOR: { label: 'Refrigerator', icon: 'refrigerator' },
  WASHER: { label: 'Washing Machine', icon: 'washer' },
  DRYER: { label: 'Dryer', icon: 'dryer' },
  DISHWASHER: { label: 'Dishwasher', icon: 'dishwasher' },
  MICROWAVE: { label: 'Microwave', icon: 'microwave' },
  COMPUTER: { label: 'Computer', icon: 'computer' },
  PHONE: { label: 'Phone', icon: 'phone' },
  OTHER: { label: 'Other', icon: 'device' },
};

export const WARRANTY_UNITS = {
  MONTHS: 'months',
  YEARS: 'years',
};

export function validateDeviceData(deviceData) {
  const errors = {};

  if (!deviceData.name?.trim()) {
    errors.name = 'Device name is required';
  }

  if (!deviceData.type) {
    errors.type = 'Device type is required';
  }

  if (!deviceData.brand?.trim()) {
    errors.brand = 'Brand is required';
  }

  if (!deviceData.purchaseDate) {
    errors.purchaseDate = 'Purchase date is required';
  }

  if (!deviceData.warrantyDuration) {
    errors.warrantyDuration = 'Warranty duration is required';
  } else if (deviceData.warrantyDuration <= 0) {
    errors.warrantyDuration = 'Warranty duration must be greater than 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function enrichDeviceData(deviceData) {
  const warrantyEndDate = calculateWarrantyEndDate(
    deviceData.purchaseDate,
    deviceData.warrantyDuration,
    deviceData.warrantyUnit
  );

  return {
    ...deviceData,
    warrantyEndDate,
    warrantyStatus: getWarrantyStatus(warrantyEndDate),
  };
}

export function formatDeviceType(type) {
  return DEVICE_TYPES[type]?.label || type;
}

export function getDeviceIcon(type) {
  return DEVICE_TYPES[type]?.icon || 'device';
}

export function sortDevicesByWarrantyStatus(devices) {
  const statusPriority = {
    'expiring-soon': 1,
    'active': 2,
    'expired': 3,
    'unknown': 4,
  };

  return [...devices].sort((a, b) => {
    const statusA = statusPriority[a.warrantyStatus] || 4;
    const statusB = statusPriority[b.warrantyStatus] || 4;
    return statusA - statusB;
  });
} 