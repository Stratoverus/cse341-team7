const { body, validationResult } = require("express-validator")

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const reviewRules = [
    body('userId')
        .trim()
        .notEmpty().withMessage('User ID is required')
        .isLength({ min: 24, max: 24 }).withMessage('User ID require 24 chars')
        .isAlphanumeric(),
    body('destnationId')
        .trim()
        .notEmpty().withMessage('Destination Id is required')
        .isLength({ min: 24, max: 24 }).withMessage('Destination Id require 24 chars')
        .isAlphanumeric(),
    body('rating')
        .notEmpty().withMessage('Rating is important')
        .isInt({ min: 1, max: 5 }).withMessage('Rating between 1 to 5'),
    body('reviewText')
        .trim()
        .notEmpty().withMessage('The review most important field will be used')
        .isString().withMessage('The review text must be a string.')
        .isLength({ min: 10 }).withMessage('Opinion require 10 or more chars'),
    body('visitDate')
        .notEmpty().withMessage('The trip date is required')
        .isISO8601().withMessage('Trip Date will be format valid (YYYY-MM-DD)'),
    body('reviewDate')
        .notEmpty().withMessage('Review creation Date is required')
        .isISO8601().withMessage('Format valid Date will be (YYYY-MM-DD)'),

    validate
]

module.exports = { reviewRules, validate };