import React from 'react'

export const BwmTextarea = ({
    input,
    type,
    rows,
    label,
    className,
    meta: { touched, error, warning }
}) => (
        <div className='form-group'>
            <label>{label}</label>
            <div className='input-group'>
                <textarea {...input} type={type} rows={rows} placeholder={label} className={className} ></textarea>
            </div>
            {touched &&
                ((error && <div className='alert alert-danger'>{error}</div>))}
        </div>
)