const WEAK_PASSWORDS = new Set([
  "password", "password123", "12345678", "123456789", 
  "qwertyuiop", "admin123", "welcome123", "letmein123"
]);

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long (12+ recommended).";
  }
  
  if (password.startsWith(" ") || password.endsWith(" ")) {
    return "Password cannot start or end with a blank space.";
  }

  // ASCII-standard only: 0x20 (space) to 0x7E (~)
  // This effectively blocks accented characters like á, ñ, etc.
  if (!/^[\x20-\x7E]*$/.test(password)) {
    return "Password contains invalid characters. Please use only standard letters, numbers, and symbols (ASCII).";
  }

  // Check for common weak passwords
  if (WEAK_PASSWORDS.has(password.toLowerCase())) {
    return "This password is too common. Please choose a stronger one.";
  }

  // Simple check for extremely predictable patterns
  if (/^(.)\1+$/.test(password)) {
    return "Password cannot be all the same character.";
  }

  return null;
}

const ALLOWED_DOMAINS = new Set([
  "gmail.com", "ymail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com"
]);

export function validateEmail(email: string): string | null {
  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2) return "Please enter a valid email address.";
  
  const [local, domain] = parts;
  
  if (!ALLOWED_DOMAINS.has(domain)) {
    return "Only real email addresses from recognized providers are allowed.";
  }
  
  // Basic username validation for the local part
  if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(local)) {
    return "Email username is invalid. It must start and end with a letter or number.";
  }

  if (local.includes("..")) {
    return "Email username cannot contain consecutive periods.";
  }

  return null;
}
