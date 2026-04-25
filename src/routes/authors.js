const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

// In-memory store
let authors = [];

// ===== GET /api/v1/books/:bookId/authors =====
router.get("/", (req, res) => {
  try {
    const { bookId } = req.params;
    const bookAuthors = authors.filter(a => a.bookId === bookId);

    res.status(200).json({ authors: bookAuthors });
  } catch (error) {
    console.error("Get authors error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== POST /api/v1/books/:bookId/authors =====
router.post("/", authMiddleware, (req, res) => {
  try {
    const { bookId } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Missing required field: name" });
    }

    const author = {
      id: `author-${Date.now()}`,
      bookId,
      name,
      createdAt: new Date(),
    };

    authors.push(author);

    res.status(201).json(author);
  } catch (error) {
    console.error("Create author error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
