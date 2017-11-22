import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const MAX_USERNAME_LEN = 20;
const MIN_USERNAME_LEN = 4;

const mapStateToProps = state => ({
    ...state.common,
    specialPunishments: state.punishment.specialPunishments
});

const mapDispatchToProps = dispatch => ({
    onUsernameChange: (value) => {
        dispatch({ type: 'UPDATE_SET_USERNAME_FIELD', value })
    },
    onSubmit: (username, punishment) => {
        agent.Auth.setUsername(username)
            .then(payload => {
                if (payload !== null) {

                    if (typeof payload.errMsg != 'undefined') {
                        dispatch({ type: 'SET_USERNAME_ERROR', errMsg: payload.errMsg })

                    } else if (typeof payload._id != 'undefined' && typeof payload.email != 'undefined' && typeof payload.username != 'undefined') {
                        dispatch({ type: 'USERNAME_SET', user: payload, specialPunishment: punishment });
                    }
                } else {

                }
            }, (err) => {
                dispatch({ type: 'SET_USERNAME_ERROR', errMsg: 'Username not set. Try again.' });
            });
    }
});

class SetUsername extends React.Component {

    constructor(props) {
        super(props);

        this.validationMessage = null;

        this.usernameChange = ev => {

            ev.preventDefault();
            this.props.onUsernameChange(ev.target.value);

            if (ev.target.value.length < MIN_USERNAME_LEN || ev.target.value.length > MAX_USERNAME_LEN) {
                this.validationMessage = 'Username needs to be between ' + MIN_USERNAME_LEN + ' and ' + MAX_USERNAME_LEN + ' characters long.'
            } else {
                this.validationMessage = null;
            }
        };

        this.createOnUsernameSetPunishment = username => {
            return getFromSpecialPunishments('USERNAME_SET', username, this.props.specialPunishments)
        }

        this.submitUsername = username => ev => {
            ev.preventDefault();
            let punishment = this.createOnUsernameSetPunishment(username);
            punishment && this.props.onSubmit(username, punishment);
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

                    {this.validationMessage ? <label>&nbsp;{this.validationMessage}</label> : null}
                    {errMsg ? (<label>{errMsg}</label>) : null}
                    <br />

                    <button
                        type="submit"
                        disabled={!!this.validationMessage}>
                        Set username
                    </button>
                </form>
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
            return result;
        }
    }

    return null;
}