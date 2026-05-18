const reservationsService = require("../services/reservationsService");

const createReservation = async (req, res, next) => {
  try {
    const reservation = await reservationsService.createReservation({
      ...req.body,
      userId: req.user?.id,
    });
    return res.status(201).json({
      status: 201,
      code: 'CREATED',
      message: 'Reservation created successfully',
      data: reservation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getReservations = async (req, res, next) => {
  try {
    const reservations = await reservationsService.getReservations(
      req.query.status,
    );
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Reservations retrieved successfully',
      data: reservations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getMemberReservations = async (req, res, next) => {
  try {
    const data = await reservationsService.getMemberReservations(
      req.params.memberId,
    );
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Member reservations retrieved successfully',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    await reservationsService.cancelReservation(req.params.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Reservation cancelled successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getReservationById = async (req, res, next) => {
  try {
    const reservation = await reservationsService.getReservationById(
      req.params.id,
    );
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Reservation retrieved successfully',
      data: reservation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const updateReservation = async (req, res, next) => {
  try {
    const reservation = await reservationsService.updateReservation(
      req.params.id,
      req.body,
    );
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Reservation updated successfully',
      data: reservation,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getReservations,
  getMemberReservations,
  cancelReservation,
  getReservationById,
  updateReservation,
};
