const   express         = require('express'),
        ToolsCtrl       = require('../controllers/tools.js');
        
const router = express.Router();

router.get('/tags', ToolsCtrl.getTag);

module.exports = router;