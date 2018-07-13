import React from 'react';
import NotificationCount from './NotificationCount';


class LoggedInToolbar extends React.Component {
    constructor(props) {
        super(props);
        this.prefsElement = null;
        this.getPrefElementTimeout = setTimeout(() => {
            this.prefsElement = document.getElementById("prefs");
        }, 250);

        this.usernameClick = ev => {
            ev.preventDefault();
            if (this.prefsElement) this.prefsElement.scrollIntoView({ behavior: "smooth" });
        }
    }

    render() {
        return (
            <div className="user-loggedin-top-component">
                <div className="container">

                    <button className="float-right logout-button" onClick={this.props.handleLogout}>LOG OUT</button>

                    <div className="float-right delimiter-container">
                        <svg id="user-loggedin-top-delimiter" width="2px" height="22px" viewBox="0 0 2 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-1120.000000, -32.000000)"
                                strokeLinecap="square">
                                <path d="M1121,53 L1121,33" id="Line-Copy-2" stroke="#979797"></path>
                            </g>
                        </svg>
                    </div>

                    <div style={{ position: "relative", display: "inline-block" }} className="float-right">
                        <button
                            className="user-identity noselect"
                            onClick={this.usernameClick} >
                            {this.props.username}
                        </button>

                        <NotificationCount />

                    </div>
                </div>
            </div>
        )
    }
}


export default LoggedInToolbar;