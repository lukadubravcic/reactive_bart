import { connect } from 'react-redux'
import React from 'react';
import agent from '../../../agent';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

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
    policyAgreementStatus: state.common.policyAgreementStatus,
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
            // enableSubmit();
            if (payload === null) {
                return dispatch({ type: 'LOGIN_FAILED', errMsg: 'Login failed. Try again' });
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
    showResetPasswordForm: () => dispatch({ type: 'SHOW_RESET_PASSWORD_FORM' }),
    clearDisplayMessage: () => dispatch({ type: 'CLEAR_FORM_MSG' }),
    googleLogin: () => dispatch({}),
    facebookLogin: async fbResponse => {
        if (typeof fbResponse.accessToken === 'undefined') return dispatch({ type: 'LOGIN_FAILED', errMsg: 'Login failed. Try again' });

        let accessToken = fbResponse.accessToken;
        let response = null;

        try {
            response = await agent.Auth.facebookLogin(accessToken);
        } catch (err) {
            console.log(err);
            dispatch({ type: 'LOGIN_FAILED', errMsg: 'Login failed. Try again' });
        }

        agent.setToken(response.token);
        localStorage.setItem('token', response.token);

        dispatch({
            type: 'LOGIN',
            currentUser: {
                username: response.username,
                email: response.email,
                _id: response._id
            },
            token: response.token,
            prefs: response.prefs,
        });
    },
    googleLogin: async googleResponse => {
        if (typeof googleResponse.accessToken === 'undefined') return dispatch({ type: 'LOGIN_FAILED', errMsg: 'Login failed. Try again' });

        let accessToken = googleResponse.accessToken;
        let response = null;

        try {
            response = await agent.Auth.googleLogin(accessToken);
        } catch (err) {
            console.log(err);
            dispatch({ type: 'LOGIN_FAILED', errMsg: 'Login failed. Try again' });
        }

        agent.setToken(response.token);
        localStorage.setItem('token', response.token);

        dispatch({
            type: 'LOGIN',
            currentUser: {
                username: response.username,
                email: response.email,
                _id: response._id
            },
            token: response.token,
            prefs: response.prefs,
        });
    },
    failedLogin: msg => dispatch({ type: 'LOGIN_FAILED', errMsg: msg.toUpperCase() }),
    showTopBarElement: () => dispatch({ type: 'CHANGE_SHOWN_TOP_ELEMENT', element: 'start' }),
});

const topBarElementHeight = 150;
const registerElementHeight = 670;
const resetPwdElementHeight = 400;
const animationDuration = 500; // 0.5s
const formMsgDuration = 2000; // 2s

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
    },
    // tranform to def top bar 
    topComponentStyle: {
        height: topBarElementHeight,
        backgroundColor: "#C4ACE4",
    },
};


