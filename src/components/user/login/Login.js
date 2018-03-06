import { connect } from 'react-redux'
import React from 'react';
import agent from '../../../agent';

// prilikom gubitka fokusa na polje username/mail, ako nije prazno:
//  - pingaj be api i provjeri jel user postoji:
//      - ako postoji, nista se ne mijenja
//      - ako ne postoji, promjeni login na register formu i ostavi unesene podatke

// animacije: 
//     -  kod promjene na register formu:
//         - promjena velicine
//         - promjena pozadinske 
//         - fadeout elemenata komponente



const PASSWORD_MAX_LEN = 20;
const PASSWORD_MIN_LEN = 3;
const PASSWORD_VALIDATION_ERROR_TEXT = 'Password must be between ' + PASSWORD_MIN_LEN + ' and ' + PASSWORD_MAX_LEN + ' characters long.';


const mapStateToProps = state => ({
    ...state.auth,
    username: state.common.currentUser.username,
    email: state.common.currentUser.email,
    activePunishment: state.game.activePunishment,
    timeSpent: state.game.timeSpent,
    gameInProgress: state.game.gameInProgress,
    // showSetNewPasswordComponent: state.auth.showSetNewPasswordComponent
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
    showRegisterForm: (key = '', value = '') => {
        dispatch({ type: 'SHOW_REGISTER_FORM', key, value });
    },
    showPasswordSetForm: value => {
        dispatch({ type: 'SHOW_CHANGE_PASSWORD_FORM', value });
    },
    showResetPasswordForm: () => {
        dispatch({ type: 'SHOW_RESET_PASSWORD_FORM' });
    }
});

const registerElementHeight = 670;
const resetPwdElementHeight = 400;
const animationDuration = 500; // 0.5s

const animStyles = {
    componentStyle: {
        height: registerElementHeight + 'px',
        backgroundColor: '#FFA623'
    },
    opacityStyle: { opacity: 0 },
    fadeInStyle: { opacity: 1 },
    fieldsetUsernameStyle: { paddingTop: 90 + 'px' },
    fieldsetEmailStyle: { paddingTop: 90 + 'px' },
    fieldsetStyle: { paddingTop: 90 + 'px' },

    // transform to reset pwd
    componentPwdResetStyle: {
        height: resetPwdElementHeight + 'px',
        backgroundColor: '#FFA623'
    },
    pwdFieldHide: {
        opacity: 0,
        height: 0 + 'px',
        marginTop: 0 + 'px'
    },
    btnsTopMarginCollapse: {
        marginTop: 0 + 'px'
    }

};


class LoginTest extends React.Component {
    constructor() {
        super();

        this.mainDiv = null;
        this.pwdFieldset = null;

        this.state = {
            componentStyle: {},
            opacityStyle: { opacity: 0 },
            fieldsetUsernameStyle: { paddingTop: 0 + 'px' },
            fieldsetEmailStyle: { paddingTop: 0 + 'px', backgroundColor: 'red' },
            fieldsetStyle: { paddingTop: 0 + 'px' },
            formDisabled: false
        }

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

            this.animateShowResetPassword();

            setTimeout(() => {
                this.props.showResetPasswordForm();
            }, animationDuration);
        }

        this.whomLostFocus = ev => {
            ev.preventDefault();
            let fieldValue = ev.target.value;

            if (fieldValue.length === 0) return;

            this.checkIfExistingUser(fieldValue);

        }

        this.checkIfExistingUser = async (value) => {

            let response = await agent.Auth.checkIfUserExists(value);
            let key = isMail(value) ? 'email' : 'username';

            if (response.exist !== false) return;

            this.animateChangeToRegister(key);

            setTimeout(() => {
                this.props.showRegisterForm(key, value);
            }, animationDuration);
        }

        this.animateChangeToRegister = key => {

            let fsToChange = key === 'email' ? 'fieldsetEmailStyle' : 'fieldsetUsernameStyle';

            requestAnimationFrame(() => {
                this.setState({
                    componentStyle: { ...this.state.componentStyle, ...animStyles.componentStyle },
                    opacityStyle: { ...this.state.opacityStyle, ...animStyles.opacityStyle },
                    [fsToChange]: { ...this.state[fsToChange], ...animStyles[fsToChange] },
                    fieldsetStyle: { ...this.state.fieldsetStyle, ...animStyles.fieldsetStyle },
                    formDisabled: true
                });
            })
        }

        this.animateShowResetPassword = () => {
            requestAnimationFrame(() => {
                this.setState({
                    componentStyle: {
                        ...this.state.componentStyle,
                        ...animStyles.componentPwdResetStyle
                    },
                    fieldsetEmailStyle: {
                        ...this.state.fieldsetEmailStyle,
                        ...animStyles.pwdFieldHide
                    },
                    opacityStyle: { ...this.state.opacityStyle, opacity: 0 },
                    formDisabled: true
                });
            });
        }

        this.animateMounting = () => {
            console.log('here')
            this.setState({
                opacityStyle: { ...this.state.opacityStyle, ...animStyles.fadeInStyle }
            });
        }
    }


    componentDidMount() {
        this.setState({
            componentStyle: { ...this.state.componentStyle, height: this.mainDiv.clientHeight + 'px' },
            fieldsetEmailStyle: { ...this.state.fieldsetStyle, height: this.pwdFieldset.clientHeight + 'px' }
        });

        requestAnimationFrame(() => {
                this.animateMounting();
        });
    }


    render() {

        const loginWhom = this.props.loginWhom;
        const password = this.props.password;
        const errMsg = this.props._errMsg;
        const isFormDisabled = this.state.formDisabled;

        return (

            <div
                ref={elem => this.mainDiv = elem}
                style={this.state.componentStyle}
                className="parent-component login">

                <div
                    className="container">

                    <label
                        className="heading opacity-tran-fast"
                        style={this.state.opacityStyle}>

                        Log in
                        </label>

                    <form
                        id="login-form"
                        onSubmit={this.submitForm(loginWhom, password)}
                        disabled={isFormDisabled}>

                        <fieldset
                            style={this.state.fieldsetUsernameStyle}
                            className="header-form-row fieldset-padding-top-tran"
                            disabled={isFormDisabled}>

                            <input
                                className="text-input"
                                type="text"
                                value={loginWhom}
                                placeholder="e-mail/username"
                                onChange={this.loginWhomChange}
                                onBlur={this.whomLostFocus}
                                required />
                        </fieldset>

                        <fieldset
                            ref={elem => this.pwdFieldset = elem}
                            style={this.state.fieldsetEmailStyle}
                            className="header-form-row fieldset-padding-top-tran"
                            disabled={isFormDisabled}>

                            <input
                                className="text-input"
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={this.passwordChange}
                                required />

                            {this.passwordValidationError ? <label className="form-feedback">{this.passwordValidationError}</label> : null}

                        </fieldset>

                        <fieldset
                            style={{ ...this.state.opacityStyle, ...this.state.fieldsetStyle }}
                            className="header-form-row opacity-delay-tran"
                            disabled={isFormDisabled}>

                            <button className="btn-submit" ref="loginBtn" type="submit">LOG IN</button>
                            <a id="forgot-password" className="link noselect" onClick={this.showResetPasswordForm}>FORGOT PASSWORD?</a>
                        </fieldset>

                        {errMsg ? (<label className="form-feedback">{errMsg}</label>) : null}

                    </form>

                </div>
            </div >
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


