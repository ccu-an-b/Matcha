import React from 'react';

export const BwmInput = ({
    input,
    label,
    type,
    className,
    symbol,
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
                <input {...input} placeholder={label} type={type} className={className} />
                <span className='focus-input'></span>
            </div>
            {touched &&
                ((error && <div className='alert alert-danger'>{error}</div>))}
        </div>
    )
