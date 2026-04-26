const bcrypt = require("bcryptjs");
const prisma = require("../lib/prisma");
const { generateToken } = require("../utils/jwt");

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
  role,
  staffType,
  phone,
  libraryId,
}) => {
  const normalizedRole = typeof role === "string" ? role.toUpperCase() : role;
  const normalizedStaffType =
    typeof staffType === "string" ? staffType.toUpperCase() : staffType;

  if (!name || !email || !password || !role) {
    throw createError(
      "Missing required fields: name, email, password, role",
      400,
    );
  }

  if (!["MEMBER", "STAFF"].includes(normalizedRole)) {
    throw createError("Role must be either MEMBER or STAFF", 400);
  }

  if (normalizedRole === "STAFF") {
    if (!["ADMIN", "LIBRARIAN"].includes(normalizedStaffType || "")) {
      throw createError("Staff type must be ADMIN or LIBRARIAN", 400);
    }

    if (libraryId) {
      const library = await prisma.library.findUnique({
        where: { id: libraryId },
      });
      if (!library) {
        throw createError("Library not found", 404);
      }
    }
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw createError("Email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      staffType: normalizedRole === "STAFF" ? normalizedStaffType : null,
      member:
        normalizedRole === "MEMBER"
          ? {
              create: {
                phone: phone || null,
              },
            }
          : undefined,
      staff:
        normalizedRole === "STAFF"
          ? {
              create: {
                libraryId: libraryId || null,
              },
            }
          : undefined,
    },
  });

  return sanitizeUser(user);
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw createError("Missing required fields: email, password", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });

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
