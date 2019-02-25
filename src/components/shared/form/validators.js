const minLength = min => value =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined

export const isEmail = value => (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : 'Incorrect email address') 

export const minLength8 = minLength(8)

export const minLength5 = minLength(5)

export const required = value => (value ? undefined : '* Required')

export const checkNumber = value => (/\d/i.test(value) ? undefined : 'Must contain at least one number')

export const checkUpper = value => (/[A-Z]/g.test(value) ? undefined : 'Must contain at least one uppercase')

export const checkLetter = value => (/[a-z]/g.test(value) ? undefined : 'Must contain at least one letter')

export const checkSpecialChar = value => (/[&/\\#\s,+()$~%'":*?<>{}]/g.test(value) === false ? undefined : `Cant't contain special charcters`)

export const notMinor = value => (value >= 18 ? undefined : '* Must be over 18')