const prisma = require("../lib/prisma");

const mapMember = (member) => ({
  id: member.id,
  name: member.user.name,
  email: member.user.email,
  phone: member.phone,
  createdAt: member.createdAt,
});

const getMembers = async (search) => {
  const where = search
    ? {
        OR: [
          {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }
    : undefined;

  const members = await prisma.member.findMany({
    where: {
      ...(where || {}),
      user: {
        ...(where?.user || {}),
        role: "MEMBER",
      },
    },
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return members.map(mapMember);
};

const getMemberById = async (id) => {
  const member = await prisma.member.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!member) {
    const error = new Error("Member not found");
    error.status = 404;
    throw error;
  }

  return mapMember(member);
};

const createMember = async ({ name, email, password, phone }) => {
  if (!name || !email || !password) {
    const error = new Error(
      "Missing required fields: name, email, password",
    );
    error.status = 400;
    throw error;
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.status = 409;
    throw error;
  }

  // Hash password
  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user and member in transaction
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "MEMBER",
      member: {
        create: {
          phone: phone || null,
        },
      },
    },
    include: { member: true },
  });

  return mapMember(user.member);
};

const updateMember = async (id, { name, phone }) => {
  const member = await prisma.member.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!member) {
    const error = new Error("Member not found");
    error.status = 404;
    throw error;
  }

  // Update user name if provided, and member phone
  const updatedUser = await prisma.user.update({
    where: { id: member.userId },
    data: {
      name: name !== undefined ? name : member.user.name,
    },
  });

  const updatedMember = await prisma.member.update({
    where: { id },
    data: {
      phone: phone !== undefined ? phone : member.phone,
    },
    include: { user: true },
  });

  return mapMember(updatedMember);
};

const deleteMember = async (id) => {
  const member = await prisma.member.findUnique({
    where: { id },
  });

  if (!member) {
    const error = new Error("Member not found");
    error.status = 404;
    throw error;
  }

  // Delete user (cascades to member via onDelete: Cascade)
  await prisma.user.delete({
    where: { id: member.userId },
  });
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
