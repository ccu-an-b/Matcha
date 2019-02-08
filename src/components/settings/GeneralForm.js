import React from "react";
import { Field, reduxForm } from "redux-form";
import { BwmInput } from "components/shared/form/BwmInput";
import { required } from "components/shared/form/validators";
import { connect } from "react-redux";


let GeneralForm = props => {
  const {
    handleSubmit,
    pristine,
    submitting,
    submitCb,
    valid
  } = props;

    return (
      <form onSubmit={handleSubmit(submitCb)}>
       <h1>General account Settings</h1>
       <h2>If you change your username you'll be logged out.</h2>
        <Field
            name="username"
            type="text"
            label="username"
            component={BwmInput}
            validate={[required]}
            data-parse="lowercase"
        />
        <Field
            name="mail"
            type="text"
            label="mail"
            component={BwmInput}
            validate={[required]}
            data-parse="lowercase"
        />
       <div className="form-submit">
          <button
            className="button full"
            type="submit"
            disabled={!valid || pristine || submitting}
          >
            Save Changes
          </button>
        </div>
      </form>
    );
};

GeneralForm= reduxForm({
  form: "generalForm"
})(GeneralForm);

GeneralForm = connect(store => ({
  initialValues: store.user.data[0]
}))(GeneralForm);

export default GeneralForm;
