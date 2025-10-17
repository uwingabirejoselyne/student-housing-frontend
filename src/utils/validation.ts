export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

/**
 * Password validation
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  if (password.length > 50) {
    return 'Password must not exceed 50 characters';
  }

  // Optional: Strong password validation
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  // You can enforce strong password if needed
  // if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
  //   return 'Password must contain uppercase, lowercase, and numbers';
  // }

  return null;
};

/**
 * Name validation
 */
export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Full name is required';
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (name.trim().length > 50) {
    return 'Name must not exceed 50 characters';
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(name)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }

  return null;
};

/**
 * Phone validation (optional)
 */
export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) {
    return null; // Optional field
  }

  // Rwanda phone number format: +250 followed by 9 digits
  const phoneRegex = /^(\+250|0)[0-9]{9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid Rwanda phone number (e.g., +250788123456)';
  }

  return null;
};

/**
 * Confirm password validation
 */
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

/**
 * Login form validation
 */
export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (email: string, password: string): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

/**
 * Registration form validation
 */
export interface RegisterFormErrors {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: string,
  phone?: string
): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  if (!role) {
    errors.role = 'Please select a user role';
  }

  if (phone) {
    const phoneError = validatePhone(phone);
    if (phoneError) errors.phone = phoneError;
  }

  return errors;
};

/**
 * Check if form has errors
 */
export const hasErrors = (errors: Record<string, string | undefined>): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};