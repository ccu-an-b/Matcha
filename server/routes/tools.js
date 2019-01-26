const   express         = require('express'),
        ToolsMod        = require('../models/tools.js');
        
const router = express.Router();

router.get('/tags', ToolsMod.get_tags);

module.exports = router;