const pg = require('pg'),
    bcrypt = require('bcrypt'),
    crypto = require('crypto'),
    base64url = require('base64url'),
    config = require('../config/dev'),
    mail = require('./mail');
const pool = new pg.Pool(config.db);

function user_select_all(callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT mail, id, login FROM users', function (err, result) {
            done();
            return callback(err, result);
        });
    });
}

function user_select_one(key, value, callback) {
    pool.connect(function (err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        client.query(`SELECT mail, id, username FROM users WHERE ${key}=$1 `, [value], function (err, result) {
            done();
            return callback(err, result.rows);
        });
    });
}

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
            return res.status(422).send({ errors: [{ title: 'User exists', detail: 'Username already exists' }] })
        else {
            user_select_one('mail', mail, function (err, result) {
                if (result.length != 0) {
                    return res.status(422).send({ errors: [{ title: 'User exists', detail: 'Email already used ' }] })
                }
                else {
                    let hash = bcrypt.hashSync(password, 10);
                    let key = base64url(crypto.randomBytes(40));
                    pool.connect(function (err, client, done) {
                        if (err) {
                            return res.status(422).send({ errors: [{ title: 'Error fetching client from pool', detail: err }] })
                        }
                        // client.query('INSERT INTO users (first_name, last_name, username, mail, password, key) VALUES($1, $2 ,$3, $4, $5, $6) RETURNING id', [name, last_name, username, mail, hash, key]);
                        // done();
                        client.query('INSERT INTO users (first_name, last_name, username, mail, password, key) VALUES($1, $2 ,$3, $4, $5, $6) RETURNING id', [name, last_name, username, mail, hash, key], function(err, result){
                            done();
                            mail.activation_mail();
                            user_new_tables(result.rows[0].id);
                            return res.status(200).send({ success: [{title: 'User created', detail: 'You created a new user'}] });
                        });
                        // client.query('ALTER TABLE matchs ADD COLUMN ' + username + ' integer DEFAULT 0');                     
                        // done();
                        // return res.status(200).send({ success: [{title: 'User created', detail: 'You created a new user'}] });
                    });
                }
            });
        }
    });
    // return mail.activation_mail();
}

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

module.exports = {
    user_select_one,
    user_new,
    user_password_check
}