const db = require('./db');

function get_room_messages(req, res) {
    const roomId = req.params.type;

    const query = {
        text: `id, user_from_id, user_for_id, content, read`,
        values: [userId, type]
    }
    return db.get_database(query).then((result) => {
        return res.json(result)
    })
}

function get_matchs(req, res) {
    const userId = res.locals.user.userId;
    console.log(userId);

    const query = {
        text: `SELECT * FROM notifications 
        WHERE user_id = $1`,
        values: [userId]
    }
    return db.get_database(query).then((result) => {
        return res.json(result)
    })
}

function delete_notification(user, userfrom, type) {
    const query = {
        text: `DELETE FROM notifications WHERE user_id = $1 AND user_from_id = $2 AND type = $3`,
        values: [user, userfrom, type]
    }
    db.set_database(query)
}

function send_notification(user, userfrom, type) {
    const query = {
        text: `INSERT INTO notifications (user_id, user_from_id, type, date) VALUES ($1, $2, $3, $4)`,
        values: [user, userfrom, type, Date.now()]
    }
    db.set_database(query)
}

function delete_all_notification(user, userfrom) {
    const query = [{
        text: `DELETE FROM notifications WHERE user_id = $1 AND user_from_id = $2`,
        values: [user, userfrom]
    }, {
        text: `DELETE FROM notifications WHERE user_id = $1 AND user_from_id = $2`,
        values: [userfrom, user]
    }]
    for (var i = 0; i < query.length; i++)
        db.set_database(query[i]);
}

module.exports = {
    get_type_notifications,
    delete_notification,
    get_matchs,
    send_notification,
    delete_all_notification
}