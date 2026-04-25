const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// In-memory store
let reservations = [];

// ===== POST /api/v1/reservations =====
router.post("/", authMiddleware, (req, res) => {
  try {
    const { bookId, memberId } = req.body;

    if (!bookId || !memberId) {
      return res.status(400).json({
        error: "Missing required fields: bookId, memberId",
      });
    }

    // Check if member already has active reservation for this book
    if (reservations.find(r => r.bookId === bookId && r.memberId === memberId && r.status === "ACTIVE")) {
      return res.status(400).json({
        error: "Book already reserved by this member",
      });
    }

    const reservation = {
      id: `res-${Date.now()}`,
      bookId,
      memberId,
      reservationDate: new Date(),
      status: "ACTIVE",
    };

    reservations.push(reservation);

    res.status(201).json(reservation);
  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== GET /api/v1/reservations =====
router.get("/", (req, res) => {
  try {
    const { status } = req.query;

    let filtered = reservations;
    if (status) {
      filtered = reservations.filter(r => r.status === status.toUpperCase());
    }

    res.status(200).json(filtered);
  } catch (error) {
    console.error("Get reservations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== GET /api/v1/members/:memberId/reservations =====
router.get("/member/:memberId", (req, res) => {
  try {
    const { memberId } = req.params;

    const memberReservations = reservations.filter(r => r.memberId === memberId);

    res.status(200).json({
      member: { id: memberId },
      reservations: memberReservations,
    });
  } catch (error) {
    console.error("Get member reservations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== DELETE /api/v1/reservations/:id =====
router.delete("/:id", authMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    reservations.splice(index, 1);

    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Cancel reservation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
