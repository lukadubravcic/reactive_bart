import React from 'react';
import { connect } from 'react-redux';

import StartToolbar from './StartToolbar';
import Login from '../login/Login';
import LoggedInToolbar from './LoggedInToolbar';
import NewPassword from '../newPassword/NewPassword';
import SetUsername from '../login/SetUsername';


const mapStateToProps = state => ({
    common: state.common,
    auth: state.auth
});

const mapDispatchToProps = dispatch => ({
    showLoginForm: () => dispatch({ type: 'SHOW_LOGIN_FORM' })
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

    }

    render() {

        const userLoggedIn = !!Object.keys(this.props.common.currentUser).length;
        const elementToDisplay = this.props.auth.test;

        let username = null;

        let renderElement = null;



        switch (elementToDisplay) {
            case 'start':
                renderElement = (
                    <div>
                        <StartToolbar btnClickCallback={this.showLogin} />
                    </div>
                );
                break;
            case 'login':
                renderElement = (
                    <Login />
                );
                break;
            case 'changePassword':
                renderElement = (
                    <NewPassword />
                );
                break;
            case 'setUsername':
                renderElement = (
                    <SetUsername />
                );
                break;
            case 'thanks':
                renderElement = (
                    <div class="parent-component header">

                        <div class="container">

                            <label class="heading username-set-heading">
                                Thanks! Let me punish you in return.
                                <br /> It's optional. Really.
                            </label>
                        </div>
                    </div>
                );
                break;
        }

        if (userLoggedIn) {

            username = this.props.common.currentUser.username ? this.props.common.currentUser.username : this.props.common.currentUser.email;

            return (
                <div>
                    <LoggedInToolbar username={username} />
                    {renderElement}
                </div>
            )

        } else {
            return (
                <div>
                    {renderElement}
                </div>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Top);