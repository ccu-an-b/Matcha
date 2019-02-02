import React from "react";
import { Field, reduxForm } from "redux-form";
import { BwmSelectLocation } from "components/shared/form/BwmSelectLocation";
import { BwmIntervalSlider } from "components/shared/form/BwmIntervalSlider";
import { BwmMultiSelect } from "components/shared/form/BwmMultiSelect";

let FiltersForm = props => {
  
    const {optionsTags} = props;

      return (
        <form className="form" >
            <div className="row">
                <div className="col">
                    <div className="collapse multi-collapse" id="multiCollapseAge">
                        <div className="my-card card card-body">
                            <Field 
                                name="age"
                                min={18}
                                max={120}
                                component={BwmIntervalSlider}
                                value="ok"
                            />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="collapse multi-collapse" id="multiCollapseScore">
                        <div className="my-card card card-body">
                            <Field BwmIntervalSlider 
                                name="score"
                                min={0}
                                max={120}
                                component={BwmIntervalSlider}
                            />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="collapse multi-collapse" id="multiCollapseLocation">
                        <div className="my-card card card-body">
                        <Field
                            name="location"
                            type="text"
                            placeholder="Where to ..."
                            className="my-select no-border location"
                            component={BwmSelectLocation}
                        />
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="collapse multi-collapse" id="multiCollapseTags">
                        <div className="my-card card card-body">
                            <Field 
                                name="tags"
                                className="my-select no-border multi"
                                options={optionsTags}
                                component={BwmMultiSelect }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
      )
  };

export default reduxForm({
    form: "filtersForm"
  })(FiltersForm);



