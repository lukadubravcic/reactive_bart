import React from 'react';
import { connect } from 'react-redux';
import agent from '../../../agent';

const PASSWORD_MAX_LEN = 20;
const PASSWORD_MIN_LEN = 3;

const PASSWORD_VALIDATION_ERROR_TEXT = 'Password must be between ' + PASSWORD_MIN_LEN + ' and ' + PASSWORD_MAX_LEN + ' characters long.';

const mapStateToProps = state => ({
    ...state.newPassword
});

const mapDispatchToProps = dispatch => ({
    onCurrentPasswordChange: value => {
        dispatch({ type: 'UPDATE_FIELD', key: 'currentPassword', value });
    },
    onNewPasswordChange: value => {
        dispatch({ type: 'UPDATE_FIELD', key: 'newPassword', value });
    },
    onReNewPasswordChange: value => {
        dispatch({ type: 'UPDATE_FIELD', key: 'reNewPassword', value });
    },
    submitNewPassword: (currentPassword, newPassword, reNewPassword, enableSubmit) => {
        dispatch({ type: 'SETTING_NEW_PASSWORD' });

        agent.Auth.setNewPassword(currentPassword, newPassword, reNewPassword).then((payload) => {
            if (payload !== null) {

                if (typeof payload.message !== 'undefined') {
                    dispatch({ type: 'SETTING_NEW_PASSWORD_FAILED', errMsg: payload.message });

                } else {
                    dispatch({ type: 'PASSWORD_CHANGED' });
                }
            }
            enableSubmit();
        });
    }
});


class NewPassword extends React.Component {
    constructor() {
        super();

        this.currentPasswordValidationMessage = null;
        this.newPasswordValidationMessage = null;
        this.reNewPasswordValidationMessage = null;

        this.submitNewPassword = (currentPassword, newPassword, reNewPassword, enableSubmit) => ev => {
            ev.preventDefault();
            this.refs.changePasswordBtn.setAttribute('disabled', 'true');
            this.props.submitNewPassword(currentPassword, newPassword, reNewPassword, this.enableSubmit);
        }

        this.currentPasswordChange = ev => {
            if (ev.target.value.length < PASSWORD_MIN_LEN || ev.target.value.length > PASSWORD_MAX_LEN) this.currentPasswordValidationMessage = PASSWORD_VALIDATION_ERROR_TEXT;
            else this.currentPasswordValidationMessage = null;
            this.props.onCurrentPasswordChange(ev.target.value);
        }

        this.newPasswordChange = ev => {
            if (ev.target.value.length < PASSWORD_MIN_LEN || ev.target.value.length > PASSWORD_MAX_LEN) this.newPasswordValidationMessage = PASSWORD_VALIDATION_ERROR_TEXT;
            else this.newPasswordValidationMessage = null;
            this.props.onNewPasswordChange(ev.target.value);
        }

        this.reNewPasswordChange = ev => {
            this.props.onReNewPasswordChange(ev.target.value);
        }

        this.enableSubmit = () => {
            this.refs.changePasswordBtn.removeAttribute('disabled');
        }
    }

    render() {

        const currentPassword = this.props.currentPassword;
        const newPassword = this.props.newPassword;
        const reNewPassword = this.props.reNewPassword;
        const errMsg = this.props._errMsg;
        const formValid = currentPassword.length
            && newPassword.length
            && !this.currentPasswordValidationMessage
            && !this.newPasswordValidationMessage
            && !this.reNewPasswordValidationMessage
            && newPassword === reNewPassword
            && currentPassword !== newPassword;

        return (
            <div className="parent-component header register-header">
                <div className="container">

                    <label className="heading register-heading">Change your password</label>

                    <form
                        className="register-form"
                        onSubmit={this.submitNewPassword(currentPassword, newPassword, reNewPassword)}>

                        <fieldset className="header-form-row">
                            <input
                                className="text-input"
                                id='currentPassword'
                                type="password"
                                placeholder="Current password"
                                onChange={this.currentPasswordChange}
                                value={currentPassword}
                                required />

                            {this.currentPasswordValidationMessage
                                ? <label className="form-feedback">{this.currentPasswordValidationMessage}</label>
                                : null}
                        </fieldset>

                        <fieldset className="header-form-row">
                            <input
                                id='newPassword'
                                className="text-input"
                                type="password"
                                placeholder="New password"
                                onChange={this.newPasswordChange}
                                value={newPassword}
                                required />

                            {this.newPasswordValidationMessage
                                ? <label className="form-feedback">{this.newPasswordValidationMessage}</label>
                                : null}
                        </fieldset>

                        <fieldset className="header-form-row">
                            <input
                                id="reNewPassword"
                                className="text-input"
                                type="password"
                                placeholder="Confirm new password"
                                onChange={this.reNewPasswordChange}
                                value={reNewPassword}
                                required />
                        </fieldset>

                        <fieldset className="header-form-row">
                            <button

                                className="btn-submit"
                                ref="changePasswordBtn"
                                type="submit"
                                disabled={!formValid}>
                                Set new password
                            </button>

                            {errMsg
                                ? <label className="form-feedback">{errMsg.toUpperCase()}</label>
                                : null}
                        </fieldset>



                    </form>
                </div>
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);