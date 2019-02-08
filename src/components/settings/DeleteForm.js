import React from "react";
import { Field, reduxForm } from "redux-form";
import { BwmInput } from "components/shared/form/BwmInput";
import { required } from "components/shared/form/validators";

let DeleteForm = props => {
  const {
    handleSubmit,
    pristine,
    submitting,
    submitCb,
    valid
  } = props;

    return (
    <form onSubmit={handleSubmit(submitCb)}>
        <h1>Delete your profile</h1>
        <h2>Are you sure you want to delete your profile ?<br/> All your matchs will be lost...</h2>
        <Field
            name="password"
            type="password"
            label="password"
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
            Confirm
          </button>
        </div>
      </form>
    );
};

DeleteForm= reduxForm({
  form: "deleteForm"
})(DeleteForm);

export default DeleteForm;