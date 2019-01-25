const   pg = require('pg'),
        config = require('../config/dev');

const   pool = new pg.Pool(config.db);

function get_suggested_profiles(req, res){
        const userId = req.params.user;
        //const userId = res.locals.user.userId;

        pool.connect(function (err, client, done) {
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                client.query(`SELECT first_name, last_name , username, online, connexion,age, location, profile_img, total from users JOIN profiles ON profiles.user_id = users.id  JOIN scores ON scores.user_id = users.id  WHERE users.complete = 1 AND id != $1 `, [userId], function (err, result) {
                    done();
                    return res.json(result.rows);
                });
        })

}

module.exports = {
        get_suggested_profiles
}