const express = require("express");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// In-memory store
let loans = [];

// ===== POST /api/v1/loans =====
router.post("/", authMiddleware, (req, res) => {
  try {
    const { bookCopyId, memberId, staffId, dueDate, bookId } = req.body;

    if (!bookCopyId || !memberId || !dueDate || !bookId) {
      return res.status(400).json({
        error: "Missing required fields: bookCopyId, memberId, dueDate, bookId",
      });
    }

    const loan = {
      id: `loan-${Date.now()}`,
      bookCopyId,
      memberId,
      staffId,
      bookId,
      loanDate: new Date(),
      dueDate: new Date(dueDate),
      returnedDate: null,
    };

    loans.push(loan);

    res.status(201).json(loan);
  } catch (error) {
    console.error("Create loan error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== GET /api/v1/loans =====
router.get("/", (req, res) => {
  try {
    const { memberId, status } = req.query;

    let filtered = loans;
    
    if (memberId) {
      filtered = filtered.filter(l => l.memberId === memberId);
    }

    if (status === "active") {
      filtered = filtered.filter(l => l.returnedDate === null);
    } else if (status === "returned") {
      filtered = filtered.filter(l => l.returnedDate !== null);
    }

    res.status(200).json(filtered);
  } catch (error) {
    console.error("Get loans error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== GET /api/v1/members/:memberId/loans =====
router.get("/member/:memberId", (req, res) => {
  try {
    const { memberId } = req.params;

    const memberLoans = loans.filter(l => l.memberId === memberId);

    res.status(200).json({
      member: { id: memberId },
      loans: memberLoans,
    });
  } catch (error) {
    console.error("Get member loans error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== PATCH /api/v1/loans/:id/return =====
router.patch("/:id/return", authMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const loan = loans.find(l => l.id === id);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    if (loan.returnedDate) {
      return res.status(400).json({ error: "Loan already returned" });
    }

    loan.returnedDate = new Date();

    res.status(200).json(loan);
  } catch (error) {
    console.error("Return loan error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
