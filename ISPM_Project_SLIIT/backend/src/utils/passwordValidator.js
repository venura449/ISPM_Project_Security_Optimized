
const COMMON_WEAK_PASSWORDS = new Set([
  '123456',
  'password',
  '12345678',
  'qwerty',
  '123456789',
  '12345',
  '1234567',
  '1234567890',
  '123123',
  'password123',
  'admin',
  'admin123',
  'letmein',
  'welcome',
  'iloveyou',
  'sunshine',
  'monkey',
  'dragon',
  'master',
  'abc123',
  'pass123',
  'changed',
  'p@ssword',
  'p@ssw0rd'
]);

/**
 * 
 * @param {string} str 
 * @returns {boolean}
 */
function isRepeatedChar(str) {
  return /^(\x20|.)\1+$/.test(str) || new Set(str.toLowerCase().split('')).size === 1;
}

/**
 * 
 * @param {string} str 
 * @returns {boolean}
 */
function isSequentialPattern(str) {
  const s = str.toLowerCase();
  let isSeqAsc = true;
  let isSeqDesc = true;
  
  for (let i = 0; i < s.length - 1; i++) {
    const curr = s.charCodeAt(i);
    const next = s.charCodeAt(i + 1);
    if (next !== curr + 1) isSeqAsc = false;
    if (next !== curr - 1) isSeqDesc = false;
  }
  
  return isSeqAsc || isSeqDesc;
}

/**
 * Validate password strength
 * @param {string} password 
 * @returns {{ isValid: boolean, message: string }}
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      message: 'Password is required'
    };
  }

  // Minimum length rule (8 characters minimum, up to 128)
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long'
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: 'Password must not exceed 128 characters'
    };
  }

  const lowerPassword = password.toLowerCase().trim();

  // Common password check
  if (COMMON_WEAK_PASSWORDS.has(lowerPassword)) {
    return {
      isValid: false,
      message: 'Password is too common and easily guessable. Please choose a stronger password.'
    };
  }

  // Repeated character check (e.g. 'aaaaaa', '11111111')
  if (isRepeatedChar(password)) {
    return {
      isValid: false,
      message: 'Password cannot consist of a single repeated character.'
    };
  }

  // Simple sequential check
  if (isSequentialPattern(password)) {
    return {
      isValid: false,
      message: 'Password cannot be a simple sequential sequence of characters.'
    };
  }

  return {
    isValid: true,
    message: 'Password meets security requirements'
  };
}

module.exports = {
  validatePassword,
  COMMON_WEAK_PASSWORDS
};
