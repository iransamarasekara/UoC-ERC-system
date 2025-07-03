// This module provides a utility function to generate a random password
// that meets certain criteria. The password will contain at least one uppercase letter,
// Generate a random password of specified length
const generateRandomPassword = (length = 10) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  let password = '';
  
  // Ensure password has at least one uppercase, one lowercase, one number, and one special character
  password += charset.substring(26, 52).charAt(Math.floor(Math.random() * 26)); // Uppercase
  password += charset.substring(0, 26).charAt(Math.floor(Math.random() * 26));  // Lowercase
  password += charset.substring(52, 62).charAt(Math.floor(Math.random() * 10)); // Number
  password += charset.substring(62).charAt(Math.floor(Math.random() * (charset.length - 62))); // Special
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password (Fisher-Yates algorithm)
  password = password.split('');
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }
  
  return password.join('');
};

module.exports = { generateRandomPassword };