const prisma = require("../lib/prisma");

const getLibraries = async (search) => {
  const where = search
    ? {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }
    : undefined;

  return prisma.library.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
};

const getLibraryById = async (id) => {
  const library = await prisma.library.findUnique({ where: { id } });
  if (!library) {
    const error = new Error("Library not found");
    error.status = 404;
    throw error;
  }

  return library;
};

const createLibrary = async ({ name, location }) => {
  if (!name || !location) {
    const error = new Error("Missing required fields: name, location");
    error.status = 400;
    throw error;
  }

  return prisma.library.create({
    data: {
      name,
      location,
    },
  });
};

module.exports = {
  getLibraries,
  getLibraryById,
  createLibrary,
};
