const   express         = require('express'),
        UserCtrl        = require('../controllers/user'),
        UserMod         = require ('../models/user.js'),
        NotifMod        = require("../models/notifications");

const router = express.Router();

router.post('/auth',  UserCtrl.auth)

router.get('/logout/:user',  UserMod.user_set_offline)

router.post('/register', UserCtrl.register)

router.post('/profileComplete', UserCtrl.authMiddleware, UserMod.user_profile_update)

router.get('/activate/:key', UserCtrl.activate)

router.post('/fetch-users', UserCtrl.fetchAllUsersData)

router.get('/profile/:username', UserMod.user_get_profile)

router.get('/deleteImage/:image', UserCtrl.authMiddleware, UserMod.user_delete_image)

router.get('/notifications/:type', UserCtrl.authMiddleware, NotifMod.get_type_notifications )

module.exports = router;