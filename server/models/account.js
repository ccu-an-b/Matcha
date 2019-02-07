const   db = require('./db'),
        bcrypt = require('bcrypt');

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
        .then(() => res.status(200).send({ success: [{ title: 'Update', detail: 'Your password has been updated' }] }))
        .catch((err) => res.status(422).send(err))
}
module.exports = {
    user_get_block,
    user_update_password
}
