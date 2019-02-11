const db = require('./db');

function get_room_messages(req, res) {
    const roomId = req.params.roomId;
    const query = {
        text: `SELECT user_from_id, user_for_id, content, room_id, date FROM messages WHERE room_id = $1`,
        values: [roomId]
    }
    return db.get_database(query).then((result) => {
        return res.json(result)
    })
}

function send_message(req, res) {
    // const { roomId, userId, messageTo, content } = req.body;
    const { room_id, user_from_id, user_for_id, content } = req.body;

    console.log(req.body)
    const query = {
        text: `INSERT INTO messages (user_from_id, user_for_id, content, room_id, date) VALUES ($1, $2, $3, $4, $5)`,
        values: [user_from_id, user_for_id, content, room_id, Date.now()]
    }
    return db.get_database(query).then((result) => {
        return res.json(result)
    })
}

function delete_all_messages_match(user1, user2){
    const query = {
        text: `DELETE from messages WHERE (user_from_id = $1 AND user_for_id = $2) OR (user_from_id = $2 AND user_for_id = $1)`,
        values: [user1, user2]
    }
    return db.set_database(query)
}

module.exports = {
    get_room_messages,
    send_message,
    delete_all_messages_match,
}