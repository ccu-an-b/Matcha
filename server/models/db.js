const   pg = require('pg'),
        config = require('../config/dev');

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

module.exports = {
    get_database,
    set_database
}