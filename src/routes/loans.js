const express = require("express");
const authMiddleware = require("../middleware/auth");
const { validateUUIDParam } = require("../middleware/validateParams");
const loansController = require("../controllers/loansController");

const router = express.Router();

// ===== POST /api/v1/loans =====
router.post(
  "/",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN", "LIBRARIAN"),
  loansController.createLoan,
);

// ===== GET /api/v1/loans =====
router.get("/", loansController.getLoans);

// ===== GET /api/v1/loans/:id =====
router.get("/:id", validateUUIDParam('id'), loansController.getLoanById);

// ===== GET /api/v1/loans/overdue =====
router.get(
  "/overdue",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN", "LIBRARIAN"),
  loansController.getOverdueLoans,
);

// ===== GET /api/v1/members/:memberId/loans =====
router.get("/member/:memberId", validateUUIDParam('memberId'), loansController.getMemberLoans);

// ===== PATCH /api/v1/loans/:id/return =====
router.patch(
  "/:id/return",
  validateUUIDParam('id'),
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN", "LIBRARIAN"),
  loansController.returnLoan,
);

module.exports = router;
