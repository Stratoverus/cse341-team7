const { body, validationResult } = require("express-validator")
const validate = {}

validate.destinationInformation = () => {
    return [
        // name is required and must be string
        body("name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a destination name."),

        // city is required and must be string
        body("city")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a city for the destination."),

        // country is required and must be string
        body("country")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a country for the destination."),

        // description is required and must be string
        body("description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a description for the destination."),

        // tags are not required, this checks if it's an array
        body('tags')
        .optional({ nullable: true })
        .isArray()
        .withMessage('Tags must be an array'),

        // tags are not required, this checks individual tags to make sure that it's not empty
        body('tags.*')
        .optional()
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Each tag must be a non-empty string'),
    ]
}

validate.destinationUpdateInformation = () => {
    return [
        // name is not required while updating and must be string
        body("name")
        .optional()
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a destination name."),

        // city is not required while updatin and must be string
        body("city")
        .optional()
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a city for the destination."),

        // country is not required while updatin and must be string
        body("country")
        .optional()
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a country for the destination."),

        // description is not required while updatin and must be string
        body("description")
        .optional()
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a description for the destination."),

        // tags are not required, this checks if it's an array
        body('tags')
        .optional({ nullable: true })
        .isArray()
        .withMessage('Tags must be an array'),

        // tags are not required, this checks individual tags to make sure that it's not empty
        body('tags.*')
        .optional()
        .isString()
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Each tag must be a non-empty string'),
    ]
}

// middleware to check validation results
validate.destinationResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

module.exports = validate