import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const mapStateToProps = state => ({
    ...state.auth
});

const mapDispatchToProps = dispatch => ({
    onUsernameChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'username', value }),

    onEmailChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value }),

    onPasswordChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value }),

    onRePasswordChange: value =>
        dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'rePassword', value }),

    onSubmit: (username, email, password, enableSubmit) => {
        dispatch({ type: 'REGISTER_ATTEMPT' });

        agent.Auth.register(username, email, password).then(payload => {
            // ako je ispravan register onda prikaz login forma, u drugom slucaju prikazi err poruku
            // enableSubmit();
            const isMailValid = isMail(email);

            if (!isMailValid) {
                dispatch({ type: 'REGISTER_MAIL_INVALID', errMsg: 'Invalid email.' });
            } else if (payload.errMsg === 'User with that email exists.') {
                dispatch({ type: 'REGISTER_EXISTING_MAIL', errMsg: 'Existing email. Try logging in.' });
            } else if (payload && payload.hasOwnProperty('errMsg')) {
                dispatch({ type: 'FAILED_REGISTER', errMsg: payload.errMsg });
            } else if (typeof payload.message !== 'undefined') {
                let forceLogin = typeof payload.invitedUser !== 'undefined' ? payload.invitedUser : false;
                dispatch({
                    type: 'REGISTER',
                    serverAnswer: payload.message,
                    forceLogin: forceLogin,
                });
            } else {
                dispatch({ type: 'FAILED_REGISTER', errMsg: 'There was an error with register action. Try again.' });
            }
        }, err => console.log(err));
    },
    backToLogin: () => dispatch({ type: 'SHOW_LOGIN_FORM' }),
    clearDisplayMessage: () => dispatch({ type: 'CLEAR_FORM_MSG' }),
    login: (loginWhom, password) => {
        dispatch({ type: 'LOGIN_ATTEMPT' });

        let dataToSend = {};
        isMail(loginWhom) ? dataToSend.email = loginWhom : dataToSend.username = loginWhom;
        dataToSend.password = password;

        agent.Auth.login({ ...dataToSend }).then(payload => {
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
});


const animationDuration = 500; // ms
const formMsgDuration = 5000; // 5s
const loginHeight = 490;

const animStyles = {
    //mount styles
    parentContainerMountStyle: {},
    labelMountStyle: { opacity: 1 },
    emailFieldsetMountStyle: { opacity: 1 },
    usernameFieldsetMountStyle: { opacity: 1 },
    pwdFieldsetMountStyle: {},
    rePwdFieldsetMountStyle: { opacity: 1 },
    btnFieldsetMountStyle: { opacity: 1 },

    // dismount styles
    parentContainerDismountStyle: {
        height: loginHeight + 'px',
        backgroundColor: '#C4ACE4'
    },
    labelDismountStyle: { opacity: 0 },
    emailFieldsetDismountStyle: {},
    usernameFieldsetDismountStyle: {},
    pwdFieldsetDismountStyle: {},
    rePwdFieldsetDismountStyle: {
        opacity: 0,
        height: 0,
        marginTop: 0,
    },
    btnFieldsetDismountStyle: { opacity: 0 },
    fieldsetCollapse: {
        opacity: 0,
        height: 0,
        marginTop: 0,
    },
    marginTopCollapse: {
        marginTop: 0
    }
};


class Register extends React.Component {

    constructor() {
        super();

        this.emailInput = null;
        this.usernameInput = null;
        this.parentContainer = null;
        this.formMsgTimeout = null;
        this.emailField = null;
        this.usernameField = null;
        this.rePwdElement = null;

        this.state = {
            parentContainerStyle: { backgroundColor: '#FFA623' },
            labelStyle: { opacity: 0 },
            emailFieldsetStyle: { opacity: 1 },
            usernameFieldsetStyle: { opacity: 1 },
            pwdFieldsetStyle: {},
            rePwdFieldsetStyle: { opacity: 0, },
            btnFieldsetStyle: { opacity: 0 },

            formDisabled: true,
            submitBtnDisabled: false,

            validEmailField: true,
            validUsernameField: true,
            validPasswordField: true,

            emailExist: false,
            usernameExist: false,

            showPwdInvalidHoverElement: false,
            showFormMessage: false,
        }

        this.usernameChange = ev => {
            if (ev.target.value.length > 0 && !validateUsername(ev.target.value)) {
                this.setState({ validUsernameField: false });
            } else this.setState({ validUsernameField: true });
            this.setState({ usernameExist: false });
            this.props.onUsernameChange(ev.target.value);
        };

        this.emailChange = ev => {
            if (ev.target.value.length > 0 && !isMail(ev.target.value)) {
                this.setState({ validEmailField: false });
            } else this.setState({ validEmailField: true });
            this.setState({ emailExist: false });
            this.props.onEmailChange(ev.target.value);
        };

        this.passwordChange = ev => {
            if (ev.target.value.length > 0 && !validatePassword(ev.target.value)) {
                this.setState({ validPasswordField: false });
            } else this.setState({ validPasswordField: true, showPwdInvalidHoverElement: false });
            this.props.onPasswordChange(ev.target.value);
        };

        this.rePasswordChange = ev => this.props.onRePasswordChange(ev.target.value);

        this.submitForm = (username, email, password, rePassword) => ev => {
            ev.preventDefault();
            this.disableSubmit();
            if (password === rePassword) {
                // this.refs.registerBtn.setAttribute("disabled", "disabled");
                this.props.onSubmit(username, email, password, this.enableSubmit);
            }
        }

        this.enableSubmit = () => {
            this.setState({ submitBtnDisabled: false });
        }

        this.disableSubmit = () => {
            this.setState({ submitBtnDisabled: true });
        }

        this.backToLogin = ev => {
            ev.preventDefault();
            this.animateDismounting();
            setTimeout(() => {
                this.props.backToLogin();
            }, animationDuration);
        }

        this.animateMounting = () => {
            // fadein username/email (onaj koji je prazan), naslov i btne
            let emailStyle = { ...this.state.emailFieldsetStyle };
            let usernameStyle = { ...this.state.usernameFieldsetStyle };

            if (this.props.email.length === 0) emailStyle = { ...emailStyle, ...animStyles.emailFieldsetMountStyle };
            else usernameStyle = { ...usernameStyle, ...animStyles.usernameFieldsetMountStyle };

            this.setState({
                labelStyle: { ...this.state.labelStyle, ...animStyles.labelMountStyle },
                emailFieldsetStyle: { ...emailStyle },
                usernameFieldsetStyle: { ...usernameStyle },
                rePwdFieldsetStyle: { ...this.state.rePwdFieldsetStyle, ...animStyles.rePwdFieldsetMountStyle },
                btnFieldsetStyle: { ...this.state.btnFieldsetStyle, ...animStyles.btnFieldsetMountStyle },
                formDisabled: false
            });
        }

        this.animateDismounting = () => {

            let emailDismStyle = { ...this.state.emailFieldsetStyle };
            let usernameDismStyle = { ...this.state.usernameFieldsetStyle };
            // postavi dismount stilove -> ako postoji unesen email
            if (this.props.email.length > 0) {
                usernameDismStyle = { ...usernameDismStyle, ...animStyles.fieldsetCollapse };
            } else {
                emailDismStyle = { ...emailDismStyle, ...animStyles.fieldsetCollapse };
                usernameDismStyle = { ...usernameDismStyle, ...animStyles.marginTopCollapse };
            }

            this.setState({
                parentContainerStyle: { ...this.state.parentContainerStyle, ...animStyles.parentContainerDismountStyle },
                emailFieldsetStyle: { ...emailDismStyle },
                usernameFieldsetStyle: { ...usernameDismStyle },
                labelStyle: { ...this.state.labelStyle, ...animStyles.labelDismountStyle },
                rePwdFieldsetStyle: { ...this.state.rePwdFieldsetStyle, ...animStyles.rePwdFieldsetDismountStyle },
                btnFieldsetStyle: { ...this.state.btnFieldsetStyle, ...animStyles.btnFieldsetDismountStyle },
                formDisabled: true
            });
        }

        this.onEmailBlur = async ev => {
            ev.preventDefault();
            if (this.props.email.length === 0) return;
            let { exist } = await agent.Auth.checkIfUserExists(this.props.email);
            if (!exist) return this.setState({ emailExist: false });
            return this.setState({ emailExist: true });
        }

        this.onUsernameBlur = async ev => {
            ev.preventDefault();
            if (this.props.username.length === 0) return;
            let { exist } = await agent.Auth.checkIfUserExists(this.props.username);
            if (!exist) return this.setState({ usernameExist: false });
            return this.setState({ usernameExist: true });
        }

        this.showPwdInvalidElement = ev => {
            ev.preventDefault();
            this.setState({ showPwdInvalidHoverElement: true });
        }

        this.hidePwdInvalidElement = ev => {
            ev.preventDefault();
            this.setState({ showPwdInvalidHoverElement: false });
        }

        this.displayFormMessage = () => {
            this.setState({ showFormMsg: true });
            this.formMsgTimeout = setTimeout(() => {
                this.setState({ showFormMsg: false });
                this.props.clearDisplayMessage();
                this.enableSubmit();
            }, formMsgDuration)
        }

        this.userLogin = () => {
            this.forceLoginTimeout = setTimeout(() => {
                this.props.login(this.props.email, this.props.password);
            }, formMsgDuration);
        }
    }

    componentDidMount() {

        this.setState({
            parentContainerStyle: { ...this.state.parentContainerStyle, height: this.parentContainer.clientHeight },
            emailFieldsetStyle: { ...this.state.emailFieldsetStyle, height: this.emailField.clientHeight },
            usernameFieldsetStyle: { ...this.state.usernameFieldsetStyle, height: this.usernameField.clientHeight },
            rePwdFieldsetStyle: { ...this.state.rePwdFieldsetStyle, height: this.rePwdElement.clientHeight }
        });

        requestAnimationFrame(() => {
            this.animateMounting();
            this.props.email !== '' ? this.usernameInput.focus() : this.emailInput.focus();
        });
    }

    componentDidUpdate(prevProps) {
        if (
            (prevProps._errMsg === null && this.props._errMsg !== null)
            || (prevProps.serverAnswer === null && this.props.serverAnswer !== null)
        ) {
            this.displayFormMessage();
            if (prevProps.forceLogin === false && this.props.forceLogin === true) {
                this.userLogin();
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(this.formMsgTimeout);
    }

    render() {
        const username = this.props.username;
        const email = this.props.email;
        const password = this.props.password;
        const rePassword = this.props.rePassword;
        const _errMsg = this.props._errMsg;
        const serverAnswer = this.props.serverAnswer;
        const passwordWrongEntryWarning = '3 to 20 characters, contain at least one numeric digit, one uppercase and lowercase letter.';
        const isFormDisabled = this.state.formDisabled;
        const isSubmitDisabled =
            this.state.formDisabled
            || this.state.usernameExist
            || !this.state.validEmailField
            || !this.state.validUsernameField
            || !this.state.validPasswordField
            || this.state.submitBtnDisabled;
        const submitBtnStyle = this.state.submitBtnDisabled
            ? { opacity: 0.5, pointerEvents: "none" }
            : { opacity: 1 };

        return (

            <div
                ref={elem => this.parentContainer = elem}
                style={this.state.parentContainerStyle}
                className="parent-component header register-header height-tran backgroundcolor-tran">

                <div className="container">

                    <label
                        style={this.state.labelStyle}
                        className="heading register-heading opacity-tran">

                        New user registration
                    </label>

                    <form
                        className="register-form"
                        onSubmit={this.submitForm(username, email, password, rePassword)}
                        disabled={isFormDisabled}>

                        <fieldset
                            ref={elem => this.emailField = elem}
                            style={this.state.emailFieldsetStyle}
                            className="header-form-row fieldset-collapse-tran"
                            disabled={isFormDisabled}>

                            <input
                                ref={elem => this.emailInput = elem}
                                className={`text-input ${!this.state.validEmailField || this.state.emailExist ? "input-wrong-entry" : ""}`}
                                type="text"
                                placeholder="e-mail"
                                value={email}
                                onChange={this.emailChange}
                                onBlur={this.onEmailBlur}
                                required />

                            {this.state.emailExist ? <label className="form-feedback">ALREADY IN USE</label> : null}
                            {this.state.validEmailField ? null : <label className="form-feedback">INVALID E-MAIL</label>}
                        </fieldset>

                        <fieldset
                            ref={elem => this.usernameField = elem}
                            style={this.state.usernameFieldsetStyle}
                            className="header-form-row fieldset-collapse-tran"
                            disabled={isFormDisabled}>

                            <input
                                className={`text-input ${!this.state.validUsernameField || this.state.usernameExist ? "input-wrong-entry" : ""}`}
                                type="text"
                                placeholder="username"
                                value={username}
                                onChange={this.usernameChange}
                                onBlur={this.onUsernameBlur}
                                ref={elem => this.usernameInput = elem} />
                            {this.state.usernameExist ? <label className="form-feedback">ALREADY IN USE</label> : null}
                            {this.state.validUsernameField ? null : <label className="form-feedback">INVALID USERNAME</label>}
                        </fieldset>

                        <fieldset
                            style={this.state.pwdFieldsetStyle}
                            className="header-form-row"
                            disabled={isFormDisabled}>

                            <input
                                className={`text-input ${!this.state.validPasswordField ? "input-wrong-entry" : ""}`}
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={this.passwordChange}
                                required />
                            {!this.state.validPasswordField
                                ? <label
                                    className="form-feedback"
                                    onMouseOver={this.showPwdInvalidElement}
                                    onMouseOut={this.hidePwdInvalidElement}>
                                    <u>UNACCEPTABLE</u>

                                    {this.state.showPwdInvalidHoverElement
                                        ? <div
                                            style={{
                                                position: "absolute",
                                                width: 500 + "px",
                                                right: -160 + "px",
                                                bottom: 25 + "px",
                                            }}
                                            className="hover-dialog" >

                                            <label className="hover-dialog-text">
                                                {passwordWrongEntryWarning}
                                            </label>

                                            <div className="triangle-hover-box-container">
                                                <svg id="triangle-element" width="23px" height="14px" viewBox="0 0 23 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                                    <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-528.000000, -981.000000)">
                                                        <g id="Fill-2-+-LOG-IN-+-Triangle-4-Copy" transform="translate(456.000000, 916.000000)" fill="#323232">
                                                            <polygon id="Triangle-4-Copy" transform="translate(83.500000, 72.000000) scale(1, -1) translate(-83.500000, -72.000000) "
                                                                points="83.5 65 95 79 72 79"></polygon>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                        </div>
                                        : null}

                                </label>
                                : null}
                        </fieldset>

                        <fieldset
                            ref={elem => this.rePwdElement = elem}
                            style={this.state.rePwdFieldsetStyle}
                            className="header-form-row fieldset-collapse-tran"
                            disabled={isFormDisabled}>

                            <input
                                className={`text-input ${password !== rePassword && rePassword.length ? "input-wrong-entry" : ""}`}
                                type="password"
                                placeholder="repeat password"
                                value={rePassword}
                                onChange={this.rePasswordChange}
                                required />

                            {password !== rePassword && rePassword.length
                                ? <label className="form-feedback">DOESN'T MATCH</label>
                                : null}

                        </fieldset>

                        <fieldset
                            style={this.state.btnFieldsetStyle}
                            className="header-form-row opacity-03-delay-tran-fast">

                            <button
                                style={submitBtnStyle}
                                id="btn-register"
                                className="btn-submit opacity-tran"
                                type="submit"
                                disabled={isFormDisabled || isSubmitDisabled}>
                                REGISTER
                            </button>
                            <button
                                style={submitBtnStyle}
                                id="btn-additional"
                                className="btn-submit"
                                type="button"
                                onClick={this.backToLogin}
                                disabled={this.state.submitBtnDisabled}>
                                BACK TO LOGIN
                            </button>
                            {this.props._errMsg && this.state.showFormMsg
                                ?
                                <label className="form-feedback">{this.props._errMsg.toUpperCase()}</label>
                                : null}
                            {this.props.serverAnswer && this.state.showFormMsg
                                ?
                                <label className="form-feedback">{this.props.serverAnswer.toUpperCase()}</label>
                                : null}
                        </fieldset>

                    </form>

                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);



function isMail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};


function validatePassword(password) {
    const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{2,20}$/;

    if (pwdRegex.test(password)) {
        return true;

    } else return false // '3 to 20 characters, contain at least one numeric, uppercase and lowercase character.';
};

function validateUsername(username) {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9-_\.]{2,20}$/;

    if (usernameRegex.test(username)) {
        return true;

    } else return false // '3 to 20 characters (no white-space).';
}