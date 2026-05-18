const booksService = require("../services/booksService");

const getBooks = async (req, res, next) => {
  try {
    const data = await booksService.getBooks(req.query);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Books retrieved successfully',
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await booksService.getBookById(req.params.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Book retrieved successfully',
      data: book,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const book = await booksService.createBook(req.body);
    return res.status(201).json({
      status: 201,
      code: 'CREATED',
      message: 'Book created successfully',
      data: book,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await booksService.updateBook(req.params.id, req.body);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Book updated successfully',
      data: book,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    await booksService.deleteBook(req.params.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Book deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
