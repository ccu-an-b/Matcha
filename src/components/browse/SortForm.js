import React from 'react';
import { Field, reduxForm } from "redux-form";
import { BwmSelect } from "components/shared/form/BwmSelect";

const sortOptions = [
    { value: "age", label: "age" },
    { value: "score", label: "score" },
    { value: "distance", label: "distance" },
    { value: "tags", label: "tags" },
];

let SortForm = props => { 

    const {order, triggerOrder, show} = props
    return (

        <div className={show ? "order-input show" : "order-input"}>
            <Field 
                    name="sort"
                    className="my-select no-border multi"
                    options={sortOptions}
                    component={BwmSelect}
            />
            <i className={order ? 'fas fa-sort-up active' : 'fas fa-sort-up' } onClick={triggerOrder}></i>
        </div>
    )     
}
export default reduxForm({
    form: "sortForm"
  })(SortForm);