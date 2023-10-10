const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middlewares')
const users = require('../controllers/users')

router.get('/register', users.renderRegisterForm)

router.post('/register', wrapAsync(users.registerUser))

router.get('/login', users.renderLoginForm)

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)
module.exports = router;