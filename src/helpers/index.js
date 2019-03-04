import titleize from 'titleize';

export const toCapitalize = value => value ? titleize(value) : ''

export const formatter = (nb,item ,ago) =>{
    if (item === "month")
        return nb+"mth "+ago
    if (item === "second")
        return "just now"
    return nb+item[0]+" "+ago
}

export const formatterChat = (nb,item ,ago) =>{
    if (item === "month")
        return nb+"mth"
    if (item === "second")
        return "just now"
    return nb+item[0]
}

export const string_to_array = (str) => {
    if (str)
        return str.trim().split(" ");
    return undefined;
};

export const imgPath = (img) => {
    if (img.includes("http"))
        return img;
    else    
        return process.env.PUBLIC_URL+'/img/'+img;
}

export const intersect =(a, b) => {
    return [...new Set(a)].filter(x => new Set(b).has(x));
}

export const contains = (a, b) => {
    const res = intersect(a,b);

    if (res.length === b.length)
        return true
    else
        return false
}

export const getValues = (array) => {
    return array.map((row) => row.value)
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

export const distanceInKm = (lat1, lon1, lat2, lon2) => {
    var earthRadiusKm = 6371;
  
    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);
  
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    if (earthRadiusKm * c <= 20)
        return true;
    else 
        return false
}

export const getSearchUrl = (values) => {
    const {age, location, score, tags, search} = values
    let locJson = "";
    let url = "/search?"
    let before = false

    if (age || location || score || tags || search)
    {
        if (search)
        {
            url += `search=${escape(search)}`;
            before = true;
        }
        if (age)
        {
            before ? url += `&age=${age[0]}+${age[1]}` : url += `age=${age[0]}+${age[1]}` ;
            before = true;
        }   
        if (score)
        {
            before ? url += `&score=${score[0]}+${score[1]}` : url += `score=${score[0]}+${score[1]}` ;
            before = true;
        }
        if (tags && tags.length)
        {
            before ? url += `&tags=${escape(tags[0].value)}` : url += `tags=${escape(tags[0].value)}` ;
            for (var i = 1; i < tags.length ; i++ )
                url +=`+${escape(tags[i].value)}`;
            before = true;
        }
        if(location)
        {
            locJson = JSON.parse(location.value);
            before ? url += `&lat=${locJson.lat}&location=${locJson.display_name}` : url += `lat=${locJson.lat}&location=${locJson.display_name}` ;
        }
        return url
    }  
}


export const sort_by_tags = (profiles, order) =>{
    const res =  profiles.sort(function(a,b){
        if (order === 'desc')
            return a.tagsCount - b.tagsCount;
        else
            return b.tagsCount - a.tagsCount;
    })
    return res.map((profile, index) =>{
        profile.sort +=(index*4);
        return profile
    })
}

export const sort_by_age = (profiles, order) =>{
    const res =  profiles.sort(function(a,b){
        if (order === 'desc')
            return a.age - b.age;
        else
            return b.age - a.age;
    })
    return res.map((profile, index) =>{
        profile.sort +=(index*4);
        return profile
    })
}

export const sort_by_distance = (profiles, order) => {
    const res =  profiles.sort(function(a,b){
        if (order === 'desc')
            return a.distance - b.distance;
        else
            return b.distance - a.distance;
    })
    return res.map((profile, index) =>{
        profile.sort +=(index*40);
        return profile
    })

}

export const sort_by_score = (profiles, order) =>{
    const res =  profiles.sort(function(a,b){
        if (order === 'desc')
            return a.total - b.total;
        else
            return b.total - a.total;
    })
    return res.map((profile, index) =>{
        profile.sort +=index;
        return profile
    })
}

export const sort_by_suggestion = (profiles, order) =>{
    const res =  profiles.sort(function(a,b){
        if (order === 'desc')
            return a.sort - b.sort;
        else
            return b.sort - a.sort;
    })
    return res.map((profile, index) =>{
        profile.sort +=index;
        return profile
    })
}

export const sort_by_username = (profiles, order) =>{
    const res =  profiles.sort(function(a,b){
        if (order === 'asc')
        {
            if(a.username < b.username) { return -1 }
            if(a.username > b.username) { return 1 }
            return 0;
        }
        else
        {
            if(a.username > b.username) { return -1 }
            if(a.username < b.username) { return 1 }
            return 0;
        }
    })
    return res.map((profile, index) =>{
        profile.sort +=index;
        return profile
    })
}

export const sort_profiles = (profiles, category, order) =>{
    let result = [];

    switch (category) {
        case "age":
            result = sort_by_age(profiles, order)
            break;
        case "score":
            result = sort_by_score(profiles, order)
            break;
        case "tags":
            result = sort_by_tags(profiles, order)
            break;
        case "distance":
            result = sort_by_distance(profiles, order)
            break;
        case "username":
            result = sort_by_username(profiles, order)
            break;
        case "sort":
            result = sort_by_suggestion(profiles, order)
            break;
        default:
            result = sort_by_username(profiles, order)
    }
    return result;
}

export const imagesLoaded = (parentNode) => {
    const imgElements = [...parentNode.querySelectorAll("img")];
    for (let i = 0; i < imgElements.length; i += 1) {
      const img = imgElements[i];
      if (!img.complete) {
        return false;
      }
    }
    return true;
}
