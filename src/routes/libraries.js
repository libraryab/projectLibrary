const express = require("express");

const router = express.Router();

// In-memory store
let libraries = [];

// ===== GET /api/v1/libraries =====
router.get("/", (req, res) => {
  try {
    const { search } = req.query;

    let filtered = libraries;
    if (search) {
      filtered = libraries.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
    }

    res.status(200).json(filtered);
  } catch (error) {
    console.error("Get libraries error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== GET /api/v1/libraries/:id =====
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const library = libraries.find(l => l.id === id);

    if (!library) {
      return res.status(404).json({ error: "Library not found" });
    }

    res.status(200).json(library);
  } catch (error) {
    console.error("Get library error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
