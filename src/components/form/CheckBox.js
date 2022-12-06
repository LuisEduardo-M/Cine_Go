import React from 'react';

const CheckBox = props => {
    return (
        <div className='form-check'>
            <input
                id={props.name}
                className="form-check-input"
                type="checkbox"
                name={props.name}
                onChange={props.onChange}
                checked={props.checked}
            />

            <label className='form-check-label'
                htmlFor={props.name}>
                {props.title}
            </label>
        </div>
    )
}

export default CheckBox;