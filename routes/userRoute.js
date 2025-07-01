const express = require('express');
const router = express.Router();
const {createUser, getUsers, getUser, updateUser, deleteUser, changeUserPassword, uploadUserImage, resizeImage, getLoggedUserData, changeLoggedUserPassword, updateLoggedUserData, deleteLoggedUser} = require('../services/userService');
const {createUserValidator, getUserValidator, updateUserValidator, changeUserPasswordValidator, deleteUserValidator, updateLoggedUserDataValidator, deleteLoggedUserValidator} = require('../utils/validators/userValidator');
const authService = require('../services/authService');

router.use(authService.protect);

router.route('/getMe')
    .get(getLoggedUserData, getUser); // Get logged-in user's data

router.route('/change-my-password')
    .put(changeUserPasswordValidator, changeLoggedUserPassword);

router.route('/updateMe')
    .put(updateLoggedUserDataValidator, updateLoggedUserData);

router.route('/deleteMe')
    .delete(deleteLoggedUserValidator, deleteLoggedUser);

router.use(authService.allowedTo('admin', 'manager'));

router.route('/')
    .post(uploadUserImage, resizeImage, createUserValidator, createUser)
    .get(getUsers);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

router.route('/change-password/:id')
    .put(changeUserPasswordValidator, changeUserPassword);

module.exports = router;
// This code defines the user routes for creating, retrieving, updating, and deleting users.
// It uses Express.js to set up the routes and applies validation middleware to ensure that the data being sent to the server is valid.
// The routes are linked to their respective service functions which handle the business logic.