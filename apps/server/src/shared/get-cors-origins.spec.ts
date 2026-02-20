import { getCorsOrigins } from './get-cors-origins';

describe('getCorsOrigins', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('development mode', () => {
    it('should return regex pattern when NODE_ENV is not production', () => {
      delete process.env.NODE_ENV;

      const result = getCorsOrigins();

      expect(result).toBeInstanceOf(RegExp);
      expect(result).toEqual(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/);
    });

    it('should match localhost with port', () => {
      delete process.env.NODE_ENV;

      const regex = getCorsOrigins() as RegExp;

      expect(regex.test('http://localhost:3000')).toBe(true);
      expect(regex.test('http://localhost:4200')).toBe(true);
      expect(regex.test('http://127.0.0.1:3000')).toBe(true);
    });

    it('should match localhost without port', () => {
      delete process.env.NODE_ENV;

      const regex = getCorsOrigins() as RegExp;

      expect(regex.test('http://localhost')).toBe(true);
      expect(regex.test('http://127.0.0.1')).toBe(true);
    });

    it('should not match https or other hosts', () => {
      delete process.env.NODE_ENV;

      const regex = getCorsOrigins() as RegExp;

      expect(regex.test('https://localhost:3000')).toBe(false);
      expect(regex.test('http://example.com:3000')).toBe(false);
    });
  });

  describe('production mode', () => {
    it('should return BASE_URL as array when set', () => {
      process.env.NODE_ENV = 'production';
      process.env.BASE_URL = 'https://example.com';

      const result = getCorsOrigins();

      expect(result).toEqual(['https://example.com']);
    });

    it('should handle multiple comma-separated URLs', () => {
      process.env.NODE_ENV = 'production';
      process.env.BASE_URL =
        'https://app.example.com, https://admin.example.com';

      const result = getCorsOrigins();

      expect(result).toEqual([
        'https://app.example.com',
        'https://admin.example.com',
      ]);
    });

    it('should default to http://localhost:3000 when BASE_URL not set', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.BASE_URL;

      const result = getCorsOrigins();

      expect(result).toEqual(['http://localhost:3000']);
    });
  });
});
