const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
