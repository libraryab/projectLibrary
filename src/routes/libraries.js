const express = require("express");
const authMiddleware = require("../middleware/auth");
const librariesController = require("../controllers/librariesController");

const router = express.Router();

// ===== GET /api/v1/libraries =====
router.get("/", librariesController.getLibraries);

// ===== GET /api/v1/libraries/:id =====
router.get("/:id", librariesController.getLibraryById);

// ===== POST /api/v1/libraries =====
router.post(
  "/",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN"),
  librariesController.createLibrary,
);

module.exports = router;
