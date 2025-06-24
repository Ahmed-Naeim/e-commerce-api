const express = require('express');
const router = express.Router();
const {createUser, getUsers, getUser, updateUser, deleteUser, changeUserPassword} = require('../services/userService');
const {createUserValidator, getUserValidator, updateUserValidator, changeUserPasswordValidator, deleteUserValidator} = require('../utils/validators/userValidator');

router.route('/')
    .post(createUserValidator, createUser)
    .get(getUsers);

router.route('/:id')
    .get(getUserValidator, getUser)
    .put(updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser);

router.route('/change-password/:id')
    .put(changeUserPasswordValidator, changeUserPassword);

module.exports = router;
// This code defines the user routes for creating, retrieving, updating, and deleting users.
// It uses Express.js to set up the routes and applies validation middleware to ensure that the data being sent to the server is valid.
// The routes are linked to their respective service functions which handle the business logic.