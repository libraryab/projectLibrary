const prisma = require("../lib/prisma");

const getBooks = async ({ search, skip = 0, take = 10 }) => {
  const parsedSkip = Number.parseInt(skip, 10) || 0;
  const parsedTake = Number.parseInt(take, 10) || 10;

  const where = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            authors: {
              some: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      }
    : undefined;

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip: parsedSkip,
      take: parsedTake,
      orderBy: { createdAt: "desc" },
      include: {
        authors: true,
        loans: {
          where: {
            returnedDate: null,
          },
          select: { id: true },
        },
      },
    }),
    prisma.book.count({ where }),
  ]);

  const booksWithAvailability = books.map((book) => ({
    ...book,
    isAvailable: book.loans.length === 0,
    activeLoanCount: book.loans.length,
  }));

  return {
    books: booksWithAvailability,
    total,
    skip: parsedSkip,
    take: parsedTake,
  };
};

const getBookById = async (id) => {
  const book = await prisma.book.findUnique({
    where: { id },
    include: { authors: true },
  });

  if (!book) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }

  return book;
};

const createBook = async ({ title, publisherId, libraryId }) => {
  if (!title || !libraryId) {
    const error = new Error("Missing required fields: title, libraryId");
    error.status = 400;
    throw error;
  }

  return prisma.book.create({
    data: {
      title,
      publisherId: publisherId || null,
      libraryId,
    },
    include: { authors: true },
  });
};

const updateBook = async (id, { title, publisherId }) => {
  const current = await prisma.book.findUnique({ where: { id } });

  if (!current) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }

  return prisma.book.update({
    where: { id },
    data: {
      title: title ?? current.title,
      publisherId: publisherId ?? current.publisherId,
    },
    include: { authors: true },
  });
};

const deleteBook = async (id) => {
  const current = await prisma.book.findUnique({ where: { id } });

  if (!current) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }

  await prisma.book.delete({ where: { id } });
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
