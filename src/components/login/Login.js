import { connect } from 'react-redux'
import React from 'react';
import agent from '../../agent'
import SetUsername from './SetUsername';

const EMAIL_MAX_LEN = 20;
const EMAIL_MIN_LEN = 5;
const PASSWORD_MAX_LEN = 20;
const PASSWORD_MIN_LEN = 3;

const EMAIL_VALIDATION_ERROR_TEXT = 'Username must be between ' + EMAIL_MIN_LEN + ' and ' + EMAIL_MAX_LEN + ' characters long.';
const PASSWORD_VALIDATION_ERROR_TEXT = 'Password must be between ' + PASSWORD_MIN_LEN + ' and ' + PASSWORD_MAX_LEN + ' characters long.';

const mapStateToProps = state => ({
    ...state,
    username: state.common.currentUser.username,
    email: state.common.currentUser.email,
    activePunishment: state.game.activePunishment,
    timeSpent: state.game.timeSpent,
    gameInProgress: state.game.gameInProgress
});

const mapDispatchToProps = dispatch => ({
    onEmailChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value }),
    onPasswordChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value }),
    onSubmit: (email, password, cb) => {
        agent.Auth.login(email, password).then((payload) => {

            if (payload !== null) {

                if (typeof payload.message !== "undefined") {

                    dispatch({ type: 'LOGIN_FAILED', errMsg: payload.message });

                } else if (typeof payload.token !== 'undefined' && typeof payload.email !== 'undefined' && typeof payload._id !== 'undefined') {
                    agent.setToken(payload.token);

                    localStorage.setItem('token', payload.token);

                    dispatch({
                        type: 'LOGIN',
                        currentUser: { username: payload.username, email: payload.email, _id: payload._id },
                        token: payload.token,
                        prefs: payload.prefs
                    });
                } else {

                    dispatch({ type: 'LOGIN_FAILED', errMsg: 'Login failed. Try again' });
                }
            } else {
                // TODO: alert - neispravan login
                console.log('Login payload === null')
            }

            cb();
        });
    },
    onShowRegisterForm: () => {
        dispatch({ type: 'REGISTER_LOGIN_TOGGLE' });
    },
    onLogout: () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
        agent.setToken(0)
    },
    logPunishmentTry: (id, timeSpent) => {
        agent.Punishment.logTry(id, timeSpent).then(() => { console.log('Try logged') });
        dispatch({ type: 'PUNISHMENT_TRY_LOGGED' });
    }
});

class Login extends React.Component {

    constructor() {

        super();

        this.emailValidationError = null;
        this.passwordValidationError = null;

        this.emailChange = event => {

            if (event.target.value.length < EMAIL_MIN_LEN || event.target.value.length > EMAIL_MAX_LEN) this.emailValidationError = EMAIL_VALIDATION_ERROR_TEXT;
            else this.emailValidationError = null;

            this.props.onEmailChange(event.target.value);
        }

        this.passwordChange = event => {

            if (event.target.value.length < PASSWORD_MIN_LEN || event.target.value.length > PASSWORD_MAX_LEN) this.passwordValidationError = PASSWORD_VALIDATION_ERROR_TEXT;
            else this.passwordValidationError = null;

            this.props.onPasswordChange(event.target.value);
        }
        this.submitForm = (email, password) => ev => {
            ev.preventDefault();
            this.refs.loginBtn.setAttribute("disabled", "true");
            this.props.onSubmit(email, password, this.enableSubmit);
        }

        this.showRegisterForm = () => {
            // hide login and show register form
            this.props.onShowRegisterForm();
        }

        this.handleLogout = () => {

            if (!specialOrRandomPunishmentIsActive(this.props.activePunishment) && this.props.gameInProgress) {
                // logiraj kaznu
                this.props.logPunishmentTry(this.props.activePunishment._id, this.props.timeSpent)
            }

            this.props.onLogout();
        }
        this.enableSubmit = () => {
            this.refs.loginBtn.setAttribute("disabled", "enabled");
            console.log('here')
        }
    }

   /*  componentWillUpdate(nextProps) {
        if ((!this.props.auth._errMsg && nextProps.auth._errMsg) || (typeof this.props.username === 'undefined' && typeof nextProps.username !== 'undefined')) {
            console.log('here')
            
        }
    } */

    render() {

        const email = this.props.auth.email;
        const password = this.props.auth.password;
        const errMsg = this.props.auth._errMsg;
        const punishmentIdFromURL = this.props.game.punishmentIdFromURL;
        const formValid = this.emailValidationError === null && this.passwordValidationError === null && email !== '' && password !== '';

        if (window.canRunAds === undefined) {
            // adblock active
            return (
                <div className="container">
                    <h3>Can't login while using Adblock, please disable it.</h3>
                </div>
            )
        } else if (this.props.common.token === null && this.props.auth.shownForm === 'login') {
            return (
                <div className="auth-page">
                    <div className="container page">
                        <div className="row">
                            <div className="col-md-6 offset-md-3 col-xs-12">
                                <h1 className="text-xs-center">Sign In</h1>
                                {punishmentIdFromURL ? <label>Login to proceed completing your punishment</label> : null}
                                <p className="text-xs-center">
                                    <a onClick={this.showRegisterForm}>
                                        <u className="a">Create account</u>
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
                                                onChange={this.passwordChange}
                                                required />
                                            {this.passwordValidationError ? <label>{this.passwordValidationError}</label> : null}
                                        </fieldset>
                                        {errMsg ? (<label>{errMsg}</label>) : null}
                                        <button
                                            ref="loginBtn"
                                            className="btn btn-lg btn-primary pull-xs-right"
                                            type="submit"
                                            disabled={!formValid}>
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
                    {this.props.username ?
                        <h1 className="text-xs-left">{this.props.common.currentUser.username}</h1>
                        : <SetUsername />}
                    <button
                        type="button"
                        onClick={this.handleLogout}>
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

function specialOrRandomPunishmentIsActive(punishment) { // specijalne kazne nemaju created property
    return punishment.created ? false : true;
}