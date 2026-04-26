const express = require("express");
const authMiddleware = require("../middleware/auth");
const booksController = require("../controllers/booksController");

const router = express.Router();

// ===== GET /api/v1/books =====
router.get("/", booksController.getBooks);

// ===== GET /api/v1/books/:id =====
router.get("/:id", booksController.getBookById);

// ===== POST /api/v1/books =====
router.post(
  "/",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN", "LIBRARIAN"),
  booksController.createBook,
);

// ===== PUT /api/v1/books/:id =====
router.put(
  "/:id",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN", "LIBRARIAN"),
  booksController.updateBook,
);

// ===== DELETE /api/v1/books/:id =====
router.delete(
  "/:id",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN", "LIBRARIAN"),
  booksController.deleteBook,
);

module.exports = router;
