import React from 'react';

const StartToolbar = props => (

    <div className="parent-component header">
        <div className="container">
            <button
                id="btn-log-in"
                className="btn-submit"
                onClick={props.btnClickCallback}>
                LOG IN
            </button>
        </div>
    </div>
);

export default StartToolbar;