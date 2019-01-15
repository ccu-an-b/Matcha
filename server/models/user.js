const   pg = require('pg'),
        bcrypt = require('bcrypt'),
        crypto = require('crypto'),
        base64url = require('base64url'),
        config = require('../config/dev'),
        Mail = require('./mail');

const   pool = new pg.Pool(config.db);

function user_select_all(callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT mail, id, login FROM users', function (err, result) {
            done();
            return callback(err, result.rows);
        });
    });
}

function user_select_one(key, value, callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(`SELECT mail, id, username,active FROM users WHERE ${key}=$1 `, [value], function (err, result) {
            done();
            return callback(err, result.rows);
        });
    });
}

///////////////////////////
// Public Data to be defined
function user_select_all_public_data(key, value, callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(`SELECT mail, id, username, active FROM users`, function (err, result) {
            done();
            return callback(err, result.rows);
        });
    });
}

// REGISTER FUNCTIONS
function user_new_tables(user_id){
    pool.connect(function (err, client, done) {
        if (err) {
            return res.status(422).send({ errors: [{ title: 'Error fetching client from pool', detail: err }] })
        }
        client.query('ALTER TABLE matchs ADD COLUMN "'+ user_id +'" integer DEFAULT 0');
        client.query('INSERT INTO matchs (user_id) VALUES($1)', [user_id]);
        client.query('INSERT INTO scores (user_id) VALUES($1)', [user_id]);
        client.query('INSERT INTO profiles (user_id) VALUES($1)', [user_id]);
        client.query('INSERT INTO tags (user_id) VALUES($1)', [user_id]);
        done();
    });
}

function user_new(req, res) {

    const { name, last_name, username, mail, password} = req.body;

    user_select_one('username', username, function (err, result) {
        if (result.length != 0)
            return res.status(422).send({ errors: [{ title: 'User exists', detail: 'Username already exists' }] });
        else{
            user_select_one('mail', mail, function (err, result) {
                if (result.length != 0) 
                    return res.status(422).send({ errors: [{ title: 'User exists', detail: 'Email already used ' }] });
                else{
                    let hash = bcrypt.hashSync(password, 10);
                    var key = base64url(crypto.randomBytes(40));
                    pool.connect(function (err, client, done) {
                        if (err) {
                            return res.status(422).send({ errors: [{ title: 'Error fetching client from pool', detail: err }] })
                        }
                        client.query('INSERT INTO users (first_name, last_name, username, mail, password, key) VALUES($1, $2 ,$3, $4, $5, $6) RETURNING id', [name, last_name, username, mail, hash, key], function(err, result){
                            done();
                            Mail.activation_mail(username, mail, key); 
                            user_new_tables(result.rows[0].id);           
                            return res.status(200).send({ success: [{title: 'User created', detail: 'You created a new user'}] });
                        });
                    });
                }
            });
        }

    });
}

function user_set_active(user_id){
    var key = base64url(crypto.randomBytes(40));
    pool.connect(function (err, client, done) {
        if (err) {
            return res.status(422).send({ errors: [{ title: 'Error fetching client from pool', detail: err }] })
        }
    client.query('UPDATE users SET active = 1, key = $1 WHERE id = $2', [key,user_id]);
        done();
    });
}

function user_profile_update(req, res)
{
   const { bio , age, image} = req.body;
   const user = res.locals.user; 

//    let img_path='public/img/'+image;

   pool.connect(function (err, client, done) {
        if (err) {
            return res.status(422).send({errors: [{title: 'DB Error', detail: 'Could not fetch client from pool'}]})
        }
    client.query('UPDATE profiles SET bio = $1, age = $2, profile_img = $3 WHERE user_id = $4', [bio, age, image, user.userId], function (err, result) {
        done();
        return res.status(200).send({ success: [{title: 'Profile update', detail: 'Your profile has been update'}] });
    });
        
});

}

// AUTH FUNCTIONS
function user_password_check(id, password, cb) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT password FROM users WHERE id=$1', [id], function (err, result) {
            done()
            if (bcrypt.compareSync(password, result.rows[0].password))
                return cb(true);
            else
                return cb(false);
        })
    })
}

function user_check_profile_status(id, cb){
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT age, location, bio, gender, profile_img from profiles where user_id = $1', [id], function (err, result) {
            done()
            var hasNullValue = Object.values(result.rows[0]).some(function(value) {
                return value === null;
            });
            return cb(!hasNullValue);
        })
    })
}

function user_set_online(isOnline, userId){
    var date = Date.now()
    pool.connect(function (err, client, done) {   
        client.query('UPDATE users SET online = $1, connexion = $2 WHERE id = $3', [isOnline,date, userId], function () {
            done();
            console.log(Date.now())
        });
    })
}

function user_set_offline(req, res){
    const user = res.locals.user; 
    user_set_online('0', '77');
    return res.status(200).send({ success: [{title: 'Logout', detail: 'Success logout'}] });

}

module.exports = {
    user_select_one,
    user_new,
    user_profile_update,
    user_password_check,
    user_check_profile_status,
    user_set_active,
    user_set_online,
    user_set_offline,
    user_select_all_public_data
}