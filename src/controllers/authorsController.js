const authorsService = require("../services/authorsService");

const getAuthorsByBook = async (req, res, next) => {
  try {
    const authors = await authorsService.getAuthorsByBook(req.params.bookId);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Authors retrieved successfully',
      data: authors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const createAuthor = async (req, res, next) => {
  try {
    const author = await authorsService.createAuthor(
      req.params.bookId,
      req.body,
    );
    return res.status(201).json({
      status: 201,
      code: 'CREATED',
      message: 'Author created successfully',
      data: author,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuthorsByBook,
  createAuthor,
};
