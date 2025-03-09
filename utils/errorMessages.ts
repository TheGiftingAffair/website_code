export const getFirebaseErrorMessage = (error: any): string => {
  const errorCode = error?.code || '';
  
  const errorMessages: Record<string, string> = {
    // Authentication errors
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'Email/password sign up is not enabled.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account exists with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-login-credentials': 'Invalid email or password. Please try again.',
    'auth/too-many-requests': 'Account temporarily locked due to many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/popup-closed-by-user': 'Sign in window was closed.',
    'auth/unauthorized-domain': 'Authentication not allowed from this domain.',
    'auth/invalid-action-code': 'The password reset link has expired or is invalid.',
    'auth/expired-action-code': 'The password reset link has expired.',
    'auth/invalid-verification-code': 'Invalid verification code.',
    'auth/missing-verification-code': 'Verification code is required.',
    'auth/invalid-verification-id': 'Invalid verification ID.',
    'auth/missing-verification-id': 'Verification ID is required.',
    // Generic error fallback
    'default': 'Something went wrong. Please try again. or try changing password'
  };

  return errorMessages[errorCode] || errorMessages['default'];
};
