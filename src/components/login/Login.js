import { connect } from 'react-redux'
import React from 'react';

const mapStateToProps = state => ({ ...state.common });

const mapDispatchToProps = dispatch => ({
    onEmailChange: value =>
        dispatch({ type: 'UPDATE_FIELD_LOGIN', key: 'email', value }),
    onPasswordChange: value =>
        dispatch({ type: 'UPDATE_FIELD_LOGIN', key: 'password', value }),
    onSubmit: (email, password) => ev => {
        console.log('mdasdadasmmdam');
        // api call - response token i username
        dispatch({ type: 'LOGIN', email, username: 'Josko', token: '1234' })
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
    }

    render() {
        const email = this.props.email;
        const password = this.props.password;

        if (this.props.token === null) {
            return (
                <div className="auth-page">
                    <div className="container page">
                        <div className="row">
                            <div className="col-md-6 offset-md-3 col-xs-12">
                                <h1 className="text-xs-center">Sign In</h1>
                                <p className="text-xs-center">
                                    <a>
                                        Need an account?
                                    ß</a>
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
            return (
                <h1>User {this.props.username} logged in.</h1>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);