const { body, validationResult } = require("express-validator")

const validateUser = [
    body("username")
        .notEmpty()
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),
    body("name")
        .notEmpty()
        .withMessage("Name must be listed"),
    body("email")
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage ("Email must be valid"),
    body("role")
        .notEmpty()
        .isIn(["admin", "user", "editor"])
        .withMessage("Role must be one of: admin, user, or editor"),
    /*body("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
    .withMessage("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"),
*/
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = validateUser 