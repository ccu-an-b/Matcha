const   express         = require('express'),
        UserCtrl        = require('../controllers/user'),
        UserMod         = require ('../models/user.js');

const router = express.Router();

router.post('/auth',  UserCtrl.auth)

router.get('/logout',  UserCtrl.authMiddleware, UserMod.user_set_offline)

router.post('/register', UserCtrl.register)

router.post('/profileComplete', UserCtrl.authMiddleware, UserMod.user_profile_update)

router.get('/activate/:key', UserCtrl.activate)

module.exports = router;