const db = require('./db'),
        UserMod = require('./user'), 
        Mail = require('./mail'),
        NotifMod = require('./notifications');

function get_suggested_profiles(req, res) {
        const userId = res.locals.user.userId;
        const query = {
                text: `SELECT users.id, first_name, last_name , username, online, connexion,age, profile_img, total, latitude_ip, longitude_ip, latitude_user, longitude_user, city_ip, country_ip, city_user, country_user , "${userId}" as match from users 
                JOIN matchs ON matchs.user_id =users.id AND "${userId}" >= 0
                JOIN profiles ON profiles.user_id = users.id  
                JOIN scores ON scores.user_id = users.id  
                JOIN geoloc ON geoloc.user_id = users.id
                WHERE users.complete = 1 AND users.id != $1
                GROUP BY users.id, profiles.age,profile_img, total, latitude_ip, longitude_ip, latitude_user, longitude_user, city_ip, country_ip, city_user, country_user, "${userId}"`,
                values: [userId],
        };

        return db.get_database(query)
                .then((response) => { 
                        let promises = response.map((profile) =>{
                                return UserMod.user_get_tags(profile.id)
                                        .then((res) => {
                                                 profile.tags = res;
                                                return profile;  
                                        })
                                
                         })
                        Promise.all(promises).then(function(results) {
                                return res.json(results)
                        })
                })
                .catch((e) => console.log(e));
}
function update_match(userFromId, profileId, value) {
        const query = {
                text: `UPDATE matchs SET "${profileId}" =  $1  WHERE user_id = $2`,
                values: [value, userFromId]
        }
        db.set_database(query)
}

function update_score(userId, sign, value) {
        const query = {
                text: `UPDATE scores SET total = total ${sign} $1 WHERE user_id = $2`,
                values: [value, userId]
        }
        db.set_database(query)
}

function set_profile_like(req, res) {
        const userId = res.locals.user.userId;
        const username = req.params.username;

        return UserMod.user_select('username', username).then((result) => {
                const query = {
                        text: `SELECT user_id, "${userId}" as valueUser, "${result[0].id}" as valueProfile from matchs where user_id = $1 OR user_id = $2 `,
                        values: [userId, result[0].id]
                }
                return db.get_database(query)
        })
                .then((result) => {
       
                        let valueUser = result[0].valueprofile;
                        let valueProfile = result[1].valueuser;
                        let profileId = result[1].user_id

                        if (result[1].user_id === userId) {
                                valueUser = result[1].valueprofile;
                                valueProfile = result[0].valueuser;
                                profileId = result[0].user_id;
                        }
                        if (valueUser === 1 && valueProfile === 2)
                                valueUser = 12;
                       
                        switch (valueUser) {
                                case 1:
                                        NotifMod.send_notification(profileId, userId, 2);
                                        update_score(profileId, '+', 2)
                                        update_match(userId, profileId, 2)
                                        break;
                                case 2:
                                        NotifMod.send_notification(profileId, userId, -2);
                                        NotifMod.delete_notification(profileId, userId, 2);
                                        update_score(profileId, '-', 2)
                                        update_match(userId, profileId, 1)
                                        break;
                                case 3:
                                        NotifMod.send_notification(profileId, userId, -3);
                                        NotifMod.delete_notification(profileId, userId, 2);
                                        NotifMod.delete_notification(profileId, userId, 3);
                                        NotifMod.delete_notification(userId, profileId, 3);
                                        update_score(profileId, '-', 6)
                                        update_score(userId, '-', 4)
                                        update_match(userId, profileId, 1)
                                        update_match(profileId, userId, 2)
                                        break;
                                case 12:
                                        NotifMod.send_notification(profileId, userId, 2);
                                        NotifMod.send_notification(profileId, userId, 3);
                                        NotifMod.send_notification(userId, profileId, 3);
                                        update_score(profileId, '+', 6)
                                        update_score(userId, '+', 4)
                                        update_match(userId, profileId, 3)
                                        update_match(profileId, userId, 3)
                                        break;
                                default:
                                        console.log("error")

                        }
                        return res.status(200).send({ success: [{ title: 'Profile liked/unliked', detail: '' }] });
                })
}

function set_profile_view(req, res) {
        const userId = res.locals.user.userId;
        const username = req.params.username;

        if (username === res.locals.user.username)
                return res.status(200).send({ success: [{ title: "It's your profile", detail: '' }] });
        return UserMod.user_select('username', username)
                .then((result) => {

                        const query = {
                                text: `SELECT "${result[0].id}" as value, users.id from matchs JOIN users ON users.id = $1 where user_id = $2`,
                                values: [result[0].id, userId]
                        }
                        return db.get_database(query)
                })
                .then((result) => {
                        if (result[0].value === 0) {
                                update_match(userId, result[0].id, 1)
                        }

                        NotifMod.send_notification(result[0].id, userId, 1)
                        update_score(result[0].id, '+', 1)

                        return res.status(200).send({ success: [{ title: 'Profile viewed', detail: '' }] });
                })
}

function set_profile_block(req, res) {
        const userId = res.locals.user.userId;
        const username = req.params.username;

        return UserMod.user_select('username', username)
                .then((result) => {
                        update_match(userId, result[0].id, -11)
                        update_match(result[0].id, userId, -1)
                        update_score(result[0].id, '-', 10)
                        NotifMod.delete_all_notification(userId,result[0].id)
                        return res.status(200).send({ success: [{ title: 'Profile blocked', detail: result[0] }] });
                })
}

function set_profile_report(req, res){
        const username =req.params.username

        return UserMod.user_select("username", username)
        .then((result) =>{
                Mail.report_mail(username, result[0].mail, result[0].key)
                const query = {
                        text:`UPDATE users SET active = 0 WHERE id= $1`,
                        values:[result[0].id]
                }
                db.set_database(query);
                return res.status(200).send({ success: [{ title: 'The user has been report', detail: result[0] }] });
        })
}
function get_user_info(req, res){
        const userId = res.locals.user.userId;
        const username = req.params.username;

        return UserMod.user_select('username', username)
        .then((result) => {
                const query ={
                        text:`SELECT COALESCE(
                        (SELECT count(*) FROM notifications WHERE  notifications.user_id =  $1 AND type= 1  AND user_from_id= $2 
                        GROUP BY notifications.user_from_id), 0) as seen, "${userId}" as type
                        FROM matchs WHERE matchs.user_id = $2  ;`,
                        values:[userId, result[0].id]
                }
                return db.get_database(query)
        })
        .then((result) => {
                return res.json(result)
        })
}

module.exports = {
        get_suggested_profiles,
        set_profile_view,
        set_profile_like,
        set_profile_block,
        get_user_info,
        set_profile_report,
        update_match
}