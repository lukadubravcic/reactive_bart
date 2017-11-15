import React from 'react';
import { connect } from 'react-redux';

import Login from './components/login/Login';
import Register from './components/register/Register';
import Game from './components/game/Game';
import PunishmentCreator from './components/punishment/PunishmentCreator';
import PunishmentSelectorTable from './components/selector/PunishmentSelectorTable';
import Prefs from './components/prefs/Prefs';
import Stats from './components/stats/Stats';

import agent from './agent';

import { getPunishmentIdFromURL } from './helpers/helpers';


const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onLoad: (token) => {
        if (token) {
            agent.setToken(token);
            agent.Auth.current().then((payload) => {
                if (payload !== null) {
                    dispatch({
                        type: 'APP_LOAD',
                        token,
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
    setRandomPunishments: punishments => {
        dispatch({ type: 'SET_RANDOM_PUNISHMENTS', punishments });
    },
    setSpecialPunishment: punishments => {
        dispatch({ type: 'SET_SPECIAL_PUNISHMENTS', punishments })
    }
});

class App extends React.Component {

    componentDidMount() {
        const token = window.localStorage.getItem('token');
        token && this.props.onLoad(token);

        const punishmentId = getPunishmentIdFromURL();
        if (punishmentId) this.props.setPunishmentIdFromURL(punishmentId);

        punishmentId && prettifyURL();

        // dohvati specijalne i random kazne sa be-a.
        agent.Punishment.getRandom().then(payload => {
            this.props.setRandomPunishments(payload);
        });

        agent.Punishment.getSpecial().then(payload => {
            this.props.setSpecialPunishment(payload);
        });
    }

    render() {

        return (
            <div>
                <nav className="navbar">
                    <div className="container">
                        <h1 className="navbar-brand">{this.props.common.appName}</h1>
                    </div>
                </nav>
                <Login />
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
        );
        /* else {
            return (
                <div className="container">
                    <svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="lds-eclipse" style={{ "background": "none" }}>
                        <path stroke="none" d="M5 50A45 45 0 0 0 95 50A45 48 0 0 1 5 50" fill="#e15b64" transform="rotate(43.6364 50 51.5)">
                            <animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 51.5;360 50 51.5" keyTimes="0;1" dur="1.1s" begin="0s" repeatCount="indefinite"></animateTransform>
                        </path>
                    </svg>
                </div>
            );
        } */
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


function prettifyURL() {

    if (window.history.replaceState) {
        window.history.replaceState({}, "removing query string", window.location.origin);
    }
}