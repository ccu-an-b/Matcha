import React from 'react';
import { Field, reduxForm } from "redux-form";
import { BwmSelectLocation } from "components/shared/form/BwmSelectLocation";
import { BwmIntervalSlider } from "components/shared/form/BwmIntervalSlider";
import { BwmMultiSelect } from "components/shared/form/BwmMultiSelect";

let FiltersForm = props => { 

    const {tags,defaultLat, defaultLocation,defaultAge,defaultScore, defaultTags} = props;

        return (
            <div className='filters-container active' >
                <h1 className='trigger-filters active'>Filter </h1>

                <div className='filters active'>
                <form className="form" >
                    <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseTags" aria-expanded="false" aria-controls="multiCollapseTags">tags</h2>
                    <div className="col">
                        <div className="collapse multi-collapse show" id="multiCollapseTags">
                            <div className="my-card card card-body">
                                <Field 
                                    name="tags"
                                    className="my-select no-border multi"
                                    options={tags.data}
                                    component={BwmMultiSelect }
                                    defaultValue={defaultTags}
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className="collapsed" data-toggle="collapse" href="#multiCollapseAge" role="button" aria-expanded="false" aria-controls="multiCollapseAge">age</h2>
                    <div className="col">
                        <div className="collapse multi-collapse show" id="multiCollapseAge">
                            <div className="my-card card card-body">
                                <Field 
                                    name="age"
                                    min={18}
                                    max={120}
                                    component={BwmIntervalSlider}
                                    defaultValue={defaultAge}
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseScore" aria-expanded="false" aria-controls="multiCollapseScore">score</h2>
                    <div className="col">
                        <div className="collapse multi-collapse show" id="multiCollapseScore">
                            <div className="my-card card card-body">
                                <Field BwmIntervalSlider 
                                    name="score"
                                    min={0}
                                    max={500}
                                    component={BwmIntervalSlider}
                                    defaultValue={defaultScore}
                                />
                            </div>
                        </div>
                    </div>
                    <h2 className="collapsed" data-toggle="collapse" data-target="#multiCollapseLocation" aria-expanded="false" aria-controls="multiCollapseLocation">location</h2>
                    <div className="col">
                        <div className="collapse multi-collapse show" id="multiCollapseLocation">
                            <div className="my-card card card-body">
                            <Field
                                name="location"
                                type="text"
                                placeholder="Where to ..."
                                className="my-select no-border location"
                                component={BwmSelectLocation}
                                defaultValue={defaultLocation}
                                defaultLat={defaultLat}
                            />
                            </div>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        )     
    }
export default reduxForm({
    form: "filterSearch"
  })(FiltersForm);