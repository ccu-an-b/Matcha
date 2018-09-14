const minLength = min => value =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined

export const isEmail = value => (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? undefined : 'Incorrect email address') 

export const minLength4 = minLength(4)

export const required = value => (value ? undefined : '* Required')