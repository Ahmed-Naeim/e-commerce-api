const express = require('express');
const router = express.Router();
const {addAddress, getLoggedUserAddresses, removeAddress} = require('../services/addressService');
const {addAddressValidator, getLoggedUserAddressesValidator, removeAddressValidator} = require('../utils/validators/addressValidator');
const authService = require('../services/authService');

router.use(authService.protect);

router.route('/')
    .post(
        authService.protect,
        authService.allowedTo('user'),
        addAddressValidator,
        addAddress
    )
    .get(
        authService.protect,
        authService.allowedTo('user'),
        getLoggedUserAddressesValidator,
        getLoggedUserAddresses
    );

router.route('/:addressId')
    .delete(
        authService.protect,
        authService.allowedTo('user'),
        removeAddressValidator,
        removeAddress
    );



module.exports = router;
