const   express   = require('express'),
        UserCtrl  = require('../controllers/user');

const router    = express.Router();

router.post('/auth',  UserCtrl.auth)

router.post('/register', UserCtrl.register)

module.exports = router;