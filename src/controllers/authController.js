const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({
      status: 201,
      code: 'CREATED',
      message: 'User registered successfully',
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Login successful',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'User data retrieved successfully',
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
