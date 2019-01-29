const   db = require('./db'),
        UserMod = require('./user')

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

function set_profile_view(req, res){
        const userId = res.locals.user.userId;
        const username = req.params.username;

        return UserMod.user_select('username', username).then((result)=>{
                const query = [{
                        text:`INSERT INTO notifications (user_id, user_from_id, type, date) VALUES ($1, $2, $3, $4)`,
                        values: [result[0].id, userId, '1', Date.now()]
                },{
                        text:`UPDATE scores SET nb_visit = nb_visit + 1, total = total + 1 WHERE user_id = $1`,
                        values: [result[0].id]
                }]
                for (var i = 0 ; i < query.length ; i++)
                        db.set_database(query[i]);
                return res.status(200).send({ success: [{title: 'Profile viewed', detail: ''}] });
        })

}
module.exports = {
        get_suggested_profiles,
        set_profile_view
}