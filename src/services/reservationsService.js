const prisma = require("../lib/prisma");

const createReservation = async ({ bookId, memberId, bookCopyId }) => {
  if (!bookId || !memberId) {
    const error = new Error("Missing required fields: bookId, memberId");
    error.status = 400;
    throw error;
  }

  const existing = await prisma.reservation.findFirst({
    where: {
      bookId,
      memberId,
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
      memberId,
      bookCopyId: bookCopyId || null,
      status: "ACTIVE",
    },
  });
};

const getReservations = async (status) => {
  return prisma.reservation.findMany({
    where: status ? { status: status.toUpperCase() } : undefined,
    orderBy: { reservationDate: "desc" },
  });
};

const getMemberReservations = async (memberId) => {
  const reservations = await prisma.reservation.findMany({
    where: { memberId },
    orderBy: { reservationDate: "desc" },
  });

  return {
    member: { id: memberId },
    reservations,
  };
};

const getReservationById = async (id) => {
  const reservation = await prisma.reservation.findUnique({ where: { id } });
  if (!reservation) {
    const error = new Error("Reservation not found");
    error.status = 404;
    throw error;
  }
  return reservation;
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
