import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

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
    submitNewPassword: (currentPassword, newPassword, reNewPassword) => {
        agent.Auth.setNewPassword(currentPassword, newPassword, reNewPassword).then((payload) => {
            if (payload !== null) {

                if (typeof payload.message !== 'undefined') {
                    dispatch({ type: 'SETTING_NEW_PASSWORD_FAILED', errMsg: payload.message });

                } else {
                    dispatch({ type: 'PASSWORD_CHANGED' });
                }
            }
        });
    }
});


class NewPassword extends React.Component {
    constructor() {
        super();

        this.currentPasswordValidationMessage = null;
        this.newPasswordValidationMessage = null;
        this.reNewPasswordValidationMessage = null;

        this.submitNewPassword = (currentPassword, newPassword, reNewPassword) => ev => {
            ev.preventDefault();
            this.props.submitNewPassword(currentPassword, newPassword, reNewPassword);
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
    }

    render() {

        const currentPassword = this.props.currentPassword;
        const newPassword = this.props.newPassword;
        const reNewPassword = this.props.reNewPassword;
        const errMsg = this.props._errMsg;
        const formValid = !this.currentPasswordValidationMessage && !this.newPasswordValidationMessage && !this.reNewPasswordValidationMessage && newPassword === reNewPassword && currentPassword !== newPassword;

        return (
            <div className="container">
                <form onSubmit={this.submitNewPassword(currentPassword, newPassword, reNewPassword)}>
                    <label>Set your new password</label>

                    <br />

                    <input
                        id='currentPassword'
                        type="password"
                        placeholder="Current password"
                        onChange={this.currentPasswordChange}
                        value={currentPassword}
                        required />
                    {this.currentPasswordValidationMessage ? <label>&nbsp;{this.currentPasswordValidationMessage}</label> : null}
                    <br />

                    <input
                        id='newPassword'
                        type="password"
                        placeholder="New password"
                        onChange={this.newPasswordChange}
                        value={newPassword}
                        required />
                    {this.newPasswordValidationMessage ? <label>&nbsp;{this.newPasswordValidationMessage}</label> : null}
                    <br />

                    <input
                        id="reNewPassword"
                        type="password"
                        placeholder="Confirm new password"
                        onChange={this.reNewPasswordChange}
                        value={reNewPassword}
                        required />

                    <br />

                    <button
                        type="submit"
                        disabled={!formValid}>
                        Set new password
                    </button>
                    {errMsg ? (<label>{errMsg}</label>) : null}
                </form>
            </div >
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);