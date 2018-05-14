import React from 'react';
import { connect } from 'react-redux';
import Top from './components/user/Top';
import Game from './components/game/Game';
import PunishmentCreator from './components/punishment/PunishmentCreator';
import PunishmentSelectorTable from './components/selector/PunishmentSelectorTable';
import Prefs from './components/prefs/Prefs';
import Stats from './components/stats/Stats';
import Footer from './components/Footer';
import MobileSplashScreen from './components/MobileSplashScreen';
import EULawAbidingCitizen from './components/EUlawAbidingCitizen';
import GoodiesStore from './components/GoodiesStore';
import agent from './agent';

import { getQueryStringData } from './helpers/helpers';

const defaultMsgDuration = 5000;

const mapStateToProps = state => ({
    common: state.common,
    userIdFromURL: state.auth.userIdFromURL,
    guestPunishment: state.game.guestPunishment,
    punishmentIdFromURL: state.game.punishmentIdFromURL
});

const mapDispatchToProps = dispatch => ({
    onLoad: token => { // ako je postavljen token u localstrageu, ulogiraj usera
        if (token) {
            agent.setToken(token);
            dispatch({ type: 'LOADING_IN_PROGRESS' })
            agent.Auth.current().then(payload => {
                if (payload !== null) {
                    dispatch({
                        type: 'APP_LOAD',
                        token,
                        rank: payload.rank,
                        pref: typeof payload.pref !== 'undefined' ? payload.pref : null,
                        user: {
                            _id: decodeURIComponent(payload._id),
                            email: payload.email,
                            username: payload.username
                        }
                    });
                }
            });
        }
    },
    handleGuest: (userId, punishmentId) => {
        dispatch({ type: 'GUEST_PUNISHMENT_LOADING' });
        agent.Auth.getPunishmentAsGuest(encodeURIComponent(userId), encodeURIComponent(punishmentId)).then(payload => {
            if (payload) {
                if (typeof payload.msg !== 'undefined' && payload.msg !== null) {
                    const msgDuration = typeof payload.time !== 'undefined' && payload.time !== null ? payload.time : defaultMsgDuration;
                    
                    dispatch({
                        type: 'GUEST_PUNISHMENT_INVALID',
                        msg: payload.msg,
                        msgDuration
                    });

                } else if (
                    typeof payload.guestPunishment !== 'undefined'
                    && payload.guestPunishment !== null
                    && Object.keys(payload.guestPunishment).length
                    && payload.guestUser !== null
                    && Object.keys(payload.guestUser).length) {

                    payload.guestUser.uid = decodeURIComponent(payload.guestUser.uid);

                    if (payload.guestUser.confirmed !== null) {
                        dispatch({ type: 'GUEST_PUNISHMENT_LOADED', punishment: payload.guestPunishment, guestUser: payload.guestUser });
                    } else {
                        dispatch({ type: 'INVITED_GUEST_PUNISHMENT_LOADED', punishment: payload.guestPunishment, guestUser: payload.guestUser });
                    }
                }
            }
        }, failed => {
            dispatch({ type: 'GUEST_PUNISHMENT_INVALID', msg: 'Could not load desired punishment.' });
        });
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
    setSpecialPunishments: punishments => {
        dispatch({ type: 'SET_SPECIAL_PUNISHMENTS', punishments })
    },
    specialLogout: () => {
        dispatch({ type: 'SPECIAL_LOGOUT' });
    },
    set404Punishment: () => {
        dispatch({
            type: 'SET_ACTIVE_PUNISHMENT',
            punishment: {
                how_many_times: 404,
                uid: 404,
                what_to_write: "Page not found. ",
            },
        });
    },
    showTermsOfAgreement: () => dispatch({ type: 'SHOW_TERMS_OF_SERVICE' }),
    showPrivacyPolicy: () => dispatch({ type: 'SHOW_PRIVACY_POLICY' }),
});

class App extends React.Component {

    componentDidMount() {

        // hendlaj invited usera kao guesta
        let queryStringData = getQueryStringData();
        let token = window.localStorage.getItem('token');
        //  ako pathname postoji -> prikazi 404 kaznu
        if (window.location.pathname.length > 1) {
            this.props.set404Punishment();
        } else if (token) {
            this.props.onLoad(token);
            if (typeof queryStringData.uid !== 'undefined') this.props.setUserIdFromUrl(queryStringData.uid);
            if (typeof queryStringData.id !== 'undefined') this.props.setPunishmentIdFromURL(queryStringData.id);
        } else if (typeof queryStringData.uid !== 'undefined' && typeof queryStringData.id !== 'undefined') {
            this.props.setUserIdFromUrl(queryStringData.uid);
            this.props.handleGuest(queryStringData.uid, queryStringData.id);
            // window.localStorage.removeItem('token');
        }

        // MICANJE QUERY STRINGA IZ URL-a 
        // prettyURL();

        // dohvati specijalne i random kazne sa be-a.
        agent.Punishment.getRandom().then(payload => {
            this.props.setRandomPunishments(payload);
        });

        agent.Punishment.getSpecial().then(payload => {
            this.props.setSpecialPunishments(payload);
        });
    }

    componentWillUpdate(nextProps) {

        const userLoggedIn = !!Object.keys(nextProps.common.currentUser).length;
        const isUrlPunOwnedByLoggedUser = nextProps.common.currentUser._id === nextProps.userIdFromURL;

        // ako je user logiran, a kazna nije njegova, logout te postavi tu kaznu
        if (userLoggedIn) {
            if (nextProps.userIdFromURL !== null && !isUrlPunOwnedByLoggedUser) {
                agent.Auth.logout();
                agent.setToken(0);
                window.localStorage.removeItem('token');
                this.props.specialLogout();
                this.props.handleGuest(nextProps.userIdFromURL, nextProps.punishmentIdFromURL);
            }
        }
    }

    render() {

        const md = new window.MobileDetect(window.navigator.userAgent);
        const isMobile = md.mobile();

        if (isMobile) {
            return (
                <div style={{ width: 100 + "vw", height: 100 + "vh", background: "#2B5D64" }}>
                    <MobileSplashScreen />
                </div>
            )
        } else {
            return (
                <div>
                    <Top />
                    <Game />
                    <PunishmentCreator />
                    <PunishmentSelectorTable />
                    <Stats />
                    <GoodiesStore />
                    <Prefs />
                    <Footer
                        showTermsOfAgreement={this.props.showTermsOfAgreement}
                        showPrivacyPolicy={this.props.showPrivacyPolicy} />
                    <EULawAbidingCitizen />
                </div>
            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


function prettyURL() {
    if (window.history.replaceState) {
        window.history.replaceState({}, "removing query string", window.location.origin);
    }
}