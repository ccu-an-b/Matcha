const   db = require('./db');

function get_type_notifications(req, res){
    const userId = res.locals.user.userId;
    const type = req.params.type;

    const query = {
        text:`SELECT user_from_id, profile_img, username, online, age, connexion , notifications.date FROM notifications 
        JOIN profiles ON profiles.user_id = notifications.user_from_id
        JOIN users ON users.id = notifications.user_from_id
        WHERE notifications.user_id = $1  AND type = $2
        ORDER by notifications.id DESC`,
        values: [userId, type]
    }
    return db.get_database(query).then((result) => {
        return res.json(result)
    })
}

function delete_notification(user, userfrom, type){
    const query = {
        text: `DELETE FROM notifications WHERE user_id = $1 AND user_from_id = $2 AND type = $3`,
        values: [user, userfrom, type]
    }
    db.set_database(query)
}

function send_notification(user, userfrom ,type){
    const query = {
        text: `INSERT INTO notifications (user_id, user_from_id, type, date) VALUES ($1, $2, $3, $4)`,
        values: [user, userfrom, type, Date.now()]
    }
    db.set_database(query)
}

function delete_all_notification(user, userfrom){
    const query = [{
        text: `DELETE FROM notifications WHERE user_id = $1 AND user_from_id = $2`,
        values: [user, userfrom]
    },{
        text: `DELETE FROM notifications WHERE user_id = $1 AND user_from_id = $2` ,
        values: [userfrom, user]
    }]
    for (var i = 0; i < query.length; i++)
        db.set_database(query[i]);
}

module.exports = {
    get_type_notifications,
    delete_notification,
    send_notification,
    delete_all_notification
}