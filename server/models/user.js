const bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    base64url = require('base64url'),
    Mail = require('./mail'),
    db = require('./db'),
    helpers = require('./helpers'),
    tools = require('./tools');

function user_select(key, value) {

    const query = {
        text: `SELECT mail, id, username,active, first_name, last_name, complete FROM users WHERE ${key}=$1 `,
        values: [value]
    }
    return db.get_database(query)
}

// PUBLIC DATA
// TO BE UPDATED WITH: TAGS / USER POSITION
function user_select_all_public_data() {

    const query = {
        text: `SELECT id, username, latitude_ip, longitude_ip, latitude_user, longitude_user, profile_img FROM users
        JOIN geoloc ON geoloc.user_id = users.id
        JOIN profiles ON profiles.user_id = users.id`,
    }
    return db.get_database(query)
}

// REGISTER FUNCTIONS
function user_new_tables(user_id) {

    const query = [{
        text: 'ALTER TABLE matchs ADD COLUMN "' + user_id + '" integer DEFAULT 0',
    }, {
        text: `INSERT INTO matchs (user_id) VALUES($1)`,
        values: [user_id]
    }, {
        text: `INSERT INTO scores (user_id) VALUES($1)`,
        values: [user_id]
    }, {
        text: `INSERT INTO geoloc (user_id) VALUES($1)`,
        values: [user_id]
    }, {
        text: `INSERT INTO profiles (user_id) VALUES($1)`,
        values: [user_id]
    }, {
        text: `INSERT INTO tags (user_id) VALUES($1)`,
        values: [user_id]
    }]
    for (var i = 0; i < query.length; i++)
        db.set_database(query[i]);
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

function user_new(req, res) {

    const { password } = req.body;

    const name = req.body.name.capitalize();
    const last_name = req.body.last_name.capitalize();
    const mail = req.body.mail.toLowerCase();
    const username = req.body.username.toLowerCase();

    return user_select('username', username)
        .then((result) => {
            if (result.length)
                throw { errors: [{ title: 'User exists', detail: 'Username already exists' }] };
            return user_select('mail', mail)
        })
        .then((result) => {
            if (result.length)
                throw { errors: [{ title: 'User exists', detail: 'Email already used' }] };

            const hash = bcrypt.hashSync(password, 10);
            const key = base64url(crypto.randomBytes(40));
            const query = {
                text: 'INSERT INTO users (first_name, last_name, username, mail, password, key) VALUES($1, $2 ,$3, $4, $5, $6) RETURNING id, key',
                values: [name, last_name, username, mail, hash, key]
            }
            return db.get_database(query)
        })
        .then((result) => {
            console.log(result[0])
            Mail.activation_mail(username, mail, result[0].key)
            user_new_tables(result[0].id)
            return res.status(200).send({ success: [{ title: 'User created', detail: 'You created a new user' }] });
        })
        .catch((err) => {
            return res.status(422).send(err);
        })
}

function user_set_active(user_id) {
    var key = base64url(crypto.randomBytes(40));

    const query = {
        text: `UPDATE users SET active = 1, key = $1 WHERE id = $2`,
        values: [key, user_id]
    }
    db.set_database(query);
}

function user_profile_update(req, res) {
    const { bio, age, profile, location, tags, image, first_name, last_name } = req.body;
    let { gender, orientation } = req.body;
    const user = res.locals.user;
    const query = [];

    if (gender)
        gender = gender.value
    if (orientation)
        orientation = orientation.value
    if (profile) {
        query[0] = {
            text: `UPDATE profiles SET bio = $1, age = $2, profile_img = $3, gender = $4, orientation = $5 WHERE user_id = $6`,
            values: [bio, age, profile, gender, orientation, user.userId]
        }
    }
    if (!profile) {
        query[0] = {
            text: `UPDATE profiles SET bio = $1, age = $2, gender = $3, orientation = $4 WHERE user_id = $5`,
            values: [bio, age, gender, orientation, user.userId]
        }
    }
    if (location) {
        const locJson = JSON.parse(location.value);
        query.push({
            text: `UPDATE geoloc SET latitude_user = $1, longitude_user = $2, display_adress_user = $3, city_user = $4, country_user = $5 WHERE user_id = $6`,
            values: [locJson.lat, locJson.lon, locJson.display_name, locJson.address.city, locJson.address.country, user.userId]
        })
    }
    if (image) {
        for (var i = 0; i < image.length; i++) {
            query.push({
                text: 'INSERT INTO images (user_id, path) VALUES ($1, $2)',
                values: [user.userId, image[i].filename]
            })
        }
    }
    query.push({
        text: `UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3`,
        values: [first_name.capitalize(), last_name.capitalize(), user.userId]
    })

    for (var i = 0; i < query.length; i++)
        db.set_database(query[i]);

    return user_tags_update(res, tags, user.userId, user.username);
}

function user_tags_update(res, tags, userId, username) {

    //Separate created tags from existing one
    var newArray = [[], []]
    for (var i = 0; i < tags.length; i++) {
        if (tags[i]['__isNew__']) {
            newArray[0].push(tags[i])
        }
        else
            newArray[1].push(tags[i])
    }

    // //Create array with only the tags value
    var arrTagsNew = Object.keys(newArray[0]).map(key => (newArray[0][key].value));
    var arrTagsExist = Object.keys(newArray[1]).map(key => (newArray[1][key].value));

    // //Transform array value to lowercase
    arrTagsNew = arrTagsNew.map(value => value.toLowerCase());
    arrTagsExist = arrTagsExist.map(value => value.toLowerCase());

    return tools.get_tags()
        .then((res) => {
            let query = [];
            for (var i = 1; i < res.length; i++) {
                const value = helpers.isInArray(res[i].value, arrTagsExist)
                query.push({
                    text: `UPDATE tags SET ${res[i].value} =  $1 WHERE user_id = $2`,
                    values: [value, userId]
                })
            }
            for (var i = 0; i < query.length; i++)
                db.set_database(query[i]);
        })
        .then(() => {
            let query = [];
            for (var i = 0; i < arrTagsNew.length; i++) {
                query.push({
                    text: `ALTER TABLE tags ADD COLUMN ${arrTagsNew[i]} integer DEFAULT 0`
                })
                query.push({
                    text: `UPDATE tags SET ${arrTagsNew[i]} = 1 WHERE user_id = $1`,
                    values: [userId]
                })
            }
            for (var i = 0; i < query.length; i++)
                db.set_database(query[i]);

        })
        .then(() => {
            user_is_complete_status(userId)
            return res.status(200).send({ success: [{ title: 'Profile update', detail: 'Your profile has been update', username: username }] });
        });
}

function user_delete_image(req, res) {
    const userId = res.locals.user.userId;
    const path = req.params.image;

    const query = {
        text: 'DELETE FROM images WHERE user_id = $1 AND path = $2',
        values: [userId, path]
    }

    return db.set_database(query).then(() => {
        return res.status(200).send({ success: [{ title: 'Image delete', detail: 'Your image has been delete' }] })
    })
}

// AUTH FUNCTIONS
function user_password_check(data, password) {

    const query = {
        text: `SELECT password FROM users WHERE id=$1`,
        values: [data[0].id]
    }

    return db.get_database(query).then((result) => {
        if (bcrypt.compareSync(password, result[0].password))
            return data;
        else
            return status(422);
    })
}

function user_is_complete_status(id) {
    const query_get = {
        text: 'SELECT age, bio, gender, profile_img, orientation from profiles where user_id = $1',
        values: [id]
    }
    return db.get_database(query_get).then((result) => {
        var hasNullValue = Object.values(result[0]).some(function (value) {
            return value === null || value === "";
        });
        hasNullValue ? hasNullValue = 0 : hasNullValue = 1;
        const query_set = {
            text: 'UPDATE users SET complete = $1 WHERE id = $2',
            values: [hasNullValue, id]
        }
        db.set_database(query_set)
    })
}

function user_set_online(isOnline, username) {
    var date = Date.now()

    const query = {
        text: 'UPDATE users SET online = $1, connexion = $2 WHERE username = $3',
        values: [isOnline, date, username]
    }
    db.set_database(query);
}

function user_set_ip(ipData, userId) {
    const query = {
        text: 'UPDATE geoloc SET ip = $1, latitude_ip = $2, longitude_ip = $3, city_ip = $4, country_ip = $5 WHERE user_id = $6',
        values: [ipData.ip, ipData.latitude, ipData.longitude, ipData.city, ipData.country_name, userId]
    }
    db.set_database(query);
}

function user_set_offline(req, res) {

    const user = req.params.user;

    user_set_online('0', user);
    return res.status(200).send({ success: [{ title: 'Logout', detail: 'Success logout' }] });

}

//GET USER PROFILE
function user_get_profile(req, res) {
    const userId = res.locals.user.userId
    const username = req.params.username;
    let userData = [];

    const query = {
        text: `SELECT id, first_name, last_name , username, complete, online, connexion, age, latitude_ip, longitude_ip, latitude_user, longitude_user, city_ip, country_ip, city_user, country_user, gender, bio, orientation, profile_img, total,"${userId}" as match  from users 
        JOIN matchs ON matchs.user_id =users.id
        JOIN profiles ON profiles.user_id = users.id 
        JOIN scores ON scores.user_id = users.id
        JOIN geoloc ON geoloc.user_id = users.id
        WHERE username = $1`,
        values: [username]
    }
    return db.get_database(query)
        .then((result) => {
            userData.push(result[0])
            // console.log(userId)
            return user_get_tags(userData[0].id)
        })
        .then ((result) => {
            userData.push(result)
            return user_get_match(userId, userData[0].id)
        })
        .then((result) => {
            userData[0].mymatch = result[0].mymatch
            return user_get_images(userData[0].id)
        })
        .then((result) => {
            userData.push(result)
            return res.json(userData)
        })
}

function user_get_match(userId, profileId) {
    const query = {
        text: `SELECT "${profileId}" as mymatch FROM matchs WHERE user_id = $1`,
        values: [userId]
    }
    return db.get_database(query)
}

function user_get_tags(userId) {
    let allTags = [];
    return tools.get_tags()
        .then((res) => {
            allTags = res;
            const query = {
                text: `SELECT * FROM tags WHERE user_id = $1`,
                values: [userId]
            }
            return db.get_database(query)
        })
        .then((res) => {
            let tags = [];
            if (allTags) {
                for (i = 0; i < allTags.length; i++) {
                    const tag = allTags[i].value;
                    if (res[0][tag] === 1) {
                        tags.push(tag);
                    }
                }
            }
            return tags;
        })
}

function user_get_images(userId) {

    const query = {
        text: `SELECT * FROM images WHERE user_id = $1`,
        values: [userId]
    }
    return db.get_database(query)
}

module.exports = {
    user_select,
    user_new,
    user_profile_update,
    user_delete_image,
    user_get_profile,
    user_get_tags,
    user_password_check,
    user_set_active,
    user_set_online,
    user_set_ip,
    user_set_offline,
    user_select_all_public_data,

}