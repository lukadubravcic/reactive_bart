import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
// import request from 'superagent';

const MIN_USERNAME_LENGTH = 4;
const MAX_USERNAME_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 4;
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
            // ako je ispravan register onda prikaz login forma, u drugom slucaju "alert" o neuspjesnosti
            if (payload !== null) {
                console.log(payload)
                dispatch({ type: 'REGISTER', payload });
            } else {
                // bacit alert
                dispatch({ type: 'ALERT_FAILED_REG' });
            }
        });
    },
    backToLogin: () => {
        dispatch({ type: 'REGISTER_LOGIN_TOGGLE' });
    },
    disableSubmit: () => {
        dispatch({ type: 'DISABLE_SUBMIT' })
    },
    enableSubmit: () => {
        dispatch({ type: 'ENABLE_SUBMIT' })
    }
});

class Register extends React.Component {

    constructor() {
        super();

        this.usernameValidationMessage = null;
        this.emailValidationMessage = null;
        this.passwordValidationMessage = null;

        this.usernameChange = ev => {

            this.props.onUsernameChange(ev.target.value)
            console.log(ev.target.value)
            if ((ev.target.value.length < MIN_USERNAME_LENGTH && ev.target.value.length !== 0) || ev.target.value.length > MAX_USERNAME_LENGTH) {
                console.log('ne valja')
                this.usernameValidationMessage = (<label>&nbsp;Username needs to be between 4 and 20 characters long.</label>);
                this.props.disableSubmit();

            } else {
                console.log('valja');
                this.usernameValidationMessage = null;
                this.props.enableSubmit();
            }
        };

        this.emailChange = ev => {

            this.props.onEmailChange(ev.target.value);

            if (ev.target.value.length > 0 && !validateEmail(ev.target.value)) {

                this.emailValidationMessage = (<label>&nbsp;Email not valid.</label>);
                this.props.disableSubmit();

            } else {

                this.emailValidationMessage = null;
                this.props.enableSubmit();
                return null;
            }
        };

        this.passwordChange = ev => {

            this.props.onPasswordChange(ev.target.value);

            if (ev.target.value.length !== 0 && (ev.target.value.length < MIN_PASSWORD_LENGTH || ev.target.value.length > MAX_PASSWORD_LENGTH)) {

                this.passwordValidationMessage = (<label>&nbsp;Password needs to be between {MIN_PASSWORD_LENGTH} and {MAX_PASSWORD_LENGTH} characters long</label>);
                this.props.disableSubmit();

            } else {

                this.passwordValidationMessage = null;
                this.props.enableSubmit();
            }
        };

        this.rePasswordChange = ev => this.props.onRePasswordChange(ev.target.value);

        this.submitForm = (username, email, password) => ev => {
            ev.preventDefault();
            this.props.onSubmit(username, email, password);
        }
    }

    render() {
        const username = this.props.username;
        const email = this.props.email;
        const password = this.props.password;
        const rePassword = this.props.rePassword;

        let submitDisabled = (password === '' || password !== rePassword) && this.props.submitDisabled;
        //console.log(submitDisabled);

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
                                            {this.usernameValidationMessage}
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={this.emailChange}
                                                required />
                                                {this.emailValidationMessage}
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={this.passwordChange} />
                                                {this.passwordValidationMessage}
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
                                            className="btn btn-lg btn-primary pull-xs-right"
                                            type="submit"
                                            disabled={submitDisabled}>
                                            Register
                                    </button>

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


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


