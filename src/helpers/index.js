import titleize from 'titleize';

export const toCapitalize = value => value ? titleize(value) : ''

export const formatter = (nb,item ,ago) =>{
    if (item === "month")
        return nb+"mth "+ago
    if (item === "second")
        return "just now"
    return nb+item[0]+" "+ago
}

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