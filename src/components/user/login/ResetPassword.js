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
    backToLogin: () => dispatch({ type: 'HIDE_RESET_PASSWORD_FORM' })
});


const animationDuration = 500;
const loginHeight = 490;

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
            }
        }

        this.emailChange = event => {
            this.props.onEmailChange(event.target.value);
        }

        this.submitForm = email => ev => {
            ev.preventDefault();
            this.refs.pwdResetBtn.setAttribute('disabled', 'disabled');
            this.refs.backBtn.setAttribute('disabled', 'disabled');
            this.props.submitResetPassword(email, this.enableForm);
        }

        this.enableForm = () => {
            this.refs.pwdResetBtn.removeAttribute('disabled');
            this.refs.backBtn.removeAttribute('disabled');
        }

        this.backToLogin = ev => {
            ev.preventDefault();

            requestAnimationFrame(() => {
                this.animateDismounting();
            });

            setTimeout(() => {
                this.props.backToLogin();
            }, animationDuration);
        }

        this.animateMounting = () => {
            this.setState({
                labelStyle: { ...this.state.labelStyle, ...animStyles.labelMountStyle },
                btnFieldset: { ...this.state.btnFieldset, ...animStyles.btnFieldsetMountStyle }
            });
        }

        this.animateDismounting = () => {
            this.setState({
                componentContainerStyle: { ...this.state.componentContainerStyle, ...animStyles.componentContainerDismountStyle },
                labelStyle: { ...this.state.labelStyle, ...animStyles.labelDismountStyle },
                emailFieldsetStyle: { ...this.state.emailFieldsetStyle, ...animStyles.emailFieldsetDismountStyle }
            })
        }
    }

    componentDidMount() {

        this.setState({
            componentContainerStyle: { ...this.state.componentContainerStyle, height: this.parentContainer.clientHeight + 'px' },
            emailFieldsetStyle: { ...this.state.emailFieldsetStyle, height: this.emailFieldset.clientHeight + 'px' }
        });

        requestAnimationFrame(() => {
            this.animateMounting();
        });
    }

    render() {

        const email = this.props.loginWhom;
        const serverMsg = this.props._errMsg;

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
                                className="text-input"
                                type="text"
                                placeholder="e-mail"
                                value={email}
                                onChange={this.emailChange}
                                required />
                        </fieldset>

                        <fieldset
                            style={this.state.btnFieldset}
                            className="header-form-row opacity-03-delay-tran-fast">

                            <button
                                className="btn-submit"
                                ref="backBtn"
                                onClick={this.backToLogin}>

                                BACK TO LOGIN
                            </button>
                            <button
                                id="btn-additional"
                                className="btn-submit margin-left-small"
                                ref="pwdResetBtn"
                                type="submit">

                                RESET
                            </button>

                            {serverMsg ? <label className="form-feedback">{serverMsg}</label> : null}
                        </fieldset>

                    </form>

                </div>
            </div>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
