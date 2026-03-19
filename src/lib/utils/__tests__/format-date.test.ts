import { describe, it, expect } from 'vitest';
import { formatExperienceDateRange } from '../format-date';

describe('formatExperienceDateRange', () => {
  it('formats range with both dates provided', () => {
    const start = new Date('2022-03-01');
    const end = new Date('2024-06-15');
    expect(formatExperienceDateRange(start, end, 'es', 'Presente')).toBe('2022 – 2024');
    expect(formatExperienceDateRange(start, end, 'en', 'Present')).toBe('2022 – 2024');
  });

  it('uses presentLabel when endDate is null (ES)', () => {
    const start = new Date('2024-01-15');
    expect(formatExperienceDateRange(start, null, 'es', 'Presente')).toBe('2024 – Presente');
  });

  it('uses presentLabel when endDate is null (EN)', () => {
    const start = new Date('2024-01-15');
    expect(formatExperienceDateRange(start, null, 'en', 'Present')).toBe('2024 – Present');
  });

  it('handles same year start and end', () => {
    const start = new Date('2024-03-01');
    const end = new Date('2024-11-15');
    expect(formatExperienceDateRange(start, end, 'es', 'Presente')).toBe('2024 – 2024');
  });
});
