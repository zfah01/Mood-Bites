import React from 'react';
import '../styles/ErrorMessage.css';

const ErrorMessage = (props) => {
    return (
        // The error notice that takes in the props message and clearError

        <div className='error-notice'>
            {/* //message is the error */}
            <span>{props.message}</span>
            {/* //and clearError will be a callback that sets the Error back to undefined. */}
            <button onClick={props.clearError}>X</button>
        </div>
    );
};

export default ErrorMessage;