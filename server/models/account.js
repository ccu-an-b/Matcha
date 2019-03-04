const   db = require('./db'),
        bcrypt = require('bcrypt'),
        crypto = require('crypto'),
        base64url = require('base64url'),
        ProfileMod = require('./profiles'),
        UserMod = require ('./user'),
        MailMod = require ('./mail');

function user_get_block(req, res){
    const userId = res.locals.user.userId

    const query = {
        text: `SELECT * from matchs WHERE user_id=$1`,
        values: [userId],
    }
    return db.get_database(query)
        .then((result) => {
            const values = Object.values(result[0])
            const keys = Object.keys(result[0])
        
            let promises = values.map((profile, index) =>{
                if (profile === -11){
                    const query = {
                        text: `SELECT username , id, profile_img FROM users  
                        JOIN profiles ON profiles.user_id = users.id 
                        WHERE id = $1`,
                        values: [keys[index]]
                    }
                    return db.get_database(query)
                }
            })
            Promise.all(promises).then(function(results) {
                return res.json(results.filter(n => n))
            })
        })
}

function user_update_password(req, res){
    const { old_password, new_password  } = req.body;
    const userId = res.locals.user.userId;

    const query = {
        text:`SELECT password FROM users WHERE id=$1`,
        values: [userId]
    }

    return db.get_database(query)
        .then((result) => {
            if (bcrypt.compareSync(old_password, result[0].password)){
                const query ={
                    text:`UPDATE users SET password = $1 WHERE id = $2`,
                    values: [bcrypt.hashSync(new_password, 10), userId]
                }
                return db.set_database(query)
            }
            else
                throw {error: [{title: "wrongPassword" , detail: 'Wrong password'}] }
        })
        .then(() => res.status(200).send({ success: [{ title: 'Update', detail: 'Your password has been updated.' }] }))
        .catch((err) => res.status(200).send(err))
}

function user_update_general(req, res){
    const username_new = req.body.username;
    const mail_new  = req.body.mail;
    const {userId, username, mail }= res.locals.user;

    return UserMod.user_select('username', username_new)
        .then((result) => {
            if (result.length && username !== username_new)
                throw { error: [{ title: 'User exists', detail: 'Username already exists' }] };
            return UserMod.user_select('mail', mail_new)
        })
        .then((result) =>{
            if (result.length && mail !== mail_new)
                throw { error: [{ title: 'User exists', detail: 'Mail already exists' }] };
            const query = {
                text:`UPDATE users SET username = $1,mail = $2 WHERE id= $3`,
                values: [username_new, mail_new, userId]
            }
        
            return db.set_database(query).then(() => {
                if (username_new !== username)
                    return res.status(200).send({ redirect: [], success: [{ title: 'Update', detail: 'Your information has been updated.' }] })
                return res.status(200).send({ success: [{ title: 'Update', detail: 'Your information has been updated.' }] })
            })
        })
        .catch((err) => res.status(200).send(err))
}

function user_update_delete(req, res){
    const {password } = req.body;
    const userId = res.locals.user.userId;
    
    const query = {
        text:`SELECT password FROM users WHERE id=$1`,
        values: [userId]
    }

    return db.get_database(query)
        .then((result) => {
            if (bcrypt.compareSync(password, result[0].password)){
                const query = [{
                    text: 'ALTER TABLE matchs DROP COLUMN "' + userId + '"',
                }, {
                    text: `DELETE from matchs WHERE user_id = $1`,
                    values: [userId]
                }, {
                    text: `DELETE from  scores WHERE user_id = $1`,
                    values: [userId]
                }, {
                    text: `DELETE from geoloc WHERE user_id = $1`,
                    values: [userId]
                }, {
                    text: `DELETE from  profiles WHERE user_id = $1`,
                    values: [userId]
                }, {
                    text: `DELETE from tags WHERE user_id = $1`,
                    values: [userId]
                }, {
                    text: `DELETE from users WHERE id = $1`,
                    values: [userId]
                }, {
                    text: `DELETE from images WHERE user_id = $1`,
                    values: [userId]
                }, {
                    text: `DELETE from notifications WHERE user_id = $1 OR user_from_id = $1`,
                    values: [userId]
                }, {
                    text: `DELETE from notifications_messages WHERE user_id = $1 OR user_from_id = $1`,
                    values: [userId]
                },
                {
                    text: `DELETE from messages WHERE user_from_id = $1 OR user_for_id = $1`,
                    values: [userId]
                }]
                for (var i = 0; i < query.length; i++)
                    db.set_database(query[i]);
                return true
            }
            else
                throw false
        })
        .then(() => res.status(200).send({ success: [{ title: 'Update', detail: 'Your password has been updated.' }] }))
        .catch(() => res.status(200).send({error: [{title: "wrongPassword" , detail: 'Wrong password'}] }))
}

function user_update_blocked(req, res){
    const userId = res.locals.user.userId;
    const profiles = req.body;
    Object.values(profiles).map((profile) => {
        return UserMod.user_select("username", profile)
        .then((result) => {
            ProfileMod.update_match(userId, result[0].id, 0)
            ProfileMod.update_match(result[0].id, userId,0)
        })
    })

    return res.status(200).send({ success: [{ title: 'Update', detail: 'You successfully unblocked '+Object.values(profiles).join()+'.' }] })
}

function user_forgotten_password(req, res){
    const {mail} = req.body;

    return UserMod.user_select('mail', mail)
        .then((result) =>{
            if (result.length < 1)
                throw {error: [{title: "wrongIdentification" , detail: "Mail provided doesn't exist"}] } 
            MailMod.password_mail(result[0].username, mail, result[0].key)
            return res.status(200).send({success: [{title: "emailSent" , detail: "Cool"}]})
        })
        .catch((err) => res.status(200).send(err))
}

function user_change_password(req, res){
    const {key , password} = req.body
    return UserMod.user_select('key', key)
    .then((result) => {
        var new_key = base64url(crypto.randomBytes(40));
        const query ={
            text:`UPDATE users SET password = $1, key = $2 WHERE id = $3`,
            values: [bcrypt.hashSync(password, 10), new_key,result[0].id]
        }
        return db.set_database(query)
    })
    .then(() => res.status(200).send({ success: [{ title: 'Update', detail: 'Your password has been updated, you can now sign in.' }] })) 
    .catch((err) => res.status(200).send({ error: err })) 
}

module.exports = {
    user_get_block,
    user_update_password,
    user_update_general,
    user_update_delete,
    user_update_blocked,
    user_forgotten_password,
    user_change_password
}
