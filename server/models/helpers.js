function isInArray(value, array) {
    if( array.indexOf(value) > -1)
        return 1;
    else
        return 0;
}

module.exports = {
    isInArray,
}