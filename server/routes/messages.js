const express = require('express'),
    UserCtrl = require('../controllers/user'),
    UserMod = require('../models/user.js'),

const router = express.Router();

router.get('/messages/:roomId', UserCtrl.authMiddleware, UserMod.user_get_profile)

module.exports = router;