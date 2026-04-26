const authorsService = require("../services/authorsService");

const getAuthorsByBook = async (req, res) => {
  try {
    const authors = await authorsService.getAuthorsByBook(req.params.bookId);
    return res.status(200).json({ authors });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const createAuthor = async (req, res) => {
  try {
    const author = await authorsService.createAuthor(
      req.params.bookId,
      req.body,
    );
    return res.status(201).json(author);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  getAuthorsByBook,
  createAuthor,
};
