const   express         = require('express'),
        ToolsMod        = require('../models/tools.js'),
        ToolsCtrl       = require('../controllers/tools.js');
        
const router = express.Router();

router.get('/tags', ToolsCtrl.getTag);

module.exports = router;