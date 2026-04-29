const loansService = require("../services/loansService");

const createLoan = async (req, res) => {
  try {
    const loan = await loansService.createLoan(req.body);
    return res.status(201).json(loan);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getLoans = async (req, res) => {
  try {
    const loans = await loansService.getLoans(req.query);
    return res.status(200).json(loans);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getLoanById = async (req, res) => {
  try {
    const loan = await loansService.getLoanById(req.params.id);
    return res.status(200).json(loan);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getMemberLoans = async (req, res) => {
  try {
    const data = await loansService.getMemberLoans(req.params.memberId);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const returnLoan = async (req, res) => {
  try {
    const loan = await loansService.returnLoan(req.params.id);
    return res.status(200).json(loan);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getOverdueLoans = async (req, res) => {
  try {
    const loans = await loansService.getOverdueLoans();
    return res.status(200).json(loans);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  createLoan,
  getLoans,
  getLoanById,
  getMemberLoans,
  returnLoan,
  getOverdueLoans,
};
