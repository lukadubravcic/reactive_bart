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
            enableSubmit();

            const isMailValid = isMail(email);

            if (!isMailValid) {
                dispatch({ type: 'REGISTER_MAIL_INVALID', errMsg: 'Invalid email.' });

            } else if (payload.errMsg === 'User with that email exists.') {
                dispatch({ type: 'REGISTER_EXISTING_MAIL', errMsg: 'Existing email. Try logging in.' });

            } else if (payload && payload.hasOwnProperty('errMsg')) {
                dispatch({ type: 'FAILED_REGISTER', errMsg: payload.errMsg });

            } else if (typeof payload.message !== 'undefined') {
                dispatch({ type: 'REGISTER', serverAnswer: payload.message });

            } else {
                dispatch({ type: 'FAILED_REGISTER', errMsg: 'There was an error with register action. Try again.' });
            }
        }, err => console.log(err));
    },
    backToLogin: () => dispatch({ type: 'SHOW_LOGIN_FORM' })
});


const animationDuration = 500; // ms
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

            validEmailField: true,
            validUsernameField: true,
            validPasswordField: true,

            emailExist: false,
            usernameExist: false
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
            this.props.onPasswordChange(ev.target.value);
        };

        this.rePasswordChange = ev => this.props.onRePasswordChange(ev.target.value);

        this.submitForm = (username, email, password, rePassword) => ev => {
            ev.preventDefault();

            if (password === rePassword) {
                this.refs.registerBtn.setAttribute("disabled", "disabled");
                this.props.onSubmit(username, email, password, this.enableSubmit);
            }
        }

        this.enableSubmit = () => {
            this.refs.registerBtn.removeAttribute("disabled");
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


    render() {

        const username = this.props.username;
        const email = this.props.email;
        const password = this.props.password;
        const rePassword = this.props.rePassword;
        const _errMsg = this.props._errMsg;
        const serverAnswer = this.props.serverAnswer;
        const isFormDisabled = this.state.formDisabled;

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
                                ref={elem => this.usernameInput = elem}
                                required />
                            {this.state.usernameExist ? <label className="form-feedback">ALREADY IN USE</label> : null}
                            {this.state.validUsernameField ? null : <label className="form-feedback">INVALID USERNAME</label>}
                        </fieldset>

                        <fieldset
                            style={this.state.pwdFieldsetStyle}
                            className="header-form-row"
                            disabled={isFormDisabled}>

                            <input
                                className="text-input"
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={this.passwordChange}
                                required />
                        </fieldset>

                        <fieldset
                            ref={elem => this.rePwdElement = elem}
                            style={this.state.rePwdFieldsetStyle}
                            className="header-form-row fieldset-collapse-tran"
                            disabled={isFormDisabled}>

                            <input
                                className="text-input"
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
                            className="header-form-row opacity-03-delay-tran-fast"
                            disabled={isFormDisabled}>

                            <button
                                id="btn-register"
                                className="btn-submit"
                                ref="registerBtn"
                                type="submit">
                                REGISTER
                            </button>
                            <button
                                id="btn-additional"
                                className="btn-submit"
                                type="button"
                                onClick={this.backToLogin}>
                                BACK TO LOGIN
                            </button>

                            {this.props.errMsg}
                            {this.props.serverAnswer}
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