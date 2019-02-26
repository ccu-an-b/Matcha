const   express = require('express'),
        UserCtrl = require('../controllers/user'),
        messagesModule = require('../models/messages.js');

const router = express.Router();

router.post('/', UserCtrl.authMiddleware, messagesModule.send_message);

router.get('/', UserCtrl.authMiddleware, messagesModule.count_unread_room_messages);

router.post('/room/:roomId', UserCtrl.authMiddleware, messagesModule.set_message_to_read);

router.get('/room/:roomId', UserCtrl.authMiddleware, messagesModule.get_room_messages);

router.get('/conversations', UserCtrl.authMiddleware, messagesModule.get_all_conversations);

module.exports = router;