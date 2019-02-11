import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { BwmResSuccess } from 'components/shared/form/BwmResSuccess';
import { required} from 'components/shared/form/validators';


const LoginForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors, success, activate, handlePassword, changePassword} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
            <div className='form-header'>
                <img alt="logo" src={process.env.PUBLIC_URL + '/matcha_icon.svg'}></img>
                <h2>ready set match</h2>
            </div>
            <BwmResError errors={errors} />
            { activate ? <div className='alert  alert-success-matcha'>Congrats, your account is now activated !</div> : ""}
            { changePassword? <div className='alert  alert-success-matcha'>Your password has been change, you can now log in!</div> : ""}
            
            <BwmResSuccess success={success} />                                  
            <Field
                name="username"
                type="text"
                placeholder="Username"
                className='form-control'
                component={BwmInput}
                validate={[required]}
                data-parse='lowercase'
            />
            <Field
                name="password"
                type="password"
                placeholder="Password"
                className='form-control'
                component={BwmInput}
                validate={[required]}
            />
            <div className="form-submit">
                <button className='btn button full' type="submit" disabled={!valid || pristine || submitting}>
                    LOG IN
                </button>
                {!changePassword &&
                    <a className="a-submit" onClick={() => { handlePassword('password')}}>Forgot Password ?</a>
                }
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'loginForm'
})(LoginForm)