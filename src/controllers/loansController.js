const loansService = require("../services/loansService");

const createLoan = async (req, res, next) => {
  try {
    const loan = await loansService.createLoan(req.body);
    return res.status(201).json({
      status: 201,
      code: 'CREATED',
      message: 'Loan created successfully',
      data: loan,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getLoans = async (req, res, next) => {
  try {
    const loans = await loansService.getLoans(req.query);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Loans retrieved successfully',
      data: loans,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getLoanById = async (req, res, next) => {
  try {
    const loan = await loansService.getLoanById(req.params.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Loan retrieved successfully',
      data: loan,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getMemberLoans = async (req, res, next) => {
  try {
    const data = await loansService.getMemberLoans(req.params.memberId);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Member loans retrieved successfully',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const returnLoan = async (req, res, next) => {
  try {
    const loan = await loansService.returnLoan(req.params.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Loan returned successfully',
      data: loan,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getOverdueLoans = async (req, res, next) => {
  try {
    const loans = await loansService.getOverdueLoans();
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Overdue loans retrieved successfully',
      data: loans,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
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
