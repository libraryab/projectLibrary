const prisma = require("../lib/prisma");

const mapReservation = (reservation) => ({
  ...reservation,
  memberName: reservation.member?.user?.name || null,
  bookTitle: reservation.book?.title || null,
});

const resolveMemberId = async ({ memberId, userId }) => {
  if (memberId) {
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) {
      const error = new Error("Member not found");
      error.status = 404;
      throw error;
    }
    return member.id;
  }

  if (userId) {
    const member = await prisma.member.findUnique({ where: { userId } });
    if (!member) {
      const error = new Error("Member profile not found for this user");
      error.status = 404;
      throw error;
    }
    return member.id;
  }

  const error = new Error("Missing member reference (memberId or userId)");
  error.status = 400;
  throw error;
};

const createReservation = async ({ bookId, memberId, userId, bookCopyId }) => {
  if (!bookId) {
    const error = new Error("Missing required field: bookId");
    error.status = 400;
    throw error;
  }

  const resolvedMemberId = await resolveMemberId({ memberId, userId });

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book) {
    const error = new Error("Book not found");
    error.status = 404;
    throw error;
  }

  const existing = await prisma.reservation.findFirst({
    where: {
      bookId,
      memberId: resolvedMemberId,
      status: "ACTIVE",
    },
  });

  if (existing) {
    const error = new Error("Book already reserved by this member");
    error.status = 409;
    throw error;
  }

  const activeLoan = await prisma.loan.findFirst({
    where: {
      bookId,
      returnedDate: null,
    },
  });

  if (activeLoan) {
    const error = new Error("Book is currently on loan");
    error.status = 409;
    throw error;
  }

  return prisma.reservation.create({
    data: {
      bookId,
      memberId: resolvedMemberId,
      bookCopyId: bookCopyId || null,
      status: "ACTIVE",
    },
  });
};

const getReservations = async (status) => {
  const reservations = await prisma.reservation.findMany({
    where: status ? { status: status.toUpperCase() } : undefined,
    orderBy: { reservationDate: "desc" },
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

  return reservations.map(mapReservation);
};

const getMemberReservations = async (memberIdOrUserId) => {
  const resolvedMemberId = await resolveMemberId({
    memberId: memberIdOrUserId,
  }).catch(async () => resolveMemberId({ userId: memberIdOrUserId }));

  const reservations = await prisma.reservation.findMany({
    where: { memberId: resolvedMemberId },
    orderBy: { reservationDate: "desc" },
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
    member: { id: resolvedMemberId },
    reservations: reservations.map(mapReservation),
  };
};

const getReservationById = async (id) => {
  const reservation = await prisma.reservation.findUnique({
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
  if (!reservation) {
    const error = new Error("Reservation not found");
    error.status = 404;
    throw error;
  }
  return mapReservation(reservation);
};

const updateReservation = async (id, { status, bookCopyId }) => {
  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation) {
    const error = new Error("Reservation not found");
    error.status = 404;
    throw error;
  }

  if (status && !["ACTIVE", "CANCELLED", "COMPLETED"].includes(status)) {
    const error = new Error(
      "Invalid status. Must be ACTIVE, CANCELLED, or COMPLETED",
    );
    error.status = 400;
    throw error;
  }

  return prisma.reservation.update({
    where: { id },
    data: {
      status: status || reservation.status,
      bookCopyId: bookCopyId !== undefined ? bookCopyId : reservation.bookCopyId,
    },
  });
};

const cancelReservation = async (id) => {
  const reservation = await prisma.reservation.findUnique({ where: { id } });

  if (!reservation) {
    const error = new Error("Reservation not found");
    error.status = 404;
    throw error;
  }

  await prisma.reservation.delete({ where: { id } });
};

module.exports = {
  createReservation,
  getReservations,
  getMemberReservations,
  getReservationById,
  updateReservation,
  cancelReservation,
};
