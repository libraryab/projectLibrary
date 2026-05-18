const prisma = require("../lib/prisma");
const { validateDescription } = require("../utils/validators");

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
        reservations: {
          where: {
            status: "ACTIVE",
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
    activeReservationCount: book.reservations.length,
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
    include: {
      authors: true,
      loans: {
        where: {
          returnedDate: null,
        },
        select: { id: true },
      },
      reservations: {
        where: {
          status: "ACTIVE",
        },
        select: { id: true },
      },
    },
  });

  if (!book) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }

  return {
    ...book,
    isAvailable: book.loans.length === 0,
    activeLoanCount: book.loans.length,
    activeReservationCount: book.reservations.length,
  };
};

const createBook = async ({ title, publisherId, libraryId, isbn, year, description, authors }) => {
  if (!title || !libraryId) {
    const error = new Error("Missing required fields: title, libraryId");
    error.status = 400;
    throw error;
  }

  // Validate description if provided
  let validatedDescription = null;
  if (description && description.trim()) {
    const descValidation = validateDescription(description);
    if (!descValidation.valid) {
      const error = new Error(descValidation.error);
      error.status = 400;
      throw error;
    }
    validatedDescription = descValidation.value;
  }

  const data = {
    title,
    publisherId: publisherId || null,
    libraryId,
    isbn: isbn || null,
    year: year !== undefined && year !== null ? Number(year) : null,
    description: validatedDescription,
    authors: authors && Array.isArray(authors) ? {
      create: authors.map(name => ({ name }))
    } : undefined,
  }

  return prisma.book.create({
    data,
    include: { authors: true },
  });
};

const updateBook = async (id, { title, publisherId, isbn, year, description, authors }) => {
  const current = await prisma.book.findUnique({ where: { id }, include: { authors: true } });

  if (!current) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }

  // Validate description if provided
  let validatedDescription = current.description;
  if (description !== undefined) {
    if (description && description.trim()) {
      const descValidation = validateDescription(description);
      if (!descValidation.valid) {
        const error = new Error(descValidation.error);
        error.status = 400;
        throw error;
      }
      validatedDescription = descValidation.value;
    } else {
      validatedDescription = null;
    }
  }

  const updateData = {
    title: title ?? current.title,
    publisherId: publisherId ?? current.publisherId,
    isbn: isbn !== undefined ? (isbn || null) : current.isbn,
    year: year !== undefined && year !== null ? Number(year) : current.year,
    description: validatedDescription,
  }

  // If authors provided, remove existing and recreate
  if (authors && Array.isArray(authors)) {
    // Delete existing authors
    await prisma.author.deleteMany({ where: { bookId: id } })
    updateData.authors = { create: authors.map(name => ({ name })) }
  }

  return prisma.book.update({
    where: { id },
    data: updateData,
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

  // Delete related records that would block deletion due to foreign keys.
  // We delete reservations, loans, reviews and authors related to the book,
  // then delete the book itself in a single transaction to keep DB consistent.
  await prisma.$transaction(async (tx) => {
    await tx.reservation.deleteMany({ where: { bookId: id } })
    await tx.loan.deleteMany({ where: { bookId: id } })
    await tx.review.deleteMany({ where: { bookId: id } })
    await tx.author.deleteMany({ where: { bookId: id } })
    await tx.book.delete({ where: { id } })
  })
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
