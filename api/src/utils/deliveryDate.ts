/**
 * Utility functions for calculating estimated delivery dates
 */

// Supplier lead times in business days
export const SUPPLIER_LEAD_TIMES: Record<number, number> = {
  1: 7,  // PurrTech Innovations
  2: 2,  // WhiskerWare Systems
  3: 5,  // CatNip Creations
};

/**
 * Adds business days to a date, skipping weekends (Saturday and Sunday)
 * @param startDate - The starting date
 * @param businessDays - Number of business days to add
 * @returns The resulting date after adding business days
 */
export function addBusinessDays(startDate: Date, businessDays: number): Date {
  const result = new Date(startDate);
  let daysAdded = 0;

  while (daysAdded < businessDays) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }

  return result;
}

/**
 * Calculates the estimated delivery date for a product based on supplier lead time
 * @param supplierId - The ID of the supplier
 * @param orderDate - Optional order date (defaults to current date)
 * @returns The estimated delivery date
 */
export function calculateDeliveryDate(supplierId: number, orderDate?: Date): Date {
  const leadTime = SUPPLIER_LEAD_TIMES[supplierId] || 5; // Default to 5 days if supplier not found
  const startDate = orderDate || new Date();
  return addBusinessDays(startDate, leadTime);
}

/**
 * Formats a date to a friendly delivery string (e.g., "Thu, Feb 13")
 * @param date - The date to format
 * @returns A formatted date string
 */
export function formatDeliveryDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Checks if a delivery date is within a specified number of days
 * @param deliveryDate - The delivery date to check
 * @param days - Number of days to check against
 * @param fromDate - Optional reference date (defaults to current date)
 * @returns True if delivery date is within the specified days
 */
export function isWithinDays(deliveryDate: Date, days: number, fromDate?: Date): boolean {
  const reference = fromDate || new Date();
  const diffTime = deliveryDate.getTime() - reference.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= days && diffDays >= 0;
}
