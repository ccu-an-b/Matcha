import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { required, isEmail, minLength8,minLength5, checkNumber, checkUpper, checkLetter, checkSpecialChar } from 'components/shared/form/validators';


const RegisterForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
            <div className='form-header'>
                <img alt="logo" src={process.env.PUBLIC_URL + '/matcha_icon.svg'}></img>
                <h2>Get started</h2>
            </div>
            <BwmResError errors={errors}/>
            <Field
                name="name"
                type="text"
                placeholder="Name"
                className='form-control'
                component={BwmInput}
                validate={[required]}
                data-parse='lowercase'
            />
            <Field
                name="last_name"
                type="text"
                placeholder="Last Name"
                className='form-control'
                component={BwmInput}
                validate={[required]}
                data-parse='lowercase'
            />
            <Field
                name="mail"
                type="text"
                placeholder="Email"
                className='form-control'
                component={BwmInput}
                validate={[required, isEmail]}
                data-parse='lowercase'
            />
            <Field
                name="username"
                type="text"
                placeholder="Username"
                className='form-control'
                component={BwmInput}
                validate={[required, checkSpecialChar, minLength5]}
                data-parse='lowercase'
            />
            <Field
                name="password"
                type="password"
                placeholder="Password"
                className='form-control'
                component={BwmInput}
                validate={[required, minLength8, checkNumber,checkLetter, checkUpper]}
            />
            {/* <Field
                name="password_conf"
                type="password"
                label="Password Confirmation"
                className='form-control'
                component={BwmInput}
                validate={[required]}
            /> */}
            <div className="form-submit">
                <button className='btn button full' type="submit" disabled={!valid || pristine || submitting}>
                    SIGN UP
                </button>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'RegisterForm'
})(RegisterForm)