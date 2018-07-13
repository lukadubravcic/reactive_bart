import React from 'react';
import { connect } from 'react-redux';
import agent from '../../../agent';


const mapStateToProps = state => ({
    ...state.auth
});

const mapDispatchToProps = dispatch => ({
    onEmailChange: value => dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value }),
    submitResetPassword: (email, enableForm) => {
        dispatch({ type: 'RESET_PASSWORD_ATTEMPT' });
        agent.Auth.forgotPassword(email).then(payload => {
            if (payload !== null) {
                if (typeof payload.message !== "undefined") {
                    dispatch({ type: 'RESET_PASSWORD_ANSWER', errMsg: payload.message });

                } else {
                    dispatch({ type: 'RESET_PASSWORD_FAILED', errMsg: 'Password reset failed. Try again.' });
                }
            }
            enableForm();

        }, () => {
            enableForm();
            dispatch({ type: 'RESET_PASSWORD_FAILED', errMsg: 'Password reset failed. Try again.' });

        });
    },
    backToLogin: fieldValue => dispatch({ type: 'HIDE_RESET_PASSWORD_FORM', fieldValue }),
    clearDisplayMessage: () => dispatch({ type: 'CLEAR_FORM_MSG' }),
});


const animationDuration = 500;
const formMsgDuration = 2000;
const loginHeight = 690;

const animStyles = {
    labelMountStyle: {
        opacity: 1
    },
    btnFieldsetMountStyle: {
        opacity: 1
    },
    componentContainerDismountStyle: {
        height: loginHeight + 'px',
        backgroundColor: '#C4ACE4'
    },
    labelDismountStyle: {
        opacity: 0
    },
    emailFieldsetDismountStyle: {
        height: 160 + 'px'  // visina dva fieldseta
    }
}


class ResetPassword extends React.Component {

    constructor() {
        super();

        this.parentContainer = null;
        this.emailFieldset = null;

        this.state = {
            componentContainerStyle: {},
            labelStyle: {
                opacity: 0
            },
            emailFieldsetStyle: {},
            btnFieldsetStyle: {
                opacity: 0
            },
            showFormMsg: false,
            submitBtnDisabled: false,
        }

        this.emailChange = event => {
            this.props.onEmailChange(event.target.value);
        }

        this.submitForm = email => ev => {
            ev.preventDefault();
            this.disableSubmitButton();
            this.refs.pwdResetBtn.setAttribute('disabled', 'disabled');
            this.refs.backBtn.setAttribute('disabled', 'disabled');
            this.props.submitResetPassword(email, this.enableForm);
        }

        this.enableForm = () => {
            this.refs.pwdResetBtn.removeAttribute('disabled');
            this.refs.backBtn.removeAttribute('disabled');
        }

        this.disableSubmitButton = () => {
            this.setState({ submitBtnDisabled: true });
        }

        this.enableSubmitButton = () => {
            this.setState({ submitBtnDisabled: false });
        }

        this.backToLogin = ev => {
            ev.preventDefault();

            requestAnimationFrame(() => {
                this.animateDismounting();
            });

            setTimeout(() => {
                this.props.backToLogin(this.props.email);
            }, animationDuration);
        }

        this.animateMounting = () => {
            this.setState({
                labelStyle: { ...this.state.labelStyle, ...animStyles.labelMountStyle },
                btnFieldset: { ...this.state.btnFieldset, ...animStyles.btnFieldsetMountStyle },
            });
        }

        this.animateDismounting = () => {
            this.setState({
                componentContainerStyle: { ...this.state.componentContainerStyle, ...animStyles.componentContainerDismountStyle },
                labelStyle: { ...this.state.labelStyle, ...animStyles.labelDismountStyle },
                emailFieldsetStyle: { ...this.state.emailFieldsetStyle, ...animStyles.emailFieldsetDismountStyle },
            });
        }

        this.displayFormMessage = () => {
            this.setState({ showFormMsg: true });
            this.formMsgTimeout = setTimeout(() => {
                this.setState({ showFormMsg: false });
                this.props.clearDisplayMessage();
                this.enableSubmitButton();
            }, formMsgDuration)
        }
    }

    componentDidMount() {

        this.setState({
            componentContainerStyle: { ...this.state.componentContainerStyle, height: this.parentContainer.clientHeight + 'px' },
            emailFieldsetStyle: { ...this.state.emailFieldsetStyle, height: this.emailFieldset.clientHeight + 'px' },
        });

        requestAnimationFrame(() => {
            this.animateMounting();
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps._errMsg === null && this.props._errMsg !== null) {
            this.displayFormMessage();
        }
    }

    render() {

        const email = this.props.email;
        const validMail = email.length > 0 ? isMail(email) : true;
        const serverMsg = this.props._errMsg;
        const submitBtnStyle = this.state.submitBtnDisabled
            ? { opacity: 0.5, pointerEvents: "none" }
            : { opacity: 1 };

        return (

            <div
                ref={elem => this.parentContainer = elem}
                style={this.state.componentContainerStyle}
                className="parent-component header register-header height-bcg-color-tran">

                <div className="container">

                    <label
                        style={this.state.labelStyle}
                        className="heading register-heading opacity-tran-fast">

                        Reset your password
                    </label>

                    <form
                        className="register-form"
                        onSubmit={this.submitForm(email)}>

                        <fieldset
                            ref={elem => this.emailFieldset = elem}
                            style={this.state.emailFieldsetStyle}
                            className="header-form-row height-tran-fast">

                            <input
                                className={`text-input ${validMail ? "" : "input-wrong-entry"}`}
                                type="text"
                                placeholder="e-mail"
                                value={email}
                                onChange={this.emailChange}
                                spellCheck="false"
                                required />

                            {!validMail ? <label className="form-feedback">ENTER VALID MAIL!</label> : null}
                        </fieldset>

                        <fieldset
                            style={this.state.btnFieldset}
                            className="header-form-row opacity-03-delay-tran-fast">

                            <button
                                style={submitBtnStyle}
                                className="btn-submit opacity-tran"
                                ref="backBtn"
                                onClick={this.backToLogin}>

                                BACK TO LOGIN
                            </button>
                            <button
                                style={submitBtnStyle}
                                id="btn-additional"
                                className="btn-submit margin-left-small opacity-tran"
                                ref="pwdResetBtn"
                                type="submit"
                                disabled={!validMail && this.state.submitBtnDisabled}>

                                RESET
                            </button>

                            {this.state.showFormMsg ? <label className="form-feedback">{serverMsg.toUpperCase()}</label> : null}
                        </fieldset>

                    </form>

                </div>
            </div>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);


function isMail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}