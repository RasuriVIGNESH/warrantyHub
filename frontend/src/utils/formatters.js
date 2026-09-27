import { format, formatDistanceToNow, differenceInDays, isAfter } from 'date-fns';

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {string} formatStr - The format string (default: 'MMM d, yyyy')
 * @returns {string} The formatted date string
 */
export function formatDate(date, formatStr = 'MMM d, yyyy') {
  if (!date) return 'Not specified';
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a date relative to now (e.g., "2 days ago")
 * @param {string|Date} date - The date to format
 * @returns {string} The relative time string
 */
export function formatRelativeDate(date) {
  if (!date) return 'Not specified';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative date:', error);
    return 'Invalid date';
  }
}

/**
 * Calculate warranty status based on end date
 * @param {string|Date} warrantyEndDate - The warranty end date
 * @returns {{ status: string, daysLeft: number }} Warranty status and days remaining
 */
export function calculateWarrantyStatus(warrantyEndDate) {
  if (!warrantyEndDate) {
    return { status: 'unknown', daysLeft: null };
  }

  try {
    const endDate = new Date(warrantyEndDate);
    const today = new Date();
    const daysLeft = differenceInDays(endDate, today);

    if (isAfter(today, endDate)) {
      return { status: 'expired', daysLeft: 0 };
    }

    if (daysLeft <= 30) {
      return { status: 'expiring-soon', daysLeft };
    }

    return { status: 'active', daysLeft };
  } catch (error) {
    console.error('Error calculating warranty status:', error);
    return { status: 'unknown', daysLeft: null };
  }
}

/**
 * Format file size to human readable string
 * @param {number} bytes - The file size in bytes
 * @returns {string} Formatted file size (e.g., "1.5 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format a number with commas
 * @param {number} number - The number to format
 * @returns {string} Formatted number with commas
 */
export function formatNumber(number) {
  return new Intl.NumberFormat().format(number);
}

/**
 * Truncate text with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length before truncation
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 50) {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

/**
 * Format warranty status for display
 * @param {string} status - The warranty status
 * @returns {object} Formatted status with color and label
 */
export function formatWarrantyStatus(status) {
  const statusConfig = {
    active: {
      label: 'Active',
      color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
    },
    'expiring-soon': {
      label: 'Expiring Soon',
      color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
    },
    expired: {
      label: 'Expired',
      color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
    },
    unknown: {
      label: 'Unknown',
      color: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20',
    },
  };

  return statusConfig[status] || statusConfig.unknown;
}

/**
 * Generate initials from a name
 * @param {string} name - The full name
 * @returns {string} Initials (max 2 characters)
 */
export function getInitials(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
} 