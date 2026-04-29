const booksService = require("../services/booksService");

const getBooks = async (req, res) => {
  try {
    const data = await booksService.getBooks(req.query);
    return res.status(200).json(data);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await booksService.getBookById(req.params.id);
    return res.status(200).json(book);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const createBook = async (req, res) => {
  try {
    const book = await booksService.createBook(req.body);
    return res.status(201).json(book);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await booksService.updateBook(req.params.id, req.body);
    return res.status(200).json(book);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    await booksService.deleteBook(req.params.id);
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
