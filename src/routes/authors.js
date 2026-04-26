const express = require("express");
const authMiddleware = require("../middleware/auth");
const authorsController = require("../controllers/authorsController");

const router = express.Router({ mergeParams: true });

// ===== GET /api/v1/books/:bookId/authors =====
router.get("/", authorsController.getAuthorsByBook);

// ===== POST /api/v1/books/:bookId/authors =====
router.post(
  "/",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN", "LIBRARIAN"),
  authorsController.createAuthor,
);

module.exports = router;
