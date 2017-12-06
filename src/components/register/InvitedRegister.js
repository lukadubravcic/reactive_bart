import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const mapStateToProps = state => ({
    ...state.auth
});

const mapDispatchToProps = dispatch => ({
    onPasswordChange: value => {
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value });
    },
    onRePasswordChange: value => {
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'rePassword', value });
    },
    onSubmitForm: (userID, password) => {
        console.log(userID + "  " + password)
        agent.Auth.specialRegister(userID, password).then(payload => {
            if (payload !== null) {

                if (typeof payload.message !== "undefined") {

                    dispatch({ type: 'LOGIN_FAILED', errMsg: payload.message });

                } else if (
                    typeof payload.token !== 'undefined' &&
                    typeof payload.email !== 'undefined' &&
                    typeof payload._id !== 'undefined' &&
                    typeof payload.rand !== 'undefined') {

                    agent.setToken(payload.token);

                    localStorage.setItem('token', payload.token);

                    dispatch({
                        type: 'LOGIN',
                        currentUser: { username: payload.username, email: payload.email, _id: payload._id },
                        token: payload.token,
                        prefs: payload.prefs,
                        rank: payload.rank
                    });
                } else {

                    dispatch({ type: 'LOGIN_FAILED', errMsg: 'Login failed. Try again' });
                }
            }
        }, err => {
            dispatch({ type: 'FAULTY_SPECIAL_LOGIN' });
        });
    }
});

class InvitedRegister extends React.Component {

    constructor() {
        super();

        this.validationMessage = null;

        this.passwordChange = ev => this.props.onPasswordChange(ev.target.value);

        this.rePasswordChange = ev => {

            this.props.onRePasswordChange(ev.target.value);
        }

        this.submitForm = (password, rePassword) => ev => {
            ev.preventDefault();

            if (!this.validationMessage) this.props.onSubmitForm(this.props.userIdFromURL, password);
        }
    }

    render() {

        const password = this.props.password;
        const rePassword = this.props.rePassword;
        const errMsg = this.props._errMsg;

        if (rePassword.length && password !== rePassword) this.validationMessage = 'Passwords do not match.';
        else this.validationMessage = null;

        return (
            <div>
                <div className="container page">

                    <div className="row">

                        <div className="col-md-6 offset-md-3 col-xs-12">

                            <h2 className="text-xs-center bottomMarginToTwenty">Provide password</h2>
                            <label className="text-xs-center bottomMarginToTwenty">Please register by providing password for your account so you can proceed.</label>

                            <form onSubmit={this.submitForm(password, rePassword)}>
                                <fieldset>

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

                                    </fieldset>

                                    {errMsg ? (<label>{errMsg}</label>) : null}

                                    <button
                                        ref="registerBtn"
                                        className="btn btn-lg btn-primary pull-xs-right"
                                        type="submit">
                                        Register
                                        </button>

                                    {this.validationMessage ? <label>{this.validationMessage}</label> : null}

                                </fieldset>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(InvitedRegister);