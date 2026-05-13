const prisma = require("../lib/prisma");

const createError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const mapUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  staffType: user.staffType,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const getUsers = async (search) => {
  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : undefined;

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return users.map(mapUser);
};

const updateUserRole = async (targetUserId, { role, staffType }, actorUserId) => {
  if (targetUserId === actorUserId) {
    throw createError("You cannot change your own role", 400);
  }

  const normalizedRole = typeof role === "string" ? role.toUpperCase() : role;
  const normalizedStaffType =
    typeof staffType === "string" ? staffType.toUpperCase() : staffType;

  if (!["MEMBER", "STAFF"].includes(normalizedRole)) {
    throw createError("Role must be MEMBER or STAFF", 400);
  }

  if (normalizedRole === "STAFF" && !["ADMIN", "LIBRARIAN"].includes(normalizedStaffType || "")) {
    throw createError("Staff type must be ADMIN or LIBRARIAN", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { member: true, staff: true },
  });

  if (!user) {
    throw createError("User not found", 404);
  }

  const updateData = {
    role: normalizedRole,
    staffType: normalizedRole === "STAFF" ? normalizedStaffType : null,
  };

  if (normalizedRole === "MEMBER") {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: targetUserId },
        data: updateData,
      });

      if (!user.member) {
        await tx.member.create({
          data: {
            userId: targetUserId,
          },
        });
      }
    });
  } else {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: targetUserId },
        data: updateData,
      });

      if (!user.staff) {
        await tx.staff.create({
          data: {
            userId: targetUserId,
            libraryId: null,
          },
        });
      }
    });
  }

  const updatedUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  return mapUser(updatedUser);
};

const deleteUser = async (targetUserId, actorUserId) => {
  if (targetUserId === actorUserId) {
    throw createError("You cannot delete your own account", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { member: true, staff: true },
  });

  if (!user) {
    throw createError("User not found", 404);
  }

  if (user.role !== "MEMBER") {
    throw createError("Only library members can be deleted", 400);
  }

  await prisma.$transaction(async (tx) => {
    if (user.member) {
      await tx.notification.deleteMany({ where: { memberId: user.member.id } });
      await tx.review.deleteMany({ where: { memberId: user.member.id } });
      await tx.reservation.deleteMany({ where: { memberId: user.member.id } });
      await tx.loan.deleteMany({ where: { memberId: user.member.id } });
    }

    await tx.user.delete({ where: { id: targetUserId } });
  });
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
};