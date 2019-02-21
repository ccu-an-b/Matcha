import React from 'react';
import { Field, reduxForm } from "redux-form";
import { BwmSelect } from "components/shared/form/BwmSelect";

const sortOptions = [
    { value: "age", label: "Sort by age" },
    { value: "score", label: "Sort by score" },
    { value: "distance", label: "Sort by distance" },
    { value: "tags", label: "Sort by tags" },
];

const orderOptions = [
    { value: "desc", label: "order increasing" },
    { value: "asc", label: "order decreasing" },
];

let SortForm = props => { 

    return (
        <div className='filters-container active' >
            <h1 className='trigger-filters active'>Sort by</h1>

            <div className='filters active sort'>
            <form className="form" >
                <div className="col">
                    <div className="collapse multi-collapse show" id="multiCollapseTags">
                        <div className="my-card card card-body">
                            <Field 
                                name="sort"
                                className="my-select no-border multi"
                                options={sortOptions}
                                component={BwmSelect}
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="col">
                    <div className="collapse multi-collapse show" id="multiCollapseAge">
                        <div className="my-card card card-body">
                        <Field 
                                name="order"
                                className="my-select no-border multi"
                                options={orderOptions}
                                component={BwmSelect}
                            />
                        </div>
                    </div>
                </div> */}
                </form>
            </div>
        </div>
    )     
}
export default reduxForm({
    form: "sortSearch"
  })(SortForm);