import titleize from 'titleize';

export const rentalType = isShared => isShared ? 'shared' : 'entire'

export const toCapitalize = value => value ? titleize(value) : ''