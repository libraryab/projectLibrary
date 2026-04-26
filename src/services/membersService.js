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
    where,
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

module.exports = {
  getMembers,
  getMemberById,
};