class Login extends React.Component {
    constructor() {
        super();

        this.mainDiv = null;
        this.pwdFieldset = null;
        this.whomField = null;
        this.formMsgTimeout = null;
        this.whomFieldId = 'WHOM_FIELD';
        this.forgotPasswordLinkId = 'forgot-password';
        this.toResetTimeout = null;
        this.checkForUserTimeout = null;
        this.toTopBarTimeout = null;

        this.state = {
            componentStyle: {},
            opacityStyle: { opacity: 0 },
            fieldsetUsernameStyle: { paddingTop: 0 + 'px' },
            fieldsetEmailStyle: { paddingTop: 0 + 'px', backgroundColor: 'red' },
            fieldsetStyle: { paddingTop: 0 + 'px' },
            formDisabled: false,

            submitBtnDisabled: false,
            showFormMsg: false,

            whomFieldFocused: false,
        }

        this.passwordValidationError = null;

        this.loginWhomChange = event => {
            this.props.onLoginWhomChange(event.target.value);
        }

        this.passwordChange = event => {
            if (
                event.target.value.length !== 0
                && (event.target.value.length < PASSWORD_MIN_LEN
                    || event.target.value.length > PASSWORD_MAX_LEN)
            ) {
                this.passwordValidationError = PASSWORD_VALIDATION_ERROR_TEXT;
            }
            else this.passwordValidationError = null;

            this.props.onPasswordChange(event.target.value);
        }

        this.submitForm = (loginWhom, password) => ev => {
            ev.preventDefault();
            // this.refs.loginBtn.setAttribute('disabled', 'true');
            this.disableSubmit();
            this.props.onSubmit(loginWhom, password, this.enableSubmit);
        }

        this.showResetPasswordForm = ev => {
            ev.preventDefault();
            if (this.props.policyAgreementStatus !== true) return;
            this.animateShowResetPassword();
            this.toResetTimeout = setTimeout(() => {
                this.props.showResetPasswordForm();
            }, animationDuration);
        }

        this.whomLostFocus = () => {
            this.unfocusWhomField();
            let fieldValue = this.props.loginWhom;
            if (fieldValue.length === 0) return;
            this.checkIfExistingUser(fieldValue);
        }

        this.focusingWhomField = ev => {
            this.setState({ whomFieldFocused: true });
        }

        this.unfocusWhomField = () => {
            this.setState({ whomFieldFocused: false });
        }

        this.checkIfExistingUser = async (value) => {
            let response = await agent.Auth.checkIfUserExists(value);
            let key = isMail(value) ? 'email' : 'username';
            if (response.exist !== false) return;
            this.animateChangeToRegister(key);
            this.checkForUserTimeout = setTimeout(() => {
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
            });
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
            this.setState({
                opacityStyle: { ...this.state.opacityStyle, ...animStyles.fadeInStyle }
            });
        }

        this.enableSubmit = () => {
            this.setState({ submitBtnDisabled: false });
        }

        this.disableSubmit = () => {
            this.setState({ submitBtnDisabled: true });
        }

        this.displayFormMessage = () => {
            this.setState({ showFormMsg: true });
            this.formMsgTimeout = setTimeout(() => {
                this.setState({ showFormMsg: false });
                this.props.clearDisplayMessage();
                this.enableSubmit();
            }, formMsgDuration)
        }

        this.toRegisterForm = ev => {
            ev.preventDefault();
            this.animateChangeToRegister('email');
            this.checkForUserTimeout = setTimeout(() => {
                this.props.showRegisterForm('email', '');
            }, animationDuration);
        }

        this.facebookResponseHandler = response => {
            this.props.facebookLogin(response);
        }

        this.googleFailureResponseHandler = response => {
            this.props.failedLogin('COULD NOT LOGIN');
        }

        this.googleSuccessResponseHandler = response => {
            this.props.googleLogin(response);
        }

        this.closeForm = ev => {
            ev.preventDefault();
            // animacija prijelaza prema defaultnom top bar elementu (traka sa login / register btnima)
            this.animateToTopBar();
            this.toTopBarTimeout = setTimeout(() => {
                this.props.showTopBarElement();
            }, animationDuration);
        }

        this.animateToTopBar = () => {
            requestAnimationFrame(() => {
                this.setState({
                    componentStyle: {
                        ...this.state.componentStyle,
                        ...animStyles.topComponentStyle
                    },
                    fieldsetEmailStyle: { ...this.state.fieldsetEmailStyle, opacity: 0 },
                    fieldsetUsernameStyle: { ...this.state.fieldsetUsernameStyle, opacity: 0 },
                    opacityStyle: { ...this.state.opacityStyle, opacity: 0 },
                    formDisabled: true,
                });
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
            this.whomField.focus();
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps._errMsg === null && this.props._errMsg !== null) {
            this.displayFormMessage();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.formMsgTimeout);
        clearTimeout(this.toResetTimeout);
        clearTimeout(this.checkForUserTimeout);
        clearTimeout(this.toTopBarTimeout);
    }

    render() {

        const loginWhom = this.props.loginWhom;
        const password = this.props.password;
        const errMsg = this.props._errMsg;
        const isFormDisabled = this.state.formDisabled || this.props.policyAgreementStatus !== true;
        const submitBtnStyle = this.state.submitBtnDisabled
            ? { opacity: 0.5, pointerEvents: "none" }
            : { opacity: 1 };

        return (
            <div
                ref={elem => this.mainDiv = elem}
                style={this.state.componentStyle}
                className="parent-component login">

                <div
                    className="container">

                    <button
                        style={this.state.opacityStyle}
                        className="btn-close-share-dialog btn-close-forms"
                        onClick={this.closeForm}>
                        {closeBtnSVG}
                    </button>

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
                                ref={elem => this.whomField = elem}
                                id={this.whomFieldId}
                                className="text-input"
                                type="text"
                                value={loginWhom}
                                placeholder="e-mail/username"
                                onChange={this.loginWhomChange}
                                onFocus={this.focusingWhomField}
                                onBlur={this.whomLostFocus}
                                spellCheck="false"
                                required />
                        </fieldset>

                        <fieldset
                            ref={elem => this.pwdFieldset = elem}
                            style={this.state.fieldsetEmailStyle}
                            className="header-form-row fieldset-padding-top-tran"
                            disabled={isFormDisabled}>

                            <input
                                className={`text-input ${this.passwordValidationError ? "input-wrong-entry" : ""}`}
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={this.passwordChange}
                                required />
                            {this.state.showFormMsg
                                ? (<label className="form-feedback">{errMsg.toUpperCase()}</label>)
                                : <a id="forgot-password" className="link noselect" onClick={this.showResetPasswordForm}>FORGOT PASSWORD?</a>
                            }
                        </fieldset>

                        <fieldset
                            style={{ ...this.state.opacityStyle, ...this.state.fieldsetStyle }}
                            className="header-form-row opacity-delay-tran"
                            disabled={isFormDisabled}>

                            <button
                                style={submitBtnStyle}
                                className="btn-submit opacity-tran"
                                type="submit"
                                disabled={this.state.submitBtnDisabled}>
                                LOG IN
                            </button>

                            <a
                                className="link noselect"
                                onClick={this.toRegisterForm}>
                                BACK TO REGISTER
                            </a>

                        </fieldset>

                        <fieldset
                            style={{ ...this.state.opacityStyle, ...this.state.fieldsetStyle }}
                            className="header-form-row opacity-delay-tran social-login-fieldset"
                            disabled={isFormDisabled}>
                            <span className="login-fieldset-or-row">OR</span>
                        </fieldset>

                        <fieldset
                            style={{ ...this.state.opacityStyle, ...this.state.fieldsetStyle }}
                            className="header-form-row opacity-delay-tran social-login-fieldset"
                            disabled={isFormDisabled}>
                            <FacebookLogin
                                appId="213586112596663"
                                textButton="LOG IN WITH FACEBOOK"
                                autoLoad={false}
                                fields="email"
                                callback={this.facebookResponseHandler}
                                cssClass="facebook-login-button"
                                icon={fbIconSVG} />
                        </fieldset>

                        <fieldset
                            style={{ ...this.state.opacityStyle, ...this.state.fieldsetStyle }}
                            className="header-form-row opacity-delay-tran social-login-fieldset"
                            disabled={isFormDisabled}>
                            <GoogleLogin
                                clientId="985970123837-7u2ac8drrt2ob005n90e69iskmnn4em3.apps.googleusercontent.com"
                                buttonText={<span>{gIconSVG}LOG IN WITH GOOGLE+</span>}
                                onSuccess={this.googleSuccessResponseHandler}
                                onFailure={this.googleFailureResponseHandler}
                                className="google-login-button" />
                        </fieldset>

                    </form>

                </div>
            </div >
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Login);


function isMail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}




const fbIconSVG = (
    <svg style={{
        top: "3px",
        position: "relative",
        marginRight: "25px",
        marginLeft: "25px",
    }}
        width="27px" height="27px" viewBox="0 0 27 27" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="facebook-login-btn-g" transform="translate(-393.000000, -488.000000)" fill="#FFFFFF">
                <g id="Facebook" transform="translate(365.000000, 471.000000)">
                    <path d="M54.7886957,21.4655652 C54.7886957,19.1208696 52.6693913,17 50.3246957,17 L32.4655652,17 C30.1193043,17 28,19.1208696 28,21.4655652 L28,39.3254783 C28,41.6717391 30.1193043,43.7886957 32.4655652,43.7886957 L41.3943478,43.7886957 L41.3943478,33.6711304 L38.1206957,33.6711304 L38.1206957,29.2055652 L41.3943478,29.2055652 L41.3943478,27.4642609 C41.3943478,24.466087 43.6474783,21.7629565 46.4171304,21.7629565 L50.0273043,21.7629565 L50.0273043,26.2285217 L46.4171304,26.2285217 C46.0211304,26.2285217 45.5625217,26.7074783 45.5625217,27.4266957 L45.5625217,29.2055652 L50.0273043,29.2055652 L50.0273043,33.6711304 L45.5625217,33.6711304 L45.5625217,43.7886957 L50.3246957,43.7886957 C52.6693913,43.7886957 54.7886957,41.6717391 54.7886957,39.3254783 L54.7886957,21.4655652 Z" id="Fill-70"></path>
                </g>
            </g>
        </g>
    </svg>
)

const gIconSVG = (
    <svg style={{
        top: "2px",
        position: "relative",
        marginRight: "20px",
        marginLeft: "25px",
    }}
        width="33px" height="21px" viewBox="0 0 33 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="google-login-btn-g" transform="translate(-390.000000, -571.000000)" fill="#FFFFFF">
                <g id="Google" transform="translate(365.000000, 551.000000)">
                    <g id="Group-2" transform="translate(25.000000, 20.000000)">
                        <polygon id="Fill-1" points="26.7200124 4.98908472 26.7200124 8.64347361 23.0608088 8.64347361 23.0608088 11.2492236 26.7200124 11.2492236 26.7200124 14.9037097 29.3298354 14.9037097 29.3298354 11.2492236 32.9881628 11.2492236 32.9881628 8.64347361 29.3298354 8.64347361 29.3298354 4.98908472"></polygon>
                        <path d="M3.02140796,17.8191028 C-1.04567168,13.7019361 -1.00089292,7.0637 3.1207,3.00146389 C7.10591239,-0.925730556 13.4197177,-0.983188889 17.5121071,2.73546389 L14.4565407,5.787075 L14.461408,5.78240833 C12.209815,3.58275556 8.48529292,3.68231111 6.17441681,5.99581111 C3.74370885,8.42831111 3.71732832,12.4033389 6.11493894,14.8686028 C8.51362035,17.3339639 12.7022841,17.3587556 14.9490097,14.9092417 C15.572992,14.2295611 15.9254788,13.4238806 16.0987531,12.5454778 L10.4936204,12.5454778 L10.4926469,8.36686667 L20.3663637,8.36686667 C20.9152929,11.8772694 20.2534434,15.4182 17.9521071,17.8869639 C14.1410451,21.9772972 7.08936372,21.9362694 3.02140796,17.8191028" id="Fill-2"></path>
                    </g>
                </g>
            </g>
        </g>
    </svg>
)

const closeBtnSVG = (
    <svg width="20px" height="19px" viewBox="0 0 20 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
            <g id="share-btn-svg" transform="translate(-541.000000, -20.000000)" stroke="#FFFFFF">
                <g id="Line-+-Line-Copy" transform="translate(541.000000, 20.000000)">
                    <path d="M0.526315789,0.526315789 L18.9548854,18.9548854" id="Line"></path>
                    <path d="M0.526315789,0.526315789 L18.9548854,18.9548854" id="Line-Copy" transform="translate(10.000000, 10.000000) scale(-1, 1) translate(-10.000000, -10.000000) "></path>
                </g>
            </g>
        </g>
    </svg>
);