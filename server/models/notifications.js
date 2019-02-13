const   db = require('./db'),
        UserMod = require('./user');

function get_type_notifications(req, res) {
    const userId = res.locals.user.userId;
    const type = req.params.type;

    const query = {
        text: `SELECT user_from_id, profile_img, username, online, age, connexion, match_id, notifications.date FROM notifications 
        JOIN profiles ON profiles.user_id = notifications.user_from_id
        JOIN users ON users.id = notifications.user_from_id
        WHERE notifications.user_id = $1 AND type = $2
        ORDER by notifications.id DESC`,
        values: [userId, type]
    }
    return db.get_database(query).then((result) => {
        return res.json(result)
    })
}

function get_all_notifications(req, res) {
    const userId = res.locals.user.userId;

    const query = {
        text: `SELECT notifications.id , user_from_id, profile_img, username, online, age, connexion, match_id, notifications.date ,  notifications.type, read FROM notifications 
        JOIN profiles ON profiles.user_id = notifications.user_from_id
        JOIN users ON users.id = notifications.user_from_id
        WHERE notifications.user_id = $1 
        ORDER by notifications.date DESC`,
        values: [userId]
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
        text: `INSERT INTO notifications (user_id, user_from_id, type, date) VALUES ($1, $2, $3, $4)
                RETURNING notifications.id, user_from_id, user_id, type, date, read `,
        values: [user, userfrom, type, Date.now()]
    }

    let promise1 = Promise.resolve(db.get_database(query))
    let promise2 = Promise.resolve(UserMod.user_select('id', userfrom))
    return Promise.all([promise1, promise2])
    .then((result) => {
            let final = result[0].concat(result[1])
            return [Object.assign(final[0], final[1])]
        })
}

function send_match_notification(user, userfrom, type) {
    const match_id = Math.random().toString(36).replace('0.', '') 
    const query = [{
        text: `INSERT INTO notifications (user_id, user_from_id, type, date) VALUES ($1, $2, $3, $4)
                RETURNING notifications.id, user_from_id, user_id, type, date, read `,
        values: [user, userfrom, 2, Date.now()]
    },{
        text: `INSERT INTO notifications (user_id, user_from_id, type, date, match_id) VALUES ($1, $2, $3, $4, $5)
        RETURNING notifications.id, user_from_id, user_id, type, date, read `,
        values: [user, userfrom, type, Date.now(), match_id]
    }, {
        text: `INSERT INTO notifications (user_from_id, user_id, type, date, match_id) VALUES ($1, $2, $3, $4, $5)
        RETURNING notifications.id, user_from_id, user_id, type, date, read `,
        values: [user, userfrom, type, Date.now(), match_id]
    }]
    let promise = [[],[]]
    for (var i = 0; i < query.length; i++){
        promise[i] = Promise.resolve( db.get_database(query[i]))
    }
    return Promise.all([promise[0], promise[1], promise[2]])
        .then((result) => {
            let promises = result.map((notification) => {
                return UserMod.user_select('id',notification[0].user_from_id)
                    .then((profile) => {
                        let final = notification.concat(profile)
                        return Object.assign(final[0], final[1])
                    })
            })
            return Promise.all(promises).then(function(results) {
               return results
            })
        })
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

function read_notifications(req, res){
    const {userId} = res.locals.user;

    const query = {
        text:'UPDATE notifications SET read = 1 WHERE user_id = $1',
        values:  [userId]
    }
    db.set_database(query)
    return res.status(200).send({sucess: "notifications read"})
}
module.exports = {
    get_type_notifications,
    get_all_notifications,
    delete_notification,
    get_matchs,
    send_notification,
    send_match_notification,
    delete_all_notification,
    read_notifications
}