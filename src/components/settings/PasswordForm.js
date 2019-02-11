import React from "react";
import { Field, reduxForm} from "redux-form";
import { BwmInput} from "components/shared/form/BwmInput";
import { BwmResError } from 'components/shared/form/BwmResError';
import { required ,minLength8, checkNumber, checkUpper, checkLetter } from "components/shared/form/validators";

let PasswordForm = props => {
  const {
    handleSubmit,
    pristine,
    submitting,
    submitCb,
    valid,
    errors
  } = props;

    return (
    <form onSubmit={handleSubmit(submitCb)}>
        <h1>Change password</h1>
        <BwmResError errors={errors} />
        <Field
            name="old_password"
            type="password"
            label="old password"
            component={BwmInput}
            validate={[required]}
            data-parse="lowercase"
        />
        <Field
            name="new_password"
            type="password"
            label="new password"
            component={BwmInput}
            validate={[required, minLength8, checkNumber,checkLetter, checkUpper]}
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

PasswordForm= reduxForm({
  form: "passwordForm"
})(PasswordForm);

export default PasswordForm;