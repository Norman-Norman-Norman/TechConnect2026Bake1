import { describe, it, expect } from 'vitest';
import { 
  addBusinessDays, 
  calculateDeliveryDate, 
  formatDeliveryDate, 
  isWithinDays,
  SUPPLIER_LEAD_TIMES 
} from './deliveryDate';

describe('Delivery Date Utilities', () => {
  describe('addBusinessDays', () => {
    it('should add business days skipping weekends', () => {
      // Monday, Feb 10, 2026
      const monday = new Date('2026-02-09T00:00:00Z');
      const result = addBusinessDays(monday, 5);
      // Should be Monday, Feb 16, 2026 (skipping Sat/Sun Feb 14-15)
      expect(result.getDay()).not.toBe(0); // Not Sunday
      expect(result.getDay()).not.toBe(6); // Not Saturday
    });

    it('should handle adding days that span multiple weekends', () => {
      const monday = new Date('2026-02-09T00:00:00Z');
      const result = addBusinessDays(monday, 10);
      // 10 business days = 2 weeks
      expect(result.getDay()).not.toBe(0);
      expect(result.getDay()).not.toBe(6);
    });

    it('should handle starting from Friday', () => {
      const friday = new Date('2026-02-13T00:00:00Z');
      const result = addBusinessDays(friday, 1);
      // Should be Monday, Feb 16 (skipping weekend)
      expect(result.getDay()).toBe(1); // Monday
    });
  });

  describe('calculateDeliveryDate', () => {
    it('should calculate delivery date for PurrTech (7 business days)', () => {
      const startDate = new Date('2026-02-10T00:00:00Z'); // Monday
      const result = calculateDeliveryDate(1, startDate);
      
      // 7 business days from Monday should be next Wednesday
      expect(result.getTime()).toBeGreaterThan(startDate.getTime());
    });

    it('should calculate delivery date for WhiskerWare (2 business days)', () => {
      const startDate = new Date('2026-02-10T00:00:00Z'); // Tuesday
      const result = calculateDeliveryDate(2, startDate);
      
      // 2 business days from Tuesday should be Thursday
      expect(result.getDay()).toBe(4); // Thursday
    });

    it('should calculate delivery date for CatNip (5 business days)', () => {
      const startDate = new Date('2026-02-09T00:00:00Z'); // Monday
      const result = calculateDeliveryDate(3, startDate);
      
      // 5 business days from Monday should be Monday of next week
      expect(result.getTime()).toBeGreaterThan(startDate.getTime());
    });

    it('should use default lead time for unknown supplier', () => {
      const startDate = new Date('2026-02-10T00:00:00Z');
      const result = calculateDeliveryDate(999, startDate);
      
      expect(result.getTime()).toBeGreaterThan(startDate.getTime());
    });

    it('should use current date if no date provided', () => {
      const result = calculateDeliveryDate(2);
      const now = new Date();
      
      expect(result.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  describe('formatDeliveryDate', () => {
    it('should format date as "Weekday, Month Day"', () => {
      const date = new Date('2026-02-13T00:00:00Z');
      const formatted = formatDeliveryDate(date);
      
      expect(formatted).toMatch(/\w{3}, \w{3} \d{1,2}/);
    });
  });

  describe('isWithinDays', () => {
    it('should return true for date within specified days', () => {
      const now = new Date('2026-02-10T00:00:00Z');
      const futureDate = new Date('2026-02-12T00:00:00Z');
      
      expect(isWithinDays(futureDate, 3, now)).toBe(true);
    });

    it('should return false for date beyond specified days', () => {
      const now = new Date('2026-02-10T00:00:00Z');
      const futureDate = new Date('2026-02-20T00:00:00Z');
      
      expect(isWithinDays(futureDate, 3, now)).toBe(false);
    });

    it('should return false for past dates', () => {
      const now = new Date('2026-02-10T00:00:00Z');
      const pastDate = new Date('2026-02-05T00:00:00Z');
      
      expect(isWithinDays(pastDate, 3, now)).toBe(false);
    });
  });

  describe('SUPPLIER_LEAD_TIMES', () => {
    it('should have correct lead times for all suppliers', () => {
      expect(SUPPLIER_LEAD_TIMES[1]).toBe(7); // PurrTech
      expect(SUPPLIER_LEAD_TIMES[2]).toBe(2); // WhiskerWare
      expect(SUPPLIER_LEAD_TIMES[3]).toBe(5); // CatNip
    });
  });
});
