const express = require("express");

const router = express.Router();

// In-memory store
let members = [];

// ===== GET /api/v1/members =====
router.get("/", (req, res) => {
  try {
    const { search } = req.query;

    let filtered = members;
    if (search) {
      filtered = members.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase()) || 
        m.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.status(200).json(filtered);
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== GET /api/v1/members/:id =====
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const member = members.find(m => m.id === id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    console.error("Get member error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
