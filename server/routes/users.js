const   express         = require('express'),
        UserCtrl        = require('../controllers/user'),
        UserMod         = require ('../models/user.js');

const router = express.Router();

router.post('/auth',  UserCtrl.auth)

router.get('/logout',  UserCtrl.authMiddleware, UserMod.user_set_offline)

router.post('/register', UserCtrl.register)

// router.post('/profileComplete', UserCtrl.authMiddleware, UserMod.user_profile_update)
router.post('/profileComplete', UserCtrl.authMiddleware,function(req, res){
        UserMod.user_profile_update(req, res, UserMod.user_tags_update)
})

router.get('/activate/:key', UserCtrl.activate)

router.get('/profile/:username', UserCtrl.getProfile)

module.exports = router;