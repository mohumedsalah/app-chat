const express = require('express');
const controller = require('./controller');
const router  = express.Router();


// @route   POST api/user
// @desc    add one
// !access
router.post('/', [], controller.add);



// @route   POST api/user/login
// @desc    add one
// !access
router.post('/login', [], controller.logIn);


router.get('/me/:token',controller.returnUser);

module.exports = router;
