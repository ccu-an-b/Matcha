import React from 'react';

export const BwmInput = ({
    input,
    label,
    type,
    className,
    symbol,
    placeholder,
    value,
    labelUp,
    meta: { touched, error, warning }
  }) => (
        <div className='form-group'>
            <div className='input-group'>
            {
                symbol && 
                <div className="input-group-prepend">
                    <div className="input-group-text">{symbol}</div>
                </div>
            }
            {
                labelUp &&
                <label>
                    {labelUp}
                </label>
            }
                <input {...input} placeholder={placeholder} type={type} className={className} value={value} />
                <span className='focus-input'></span>
            {
                label &&
                <label>
                    {label}
                </label>
            }
            </div>
            {touched &&
                ((error && <div className='alert-input'>{error}</div>))}
        </div>
    )
