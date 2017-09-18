import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
// import request from 'superagent';

const mapStateToProps = state => ({ ...state });

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
        //console.log(this.username);
        // placeholder for API call, returns user data
        agent.Auth.register(username, email, password).then((data) => {

            // ako je ispravan register onda prikaz login forma, u drugom slucaju "alert" o neuspjesnosti
            if (data !== null) {
                dispatch({ type: 'REGISTER' });
            } else {
                // bacit alert
                dispatch({ type: 'ALERT_FAILED_REG' });
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
        this.usernameChange = ev => this.props.onUsernameChange(ev.target.value);
        this.emailChange = ev => this.props.onEmailChange(ev.target.value);
        this.passwordChange = ev => this.props.onPasswordChange(ev.target.value);
        this.rePasswordChange = ev => this.props.onRePasswordChange(ev.target.value);
        this.submitForm = (username, email, password) => ev => {
            //console.log(username);
            ev.preventDefault();
            this.props.onSubmit(username, email, password);
        }
    }

    render() {
        const username = this.props.auth.username;
        const email = this.props.auth.email;
        const password = this.props.auth.password;
        const rePassword = this.props.auth.rePassword;

        if (this.props.auth.shownForm === 'register') {
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
                                                onChange={this.usernameChange} />
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={this.emailChange} />
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={this.passwordChange} />
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
                                            disabled={!(password === rePassword)}>
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