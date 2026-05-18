const { validateUUID } = require("../utils/validators");

/**
 * Middleware to validate UUID route parameters
 * Usage: router.get('/:id', validateUUIDParam('id'), controller);
 */
const validateUUIDParam = (paramName = 'id') => {
  return (req, res, next) => {
    const paramValue = req.params[paramName];

    if (!paramValue) {
      return res.status(400).json({
        error: `Missing ${paramName} parameter`,
      });
    }

    const validation = validateUUID(paramValue);
    if (!validation.valid) {
      return res.status(400).json({
        error: `Invalid ${paramName} format: ${validation.error}`,
      });
    }

    // Continue to next middleware/handler
    next();
  };
};

module.exports = {
  validateUUIDParam,
};
