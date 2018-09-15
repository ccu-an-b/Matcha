import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { BwmResSuccess } from 'components/shared/form/BwmResSuccess';
import { required, isEmail } from 'components/shared/form/validators';


const LoginForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors, success} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
            <BwmResError errors={errors} />
            <BwmResSuccess success={success} />                                  
            <Field
                name="mail"
                type="text"
                label="Email"
                className='form-control'
                component={BwmInput}
                validate={[required,isEmail]}
            />
            <Field
                name="password"
                type="password"
                label="Password"
                className='form-control'
                component={BwmInput}
                validate={[required]}
            />
            <div className="form-submit">
                <button className='btn' type="submit" disabled={!valid || pristine || submitting}>
                    LOG IN
                </button>
                <a className="a-submit">Forgot Password ?</a>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'loginForm'
})(LoginForm)