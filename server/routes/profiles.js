const   express         = require('express'),
        UserCtrl        = require('../controllers/user'),
        profilesMod     = require('../models/profiles.js');
        
const router = express.Router();

router.post('/', UserCtrl.authMiddleware, profilesMod.get_suggested_profiles);

module.exports = router;