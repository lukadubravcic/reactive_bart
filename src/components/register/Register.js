import React from 'react';
import { connect } from 'react-redux';

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
        // placeholder for API call, returns user data
        dispatch({ type: 'REGISTER' });
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
            ev.preventDefault();
            this.props.onSubmit(username, email, password);
        }
    }

    render() {
        const username = this.props.username;
        const email = this.props.email;
        const password = this.props.password;
        const rePassword = this.props.rePassword;

        if (this.props.auth.shownForm === 'register') {
            return (
                <div className="auth-page">
                    <div className="container page">
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
                                                value={this.props.username}
                                                onChange={this.usernameChange} />
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="email"
                                                placeholder="Email"
                                                value={this.props.email}
                                                onChange={this.emailChange} />
                                        </fieldset>

                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                placeholder="Password"
                                                value={this.props.password}
                                                onChange={this.passwordChange} />
                                        </fieldset>
                                        <fieldset className="form-group">
                                            <input
                                                className="form-control form-control-lg"
                                                type="password"
                                                placeholder="Repeat password"
                                                value={this.props.rePassword}
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