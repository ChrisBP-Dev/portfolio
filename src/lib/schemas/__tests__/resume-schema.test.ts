/**
 * Unit Tests — Resume Schema (storedResumeSchema + parseStoredResume)
 *
 * Coverage: schema validation, Firestore Timestamp conversion, Date/string coercion, error cases
 */
import { describe, expect, it } from 'vitest';

import { storedResumeSchema, parseStoredResume } from '../resume-schema';

const validData = {
  url: 'https://firebasestorage.googleapis.com/resume/current.pdf',
  storagePath: 'resume/current.pdf',
  fileName: 'christopher-resume.pdf',
  uploadedAt: new Date('2026-03-15T10:00:00Z'),
};

describe('Resume Schema', () => {
  describe('parseStoredResume', () => {
    it('parses valid data with Firestore Timestamp mock for uploadedAt', () => {
      const firestoreTimestamp = {
        toDate: () => new Date('2026-03-15T10:00:00Z'),
      };
      const data = { ...validData, uploadedAt: firestoreTimestamp };

      const result = parseStoredResume(data as Record<string, unknown>);

      expect(result.url).toBe(validData.url);
      expect(result.storagePath).toBe(validData.storagePath);
      expect(result.fileName).toBe(validData.fileName);
      expect(result.uploadedAt).toBeInstanceOf(Date);
      expect(result.uploadedAt.toISOString()).toBe('2026-03-15T10:00:00.000Z');
    });

    it('parses valid data with uploadedAt as Date object', () => {
      const result = parseStoredResume(validData as Record<string, unknown>);

      expect(result.url).toBe(validData.url);
      expect(result.uploadedAt).toBeInstanceOf(Date);
      expect(result.uploadedAt).toEqual(validData.uploadedAt);
    });

    it('parses valid data with uploadedAt as ISO string', () => {
      const data = { ...validData, uploadedAt: '2026-03-15T10:00:00Z' };

      const result = parseStoredResume(data as Record<string, unknown>);

      expect(result.uploadedAt).toBeInstanceOf(Date);
      expect(result.uploadedAt.toISOString()).toBe('2026-03-15T10:00:00.000Z');
    });

    it('throws when url is missing', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { url: _url, ...data } = validData;
      expect(() => parseStoredResume(data as Record<string, unknown>)).toThrow();
    });

    it('throws when fileName is missing', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fileName: _fileName, ...data } = validData;
      expect(() => parseStoredResume(data as Record<string, unknown>)).toThrow();
    });

    it('throws when uploadedAt is an invalid value', () => {
      const data = { ...validData, uploadedAt: { notATimestamp: true } };
      expect(() => parseStoredResume(data as Record<string, unknown>)).toThrow(
        'Cannot convert value to Date',
      );
    });
  });

  describe('storedResumeSchema.parse', () => {
    it('passes with fully valid data', () => {
      const result = storedResumeSchema.parse(validData);

      expect(result.url).toBe(validData.url);
      expect(result.storagePath).toBe(validData.storagePath);
      expect(result.fileName).toBe(validData.fileName);
      expect(result.uploadedAt).toEqual(validData.uploadedAt);
    });

    it('fails with invalid url', () => {
      const data = { ...validData, url: 'not-a-url' };
      expect(() => storedResumeSchema.parse(data)).toThrow();
    });
  });
});
