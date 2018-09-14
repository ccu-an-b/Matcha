const pg = require('pg'),
    bcrypt = require('bcrypt'),
    config = require('../config/dev');

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
        client.query(`SELECT mail, id, login FROM users WHERE ${key}=$1 `, [value], function (err, result) {
            done();
            return callback(err, result.rows);
        });
    });
}

function user_new(login, mail, password, cb) {

    user_select_one('login', login, function (err, result) {
        if (result.length != 0)
            return cb(false);
        else {
            user_select_one('mail', mail, function (err, result) {
                if (result.length != 0) {
                    return cb(false);
                }
                else {
                    let hash = bcrypt.hashSync(password, 10);
                    pool.connect(function (err, client, done) {
                        if (err) {
                            return console.error('error fetching client from pool', err);
                        }
                        client.query('INSERT INTO users (login, mail, password) VALUES($1, $2 ,$3)', [login, mail, hash]);
                        done();
                        return cb(true);
                    });
                }
            });
        }
    });
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