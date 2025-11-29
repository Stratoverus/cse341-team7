const { body, validationResult } = require("express-validator");

const validate = {};

validate.itineraryRules = () => {
    return [
        body("userId")
            .trim()
            .notEmpty()
            .withMessage("userId is required."),

        body("title")
            .trim()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters."),

        body("description")
            .optional()
            .trim(),

        body("startDate")
            .notEmpty()
            .isISO8601()
            .withMessage("Valid startDate (YYYY-MM-DD) is required."),

        body("endDate")
            .notEmpty()
            .isISO8601()
            .withMessage("Valid endDate (YYYY-MM-DD) is required."),

        body("destinations")
            .optional()
            .isArray()
            .withMessage("Destinations must be an array of destination IDs"),

        body("isPublic")
            .optional()
            .isBoolean()
            .withMessage("isPublic must be true or false")
    ];
};

validate.updateItineraryRules = () => {
    return [
        body("title")
            .optional()
            .trim()
            .isLength({ min: 3 }),

        body("description")
            .optional(),

        body("startDate")
            .optional()
            .isISO8601(),

        body("endDate")
            .optional()
            .isISO8601(),

        body("destinations")
            .optional()
            .isArray(),

        body("isPublic")
            .optional()
            .isBoolean()
    ];
};

validate.checkData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validate;