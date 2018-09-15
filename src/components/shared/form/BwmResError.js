import React from 'react';

export function BwmResError(props) {
    const errors = props.errors || props.success

    return (
        errors.length > 0 &&
        <div className='alert  alert-danger-matcha'>
            {errors.map((error, index) => <p key={index}>{error.detail}</p>)}
        </div>
    )
}