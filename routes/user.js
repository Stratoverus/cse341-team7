const router = require('express').Router();
const passport = require('passport');

const userController = require('../controller/user');
const validateUser = require('../utilities/userValidation');
const { isAuthenticated } = require('../utilities/userAuthentication');

router.get('/', isAuthenticated, userController.getAll);

router.get('/:id', isAuthenticated, userController.getSingleUser); // getting a single user by ID
router.put('/:id', isAuthenticated, validateUser, userController.updateUser);  //update User
router.delete('/:id', isAuthenticated, userController.deleteUser);   //delete User

module.exports = router;