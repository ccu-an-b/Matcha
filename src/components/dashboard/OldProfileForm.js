import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from 'components/shared/form/BwmInput';
import { BwmTextarea } from 'components/shared/form/BwmTextarea';
import { BwmProfileUpload } from 'components/shared/form/BwmProfileUpload';
import { BwmImageUpload } from 'components/shared/form/BwmImageUpload';
import { BwmSelect } from 'components/shared/form/BwmSelect';
import { BwmSelectCreatable} from 'components/shared/form/BwmSelectCreatable';
import { required} from 'components/shared/form/validators';
import {connect} from 'react-redux';
import { Reducer } from 'redux';

var optionsGender = [
    { value: '0', label: 'Man' },
    { value: '1', label: 'Woman' }
];

var optionsOrientation = [
    { value: '0', label: 'Women and Men'},
    { value: '1', label: 'Men' },
    { value: '2', label: 'Women' }
];

const data = {
    first_name: 'Jane',
    last_name: 'Doe',
    age: '42',
    gender:'0' ,
    orientation: '1',
    location: "Paris",
    bio: 'Born to write amazing Redux code.',
    tags: ['love', 'fashion', 'strawberry']
}

let ProfileForm = props => {
    const { handleSubmit, pristine,  submitting, submitCb, valid, optionsTags, userData} = props

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
                    className='form-control'
                    component={BwmInput}
                    // validate={[required]}
                    data-parse='lowercase'
                /> 
                <Field
                    name="last_name"
                    type="text"
                    label="Last Name"
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
                    validate={[required]}
                    data-parse='lowercase'
                />
                <Field
                    name='gender'
                    type="select"
                    labelUp = "Gender"
                    valueStart = ""
                    defaultValue = {userData[0].gender}
                   // defaultValue = {userData[0].gender}
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
                    valueStart = "0"
                    defaultValue = {userData[0].orientation}
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
                value = ""
                option = {optionsTags}
                defaultValue = {userData[1]}
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
    form: 'profileForm',
    initialValues: data
})(ProfileForm)


// // Decorate with reduxForm(). It will read the initialValues prop provided by connect()
// ProfileForm = reduxForm({
//     form: 'profileForm'
//   })(ProfileForm)
  
//   // You have to connect() to any reducers that you wish to connect to yourself
// ProfileForm= connect(
//     state => ({
//         initialValues: state.user.data// pull initial values from account reducer
//     }),
//   )(ProfileForm)
  
//   export default ProfileForm