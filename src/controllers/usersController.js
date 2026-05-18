const usersService = require("../services/usersService");

const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getUsers(req.query.search);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Users retrieved successfully',
      data: users,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const user = await usersService.updateUserRole(
      req.params.id,
      req.body,
      req.user.id,
    );
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'User role updated successfully',
      data: user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await usersService.deleteUser(req.params.id, req.user.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'User deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  deleteUser,
};