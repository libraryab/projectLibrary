const express = require("express");
const authMiddleware = require("../middleware/auth");
const { validateUUIDParam } = require("../middleware/validateParams");
const membersController = require("../controllers/membersController");

const router = express.Router();

// ===== GET /api/v1/members =====
router.get("/", membersController.getMembers);

// ===== GET /api/v1/members/:id =====
router.get("/:id", validateUUIDParam('id'), membersController.getMemberById);

// ===== POST /api/v1/members =====
router.post("/", authMiddleware, membersController.createMember);

// ===== PUT /api/v1/members/:id =====
router.put("/:id", validateUUIDParam('id'), authMiddleware, membersController.updateMember);

// ===== DELETE /api/v1/members/:id =====
router.delete("/:id", validateUUIDParam('id'), authMiddleware, authMiddleware.requireStaffType("ADMIN"), membersController.deleteMember);

module.exports = router;
