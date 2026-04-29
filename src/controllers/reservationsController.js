const reservationsService = require("../services/reservationsService");

const createReservation = async (req, res) => {
  try {
    const reservation = await reservationsService.createReservation(req.body);
    return res.status(201).json(reservation);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getReservations = async (req, res) => {
  try {
    const reservations = await reservationsService.getReservations(
      req.query.status,
    );
    return res.status(200).json(reservations);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getMemberReservations = async (req, res) => {
  try {
    const data = await reservationsService.getMemberReservations(
      req.params.memberId,
    );
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const cancelReservation = async (req, res) => {
  try {
    await reservationsService.cancelReservation(req.params.id);
    return res
      .status(200)
      .json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await reservationsService.getReservationById(
      req.params.id,
    );
    return res.status(200).json(reservation);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const updateReservation = async (req, res) => {
  try {
    const reservation = await reservationsService.updateReservation(
      req.params.id,
      req.body,
    );
    return res.status(200).json(reservation);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
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
