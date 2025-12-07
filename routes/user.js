const router = require('express').Router();
const userController = require('../controller/user');
const validateUser = require('../utilities/userValidation');
const { isAuthenticated } = require('../utilities/userAuthentication');

router.get('/', userController.getAll);
router.post('/:id', validateUser, userController.createUser); // create a user
router.get('/:id', userController.getSingleUser); // getting a single user by ID

router.put('/:id', isAuthenticated, validateUser, userController.updateUser);  //update User
router.delete('/:id', isAuthenticated, userController.deleteUser);   //delete User

module.exports = router;