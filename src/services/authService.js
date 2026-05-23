const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const { generateToken } = require("../utils/jwt");
const { validateEmail, validatePassword, validateName } = require("../utils/validators");

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  staffType: user.staffType,
  createdAt: user.createdAt,
});

const register = async ({
  name,
  email,
  password,
  phone,
}) => {
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw createError(emailValidation.error, 400);
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw createError(passwordValidation.error, 400);
  }

  // Validate name
  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    throw createError(nameValidation.error, 400);
  }

  const existingUser = await prisma.user.findUnique({ where: { email: emailValidation.value } });
  if (existingUser) {
    throw createError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(passwordValidation.value, 10);

  const user = await prisma.user.create({
    data: {
      name: nameValidation.value,
      email: emailValidation.value,
      password: hashedPassword,
      role: "MEMBER",
      staffType: null,
      member: {
        create: {
          phone: phone || null,
        },
      },
    },
  });

  return sanitizeUser(user);
};

const login = async ({ email, password }) => {
  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw createError(emailValidation.error, 400);
  }

  // Login must accept existing accounts regardless of password length.
  if (typeof password !== "string" || password.length === 0) {
    throw createError("Password is required", 400);
  }

  const user = await prisma.user.findUnique({ where: { email: emailValidation.value } });

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError("Invalid email or password", 401);
  }

  const token = generateToken(user.id, user.role, user.staffType);

  return {
    token,
    user: sanitizeUser(user),
  };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw createError("User not found", 404);
  }

  return sanitizeUser(user);
};

module.exports = {
  register,
  login,
  getMe,
};
