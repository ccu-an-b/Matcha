import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmTextarea } from 'components/shared/form/BwmTextarea';
import { BwmFileUpload } from 'components/shared/form/BwmFileUpload';
import { BwmResError } from 'components/shared/form/BwmResError';
import { BwmResSuccess } from 'components/shared/form/BwmResSuccess';
import { required} from 'components/shared/form/validators';

const ProfileForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors, success} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
            {/* <BwmResError errors={errors} />
            <BwmResSuccess success={success} /> */}
            <Field
                name="image"
                label="Profile Picture"
                component={BwmFileUpload}
                
            />
            <Field
                name="age"
                type="number"
                label="Age"
                className='form-control'
                component={BwmInput}
                validate={[required]}
                data-parse='lowercase'
            />
            <Field
                name="bio"
                type="textarea"
                label="Bio"
                className='form-control'
                component={BwmTextarea}
                validate={[required]}
                data-parse='lowercase'
            />
            <div className="form-submit">
                <button className='btn button full' type="submit" disabled={!valid || pristine || submitting}>
                    Save Profile
                </button>
            </div>
        </form>
    )
}

export default reduxForm({
    form: 'profileForm'
})(ProfileForm)