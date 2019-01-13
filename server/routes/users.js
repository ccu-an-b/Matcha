const   express   = require('express'),
        UserCtrl  = require('../controllers/user');

const router    = express.Router();

router.post('/auth',  UserCtrl.auth)

router.post('/register', UserCtrl.register)

router.get('/activate/:key', UserCtrl.activate)

module.exports = router;