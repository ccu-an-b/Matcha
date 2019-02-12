const   express = require('express'),
        UserCtrl = require('../controllers/user'),
        messagesModule = require('../models/messages.js');

const router = express.Router();

router.post('/', UserCtrl.authMiddleware, messagesModule.send_message);

router.get('/:roomId', UserCtrl.authMiddleware, messagesModule.get_room_messages);

module.exports = router;