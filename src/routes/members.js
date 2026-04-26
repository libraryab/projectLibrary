const express = require("express");
const membersController = require("../controllers/membersController");

const router = express.Router();

// ===== GET /api/v1/members =====
router.get("/", membersController.getMembers);

// ===== GET /api/v1/members/:id =====
router.get("/:id", membersController.getMemberById);

module.exports = router;
