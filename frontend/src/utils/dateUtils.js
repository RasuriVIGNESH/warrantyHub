import { format, addMonths, addYears, isAfter, isBefore, parseISO } from 'date-fns';

export function formatDate(date) {
  if (!date) return '';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM dd, yyyy');
}

export function calculateWarrantyEndDate(purchaseDate, warrantyDuration, warrantyUnit = 'years') {
  if (!purchaseDate) return null;
  
  const parsedDate = typeof purchaseDate === 'string' ? parseISO(purchaseDate) : purchaseDate;
  
  return warrantyUnit === 'months'
    ? addMonths(parsedDate, warrantyDuration)
    : addYears(parsedDate, warrantyDuration);
}

export function isWarrantyExpired(warrantyEndDate) {
  if (!warrantyEndDate) return false;
  const parsedDate = typeof warrantyEndDate === 'string' ? parseISO(warrantyEndDate) : warrantyEndDate;
  return isBefore(parsedDate, new Date());
}

export function isWarrantyExpiringSoon(warrantyEndDate, thresholdDays = 30) {
  if (!warrantyEndDate) return false;
  const parsedDate = typeof warrantyEndDate === 'string' ? parseISO(warrantyEndDate) : warrantyEndDate;
  const thresholdDate = addMonths(new Date(), 1);
  return isAfter(parsedDate, new Date()) && isBefore(parsedDate, thresholdDate);
}

export function getWarrantyStatus(warrantyEndDate) {
  if (!warrantyEndDate) return 'unknown';
  if (isWarrantyExpired(warrantyEndDate)) return 'expired';
  if (isWarrantyExpiringSoon(warrantyEndDate)) return 'expiring-soon';
  return 'active';
} 