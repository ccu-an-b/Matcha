const db = require('./db'),
        UserMod = require('./user'), 
        Mail = require('./mail'),
        NotifMod = require('./notifications'),
        MessagesMod = require('./messages'),
        MatchMod = require('./matching');

function fetch_public_data(userId) {

        const query = {
                text: `SELECT id, age, total, username, first_name, last_name, city_user, country_user,latitude_user, longitude_user, profile_img, username as value, username as label FROM users
                JOIN geoloc ON geoloc.user_id = users.id
                JOIN scores ON scores.user_id = users.id
                JOIN profiles ON profiles.user_id = users.id
                JOIN matchs ON matchs.user_id = users.id
                WHERE "${userId}" != -1 AND complete != 0`,
        }
        return db.get_database(query)
        .then((response) => response)
}

const get_public_data = async (req, res) => {
        const userId = res.locals.user.userId;
        const response = await fetch_public_data(userId);
        let i = 0
        do {
                const tags = await UserMod.user_get_tags(response[i].id);
                response[i].tags = tags;
                const distance =  await MatchMod.match_distance(userId, response[i]);
                response[i].distance = distance;
                const tagsCount = await MatchMod.match_tags(userId, response[i]);
                response[i].tagsCount = tagsCount.length;
                i += 1;
        }while (i < response.length)

        return res.status(200).send(response);

}

function get_profiles(userId) {
        return UserMod.user_select('id', userId)
        .then((result) => {
                let orientation1;
                let orientation2;
                let sex1 = 0;
                let sex2 = 1;

                if (result[0].gender === 0){
                        orientation1 = 0;
                        orientation2 = 1;
                        if (result[0].orientation == 1){
                                sex1 = 0;
                                sex2 = 0;
                        }
                        if (result[0].orientation == 2){
                                sex1 = 1;
                                sex2 = 1;
                        }
                }
                if (result[0].gender === 1){
                        orientation1 = 0;
                        orientation2 = 2;
                        if (result[0].orientation == 1){
                                sex1 = 0;
                                sex2 = 0;
                        }
                        if (result[0].orientation == 2){
                                sex1 = 1;
                                sex2 = 1;
                        }
                }
               
                const query = {
                        text: `SELECT users.id, first_name, last_name , username, online, connexion,age, profile_img, total, latitude_ip, longitude_ip, latitude_user, longitude_user, city_ip, country_ip, city_user, country_user , "${userId}" as match from users 
                        JOIN matchs ON matchs.user_id =users.id AND "${userId}" >= 0
                        JOIN profiles ON profiles.user_id = users.id  
                        JOIN scores ON scores.user_id = users.id  
                        JOIN geoloc ON geoloc.user_id = users.id
                        WHERE users.complete = 1 AND users.id != $1 AND (profiles.orientation = $2 OR profiles.orientation = $3) AND (profiles.gender = $4 OR profiles.gender = $5)
                        GROUP BY users.id, profiles.age,profile_img, total, latitude_ip, longitude_ip, latitude_user, longitude_user, city_ip, country_ip, city_user, country_user, "${userId}"`,
                        values: [userId,orientation1, orientation2, sex1, sex2],
                };
        
                return db.get_database(query) 
                        .then((res) => res)
                        .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
}

const get_suggested_profiles = async (req, res) => {

        const userId = res.locals.user.userId;

        const response = await get_profiles(userId)
        let i = 0;
        do {
                const tags = await UserMod.user_get_tags(response[i].id);
                response[i].sort = 0;
                response[i].tags = tags;
                const distance =  await MatchMod.match_distance(userId, response[i]);
                response[i].distance = distance;
                const tagsCount = await MatchMod.match_tags(userId, response[i]);
                response[i].tagsCount = tagsCount.length;
                i += 1;
        } while (i < response.length)

        const sort1 = await MatchMod.sort_by_distance(response);
        const sort2 = await MatchMod.sort_by_tags(sort1);
        const sort3 = await MatchMod.sort_by_score(sort2);
        const sortFinal = await MatchMod.sort_final(sort3);

        return res.json(sortFinal);
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
                        let type 
                        
                        if (result[1].user_id === userId) {
                                valueUser = result[1].valueprofile;
                                valueProfile = result[0].valueuser;
                                profileId = result[0].user_id;
                        }
                        if (valueUser === 1 && valueProfile === 2)
                                valueUser = 12;
                       
                        switch (valueUser) {
                                case 1:
                                        type = 2;
                                        update_score(profileId, '+', 2)
                                        update_match(userId, profileId, 2)
                                        break;
                                case 2:
                                        type = -2;
                                        NotifMod.delete_notification(profileId, userId, 2);
                                        update_score(profileId, '-', 2)
                                        update_match(userId, profileId, 1)
                                        break;
                                case 3:
                                        type = -3;
                                        NotifMod.delete_notification(profileId, userId, 2);
                                        NotifMod.delete_notification(profileId, userId, 3);
                                        NotifMod.delete_notification(userId, profileId, 3);
                                        NotifMod.delete_notification_message(profileId, userId);
                                        NotifMod.delete_notification_message(userId, profileId);
                                        update_score(profileId, '-', 6)
                                        update_score(userId, '-', 4)
                                        update_match(userId, profileId, 1)
                                        update_match(profileId, userId, 2)
                                        break;
                                case 12:
                                        type = 2;
                                        update_score(profileId, '+', 6)
                                        update_score(userId, '+', 4)
                                        update_match(userId, profileId, 3)
                                        update_match(profileId, userId, 3)
                                        break;
                                default:
                                        console.log("error")

                        }
                        if (valueUser === 12)
                        { 
                                return  NotifMod.send_match_notification(profileId, userId, 3)
                                        .then((result) => {
                                                return res.json(result)
                                        }) 
                        }
                        else {
                                return NotifMod.send_notification(profileId, userId, type)
                                        .then((result) => {
                                                return res.json(result)
                                        })  
                        }
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
                        update_score(result[0].id, '+', 1)
                        return NotifMod.send_notification(result[0].id, userId, 1)
                         .then((result) => {
                                return res.json(result)
                        })
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
                        MessagesMod.delete_all_messages_match(result[0].id, userId)
                        NotifMod.delete_all_notification(userId,result[0].id)
                        NotifMod.delete_notification_message(result[0].id, userId);
                        NotifMod.delete_notification_message(userId,result[0].id);
                        return res.status(200).send({ success: [{ title: 'Profile blocked', detail: result[0] }] });
                })
}

function set_profile_report(req, res){
        const username =req.params.username

        return UserMod.user_select("username", username)
        .then((result) =>{
                Mail.report_mail(req.headers.host, result[0].mail, result[0].key)
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
        get_public_data,
        get_suggested_profiles,
        set_profile_view,
        set_profile_like,
        set_profile_block,
        get_user_info,
        set_profile_report,
        update_match
}