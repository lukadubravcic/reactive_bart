import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const MAX_USERNAME_LEN = 20;
const MIN_USERNAME_LEN = 4;

const mapStateToProps = state => ({
    ...state.common
});

const mapDispatchToProps = dispatch => ({
    onUsernameChange: (value) => {
        dispatch({ type: 'UPDATE_SET_USERNAME_FIELD', value })
    },
    onSubmit: username => {
        agent.Auth.setUsername(username).then(payload => {
            if (payload !== null) {
                dispatch({ type: 'USERNAME_SET', user: payload });
            } else {
                console.log('Err: username not set.');
            }
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
                this.validationMessage = 'Username needs to be between 4 and 30 characters long.'
            } else {
                this.validationMessage = null;
            }
        };

        this.submitUsername = username => ev => {
            ev.preventDefault();
            this.props.onSubmit(username);
        };
    }

    render() {

        const username = this.props.usernameSet;

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