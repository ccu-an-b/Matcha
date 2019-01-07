import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { BwmResSuccess } from 'components/shared/form/BwmResSuccess';
import { required} from 'components/shared/form/validators';


const LoginForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors, success} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
            <div className='form-header'>
                <img alt="logo" src={process.env.PUBLIC_URL + '/matcha_icon.svg'}></img>
                <h2>ready set match</h2>
            </div>
            <BwmResError errors={errors} />
            <BwmResSuccess success={success} />                                  
            <Field
                name="username"
                type="text"
                label="Username"
                className='form-control'
                component={BwmInput}
                validate={[required]}
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
                <button className='btn button full' type="submit" disabled={!valid || pristine || submitting}>
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