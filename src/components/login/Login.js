import { connect } from 'react-redux'
import React from 'react';
import agent from '../../agent'
/* import SetUsername from './SetUsername';
import ResetPassword from './ResetPassword'; */


const PASSWORD_MAX_LEN = 20;
const PASSWORD_MIN_LEN = 3;


const PASSWORD_VALIDATION_ERROR_TEXT = 'Password must be between ' + PASSWORD_MIN_LEN + ' and ' + PASSWORD_MAX_LEN + ' characters long.';

const mapStateToProps = state => ({
    ...state,
    username: state.common.currentUser.username,
    email: state.common.currentUser.email,
    activePunishment: state.game.activePunishment,
    timeSpent: state.game.timeSpent,
    gameInProgress: state.game.gameInProgress,
    showSetNewPasswordComponent: state.auth.showSetNewPasswordComponent
});

const mapDispatchToProps = dispatch => ({
    onLoginWhomChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'loginWhom', value }),
    onPasswordChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value }),
    onSubmit: (loginWhom, password, enableSubmit) => {
        dispatch({ type: 'LOGIN_ATTEMPT' });

        let dataToSend = {};

        isMail(loginWhom) ? dataToSend.email = loginWhom : dataToSend.username = loginWhom;

        dataToSend.password = password;

        agent.Auth.login({ ...dataToSend }).then((payload) => {

            enableSubmit();

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
                        prefs: payload.prefs,
                        rank: payload.rank
                    });
                } else {

                    dispatch({ type: 'LOGIN_FAILED', errMsg: 'Login failed. Try again' });
                }
            } else {
                // TODO: alert - neispravan login
                console.log('Login payload === null');
            }
        });
    },
    onShowRegisterForm: () => {
        dispatch({ type: 'REGISTER_LOGIN_TOGGLE' });
    },
    onLogout: () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
        agent.Auth.logout();
        agent.setToken(0)
    },
    logPunishmentTry: (id, timeSpent) => {
        agent.Punishment.logTry(id, timeSpent).then(() => { console.log('Try logged') });
        dispatch({ type: 'PUNISHMENT_TRY_LOGGED' });
    },
    showPasswordSetForm: value => {
        dispatch({ type: 'SHOW_CHANGE_PASSWORD_FORM', value });
    },
    showResetPasswordForm: () => {
        dispatch({ type: 'SHOW_RESET_PASSWORD_FORM' });
    }
});

class Login extends React.Component {

    constructor() {

        super();

        this.passwordValidationError = null;

        this.loginWhomChange = event => {
            this.props.onLoginWhomChange(event.target.value);
        }

        this.passwordChange = event => {

            if (event.target.value.length < PASSWORD_MIN_LEN || event.target.value.length > PASSWORD_MAX_LEN) this.passwordValidationError = PASSWORD_VALIDATION_ERROR_TEXT;
            else this.passwordValidationError = null;

            this.props.onPasswordChange(event.target.value);
        }

        this.submitForm = (loginWhom, password) => ev => {
            ev.preventDefault();
            this.refs.loginBtn.setAttribute('disabled', 'true');
            this.props.onSubmit(loginWhom, password, this.enableSubmit);
        }

        this.showRegisterForm = () => {
            // hide login and show register form
            this.props.onShowRegisterForm();
        }

        this.handleLogout = () => {

            if (!specialOrRandomPunishmentIsActive(this.props.activePunishment) && this.props.gameInProgress) {
                // logiraj kaznu
                this.props.logPunishmentTry(this.props.activePunishment.uid, this.props.timeSpent)
            }

            this.props.onLogout();
        }

        this.enableSubmit = () => {
            this.refs.loginBtn.removeAttribute('disabled');
        }

        this.showChangePasswordForm = () => {
            if (!this.props.showSetNewPasswordComponent) this.props.showPasswordSetForm(true);
        }

        this.hideChangePasswordForm = () => {
            if (this.props.showSetNewPasswordComponent) this.props.showPasswordSetForm(false);
        }

        this.showResetPasswordForm = () => {
            this.props.showResetPasswordForm();
        }
    }

    render() {

        const loginWhom = this.props.auth.loginWhom;
        const password = this.props.auth.password;
        const errMsg = this.props.auth._errMsg;
        const punishmentIdFromURL = this.props.game.punishmentIdFromURL;
        const userIdFromURL = this.props.auth.userIdFromURL;
        const showSetNewPasswordComponent = this.props.showSetNewPasswordComponent;
        const showResetPasswordForm = this.props.auth.showResetPasswordForm;
        const guestUserSetWithNoUsername = this.props.common.guestUser !== null
            && Object.keys(this.props.common.guestUser).length
            && typeof this.props.common.guestUser.email !== 'undefined'
            && typeof this.props.common.guestUser.username !== 'undefined'
            && this.props.common.guestUser.username === null;
        // const formValid = this.emailValidationError === null && this.passwordValidationError === null && email !== '' && password !== '';


        if (this.props.common.token === null && this.props.auth.shownForm === 'login') {
            return (

                <div className="parent-component header">
                    <div className="container">

                        <label className="heading">Log in</label>

                        <form id="login-form" onSubmit={this.submitForm(loginWhom, password)}>
                            <fieldset className="header-form-row">
                                <input
                                    className="text-input"
                                    type="text"
                                    value={loginWhom}
                                    placeholder="e-mail/username"
                                    onChange={this.loginWhomChange}
                                    required />
                            </fieldset>

                            <fieldset className="header-form-row">
                                <input
                                    className="text-input"
                                    type="password"
                                    placeholder="password"
                                    value={password}
                                    onChange={this.passwordChange}
                                    required />
                                <label className="form-feedback">WRONG</label>

                                {this.passwordValidationError ? <label>{this.passwordValidationError}</label> : null}

                            </fieldset>

                            {errMsg ? (<label>{errMsg}</label>) : null}

                            <fieldset className="header-form-row">
                                <button className="btn-submit" ref="loginBtn" type="submit">LOG IN</button>
                                <a id="forgot-password" className="link" onClick={this.showResetPasswordForm}>FORGOT PASSWORD?</a>
                            </fieldset>

                            <a onClick={this.showRegisterForm}>
                                <u className="a">Create account</u>
                            </a>
                        </form>

                    </div>
                </div>

            );
        } else if (this.props.common.token !== null && this.props.auth.shownForm === 'login') {

            // logiran korisnik
            return (

                <div className="user-loggedin-top-component">
                    <div className="container">

                        <button className="float-right logout-button" onClick={this.handleLogout}>LOG OUT</button>

                        <div className="float-right delimiter-container">
                            <svg id="user-loggedin-top-delimiter" width="2px" height="22px" viewBox="0 0 2 22" version="1.1" xmlns="http://www.w3.org/2000/svg">

                                <title>Line Copy 2</title>
                                <desc>Created with Sketch.</desc>
                                <defs></defs>
                                <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-1120.000000, -32.000000)"
                                    strokeLinecap="square">
                                    <path d="M1121,53 L1121,33" id="Line-Copy-2" stroke="#979797"></path>
                                </g>
                            </svg>
                        </div>

                        <label className="float-right user-identity">{this.props.username ? this.props.username : this.props.email}</label>

                        {/* this.props.username ? null : <SetUsername /> */}

                        {/* showSetNewPasswordComponent ?  
                            <button
                                onClick={this.hideChangePasswordForm}>
                                Return to game
                        </button>
                            : <button
                                onClick={this.showChangePasswordForm}>
                                Change Password
                        </button>
                         */}

                    </div>
                </div >


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

function isMail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}\.[0-9]{1, 3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2, }))$/;
    return re.test(email);
}