const   express         = require('express'),
        UserCtrl        = require('../controllers/user'),
        profilesMod     = require('../models/profiles.js');
        
const router = express.Router();

router.post('/', UserCtrl.authMiddleware, profilesMod.get_suggested_profiles);

router.get('/like/:username', UserCtrl.authMiddleware, profilesMod.set_profile_like)

router.get('/view/:username', UserCtrl.authMiddleware, profilesMod.set_profile_view)

router.get('/block/:username', UserCtrl.authMiddleware, profilesMod.set_profile_block)

router.get('/report/:username', profilesMod.set_profile_report)

router.get('/user-info/:username', UserCtrl.authMiddleware, profilesMod.get_user_info)

module.exports = router;