const prisma = require("../lib/prisma");

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

  return prisma.loan.create({
    data: {
      bookCopyId,
      memberId,
      staffId: staffId || null,
      bookId,
      dueDate: new Date(dueDate),
    },
  });
};

const getLoans = async ({ memberId, status }) => {
  const where = {
    ...(memberId ? { memberId } : {}),
    ...(status === "active" ? { returnedDate: null } : {}),
    ...(status === "returned" ? { NOT: { returnedDate: null } } : {}),
  };

  return prisma.loan.findMany({
    where,
    orderBy: { loanDate: "desc" },
  });
};

const getMemberLoans = async (memberId) => {
  const loans = await prisma.loan.findMany({
    where: { memberId },
    orderBy: { loanDate: "desc" },
  });

  return {
    member: { id: memberId },
    loans,
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
  getMemberLoans,
  returnLoan,
  getOverdueLoans,
};
