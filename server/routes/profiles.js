const   express         = require('express'),
        UserCtrl        = require('../controllers/user'),
        ProfilesMod     = require('../models/profiles.js');
        
const router = express.Router();

router.post('/', UserCtrl.authMiddleware, ProfilesMod.get_suggested_profiles);

router.post('/public-data', ProfilesMod.get_public_data);

router.get('/like/:username', UserCtrl.authMiddleware, ProfilesMod.set_profile_like);

router.get('/view/:username', UserCtrl.authMiddleware, ProfilesMod.set_profile_view);

router.get('/block/:username', UserCtrl.authMiddleware, ProfilesMod.set_profile_block);

router.get('/report/:username', ProfilesMod.set_profile_report);

router.get('/user-info/:username', UserCtrl.authMiddleware, ProfilesMod.get_user_info);

module.exports = router;