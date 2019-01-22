import React from 'react'

export const BwmTextarea = ({
    input,
    type,
    rows,
    label,
    placeholder,
    className,
    meta: { touched, error, warning }
}) => (
        <div className='form-group'>
            { label &&
                <label>{label}</label>
            }
            <div className='input-group'>
                <textarea {...input} type={type} rows={rows} placeholder={placeholder} className={className} ></textarea>
            </div>
            {touched &&
                ((error && <div className='alert-input'>{error}</div>))}
        </div>
)