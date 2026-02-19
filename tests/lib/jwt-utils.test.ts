import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Buffer } from 'buffer';
import { parseJwt } from '@/lib/jwt-utils';

describe('parseJwt', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should parse a valid JWT payload', () => {
    const payload = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '');
    const token = `header.${base64Payload}.signature`;

    expect(parseJwt(token)).toEqual(payload);
  });

  it('should handle Base64URL encoding with - and _', () => {
    // A payload that results in + and / in standard base64
    // " >?" in JSON is "\u0020\u003e\u003f"
    // Let's just manually create a payload and encode it to base64url
    const payload = { sub: 'subjects > 0?' };
    const base64Payload = Buffer.from(JSON.stringify(payload))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    // Ensure we actually have - or _ in the base64Payload to test the replacement
    expect(base64Payload).toMatch(/[-_]/);

    const token = `header.${base64Payload}.signature`;
    expect(parseJwt(token)).toEqual(payload);
  });

  it('should handle multi-byte characters (Unicode)', () => {
    const payload = { name: 'Jules 🚀', city: 'München' };
    const jsonString = JSON.stringify(payload);
    // encode to base64
    const base64Payload = Buffer.from(jsonString).toString('base64');
    const token = `header.${base64Payload}.signature`;

    expect(parseJwt(token)).toEqual(payload);
  });

  it('should return null for malformed tokens (less than 2 parts)', () => {
    expect(parseJwt('invalid-token')).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('should return null for invalid JSON in payload', () => {
    const base64Payload = Buffer.from('not-json').toString('base64');
    const token = `header.${base64Payload}.signature`;
    expect(parseJwt(token)).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('should return null for invalid base64', () => {
    const token = 'header.!!!.signature';
    expect(parseJwt(token)).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('should return null when input is empty string', () => {
    expect(parseJwt('')).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  it('should parse even if signature is missing but has two dots', () => {
    const payload = { sub: '123' };
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const token = `header.${base64Payload}.`;
    expect(parseJwt(token)).toEqual(payload);
  });
});
