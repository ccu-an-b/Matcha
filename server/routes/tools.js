const   express   = require('express'),
        ToolsMod  = require('../models/tools.js');
        
const router = express.Router();

router.get('/tags', function(req, res){
        ToolsMod.get_tags().then((result) => {return res.json(result);})
});

module.exports = router;