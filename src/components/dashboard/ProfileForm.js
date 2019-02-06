import React from "react";
import { Field, reduxForm } from "redux-form";
import { BwmInput } from "components/shared/form/BwmInput";
import { BwmTextarea } from "components/shared/form/BwmTextarea";
import { BwmProfileUpload } from "components/shared/form/BwmProfileUpload";
import { BwmImageUpload } from "components/shared/form/BwmImageUpload";
import { BwmSelectLocation } from "components/shared/form/BwmSelectLocation";
import { BwmSelect } from "components/shared/form/BwmSelect";
import { BwmSelectCreatable } from "components/shared/form/BwmSelectCreatable";
import { required } from "components/shared/form/validators";
import { connect } from "react-redux";

var optionsGender = [
  { value: "0", label: "Man" },
  { value: "1", label: "Woman" }
];

var optionsOrientation = [
  { value: "0", label: "Women and Men" },
  { value: "1", label: "Men" },
  { value: "2", label: "Women" }
];

let ProfileForm = props => {
  const {
    handleSubmit,
    pristine,
    submitting,
    submitCb,
    valid,
    optionsTags,
    userData
  } = props;

  if (userData.length < 1) {
    return (
      <div className="dashboard loading">
        <img src={process.env.PUBLIC_URL + "loading.gif"} alt="loading_gif" />
      </div>
    );
  } else {
    return (
      <form className="form" onSubmit={handleSubmit(submitCb)}>
        {userData[0].profile_img && (
          <Field
            name="profile"
            label="Profile Picture"
            defaultValue={userData[0].profile_img}
            component={BwmProfileUpload}
          />
        )}
        {!userData[0].profile_img && (
          <Field
            name="profile"
            label="Profile Picture"
            defaultValue=""
            validate={[required]}
            component={BwmProfileUpload}
          />
        )}
        <div className="profile-name">
          <Field
            name="first_name"
            type="text"
            label="First Name"
            className="form-control"
            component={BwmInput}
            validate={[required]}
            data-parse="lowercase"
          />
          <Field
            name="last_name"
            type="text"
            label="Last Name"
            className="form-control"
            component={BwmInput}
            validate={[required]}
            data-parse="lowercase"
          />
        </div>
        <h3>Personnal Information</h3>
        <div className="perso-information">
          <Field
            name="age"
            type="number"
            labelUp="Age"
            placeholder="99"
            className="form-control"
            component={BwmInput}
            validate={[required]}
            data-parse="lowercase"
          />
          <Field
            name="gender"
            type="select"
            labelUp="Gender"
            defaultValue={userData[0].gender}
            className="my-select no-border"
            options={optionsGender}
            validate={[required]}
            component={BwmSelect}
          />
          <Field
            name="location"
            type="text"
            labelUp="Location"
            placeholder="The Moon"
            className="my-select no-border location"
            component={BwmSelectLocation}
            validate={[required]}
            defaultValue={userData[0].display_adress_user}
            defaultLat={userData[0].latitude_user}
            data-parse="lowercase"
          />
        </div>
        <h3>What are you looking for ?</h3>
        <Field
          name="orientation"
          type="select"
          valueStart="0"
          defaultValue={userData[0].orientation}
          className="my-select no-border"
          options={optionsOrientation}
          validate={[required]}
          component={BwmSelect}
        />
        <h3>Bio</h3>
        <Field
          name="bio"
          type="textarea"
          placeholder="Tell us more about you ..."
          className="form-control"
          component={BwmTextarea}
          validate={[required]}
          data-parse="lowercase"
        />
        <h3>Your interests</h3>
        <Field
          name="tags"
          type="select"
          value=""
          option={optionsTags}
          defaultValue={userData[1]}
          validate={[required]}
          component={BwmSelectCreatable}
        />
        <Field
          name="image"
          label="Pictures"
          defaultValue={userData[2]}
          component={BwmImageUpload}
        />
        <div className="form-submit">
          <button
            className="btn button full"
            type="submit"
            disabled={!valid || pristine || submitting}
          >
            Save Profile
          </button>
        </div>
      </form>
    );
  }
};

ProfileForm = reduxForm({
  form: "profileForm"
})(ProfileForm);

ProfileForm = connect(store => ({
  initialValues: store.user.data[0]
}))(ProfileForm);

export default ProfileForm;
