import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmTextarea } from 'components/shared/form/BwmTextarea';
import { BwmProfileUpload } from 'components/shared/form/BwmProfileUpload';
import { BwmImageUpload } from 'components/shared/form/BwmImageUpload';
import { BwmSelectTags } from 'components/shared/form/BwmSelectTags';
import { BwmResError } from 'components/shared/form/BwmResError';
import { BwmResSuccess } from 'components/shared/form/BwmResSuccess';
import { required} from 'components/shared/form/validators';

var option = [
        { label: 'Basic customer support', value: 'basic', color: '#E31864', id: 1 },
        { label: 'Premium customer support', value: 'premium', color: '#6216A3', id: 2 },
        { label: 'Pro customer support', value: 'pro', id: 3}
    ];
const ProfileForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, errors, success} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
            {/* <BwmResError errors={errors} />
            <BwmResSuccess success={success} /> */}
            <Field
                name="profile"
                label="Profile Picture"
                component={BwmProfileUpload}
                // validate={[required]}
            />
            <Field
                name="age"
                type="number"
                label="Age"
                className='form-control'
                component={BwmInput}
                // validate={[required]}
                data-parse='lowercase'
            />
            <Field
                name="bio"
                type="textarea"
                label="Bio"
                className='form-control'
                component={BwmTextarea}
                // validate={[required]}
                data-parse='lowercase'
            />
           <Field
                  component={BwmSelectTags}
                  name='client'
                  options={option}
                  
                  />
             <Field
                name="image"
                label="Pictures"
                component={BwmImageUpload}
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