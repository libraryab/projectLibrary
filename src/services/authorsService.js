const prisma = require("../lib/prisma");

const getAuthorsByBook = async (bookId) => {
  return prisma.author.findMany({
    where: { bookId },
    orderBy: { createdAt: "desc" },
  });
};

const createAuthor = async (bookId, { name }) => {
  if (!name) {
    const error = new Error("Missing required field: name");
    error.status = 400;
    throw error;
  }

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }

  return prisma.author.create({
    data: {
      name,
      bookId,
    },
  });
};

module.exports = {
  getAuthorsByBook,
  createAuthor,
};
