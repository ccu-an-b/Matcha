const   Tools = require('../models/tools');

exports.getTag = function (req, res){
    Tools.get_tags(function(result) {
        return res.json(result)
    })
}