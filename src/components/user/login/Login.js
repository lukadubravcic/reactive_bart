import { connect } from 'react-redux'
import React from 'react';
import agent from '../../../agent';


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

        agent.Auth.login({ ...dataToSend }).then(payload => {

            enableSubmit();

            if (payload === null) {
                // TODO: alert - neispravan login
                console.log('Login payload === null');
                return;
            }

            if (typeof payload.message !== "undefined") {
                dispatch({ type: 'LOGIN_FAILED', errMsg: payload.message });
                return;
            }

            if (typeof payload.token !== 'undefined'
                && typeof payload.email !== 'undefined'
                && typeof payload._id !== 'undefined') {

                agent.setToken(payload.token);
                localStorage.setItem('token', payload.token);

                dispatch({
                    type: 'LOGIN',
                    currentUser: {
                        username: payload.username,
                        email: payload.email,
                        _id: payload._id
                    },
                    token: payload.token,
                    prefs: payload.prefs,
                    rank: payload.rank
                });
            } else {
                dispatch({ type: 'LOGIN_FAILED', errMsg: 'Login failed. Try again' });
            }
        });
    },
    onShowRegisterForm: () => {
        dispatch({ type: 'REGISTER_LOGIN_TOGGLE' });
    },
    showPasswordSetForm: value => {
        dispatch({ type: 'SHOW_CHANGE_PASSWORD_FORM', value });
    },
    showResetPasswordForm: () => {
        dispatch({ type: 'SHOW_RESET_PASSWORD_FORM' });
    }
});


class LoginTest extends React.Component {
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

        this.enableSubmit = () => {
            this.refs.loginBtn.removeAttribute('disabled');
        }

        this.showResetPasswordForm = ev => {
            ev.preventDefault();
            this.props.showResetPasswordForm();
        }

    }

    render() {

        const loginWhom = this.props.auth.loginWhom;
        const password = this.props.auth.password;
        const errMsg = this.props.auth._errMsg;

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

                            {this.passwordValidationError ? <label className="form-feedback">{this.passwordValidationError}</label> : null}

                        </fieldset>



                        <fieldset className="header-form-row">
                            <button className="btn-submit" ref="loginBtn" type="submit">LOG IN</button>
                            <a id="forgot-password" className="link noselect" onClick={this.showResetPasswordForm}>FORGOT PASSWORD?</a>
                        </fieldset>

                        {errMsg ? (<label className="form-feedback">{errMsg}</label>) : null}

                        <a onClick={()=>({})}>
                            <u className="a">Create account</u>
                        </a>
                    </form>

                </div>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginTest);


function specialOrRandomPunishmentIsActive(punishment) { // specijalne kazne nemaju created property
    return punishment.created ? false : true;
}

function isMail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}