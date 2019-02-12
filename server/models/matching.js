const   db = require('./db'),
        UserMod = require('./user');

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

function distanceInKm(lat1, lon1, lat2, lon2) 
{
    var earthRadiusKm = 6371;
  
    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);
  
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusKm * c 
}

function intersect (a, b){
    return [...new Set(a)].filter(x => new Set(b).has(x));
}

function match_distance(userId, profile){
    const query = {
        text:`SELECT latitude_ip, longitude_ip, latitude_user, longitude_user FROM geoloc WHERE user_id = $1`,
        values: [userId]
    }

    return db.get_database(query)
        .then((result) => {
            return distanceInKm(result[0].latitude_user, result[0].longitude_user, profile.latitude_user, profile.longitude_user)
        })
}

function match_tags(userId, profile){
    return UserMod.user_get_tags(userId)
        .then((res) => {
            return intersect(res, profile.tags)
        })
}

function sort_by_tags(profiles){
    const res =  profiles.sort(function(a,b){
        return a.tagsCount - b.tagsCount;
    })
    return res.map((profile, index) =>{
        profile.sort +=(index*2);
        return profile
    })

}

function sort_by_distance(profiles){
    const res =  profiles.sort(function(a,b){
        return b.distance - a.distance;
    })
    return res.map((profile, index) =>{
        profile.sort +=(index*3);
        return profile
    })

}

function sort_by_score(profiles){
    const res =  profiles.sort(function(a,b){
        return a.score - b.score;
    })
    return res.map((profile, index) =>{
        profile.sort +=index;
        return profile
    })
}
function sort_final(profiles){
    const res =  profiles.sort(function(a,b){
        return b.sort - a.sort;
    })
    return res
}
module.exports = {
    match_distance,
    match_tags,
    sort_by_distance,
    sort_by_tags,
    sort_by_score,
    sort_final
}