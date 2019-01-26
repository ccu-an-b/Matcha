const   db = require('./db')

function get_suggested_profiles(req, res){
        const userId = res.locals.user.userId;
        const query = {
                text: 'SELECT first_name, last_name , username, online, connexion,age, location, profile_img, total from users JOIN profiles ON profiles.user_id = users.id  JOIN scores ON scores.user_id = users.id  WHERE users.complete = 1 AND id != $1',
                values: [userId],
        };

        return db.get_database(query)
                .then((response) => { return res.json(response)})
                .catch((e) => console.log(e));
}

module.exports = {
        get_suggested_profiles
}