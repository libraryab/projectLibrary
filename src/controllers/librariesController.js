const librariesService = require("../services/librariesService");

const getLibraries = async (req, res) => {
  try {
    const libraries = await librariesService.getLibraries(req.query.search);
    return res.status(200).json(libraries);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const getLibraryById = async (req, res) => {
  try {
    const library = await librariesService.getLibraryById(req.params.id);
    return res.status(200).json(library);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const createLibrary = async (req, res) => {
  try {
    const library = await librariesService.createLibrary(req.body);
    return res.status(201).json(library);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const updateLibrary = async (req, res) => {
  try {
    const library = await librariesService.updateLibrary(req.params.id, req.body);
    return res.status(200).json(library);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

const deleteLibrary = async (req, res) => {
  try {
    await librariesService.deleteLibrary(req.params.id);
    return res.status(200).json({ message: "Library deleted successfully" });
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
  }
};

module.exports = {
  getLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  deleteLibrary,
};
