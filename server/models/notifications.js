const   db = require('./db');

function get_type_notifications(req, res){
    const userId = res.locals.user.userId;
    const type = req.params.type;

    const query = {
        text:`SELECT user_from_id, profile_img, username, online, connexion FROM notifications 
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
module.exports = {
    get_type_notifications
}