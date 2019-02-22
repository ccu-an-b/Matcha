import React from 'react';
import { Field, reduxForm } from "redux-form";
import { BwmSelect } from "components/shared/form/BwmSelect";

const sortOptions = [
    { value: "age", label: "Sort by age" },
    { value: "score", label: "Sort by score" },
    { value: "distance", label: "Sort by distance" },
    { value: "tags", label: "Sort by tags" },
];

let SortForm = props => { 

    const {order, triggerOrder} = props
    return (
        <div className='filters-container active' >
            <span className="order-by">
                <h1 className='trigger-filters active'>Sort by</h1>
                <i className={order ? 'fas fa-sort-up active' : 'fas fa-sort-up' } onClick={triggerOrder}></i>
            </span>
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
                </form>
            </div>
        </div>
    )     
}
export default reduxForm({
    form: "sortSearch"
  })(SortForm);