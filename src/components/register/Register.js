import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
// import request from 'superagent';

const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 3;
const MAX_PASSWORD_LENGTH = 20;

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

    onSubmit: (username, email, password) => {        
        agent.Auth.register(username, email, password).then((payload) => {
            // ako je ispravan register onda prikaz login forma, u drugom slucaju prikazi err poruku
            if (payload && payload.hasOwnProperty('errMsg')) {
            
                dispatch({ type: 'FAILED_REGISTER', errMsg: payload.errMsg });
            
            } else if (payload) {

                dispatch({ type: 'REGISTER', payload });
            
            } else {
                dispatch({ type: 'FAILED_REGISTER', errMsg: 'There was an error with register action. Try again.' });
            }
        });
    },

    backToLogin: () => {
        dispatch({ type: 'REGISTER_LOGIN_TOGGLE' });
    }
});

class Register extends React.Component {

    constructor() {
        super();

        this.usernameValidationError = null;
        this.emailValidationError = null;
        this.passwordValidationError = null;

        this.usernameChange = ev => {
            this.props.onUsernameChange(ev.target.value)

            if ((ev.target.value.length < MIN_USERNAME_LENGTH && ev.target.value.length !== 0) || ev.target.value.length > MAX_USERNAME_LENGTH) {

                this.usernameValidationError = 'Username needs to be between ' + MIN_USERNAME_LENGTH + ' and ' + MAX_USERNAME_LENGTH + ' characters long.';


            } else {

                this.usernameValidationError = null;
            }
        };

        this.emailChange = ev => {
            this.props.onEmailChange(ev.target.value);

            if (ev.target.value.length > 0 && !isMail(ev.target.value)) {

                this.emailValidationError = 'Email not valid.';

            } else {

                this.emailValidationError = null;
            }
        };

        this.passwordChange = ev => {
            this.props.onPasswordChange(ev.target.value);

            if (ev.target.value.length !== 0 && (ev.target.value.length < MIN_PASSWORD_LENGTH || ev.target.value.length > MAX_PASSWORD_LENGTH)) {

                this.passwordValidationError = 'Password needs to be between ' + MIN_PASSWORD_LENGTH + ' and ' + MAX_PASSWORD_LENGTH + ' characters long.';


            } else {

                this.passwordValidationError = null;

            }
        };

        this.rePasswordChange = ev => this.props.onRePasswordChange(ev.target.value);

        this.submitForm = (username, email, password) => ev => {
            ev.preventDefault();
            this.refs.registerBtn.setAttribute("disabled", "disabled");
            this.props.onSubmit(username, email, password);
        }
    }

    render() {
        const username = this.props.username;
        const email = this.props.email;
        const password = this.props.password;
        const rePassword = this.props.rePassword;
        const _errMsg = this.props._errMsg;

        const formValid =
            this.usernameValidationError === null &&
            this.emailValidationError === null &&
            this.passwordValidationError === null &&
            username !== '' &&
            email !== '' &&
            password !== '' &&
            password === rePassword;

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

                                <form onSubmit={this.submitForm(username, email, password)}>
                                    <fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="text"
                                                placeholder="Username"
                                                value={username}
                                                onChange={this.usernameChange}
                                                required />
                                            {this.usernameValidationError ? <label>{this.usernameValidationError}</label> : null}
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={this.emailChange}
                                                required />
                                            {this.emailValidationError ? <label>{this.emailValidationError}</label> : null}
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={this.passwordChange} />
                                            {this.passwordValidationError ? <label>{this.passwordValidationError}</label> : null}
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                placeholder="Repeat password"
                                                value={rePassword}
                                                onChange={this.rePasswordChange} />
                                        </fieldset>

                                        <button
                                            ref="registerBtn"
                                            className="btn btn-lg btn-primary pull-xs-right"
                                            type="submit"
                                            disabled={!formValid}>
                                            Register
                                        </button>
                                        {_errMsg ? <label>{_errMsg}</label> : null}

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
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


