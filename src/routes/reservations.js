const express = require("express");
const authMiddleware = require("../middleware/auth");
const reservationsController = require("../controllers/reservationsController");

const router = express.Router();

// ===== POST /api/v1/reservations =====
router.post(
  "/",
  authMiddleware,
  authMiddleware.requireRole("MEMBER"),
  reservationsController.createReservation,
);

// ===== GET /api/v1/reservations =====
router.get("/", reservationsController.getReservations);

// ===== GET /api/v1/reservations/:id =====
router.get("/:id", reservationsController.getReservationById);

// ===== GET /api/v1/members/:memberId/reservations =====
router.get("/member/:memberId", reservationsController.getMemberReservations);

// ===== PUT /api/v1/reservations/:id =====
router.put(
  "/:id",
  authMiddleware,
  authMiddleware.requireRole("MEMBER"),
  reservationsController.updateReservation,
);

// ===== DELETE /api/v1/reservations/:id =====
router.delete(
  "/:id",
  authMiddleware,
  authMiddleware.requireRole("MEMBER"),
  reservationsController.cancelReservation,
);

module.exports = router;
