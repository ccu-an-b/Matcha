const   pg = require('pg'),
        config = require('../config/dev'),
        setup = require('../config/create_db');

const   pool = new pg.Pool(config.db);

function get_database(query){
    return pool.query(query)
            .then(result => result.rows)
            .catch(e => console.error(e.stack))
}

function set_database(query){
    return pool.query(query)
        .catch(e => console.error(e.stack))
}

function create_database(dbname){
    // pool_create = new pg.Pool(config.db_create)

    pool_create = new pg.Pool({
        user: 'ccu-an-b',
        database: 'postgres',
        password: '',
        port: '5432'
    })

    return pool_create.query(`CREATE DATABASE ${dbname}
        WITH 
        OWNER = "ccu-an-b"
        ENCODING = 'UTF8'
        CONNECTION LIMIT = -1;`)
        .then(() => {
            pool_create.end()
            return setup.create_tables()

        })
        .catch(e => console.error(e.stack))
}

module.exports = {
    get_database,
    set_database,
    create_database
}