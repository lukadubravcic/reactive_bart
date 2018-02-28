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


const mapStateToProps = state => ({
    common: state.common,
    auth: state.auth,
    activePunishment: state.game.activePunishment,
    timeSpent: state.game.timeSpent,
    gameInProgress: state.game.gameInProgress
});

const mapDispatchToProps = dispatch => ({
    showLoginForm: () => dispatch({ type: 'SHOW_LOGIN_FORM' }),
    showChangePasswordForm: () => dispatch({ type: 'SHOW_CHANGE_PASSWORD_FORM' }),
    onLogout: () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
        agent.Auth.logout();
        agent.setToken(0)
    },
    updateElementToDisplay: element => dispatch({ type: 'CHANGE_SHOWN_TOP_ELEMENT', element })
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

        this.showLogin = ev => {
            ev.preventDefault();
            this.props.showLoginForm();
        }

        this.showChangePassword = ev => {
            ev.preventDefault();
            this.props.showChangePasswordForm();
        }

        this.getElementToDisplay = () => {

            if (window.canRunAds === undefined) return <AdblockerDisabled />;

            const userLoggedIn = !!Object.keys(this.props.common.currentUser).length;
            let elementToDisplay = this.props.auth.elementToDisplay;

            let element = null;
            let key = 1;

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
                        element = <UsernameThanks />;
                        break;
                    case 'loggedIn':
                        element = null;
                }

                return (
                    <div>
                        {header}
                        {element}
                    </div>
                )

            } else { // user nije logiran
                switch (elementToDisplay) {
                    case 'start':
                        element = <StartToolbar btnClickCallback={this.showLogin} />;
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
                        element = <StartToolbar btnClickCallback={this.showLogin} />;
                }
                return element;
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

        const elements = this.getElementToDisplay();
        
        return elements;

        /* const userLoggedIn = !!Object.keys(this.props.common.currentUser).length;
        const elementToDisplay = this.props.auth.test;

        let username = null;
        let renderElement = this.getElementToDisplay(elementToDisplay);

        if (!userLoggedIn) return renderElement;
        let usernameNotSet = typeof this.props.common.currentUser.username === 'undefined'
            || this.props.common.currentUser.username === null
            || this.props.common.currentUser.username === '';


        username = this.props.common.currentUser.username
            ? this.props.common.currentUser.username
            : this.props.common.currentUser.email;

        return (
            <div>
                <LoggedInToolbar username={username} handleLogout={this.handleLogout} />
                {usernameNotSet ? <SetUsername /> : null}
                {renderElement}
            </div>
        ) */


    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Top);


function specialOrRandomPunishmentIsActive(punishment) { // specijalne kazne nemaju created property
    return punishment.created ? false : true;
}