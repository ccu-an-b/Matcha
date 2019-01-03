import React from 'react';
import { Expire } from './ExpireMessage';


export function BwmResError(props) {
    const errors = props.errors || props.success

    return (
        errors.length > 0 &&
        <Expire delay={5000}> <div className='alert  alert-danger-matcha'>
            {errors.map((error, index) => <p key={index}>{error.detail}</p>)}
        </div></Expire>
    )
}