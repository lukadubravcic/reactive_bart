import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

import StartToolbar from './StartToolbar';
import Login from './login/Login';
import LoggedInToolbar from './LoggedInToolbar';
import NewPassword from './newPassword/NewPassword';
import SetUsername from './login/SetUsername';
import UsernameThanks from './UsernameThanks';
import AdblockerDisabled from './AdblockerDisabled';
import ResetPassword from './login/ResetPassword';
import Register from '../register/Register';
import InformationFlasher from './InformationFlasher';

const mapStateToProps = state => ({
    common: state.common,
    auth: state.auth,
    activePunishment: state.game.activePunishment,
    timeSpent: state.game.timeSpent,
    gameInProgress: state.game.gameInProgress,
});

const mapDispatchToProps = dispatch => ({
    showLoginForm: () => dispatch({ type: 'SHOW_LOGIN_FORM' }),
    showRegisterForm: () => dispatch({ type: 'DIRECT_SHOW_REGISTER_FORM' }),
    showChangePasswordForm: () => dispatch({ type: 'SHOW_CHANGE_PASSWORD_FORM' }),
    onLogout: () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
        agent.Auth.logout();
        agent.setToken(0)
    },
    updateElementToDisplay: element => dispatch({ type: 'CHANGE_SHOWN_TOP_ELEMENT', element }),
    removeMsg: () => dispatch({ type: 'REMOVE_GUEST_ACCESS_MSG' }),
    logPunishmentTry: (id, timeSpent) => {
        agent.Punishment.logTry(id, timeSpent).then(() => { console.log('Try logged') });
        dispatch({ type: 'PUNISHMENT_TRY_LOGGED' });
    },
});


/* pageTop komponenta koja se brije o switchanju viewova:

    - user nije logiran:
        - login (samo traka sa btnom):
            - pocetno stanje
        
        - login forma
        - switch sa login na register formu (ako user ne postoji)

    - user je logiran: 
        - bijela traka na vrhu sa imenom/mailom i logout btnom
        - promjena passworda forma
        - forma za unos usernamea ako ga korisnik nema
        - zahvala kada je unesen username

 */

class Top extends React.Component {

    constructor() {
        super();

        this.showLogin = () => {
            this.props.showLoginForm();
        }

        this.showRegisterForm = () => {
            this.props.showRegisterForm();
        }

        this.showChangePassword = ev => {
            ev.preventDefault();
            this.props.showChangePasswordForm();
        }

        this.getElementToDisplay = () => {

            // if (window.canRunAds === undefined) return <AdblockerDisabled />;

            const userLoggedIn = !!Object.keys(this.props.common.currentUser).length;
            let elementToDisplay = this.props.auth.elementToDisplay;

            let element = null;
            let key = 1;

            let message = this.props.common.guestAccessMsg;
            let messageComponent = null;

            console.log(this.props.common.guestAccessMsg)
            if (message !== null) {
                messageComponent = <InformationFlasher message={message} removeMsg={this.props.removeMsg} displayTime={this.props.common.msgDuration} />
            }

            if (userLoggedIn) {

                let username = this.props.common.currentUser.username
                    ? this.props.common.currentUser.username
                    : this.props.common.currentUser.email;
                let usernameNotSet = typeof this.props.common.currentUser.username === 'undefined'
                    || this.props.common.currentUser.username === null
                    || this.props.common.currentUser.username === '';

                let header = null;
                let content = null;

                header = <LoggedInToolbar username={username} handleLogout={this.handleLogout} btnShowForm={this.showChangePassword} />;

                if (usernameNotSet && elementToDisplay === 'loggedIn') elementToDisplay = 'setUsername';

                switch (elementToDisplay) {
                    case 'changePassword':
                        element = <NewPassword />;
                        break;
                    case 'setUsername':
                        element = <SetUsername />;
                        break;
                    case 'thanks':
                        element = <UsernameThanks unmountCallback={this.props.updateElementToDisplay} />;
                        break;
                    case 'loggedIn':
                        element = null;
                }

                return (
                    <div>
                        {header}
                        {element}
                        {messageComponent}
                    </div>
                )

            } else { // user nije logiran
                switch (elementToDisplay) {
                    case 'start':
                        element = <StartToolbar btnClickCallback={this.showLogin} showRegisterForm={this.showRegisterForm} disabled={this.props.common.policyAgreementStatus !== true} />;
                        break;
                    case 'login':
                        element = <Login />;
                        break;
                    case 'resetPassword':
                        element = <ResetPassword />;
                        break;
                    case 'register':
                        element = <Register />;
                        break;
                    default:
                        element = <StartToolbar btnClickCallback={this.showLogin} showRegisterForm={this.showRegisterForm} disabled={this.props.common.policyAgreementStatus !== true} />;
                }
                return (
                    <div>
                        {element}
                        {messageComponent}
                    </div>
                );
            }

            return null;
        }

        this.handleLogout = ev => {

            if (!specialOrRandomPunishmentIsActive(this.props.activePunishment) && this.props.gameInProgress) {
                this.props.logPunishmentTry(this.props.activePunishment.uid, this.props.timeSpent);
            }

            this.props.onLogout();
        }
    }

    componentWillReceiveProps(nextProps) {
        const usernameSetPunishmentActive = specialOrRandomPunishmentIsActive(this.props.activePunishment)
            && this.props.activePunishment.type === "USERNAME_SET";
        const isNextPunSpecialOrRandom = specialOrRandomPunishmentIsActive(nextProps.activePunishment);
        const nextPunNotUsernameSet = (isNextPunSpecialOrRandom && nextProps.activePunishment.type !== 'USERNAME_SET')
            || !specialOrRandomPunishmentIsActive(nextProps.activePunishment);

        if (usernameSetPunishmentActive && nextPunNotUsernameSet) {
            // hide thanks section
            this.props.updateElementToDisplay('loggedIn');
        }
    }

    render() {
        return (
            <div id="top" className={this.props.common.policyAgreementStatus !== true ? 'greyscale-filter' : ''}>
                {this.props.common.policyAgreementStatus !== true ? <div id="form-overlay"></div> : null}
                {this.getElementToDisplay()}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Top);


function specialOrRandomPunishmentIsActive(punishment) { // specijalne kazne nemaju created property
    return punishment.created ? false : true;
}