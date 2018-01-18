import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

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

        this.usernameChange = ev => {
            ev.preventDefault();
            this.props.onUsernameChange(ev.target.value);
        };

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

        return (
            <div className="container">
                <form onSubmit={this.submitUsername(username)}>
                    <label>We're missing your name</label>

                    <br />

                    <input
                        type="text"
                        placeholder="Username"
                        onChange={this.usernameChange}
                        value={username}
                        required />
                   
                    {errMsg ? (<label>{errMsg}</label>) : null}
                    <br />

                    <button
                        type="submit"
                        disabled={!!this.validationMessage}>
                        Set username
                    </button>
                </form>

                <br />
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
            result.what_to_write += username;
            result.what_to_write.trim();
            return result;
        }
    }

    return null;
}