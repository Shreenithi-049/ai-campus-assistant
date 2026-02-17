// Email and Password Validation Utilities

/**
 * Email Validation for College Domain
 * Only allows @skcet.ac.in emails
 */
export const validateCollegeEmail = (email) => {
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@skcet\.ac\.in$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return { 
      isValid: false, 
      error: 'Please use your college email (@skcet.ac.in)' 
    };
  }
  
  return { isValid: true, error: null };
};

/**
 * Strong Password Validation
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (@$!%*?&)
 */
export const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password),
  };

  const allValid = Object.values(requirements).every(req => req);

  return {
    isValid: allValid,
    requirements,
    error: allValid ? null : 'Password does not meet requirements',
  };
};

/**
 * Get user-friendly error message from Firebase error code
 */
export const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email format',
    'auth/operation-not-allowed': 'Registration is currently disabled',
    'auth/weak-password': 'Password is too weak',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Check your connection',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again';
};
