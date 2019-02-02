const db = require('./db'),
        UserMod = require('./user'),
        NotifMod = require('./notifications');

function get_suggested_profiles(req, res) {
        const userId = res.locals.user.userId;
        const query = {
                text: `SELECT users.id, first_name, last_name , username, online, connexion,age, location, profile_img, total, latitude_ip, longitude_ip from users 
                JOIN profiles ON profiles.user_id = users.id  
                JOIN scores ON scores.user_id = users.id  
                JOIN geoloc ON geoloc.user_id = users.id
                WHERE users.complete = 1 AND id != $1`,
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

module.exports = {
        get_suggested_profiles,
        set_profile_view,
        set_profile_like
}