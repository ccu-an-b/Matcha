import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmTextarea } from 'components/shared/form/BwmTextarea';
import { BwmProfileUpload } from 'components/shared/form/BwmProfileUpload';
import { BwmImageUpload } from 'components/shared/form/BwmImageUpload';
import { BwmSelect } from 'components/shared/form/BwmSelect';
import { BwmSelectCreatable} from 'components/shared/form/BwmSelectCreatable';
import { required} from 'components/shared/form/validators';

var optionsTags = [
    { value: 'vanilla', label: 'Bagarreur' },
    { value: 'chocolate', label: 'Sportif' },
    { value: 'strawberry', label: 'Alcoolique' },
    { value: 'salted-caramel', label: 'Raciste' },
];

var optionsGender = [
    { value: '1', label: 'Woman' },
    { value: '0', label: 'Man' },
];

var optionsOrientation = [
    { value: '3', label: 'Women' },
    { value: '1', label: 'Men' },
    { value: '0', label: 'Women and Men'}
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
            <div className="profile-name">
                <Field
                    name="first_name"
                    type="text"
                    label="First Name"
                    placeholder="Chloe"
                    value="Chloe"
                    className='form-control'
                    component={BwmInput}
                    // validate={[required]}
                    data-parse='lowercase'
                /> 
                <Field
                    name="last_name"
                    type="text"
                    label="Last Name"
                    placeholder="Cu an binh"
                    value="Cu an binh"
                    className='form-control'
                    component={BwmInput}
                    // validate={[required]}
                    data-parse='lowercase'
                /> 
            </div>
            <h3>Personnal Information</h3>
            <div className="perso-information">
                <Field
                    name="age"
                    type="number"
                    labelUp="Age"
                    placeholder="99"
                    className='form-control'
                    component={BwmInput}
                    // validate={[required]}
                    data-parse='lowercase'
                />
                <Field
                    name='gender'
                    type="select"
                    labelUp = "Gender"
                    className = "my-select no-border" 
                    options = {optionsGender}
                    // validate={[required]}
                    component={BwmSelect} 
                />
                <Field
                    name="location"
                    type="text"
                    labelUp="Location"
                    placeholder="The Moon"
                    className='form-control'
                    component={BwmInput}
                    // validate={[required]}
                    data-parse='lowercase'
                />
            </div>
            <h3>What are you looking for ?</h3>
            <Field
                    name='orientation'
                    type="select"
                    className = "my-select no-border" 
                    options = {optionsOrientation}
                    // validate={[required]}
                    component={BwmSelect} 
            />
            <h3>Bio</h3>
            <Field
                name="bio"
                type="textarea"
                placeholder="Tell us more about you ..."
                className='form-control'
                component={BwmTextarea}
                // validate={[required]}
                data-parse='lowercase'
            />
            <h3>Your interests</h3>
           <Field
                name='tags'
                type="select"
                option = {optionsTags}
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