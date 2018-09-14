import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { required, isEmail } from 'components/shared/form/validators';


const LoginForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors} = props
    return (
        <form onSubmit={handleSubmit((submitCb))}>
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
            <button className='btn btn-bwm' type="submit" disabled={!valid || pristine || submitting}>
                Log In
            </button>
        </form>
    )
}

export default reduxForm({
    form: 'loginForm'
})(LoginForm)