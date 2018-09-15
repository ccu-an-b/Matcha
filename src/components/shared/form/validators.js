const minLength = min => value =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined

export const isEmail = value => (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : 'Incorrect email address') 

export const minLength8 = minLength(8)

export const required = value => (value ? undefined : '* Required')

export const checkNumber = value => (/\d/i.test(value) ? undefined : 'Password must contain at least one number')

export const checkUpper = value => (/[A-Z]/g.test(value) ? undefined : 'Password must contain at least one uppercase')