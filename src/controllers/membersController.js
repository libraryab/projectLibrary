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

module.exports = {
  getMembers,
  getMemberById,
};
