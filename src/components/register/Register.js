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


const animationDuration = 2000; // 2s

const animStyles = {
    opacityStyle: { opacity: 1 },
    parentContainerStyle: {
        height: 490 + 'px',
        backgroundColor: '#C4ACE4'
    },
    fieldsetsToHide: {
        height: 0 + 'px',
    },
    fieldsets: {
        marginBottom: 90 + 'px'
    }

};


class Register extends React.Component {

    constructor() {
        super();

        this.emailInput = null;
        this.usernameInput = null;
        this.parentContainer = null;
        this.fieldsetElement = null;

        this.state = {
            opacityStyle: { opacity: 0 },
            parentContainerStyle: {},
            fieldsetsToHide: {},
            fieldsets: { marginBottom: 0 },
            formDisabled: true
        }

        this.usernameChange = ev => {
            this.props.onUsernameChange(ev.target.value);
        };

        this.emailChange = ev => {
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

            this.setState({
                opacityStyle: { ...this.state.opacityStyle, ...animStyles.opacityStyle },
                formDisabled: false
            });
        }

        this.animateDismounting = () => {

            this.setState({
                /* parentContainerStyle: { ...this.state.parentContainerStyle, ...animStyles.parentContainerStyle }, */
                fieldsets: { ...this.state.fieldsets, ...animStyles.fieldsets }
            })

        };
    }

    componentDidMount() {
        this.setState({
            parentContainerStyle: { height: this.parentContainer.clientHeight },
            fieldsets: { height: this.fieldsetElement.clientHeight }
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
                className="parent-component header register-header height-tran">

                <div className="container">

                    <label
                        style={this.state.opacityStyle}
                        className="heading register-heading opacity-tran-fast">

                        New user registration
                    </label>

                    <form
                        className="register-form"
                        onSubmit={this.submitForm(username, email, password, rePassword)}
                        disabled={isFormDisabled}>

                        <fieldset
                            className="header-form-row"
                            disabled={isFormDisabled}>

                            <input
                                className="text-input"
                                type="text"
                                placeholder="e-mail"
                                value={email}
                                onChange={this.emailChange}
                                ref={elem => this.emailInput = elem}
                                required />
                        </fieldset>

                        <fieldset
                            ref={elem => this.fieldsetElement = elem}
                            style={this.state.fieldsets}
                            className="header-form-row fieldset-top-tran-fast"
                            disabled={isFormDisabled}>

                            <input
                                className="text-input"
                                type="text"
                                placeholder="username"
                                value={username}
                                onChange={this.usernameChange}
                                ref={elem => this.usernameInput = elem}
                                required />
                            {/* <label className="form-feedback">ALREADY IN USE</label> */}
                        </fieldset>

                        <fieldset
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
                            className="header-form-row opacity-tran fieldset-top-tran-fast"
                            disabled={isFormDisabled}>

                            <input
                                style={this.state.fieldsets}
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
                            style={this.state.opacityStyle}
                            className="header-form-row opacity-tran"
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
}