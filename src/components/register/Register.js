import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    onUsernameChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'username', value }),

    onEmailChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value }),

    onPasswordChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value }),

    onRePasswordChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'rePassword', value }),

    onSubmit: (username, email, password, enableSubmit) => {
        dispatch({ type: 'REGISTER_ATTEMPT' });

        agent.Auth.register(username, email, password).then(payload => {
            // ako je ispravan register onda prikaz login forma, u drugom slucaju prikazi err poruku
            enableSubmit();

            const isMailValid = isMail(email);

            if (!isMailValid) {
                dispatch({ type: 'REGISTER_MAIL_INVALID' });

            } else if (payload.errMsg === 'User with that email exists.') {
                dispatch({ type: 'REGISTER_EXISTING_MAIL' });

            } else if (payload && payload.hasOwnProperty('errMsg')) {
                dispatch({ type: 'FAILED_REGISTER', errMsg: payload.errMsg });

            } else if (typeof payload.message !== 'undefined') {
                dispatch({ type: 'REGISTER', serverAnswer: payload.message });

            } else {
                dispatch({ type: 'FAILED_REGISTER', errMsg: 'There was an error with register action. Try again.' });
            }
        }, err => console.log(err));
    },

    backToLogin: () => {
        dispatch({ type: 'REGISTER_LOGIN_TOGGLE' });
    }
});

class Register extends React.Component {

    constructor() {
        super();

        this.usernameChange = ev => {
            this.props.onUsernameChange(ev.target.value);
        };

        this.emailChange = ev => {
            this.props.onEmailChange(ev.target.value);
        };

        this.passwordChange = ev => {
            this.props.onPasswordChange(ev.target.value);
        };

        this.rePasswordChange = ev => this.props.onRePasswordChange(ev.target.value);

        this.submitForm = (username, email, password, rePassword) => ev => {
            ev.preventDefault();

            if (password === rePassword) {
                this.refs.registerBtn.setAttribute("disabled", "disabled");
                this.props.onSubmit(username, email, password, this.enableSubmit);
            }
        }

        this.enableSubmit = () => {
            this.refs.registerBtn.removeAttribute("disabled");
        }
    }

    render() {

        const username = this.props.username;
        const email = this.props.email;
        const password = this.props.password;
        const rePassword = this.props.rePassword;
        const _errMsg = this.props._errMsg;
        const serverAnswer = this.props.serverAnswer;

        if (this.props.shownForm === 'register') {
            return (
                <div className="auth-page">
                    <div className="container page">
                        <button
                            className="btn btn-primary pull-xs-left"
                            type="button"
                            onClick={this.props.backToLogin}>
                            Back to login
                        </button>
                        <div className="row">

                            <div className="col-md-6 offset-md-3 col-xs-12">

                                <h1 className="text-xs-center bottomMarginToTwenty">Register</h1>

                                <form onSubmit={this.submitForm(username, email, password, rePassword)}>
                                    <fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={this.emailChange}
                                                required />
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                placeholder="Username"
                                                value={username}
                                                onChange={this.usernameChange} />
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={this.passwordChange}
                                                required />
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                placeholder="Repeat password"
                                                value={rePassword}
                                                onChange={this.rePasswordChange}
                                                required />

                                            {password !== rePassword && rePassword.length ? <label>Passwords don't match.</label> : null}
                                        </fieldset>

                                        <button
                                            ref="registerBtn"
                                            className="btn btn-lg btn-primary pull-xs-right"
                                            type="submit">
                                            Register
                                        </button>

                                        {_errMsg ? <label>{_errMsg}</label> : null}
                                        {serverAnswer ? <label>{serverAnswer}</label> : null}

                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else { return null; }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);



function isMail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
