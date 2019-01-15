const pg = require('pg');

const config = require('../server/config/dev');

const pool = new pg.Pool(config.db);


pool.query(" \
DROP TABLE IF EXISTS profiles; \
DROP TABLE IF EXISTS users; \
DROP TABLE IF EXISTS matchs; \
DROP TABLE IF EXISTS scores; \
DROP TABLE IF EXISTS tags;\
DROP TABLE IF EXISTS images;\
DROP TABLE IF EXISTS messages;\
DROP TABLE IF EXISTS notifications;\
DROP TABLE IF EXISTS notifications_messages;\
DROP SEQUENCE IF EXISTS users_id_seq; \
DROP SEQUENCE IF EXISTS id_notif_seq; \
DROP SEQUENCE IF EXISTS id_notif_msg_seq; \
DROP SEQUENCE IF EXISTS id_images_seq; \
DROP SEQUENCE IF EXISTS id_msg_seq; \
", (err, res) => {
        console.log(err, res);
        pool.end();
    })