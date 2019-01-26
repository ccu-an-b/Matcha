const   db = require('./db');

function get_tags(req, res){

    const query = {
        text: `SELECT attname  AS col
        FROM   pg_attribute
        WHERE  attrelid = 'tags'::regclass 
        AND    attnum > 0
        AND    NOT attisdropped
        ORDER  BY attnum;`,
    };

    return db.get_database(query)
        .then((response) => { 
            var allTags = []
            for (var i = 1 ; i < response.length ; i++)
            {
                var oneTag = { value: response[i].col, label: response[i].col }
                allTags.push(oneTag)
            } 
            return res.json(allTags)
        })
        .catch((e) => console.log(e));
}
module.exports = {
    get_tags
}