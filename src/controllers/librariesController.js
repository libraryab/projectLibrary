const librariesService = require("../services/librariesService");

const getLibraries = async (req, res, next) => {
  try {
    const libraries = await librariesService.getLibraries(req.query.search);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Libraries retrieved successfully',
      data: libraries,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const getLibraryById = async (req, res, next) => {
  try {
    const library = await librariesService.getLibraryById(req.params.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Library retrieved successfully',
      data: library,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const createLibrary = async (req, res, next) => {
  try {
    const library = await librariesService.createLibrary(req.body);
    return res.status(201).json({
      status: 201,
      code: 'CREATED',
      message: 'Library created successfully',
      data: library,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const updateLibrary = async (req, res, next) => {
  try {
    const library = await librariesService.updateLibrary(req.params.id, req.body);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Library updated successfully',
      data: library,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

const deleteLibrary = async (req, res, next) => {
  try {
    await librariesService.deleteLibrary(req.params.id);
    return res.status(200).json({
      status: 200,
      code: 'SUCCESS',
      message: 'Library deleted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLibraries,
  getLibraryById,
  createLibrary,
  updateLibrary,
  deleteLibrary,
};
