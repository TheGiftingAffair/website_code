export interface ValidationErrors {
  email?: string;
  phone?: string;
  postalCode?: string;
  street?: string;
}

export const validateField = (name: string, value: string): string => {
  switch (name) {
    case 'email':
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
      break;
      
    case 'phone':
      const phoneRegex = /^[689]\d{7}$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid Singapore phone number (8 digits starting with 6, 8, or 9)';
      }
      break;
      
    case 'postalCode':
      const postalCodeRegex = /^\d{6}$/;
      if (!postalCodeRegex.test(value)) {
        return 'Please enter a valid postal code (6 digits)';
      }
      break;
      
    case 'street':
      if (value.trim().length < 5) {
        return 'Please enter a valid address';
      }
      break;
  }
  return '';
};

export const validateAllFields = (fields: Record<string, string>): ValidationErrors => {
  const errors: ValidationErrors = {};
  for (const [key, value] of Object.entries(fields)) {
    const error = validateField(key, value);
    if (error) {
      errors[key] = error;
    }
  }
  return errors;
};
