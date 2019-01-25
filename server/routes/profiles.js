const   express         = require('express'),
        profilesMod     = require('../models/profiles.js');
        
const router = express.Router();

router.get('/:user', profilesMod.get_suggested_profiles);


module.exports = router;