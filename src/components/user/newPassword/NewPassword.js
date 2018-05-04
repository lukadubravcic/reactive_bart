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

        this.state = {
            validCurrPwd: true,
            validNewPwd: true,
            validReNewPwd: true,

            showNewPwdInvalidHoverElement: false,
        };

        this.submitNewPassword = (currentPassword, newPassword, reNewPassword, enableSubmit) => ev => {
            ev.preventDefault();
            this.refs.changePasswordBtn.setAttribute('disabled', 'true');
            this.props.submitNewPassword(currentPassword, newPassword, reNewPassword, this.enableSubmit);
        }

        this.currentPasswordChange = ev => {
            if (ev.target.value.length > 0 && !validatePassword(ev.target.value)) {
                this.setState({ validCurrPwd: false });
            } else this.setState({ validCurrPwd: true, showOldPwdInvalidHoverElement: false });
            this.props.onCurrentPasswordChange(ev.target.value);
        }

        this.newPasswordChange = ev => {
            if (ev.target.value.length > 0 && !validatePassword(ev.target.value)) {
                this.setState({ validNewPwd: false });
            } else this.setState({ validNewPwd: true, showNewPwdInvalidHoverElement: false });
            this.props.onNewPasswordChange(ev.target.value);
        }

        this.reNewPasswordChange = ev => {
            if (ev.target.value !== this.props.newPassword) {
                this.setState({ validReNewPwd: false });
            } else {
                this.setState({ validReNewPwd: true });
            }
            this.props.onReNewPasswordChange(ev.target.value);
        }

        this.showPwdInvalidElement = ev => {
            ev.preventDefault();
            this.setState({ showNewPwdInvalidHoverElement: true });
        }

        this.hidePwdInvalidElement = ev => {
            ev.preventDefault();
            this.setState({ showNewPwdInvalidHoverElement: false });
        }

      /*   this.enableSubmit = () => {
            this.refs.changePasswordBtn.removeAttribute('disabled');
        } */
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
        const passwordWrongEntryWarning = '3 to 20 characters, contain at least one numeric digit, one uppercase and lowercase letter.';

        return (
            <div className="parent-component header register-header">
                <div className="container">

                    <label className="heading register-heading">Change your password</label>

                    <form
                        className="change-pwd-form opacity-anim"
                        onSubmit={this.submitNewPassword(currentPassword, newPassword, reNewPassword)}>

                        <fieldset className="header-form-row">
                            <input
                                className={`text-input ${!this.state.validCurrPwd ? "input-wrong-entry" : ""}`}
                                id='currentPassword'
                                type="password"
                                placeholder="Current password"
                                onChange={this.currentPasswordChange}
                                value={currentPassword}
                                required />
                        </fieldset>

                        <fieldset className="header-form-row">
                            <input
                                id='newPassword'
                                className={`text-input ${!this.state.validNewPwd ? "input-wrong-entry" : ""}`}
                                type="password"
                                placeholder="New password"
                                onChange={this.newPasswordChange}
                                value={newPassword}
                                required />

                            {!this.state.validNewPwd
                                ? <label
                                    className="form-feedback"
                                    onMouseOver={this.showPwdInvalidElement}
                                    onMouseOut={this.hidePwdInvalidElement}>
                                    <u>UNACCEPTABLE</u>

                                    {this.state.showNewPwdInvalidHoverElement
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

                        <fieldset className="header-form-row">
                            <input
                                id="reNewPassword"
                                className={`text-input ${!this.state.validReNewPwd ? "input-wrong-entry" : ""}`}
                                type="password"
                                placeholder="Confirm new password"
                                onChange={this.reNewPasswordChange}
                                value={reNewPassword}
                                required />
                        </fieldset>

                        <fieldset className="header-form-row">
                            <button
                                id="btn-set-pwd"
                                className="btn-submit"
                                ref="changePasswordBtn"
                                type="submit"
                                disabled={!formValid}>
                                SET NEW PASSWORD
                            </button>

                            <button
                                className="close-btn"
                                onClick={this.props.closeForm}>
                                CLOSE
                            </button>

                            {errMsg
                                ? <label
                                    id="change-pwd-form-feedback"
                                    className="form-feedback ">
                                    {errMsg.toUpperCase()}
                                </label>
                                : null}
                        </fieldset>



                    </form>
                </div>
            </div>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);


function validatePassword(password) {
    const pwdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{2,20}$/;

    if (pwdRegex.test(password)) {
        return true;

    } else return false // '3 to 20 characters, contain at least one numeric, uppercase and lowercase character.';
};