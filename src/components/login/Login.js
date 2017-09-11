import { connect } from 'react-redux'
import React from 'react';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onEmailChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value }),
    onPasswordChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value }),
    onSubmit: (email, password) => {
        // api call - response token i username
        dispatch({ type: 'LOGIN', currentUser: { email: 'test@test.hr', username: 'test' }, token: 1234 })},
    onShowRegisterForm: () => {
        dispatch({ type: 'SHOW_REGISTER' });
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
        const email = this.props.email;
        const password = this.props.password;

        if (this.props.common.token === null && this.props.auth.shownForm === 'login') {
            return (
                <div className="auth-page">
                    <div className="container page">
                        <div className="row">
                            <div className="col-md-6 offset-md-3 col-xs-12">
                                <h1 className="text-xs-center">Sign In</h1>
                                <p className="text-xs-center">
                                    <a onClick={this.showRegisterForm}>
                                        Create account
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
        } else {
            return null;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);