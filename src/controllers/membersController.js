const membersService = require("../services/membersService");

const getMembers = async (req, res, next) => {
  try {
    const members = await membersService.getMembers(req.query.search);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Members retrieved successfully',
      data: members,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getMemberById = async (req, res, next) => {
  try {
    const member = await membersService.getMemberById(req.params.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Member retrieved successfully',
      data: member,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const createMember = async (req, res, next) => {
  try {
    const member = await membersService.createMember(req.body);
    return res.status(201).json({
      status: 201,
      code: 'CREATED',
      message: 'Member created successfully',
      data: member,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    const member = await membersService.updateMember(req.params.id, req.body);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Member updated successfully',
      data: member,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    await membersService.deleteMember(req.params.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Member deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
