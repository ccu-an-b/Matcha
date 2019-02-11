import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmResError } from 'components/shared/form/BwmResError';
import { required,minLength8, checkNumber, checkUpper, checkLetter } from 'components/shared/form/validators';


const ChangePasswordForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
            <div className='form-header'>
                <img alt="logo" src={process.env.PUBLIC_URL + '/matcha_icon.svg'}></img>
                <h2>Change password</h2>
            </div>
            <BwmResError errors={errors} />                                 
            <Field
                name="password"
                type="password"
                placeholder="New Password"
                className='form-control'
                component={BwmInput}
                validate={[required, minLength8, checkNumber, checkUpper, checkLetter ]}
            />
            <div className="form-submit">
                <button className='btn button full' type="submit" disabled={!valid || pristine || submitting}>
                    SAVE CHANGE
                </button>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'changePasswordForm'
})(ChangePasswordForm)