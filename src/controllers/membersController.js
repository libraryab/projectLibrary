const membersService = require("../services/membersService");

const getMembers = async (req, res) => {
  try {
    const members = await membersService.getMembers(req.query.search);
    return res.status(200).json(members);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getMemberById = async (req, res) => {
  try {
    const member = await membersService.getMemberById(req.params.id);
    return res.status(200).json(member);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const createMember = async (req, res) => {
  try {
    const member = await membersService.createMember(req.body);
    return res.status(201).json(member);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const updateMember = async (req, res) => {
  try {
    const member = await membersService.updateMember(req.params.id, req.body);
    return res.status(200).json(member);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const deleteMember = async (req, res) => {
  try {
    await membersService.deleteMember(req.params.id);
    return res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
