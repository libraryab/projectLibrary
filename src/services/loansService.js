const prisma = require("../lib/prisma");

const mapLoan = (loan) => {
  const now = new Date();
  const computedStatus = loan.returnedDate
    ? "RETURNED"
    : loan.dueDate < now
      ? "OVERDUE"
      : "ACTIVE";

  return {
    ...loan,
    memberName: loan.member?.user?.name || null,
    bookTitle: loan.book?.title || null,
    status: computedStatus,
  };
};

const createLoan = async ({
  bookCopyId,
  memberId,
  staffId,
  dueDate,
  bookId,
}) => {
  if (!bookCopyId || !memberId || !dueDate || !bookId) {
    const error = new Error(
      "Missing required fields: bookCopyId, memberId, dueDate, bookId",
    );
    error.status = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const member = await tx.member.findUnique({
      where: { id: memberId },
      include: {
        user: {
          select: { role: true },
        },
      },
    });

    if (!member) {
      const error = new Error("Member not found");
      error.status = 404;
      throw error;
    }

    if (member.user?.role !== "MEMBER") {
      const error = new Error("Loans can only be created for library members");
      error.status = 400;
      throw error;
    }

    // If this member already has an active reservation for the same book,
    // remove it when the loan is created so the reservation queue stays clean.
    await tx.reservation.deleteMany({
      where: {
        bookId,
        memberId,
        status: "ACTIVE",
      },
    });

    return tx.loan.create({
      data: {
        bookCopyId,
        memberId,
        staffId: staffId || null,
        bookId,
        dueDate: new Date(dueDate),
      },
    });
  });
};

const getLoans = async ({ memberId, status }) => {
  const where = {
    ...(memberId ? { memberId } : {}),
    ...(status === "active" ? { returnedDate: null } : {}),
    ...(status === "returned" ? { NOT: { returnedDate: null } } : {}),
  };

  const loans = await prisma.loan.findMany({
    where,
    orderBy: { loanDate: "desc" },
    include: {
      member: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
      book: {
        select: { title: true },
      },
    },
  });

  return loans.map(mapLoan);
};

const getLoanById = async (id) => {
  const loan = await prisma.loan.findUnique({
    where: { id },
    include: {
      member: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
      book: {
        select: { title: true },
      },
    },
  });
  if (!loan) {
    const error = new Error("Loan not found");
    error.status = 404;
    throw error;
  }
  return mapLoan(loan);
};

const getMemberLoans = async (memberId) => {
  const loans = await prisma.loan.findMany({
    where: { memberId },
    orderBy: { loanDate: "desc" },
    include: {
      member: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
      book: {
        select: { title: true },
      },
    },
  });

  return {
    member: { id: memberId },
    loans: loans.map(mapLoan),
  };
};

const returnLoan = async (id) => {
  const loan = await prisma.loan.findUnique({ where: { id } });

  if (!loan) {
    const error = new Error("Loan not found");
    error.status = 404;
    throw error;
  }

  if (loan.returnedDate) {
    const error = new Error("Loan already returned");
    error.status = 400;
    throw error;
  }

  return prisma.loan.update({
    where: { id },
    data: {
      returnedDate: new Date(),
    },
  });
};

const getOverdueLoans = async () => {
  const now = new Date();

  return prisma.loan.findMany({
    where: {
      dueDate: {
        lt: now,
      },
      returnedDate: null,
    },
    orderBy: { dueDate: "asc" },
  });
};

module.exports = {
  createLoan,
  getLoans,
  getLoanById,
  getMemberLoans,
  returnLoan,
  getOverdueLoans,
};
