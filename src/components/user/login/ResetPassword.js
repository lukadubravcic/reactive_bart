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

class ResetPassword extends React.Component {

    constructor() {
        super();

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
    }

    render() {

        const email = this.props.email;
        const serverMsg = this.props._errMsg;

        return (

            <div className="parent-component header register-header">
                <div className="container">

                    <label className="heading register-heading">Reset your password</label>

                    <form
                        className="register-form"
                        onSubmit={this.submitForm(email)}>

                        <fieldset className="header-form-row">
                            <input
                                className="text-input"
                                type="text"
                                placeholder="e-mail"
                                value={email}
                                onChange={this.emailChange}
                                required />
                        </fieldset>

                        <fieldset className="header-form-row">
                            <button
                                className="btn-submit"
                                ref="backBtn"
                                onClick={this.props.backToLogin}>

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
