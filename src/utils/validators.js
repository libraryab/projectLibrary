/**
 * Validation utilities for the application
 */

// Email validation: non-empty, valid format, max 255 chars
const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email is required" };
  }

  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Email cannot be empty" };
  }

  if (trimmed.length > 255) {
    return { valid: false, error: "Email must not exceed 255 characters" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: "Email format is invalid" };
  }

  return { valid: true, value: trimmed };
};

// Password validation: min 8 chars, max 128 chars
const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required" };
  }

  const trimmed = password.trim();

  if (trimmed.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }

  if (trimmed.length > 128) {
    return { valid: false, error: "Password must not exceed 128 characters" };
  }

  return { valid: true, value: trimmed };
};

// Name validation: non-empty, max 100 chars, no HTML tags
const validateName = (name) => {
  if (!name || typeof name !== "string") {
    return { valid: false, error: "Name is required" };
  }

  const trimmed = name.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Name cannot be empty" };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: "Name must not exceed 100 characters" };
  }

  // Check for HTML tags
  const htmlTagRegex = /<[^>]*>/;
  if (htmlTagRegex.test(trimmed)) {
    return { valid: false, error: "Name cannot contain HTML tags" };
  }

  return { valid: true, value: trimmed };
};

// Description validation: non-empty, max 500 chars
const validateDescription = (description) => {
  if (!description || typeof description !== "string") {
    return { valid: false, error: "Description is required" };
  }

  const trimmed = description.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Description cannot be empty" };
  }

  if (trimmed.length > 500) {
    return {
      valid: false,
      error: "Description must not exceed 500 characters",
    };
  }

  return { valid: true, value: trimmed };
};

// Amount validation: must be number, > 0, max 2 decimal places
const validateAmount = (amount) => {
  if (amount === null || amount === undefined || amount === "") {
    return { valid: false, error: "Amount is required" };
  }

  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return { valid: false, error: "Amount must be a valid number" };
  }

  if (numAmount <= 0) {
    return { valid: false, error: "Amount must be greater than 0" };
  }

  // Check for max 2 decimal places
  if (!/^\d+(\.\d{1,2})?$/.test(String(amount).trim())) {
    return {
      valid: false,
      error: "Amount must have a maximum of 2 decimal places",
    };
  }

  return { valid: true, value: numAmount };
};

// GroupName validation: non-empty, max 50 chars
const validateGroupName = (groupName) => {
  if (!groupName || typeof groupName !== "string") {
    return { valid: false, error: "Group name is required" };
  }

  const trimmed = groupName.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: "Group name cannot be empty" };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: "Group name must not exceed 50 characters" };
  }

  return { valid: true, value: trimmed };
};

// UUID validation
const validateUUID = (uuid) => {
  if (!uuid || typeof uuid !== "string") {
    return { valid: false, error: "UUID is required" };
  }

  // Standard UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // But we'll accept CUID format too (used by Prisma @default(cuid()))
  const uuidRegex = /^[a-z0-9-]+$/i;

  if (!uuidRegex.test(uuid)) {
    return { valid: false, error: "Invalid UUID format" };
  }

  // Check length (UUID v4 is 36 chars, CUID is variable but typically 24-25)
  if (uuid.length < 21 || uuid.length > 36) {
    return { valid: false, error: "Invalid UUID format" };
  }

  return { valid: true, value: uuid };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateName,
  validateDescription,
  validateAmount,
  validateGroupName,
  validateUUID,
};
