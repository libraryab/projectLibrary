const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// In-memory store
let books = [];

// ===== GET /api/v1/books =====
router.get("/", (req, res) => {
  try {
    const { search, skip = 0, take = 10 } = req.query;

    let filtered = books;
    if (search) {
      filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));
    }

    const paginated = filtered.slice(parseInt(skip), parseInt(skip) + parseInt(take));

    res.status(200).json({
      books: paginated,
      total: filtered.length,
      skip: parseInt(skip),
      take: parseInt(take),
    });
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== GET /api/v1/books/:id =====
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const book = books.find(b => b.id === id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Get book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== POST /api/v1/books =====
router.post("/", authMiddleware, (req, res) => {
  try {
    const { title, publisherId, libraryId } = req.body;

    if (!title || !publisherId || !libraryId) {
      return res.status(400).json({
        error: "Missing required fields: title, publisherId, libraryId",
      });
    }

    const book = {
      id: `book-${Date.now()}`,
      title,
      publisherId,
      libraryId,
      authors: [],
      createdAt: new Date(),
    };

    books.push(book);

    res.status(201).json(book);
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== PUT /api/v1/books/:id =====
router.put("/:id", authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { title, publisherId } = req.body;

    const book = books.find(b => b.id === id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (title) book.title = title;
    if (publisherId) book.publisherId = publisherId;
    book.updatedAt = new Date();

    res.status(200).json(book);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== DELETE /api/v1/books/:id =====
router.delete("/:id", authMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const index = books.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Book not found" });
    }

    books.splice(index, 1);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
