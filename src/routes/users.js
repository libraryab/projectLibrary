const express = require("express");
const authMiddleware = require("../middleware/auth");
const usersController = require("../controllers/usersController");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN"),
  usersController.getUsers,
);

router.patch(
  "/:id/role",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN"),
  usersController.updateUserRole,
);

router.delete(
  "/:id",
  authMiddleware,
  authMiddleware.requireStaffType("ADMIN"),
  usersController.deleteUser,
);

module.exports = router;