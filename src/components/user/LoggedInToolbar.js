import React from 'react';

const LoggedInToolbar = props => (
    <div className="user-loggedin-top-component">
        <div className="container">

            <button className="float-right logout-button" onClick={()=>{console.log('LOGOUT clicked')}}>LOG OUT</button>

            <div className="float-right delimiter-container">
                <svg id="user-loggedin-top-delimiter" width="2px" height="22px" viewBox="0 0 2 22" version="1.1" xmlns="http://www.w3.org/2000/svg">

                    <title>Line Copy 2</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-1120.000000, -32.000000)"
                        strokeLinecap="square">
                        <path d="M1121,53 L1121,33" id="Line-Copy-2" stroke="#979797"></path>
                    </g>
                </svg>
            </div>

            <label className="float-right user-identity">{props.username}</label>
        </div>
    </div>
);


export default LoggedInToolbar;