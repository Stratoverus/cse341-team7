const router = require('express').Router();

const userController = require('../controller/user');
const validateUser = require('../utilities/userValidation');

router.get("/", userController.getAll);
router.get("/:id", userController.getSingleUser); // getting a single user by ID

router.post("/", validateUser, userController.createUser);  //create User
router.put("/:id", validateUser, userController.updateUser);  //update User
router.delete("/:id", userController.deleteUser);   //delete User

module.exports = router;