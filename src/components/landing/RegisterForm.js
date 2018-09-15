import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { required, isEmail } from 'components/shared/form/validators';


const RegisterForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
             <BwmResError errors={errors} />
            <Field
                name="name"
                type="text"
                label="Name"
                className='form-control'
                component={BwmInput}
                validate={[required]}
            />
             <BwmResError errors={errors} />
            <Field
                name="first_name"
                type="text"
                label="First Name"
                className='form-control'
                component={BwmInput}
                validate={[required]}
            />
             <BwmResError errors={errors} />
            <Field
                name="username"
                type="text"
                label="Email"
                className='form-control'
                component={BwmInput}
                validate={[required]}
            />
            <BwmResError errors={errors} />
            <Field
                name="mail"
                type="text"
                label="Email"
                className='form-control'
                component={BwmInput}
                validate={[required, isEmail]}
            />
            <Field
                name="password"
                type="password"
                label="Password"
                className='form-control'
                component={BwmInput}
                validate={[required]}
            />
            <Field
                name="password_conf"
                type="password"
                label="Password Confirmation"
                className='form-control'
                component={BwmInput}
                validate={[required]}
            />
            <div className="form-submit">
                <button className='btn btn-bwm' type="submit" disabled={!valid || pristine || submitting}>
                    SIGN UP
                </button>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'RegisterForm'
})(RegisterForm)