import titleize from 'titleize';

export const toCapitalize = value => value ? titleize(value) : ''

export const formatter = (nb,item ,ago) =>{
    if (item === "month")
        return nb+"mth "+ago
    if (item === "second")
        return "just now"
    return nb+item[0]+" "+ago
}