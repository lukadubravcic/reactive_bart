import React from 'react';
import { connect } from 'react-redux';
import agent from '../../../agent';

const mapStateToProps = state => ({
    ...state.common,
    specialPunishments: state.punishment.specialPunishments
});

const mapDispatchToProps = dispatch => ({
    onUsernameChange: value => {
        dispatch({ type: 'UPDATE_SET_USERNAME_FIELD', value })
    },
    onSubmit: (username, punishment) => {
        agent.Auth.setUsername(username)
            .then(payload => {
                if (payload !== null) {

                    if (typeof payload.errMsg != 'undefined') {
                        dispatch({ type: 'SET_USERNAME_ERROR', errMsg: payload.errMsg })

                    } else if (
                        typeof payload._id !== 'undefined'
                        && typeof payload.email !== 'undefined'
                        && typeof payload.username !== 'undefined'
                    ) {
                        dispatch({ type: 'USERNAME_SET', user: payload, specialPunishment: punishment });
                    }
                } else {
                    console.log('set username: payload === null');
                }
            }, err => {
                dispatch({ type: 'SET_USERNAME_ERROR', errMsg: 'Username not set. Try again.' });
            });
    },
    onGuestSubmit: (username, email, punishment) => {
        agent.Auth.setUsernameAsGuest(username, email)
            .then(payload => {
                if (payload !== null) {

                    if (typeof payload.errMsg != 'undefined') {
                        dispatch({ type: 'SET_USERNAME_ERROR', errMsg: payload.errMsg })

                    } else if (
                        typeof payload._id != 'undefined'
                        && typeof payload.email != 'undefined'
                        && typeof payload.username != 'undefined'
                    ) {
                        dispatch({ type: 'USERNAME_SET_AS_GUEST', user: payload, specialPunishment: punishment });
                    }
                } else {
                    console.log('set username: payload === null');
                }
            }, err => {
                dispatch({ type: 'SET_USERNAME_ERROR', errMsg: 'Username not set. Try again.' });
            });
    }
});

class SetUsername extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            usernameValid: null,
            usernameExist: false
        }

        this.usernameChange = ev => {
            ev.preventDefault();
            let username = ev.target.value;

            if (username.length > 0) this.setState({ usernameValid: validateUsername(username) });
            else this.setState({ usernameValid: true });

            if (this.state.usernameValid) this.checkIfExistingUser(username);

            this.props.onUsernameChange(username);

        };

        this.checkIfExistingUser = async (value) => {

            let response = await agent.Auth.checkIfUserExists(value);

            if (typeof response.exist !== 'undefined') this.setState({ usernameExist: !!response.exist });
        }

        this.createOnUsernameSetPunishment = username => {
            return getFromSpecialPunishments('USERNAME_SET', username, this.props.specialPunishments);
        }

        this.submitUsername = username => ev => {
            ev.preventDefault();
            let punishment = this.createOnUsernameSetPunishment(username.trim());

            if (Object.keys(this.props.currentUser).length) {
                punishment && this.props.onSubmit(username, punishment);
            } else if (this.props.guestUser !== null && Object.keys(this.props.guestUser).length && this.props.guestUser.email) {
                punishment && this.props.onGuestSubmit(username, this.props.guestUser.email, punishment);
            }
        };
    }

    render() {

        const username = this.props.usernameSet;
        const errMsg = this.props._errMsg;
        const formEnabled = username.length > 0 && this.state.usernameValid === true && this.state.usernameExist === false;
        const wrongEntry = this.state.usernameValid === false || this.state.usernameExist === true;

        return (
            <div className="parent-component header">
                <div className="container">

                    <label id="set-username-heading" className="heading">
                        We’re missing your name
                    </label>

                    <form
                        className="set-username-form"
                        onSubmit={this.submitUsername(username)}>

                        <fieldset className="header-form-row">
                            <input
                                className={`text-input ${wrongEntry ? "input-wrong-entry" : ""}`}
                                type="text"
                                placeholder="Username"
                                onChange={this.usernameChange}
                                value={username}
                                required />

                            {this.state.usernameExist
                                ? <label className="form-feedback">USERNAME TAKEN</label>
                                : null}

                            {errMsg
                                ? <label className="form-feedback">{errMsg.toUpperCase()}</label>
                                : null}

                        </fieldset>

                        <fieldset className="header-form-row">
                            <button
                                className="btn-submit btn-set-username"
                                type="submit"
                                disabled={!formEnabled}>
                                SET USERNAME
                            </button>
                        </fieldset>

                    </form>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetUsername);


function getFromSpecialPunishments(type, username, specialPunishments) {

    let result = null;

    if (!specialPunishments.length) return null;

    for (let i = 0; i < specialPunishments.length; i++) {

        if (specialPunishments[i].type === type) {

            result = JSON.parse(JSON.stringify(specialPunishments[i]));
            result.what_to_write += username + '.';
            result.what_to_write.trim();
            if (result.what_to_write[result.what_to_write.length - 1] !== ' ') result.what_to_write += ' ';
            return result;
        }
    }

    return null;
}

function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9-_\.]{2,20}$/;

    if (usernameRegex.test(username)) {
        return true;

    } else return false // '3 to 20 characters (no white-space).';
}