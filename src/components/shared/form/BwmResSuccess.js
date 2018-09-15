import React from 'react';

export function BwmResSuccess(props) {
    const success = props.success

    return (
        success.length > 0 &&
        <div className='alert  alert-success-matcha'>
            {success}
        </div>
    )
}