const usersService = require("../services/usersService");

const getUsers = async (req, res) => {
  try {
    const users = await usersService.getUsers(req.query.search);
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await usersService.updateUserRole(
      req.params.id,
      req.body,
      req.user.id,
    );
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await usersService.deleteUser(req.params.id, req.user.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
};