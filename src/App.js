import React from 'react';
import { connect } from 'react-redux';

import Login from './components/login/Login';
import Register from './components/register/Register';
import InvitedRegister from './components/register/InvitedRegister';
import Game from './components/game/Game';
import PunishmentCreator from './components/punishment/PunishmentCreator';
import PunishmentSelectorTable from './components/selector/PunishmentSelectorTable';
import Prefs from './components/prefs/Prefs';
import Stats from './components/stats/Stats';
import NewPassword from './components/newPassword/NewPassword';
import Footer from './components/Footer';

import agent from './agent';

import { getQueryStringData } from './helpers/helpers';


const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onLoad: (token) => { // ako je postavljen token u localstrageu, ulogiraj usera
        if (token) {
            agent.setToken(token);
            dispatch({ type: 'LOADING_IN_PROGRESS' })
            agent.Auth.current().then((payload) => {
                if (payload !== null) {
                    dispatch({
                        type: 'APP_LOAD',
                        token,
                        rank: payload.rank,
                        user: {
                            _id: payload._id,
                            email: payload.email,
                            username: payload.username
                        }
                    });
                }
            });
        }
    },
    setPunishmentIdFromURL: id => {
        dispatch({ type: 'PUNISHMENT_IN_URL', id });
    },
    setUserIdFromUrl: id => {
        dispatch({ type: 'USERID_IN_URL', id });
    },
    setRandomPunishments: punishments => {
        dispatch({ type: 'SET_RANDOM_PUNISHMENTS', punishments });
    },
    setSpecialPunishment: punishments => {
        dispatch({ type: 'SET_SPECIAL_PUNISHMENTS', punishments })
    }
});

class App extends React.Component {

    componentDidMount() {

        let queryStringData = getQueryStringData();
        console.log(queryStringData)
        console.log(window.location.search);

        const token = window.localStorage.getItem('token');
        token && this.props.onLoad(token);

        //const punishmentId = getPunishmentIdFromURL();
        if (typeof queryStringData.id !== 'undefined') this.props.setPunishmentIdFromURL(queryStringData.id);

        //const userId = getUserIDfromURL();
        if (typeof queryStringData.uid !== 'undefined') this.props.setUserIdFromUrl(queryStringData.uid);

        prettifyURL();

        // dohvati specijalne i random kazne sa be-a.
        agent.Punishment.getRandom().then(payload => {
            this.props.setRandomPunishments(payload);
        });

        agent.Punishment.getSpecial().then(payload => {
            this.props.setSpecialPunishment(payload);
        });
    }

    render() {

        const userLoggedInAndChangePasswordForm = this.props.auth.showSetNewPasswordComponent && Object.keys(this.props.common.currentUser).keys;

        if (this.props.auth.userIdFromURL) {
            return (
                <InvitedRegister />
            )
        } else {
            return (
                <div>
                    <nav className="navbar">
                        <div className="container">
                            <h1 className="navbar-brand">{this.props.common.appName}</h1>
                        </div>
                    </nav>
                    <Login />
                    {userLoggedInAndChangePasswordForm
                        ? <NewPassword />
                        : <div>
                            <Register />
                            <hr />
                            <Game />
                            <hr />
                            <PunishmentCreator />
                            <hr />
                            <PunishmentSelectorTable />
                            <Stats />
                            <Prefs />
                        </div>
                    }
                    <Footer />
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


function prettifyURL() {

    if (window.history.replaceState) {
        window.history.replaceState({}, "removing query string", window.location.origin);
    }
}