import React from 'react';

export function BwmResSuccess(props) {
    const success = props.success

    return (
        success  &&
        <div className='alert  alert-success-matcha'>
            {success}
        </div>
    )
}