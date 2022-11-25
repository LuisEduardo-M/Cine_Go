import React from 'react';
import { useRouteError } from 'react-router';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className='container'>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <h1 className='mt-3'>That's weird...</h1>
                    <p>Unexpected error occurred.</p>

                    <p>
                        <em>{error.statusText || error.message}</em>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage;