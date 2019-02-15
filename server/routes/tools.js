const   express         = require('express'),
        ToolsMod        = require('../models/tools.js'),
        DbSetupMod       = require('../config/fill_db.js');
        
const router = express.Router();

router.get('/tags', function(req, res){
        ToolsMod.get_tags().then((result) => {return res.json(result);})
});

router.post('/db_fake', DbSetupMod.save_user)

module.exports = router;