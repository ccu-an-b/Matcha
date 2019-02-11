import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { BwmResSuccess } from 'components/shared/form/BwmResSuccess';
import { required, isEmail} from 'components/shared/form/validators';


const PasswordForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors, success} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
            <div className='form-header'>
                <img alt="logo" src={process.env.PUBLIC_URL + '/matcha_icon.svg'}></img>
                <h2>You forgot your password ?</h2>
            </div>
            <BwmResError errors={errors} />      
            <BwmResSuccess success={success} />                         
            <Field
                name="mail"
                type="text"
                placeholder="Enter your mail"
                className='form-control'
                component={BwmInput}
                validate={[required, isEmail]}
                data-parse='lowercase'
            />
            <div className="form-submit">
                <button className='btn button full' type="submit" disabled={!valid || pristine || submitting}>
                    Retrieve your password
                </button>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'passwordForm'
})(PasswordForm)