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