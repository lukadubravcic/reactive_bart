import { connect } from 'react-redux'
import React from 'react';
import agent from '../../agent'

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onEmailChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value }),
    onPasswordChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value }),
    onSubmit: (email, password) => {
        agent.Auth.login(email, password).then((payload) => {
            if (payload !== null) {
                dispatch({ type: 'LOGIN', currentUser: { username: payload.username, email: email }, token: payload.token })
            } else {
                // TODO: alert - neispravan login
            }
        });
    },
    onShowRegisterForm: () => {
        dispatch({ type: 'REGISTER_LOGIN_TOGGLE' });
    },
    onLogout: () => {
        dispatch({ type: 'LOGOUT' });
    }
});

class Login extends React.Component {

    constructor() {
        super();
        this.emailChange = event => this.props.onEmailChange(event.target.value);
        this.passwordChange = event => this.props.onPasswordChange(event.target.value);
        this.submitForm = (email, password) => ev => {
            ev.preventDefault();
            this.props.onSubmit(email, password);
        }
        this.showRegisterForm = () => {
            // hide login and show register form
            this.props.onShowRegisterForm();
        }
    }

    render() {
        const email = this.props.auth.email;
        const password = this.props.auth.password;

        if (this.props.common.token === null && this.props.auth.shownForm === 'login') {
            return (
                <div className="auth-page">
                    <div className="container page">
                        <div className="row">
                            <div className="col-md-6 offset-md-3 col-xs-12">
                                <h1 className="text-xs-center">Sign In</h1>
                                <p className="text-xs-center">
                                    <a onClick={this.showRegisterForm}>
                                        <u>Create account</u>
                                    </a>
                                </p>

                                <form onSubmit={this.submitForm(email, password)}>
                                    <fieldset>
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
                                        <button
                                            className="btn btn-lg btn-primary pull-xs-right"
                                            type="submit">
                                            Login
                                        </button>

                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (this.props.common.token !== null && this.props.auth.shownForm === 'login') {
            return (
                <div className="container">
                    <h1 className="text-xs-left">{this.props.common.currentUser.username}</h1>
                    <button
                        type="button"
                        onClick={this.props.onLogout}>
                        Logout
                    </button>
                </div>

            );
        } else {
            return null;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);