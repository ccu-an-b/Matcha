import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmTextarea } from 'components/shared/form/BwmTextarea';
import { BwmProfileUpload } from 'components/shared/form/BwmProfileUpload';
import { BwmImageUpload } from 'components/shared/form/BwmImageUpload';
import { BwmSelectCreatable} from 'components/shared/form/BwmSelectCreatable';
import { required} from 'components/shared/form/validators';

var options = [
    { value: 'vanilla', label: 'Bagarreur' },
    { value: 'chocolate', label: 'Sportif' },
    { value: 'strawberry', label: 'Alcoolique' },
    { value: 'salted-caramel', label: 'Raciste' },
];


const ProfileForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid} = props
    return (
        <form className='form' onSubmit={handleSubmit((submitCb))}>
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
                validate={[required]}
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
                name='tags'
                type="select"
                option = {options}
                // validate={[required]}
                component={BwmSelectCreatable} 
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