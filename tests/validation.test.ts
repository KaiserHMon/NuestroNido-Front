import { describe, it, expect } from 'vitest';
import { generateInvitationCode, validateInvitationCodeFormat } from '../lib/validation';

describe('generateInvitationCode', () => {
  it('should generate a code of length 7', () => {
    const code = generateInvitationCode();
    expect(code).toHaveLength(7);
  });

  it('should generate a code with only uppercase letters and numbers', () => {
    const code = generateInvitationCode();
    expect(validateInvitationCodeFormat(code)).toBe(true);
  });

  it('should generate different codes on subsequent calls', () => {
    const code1 = generateInvitationCode();
    const code2 = generateInvitationCode();
    expect(code1).not.toBe(code2);
  });
});
