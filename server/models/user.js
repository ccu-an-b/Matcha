
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
        client.query(`SELECT mail, id, username,active, first_name, last_name, complete FROM users WHERE ${key}=$1 `, [value], function (err, result) {
            done();
            return callback(err, result.rows);
        });
    });
}

// PUBLIC DATA
// TO BE UPDATED WITH: TAGS / USER POSITION
function user_select_all_public_data(callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT username FROM users', function (err, result) {
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

function user_profile_update(req, res, callback)
{
    const { bio , age, profile, gender, orientation, location, tags ,image} = req.body;

    const user = res.locals.user; 

   pool.connect(function (err, client, done) {
        if (err) {
            return res.status(422).send({errors: [{title: 'DB Error', detail: 'Could not fetch client from pool'}]})
        }
    client.query('UPDATE profiles SET bio = $1, age = $2, profile_img = $3, gender = $4, orientation = $5, location = $6 WHERE user_id = $7', [bio, age, profile, gender.value, orientation.value, location, user.userId])
        if(image)
        {
            for ( var i = 0 ; i < image.length; i++)
            {
                client.query('INSERT INTO images (user_id, path) VALUES ($1, $2)', [user.userId, image[i].filename])
            }
        }
        done();
        return callback(res, tags, user.userId)
    });
}

function isInArray(value, array) {
    if( array.indexOf(value) > -1)
        return 1;
    else
        return 0;
}

function user_tags_update(res, tags, userId){

   
    //Separate created tags from existing one
    var newArray =[[],[]]
    for (var i =0; i < tags.length ; i++)
    {
        if (tags[i]['__isNew__'])
        {
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

    pool.connect(function (err, client, done) {
        if (err) {
            return res.status(422).send({errors: [{title: 'DB Error', detail: 'Could not fetch client from pool'}]})
        }
        client.query(`SELECT attname  AS col
            FROM   pg_attribute
            WHERE  attrelid = 'tags'::regclass 
            AND    attnum > 0
            AND    NOT attisdropped
            ORDER  BY attnum;`, function(err, res){
            for (var i = 1 ; i < res.rows.length ; i++)
            {
                const value = isInArray(res.rows[i].col, arrTagsExist)

                client.query(`UPDATE tags SET ${res.rows[i].col} =  $1 WHERE user_id = $2`, [value,userId])
            } 
        });
        for (var i = 0; i <arrTagsNew.length ; i++){
           client.query(`ALTER TABLE tags ADD COLUMN ${arrTagsNew[i]} integer DEFAULT 0`)
           client.query(`UPDATE tags SET ${arrTagsNew[i]} = 1 WHERE user_id = $1`, [userId]) 
        }
        done();
        return res.status(200).send({ success: [{title: 'Profile update', detail: 'Your profile has been update'}] });
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
        client.query('SELECT age, location, bio, gender, profile_img, orientation from profiles where user_id = $1', [id], function (err, result) {
            done()
            var hasNullValue = Object.values(result.rows[0]).some(function(value) {
                return value === null || value === "";
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

function user_set_ip(ipData, userId){
    pool.connect(function (err, client, done) {   
        client.query('UPDATE users SET ip = $1, geoloc = $2 WHERE id = $3', [ipData.ip, ipData.loc, userId], function () {
            done();
            console.log('User info : ', ipData);
        });
    })
}

function user_set_offline(req, res){
    const user = res.locals.user; 
    user_set_online('0', '77');
    return res.status(200).send({ success: [{title: 'Logout', detail: 'Success logout'}] });

}

function test_user(req, res){
    console.log(req.body)
}

//GET USER PROFILE
function user_get_profile(username, cb){
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(`SELECT id, first_name, last_name , age, location, gender, bio, orientation, profile_img from users 
        JOIN profiles ON profiles.user_id = users.id 
        WHERE username = $1`, [username], function (err, result) {
            done();
            return cb(err, result.rows);
        });
    })
}

function get_tags(userdata, cb){
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(`SELECT attname  AS col
        FROM   pg_attribute
        WHERE  attrelid = 'tags'::regclass 
        AND    attnum > 0
        AND    NOT attisdropped
        ORDER  BY attnum;`, function(err, res){
            done();
            var allTags = []
            for (var i = 0 ; i < res.rows.length ; i++)
            {
                allTags.push(res.rows[i].col)
            } 
            var newRes = userdata
            newRes.push(allTags)
            return cb(err, newRes)
        });
    })
}

function user_get_tags(userdata, cb){
    const userId = userdata[0].id

    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    
        client.query(`SELECT * FROM tags WHERE user_id = $1`, [userId], function (err, result) {
            done();
            var tags = []
            const allTags = userdata[1]
            {
                for (i= 0; i <allTags.length; i ++)
                {
                    const tag = allTags[i]
                    if (result.rows[0][tag] === 1)
                    {
                        tags.push(tag)
                    }
                }
            }
            var newRes = userdata
            newRes.splice(newRes.indexOf(1), 1)
            newRes.push(tags)
            return cb(err, newRes);
        });
    })
}

function user_get_images(userdata, cb){
    const userId = userdata[0].id

    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
    
        client.query(`SELECT * FROM images WHERE user_id = $1`, [userId], function (err, result) {
            done();
            var newRes = userdata
            newRes.push(result.rows)
            return cb(err, newRes)
        });
    });
}

module.exports = {
    user_select_one,
    user_new,
    user_profile_update,
    user_get_profile,
    user_get_tags,
    user_get_images,
    get_tags,
    user_tags_update,
    user_tags_update,
    user_password_check,
    user_check_profile_status,
    user_set_active,
    user_set_online,
    user_set_ip,
    user_set_offline,
    user_select_all_public_data,
    test_user
}