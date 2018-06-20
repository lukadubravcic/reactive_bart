import React from 'react';
import { connect } from 'react-redux';
import Top from './components/user/Top';
import Game from './components/game/Game';
import PunishmentCreator from './components/punishment/PunishmentCreator';
import PunishmentSelectorTable from './components/selector/PunishmentSelectorTable';
import Prefs from './components/prefs/Prefs';
import Stats from './components/stats/Stats';
import RankInfo from './components/stats/RankInfo';
import Footer from './components/Footer';
import MobileSplashScreen from './components/MobileSplashScreen';
import EULawAbidingCitizen from './components/EUlawAbidingCitizen';
import GoodiesStore from './components/GoodiesStore';
import Locker from './components/Locker';
import SharePunishmentDialog from './components/SharePunishmentDialog';
import SharedPunishmentPopUp from './components/SharedPunishmentPopUp';
import SkoldBoard from './components/stats/SkoldBoard';

import agent from './agent';

import { getQueryStringData } from './helpers/helpers';

import { ERR_DISPLAY_TIME } from './constants/constants';

const mapStateToProps = state => ({
    common: state.common,
    userIdFromURL: state.auth.userIdFromURL,
    guestPunishment: state.game.guestPunishment,
    punishmentIdFromURL: state.game.punishmentIdFromURL,
    randomPunishments: state.punishment.randomPunishments,
    specialPunishments: state.punishment.specialPunishments,
});

const mapDispatchToProps = dispatch => ({
    onLoad: token => { // ako je postavljen token u localstrageu, ulogiraj usera
        if (token) {
            agent.setToken(token);
            dispatch({ type: 'LOADING_IN_PROGRESS' });
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
                } else if (payload === null) {
                    localStorage.removeItem('token');
                }
            });
        }
    },
    handleGuest: (userId, punishmentId) => {
        dispatch({ type: 'GUEST_PUNISHMENT_LOADING' });
        agent.Auth.getPunishmentAsGuest(encodeURIComponent(userId), encodeURIComponent(punishmentId)).then(payload => {
            if (payload) {
                if (typeof payload.msg !== 'undefined' && payload.msg !== null) {
                    const msgDuration = typeof payload.time !== 'undefined' && payload.time !== null ? payload.time : ERR_DISPLAY_TIME;

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
    showTermsOfService: () => dispatch({ type: 'SHOW_TERMS_OF_SERVICE' }),
    showPrivacyPolicy: () => dispatch({ type: 'SHOW_PRIVACY_POLICY' }),
    showPrefs: () => dispatch({ type: 'SHOW_PREFS' }),
    handleSharedPunishment: async sid => {
        // dohvati shared kaznu
        try {
            let res = await agent.Punishment.getSharedPunishment(sid);

            if (typeof res.err_code !== 'undefined') {
                let msg = null;

                switch (res.err_code) {
                    case 1:
                        msg = (
                            <span>
                                Invalid punishment. Let's&nbsp;
                                <a
                                    className="underline-on-hover login-link"
                                    style={{ cursor: "pointer" }}
                                    onClick={ev => {
                                        let gotoElement = document.getElementById("creator-component-container");
                                        gotoElement.scrollIntoView({ behavior: "smooth" })
                                    }}>
                                    create a new one
                                </a>
                                !
                        </span>
                        );
                        break;
                    case 2: {
                        msg = (
                            <span>
                                Too late! Punishment expired. <br />Time for&nbsp;
                                <a
                                    className="underline-on-hover login-link"
                                    style={{ cursor: "pointer" }}
                                    onClick={ev => {
                                        let gotoElement = document.getElementById("creator-component-container");
                                        gotoElement.scrollIntoView({ behavior: "smooth" })
                                    }}>
                                    a new one
                                </a>
                                ?
                            </span>
                        );
                        break;
                    }
                    case 3:
                        msg = (
                            <span>
                                C'mon! Let&nbsp;
                                <a
                                    className="underline-on-hover login-link"
                                    style={{ cursor: "pointer" }}
                                    onClick={ev => {
                                        let gotoElement = document.getElementById("skoldboard");
                                        gotoElement.scrollIntoView({ behavior: "smooth" })
                                    }}>
                                    THEM
                                </a>
                                &nbsp;punish you.
                            </span>
                        );
                        break;
                    default:
                        msg = 'Invalid punishment. Let\'s create a new one!';
                        break;
                }

                return dispatch({
                    type: 'SHARED_PUNISHMENT_INVALID',
                    msg,
                    msgDuration: res.time || ERR_DISPLAY_TIME,
                });
            } else if (typeof res.punishment !== 'undefined') {
                // response sadrzi kaznu, update state sa tom share-anom kaznom i prikazi pop-up
                return dispatch({
                    type: 'SHARED_PUNISHMENT_LOADED',
                    punishment: res.punishment,
                });
            } else {
                console.log(res)
                return dispatch({
                    type: 'SHARED_PUNISHMENT_INVALID',
                    msg: 'Invalid punishment. Let\'s create a new one!',
                    msgDuration: res.time || ERR_DISPLAY_TIME,
                });
            }
        } catch (err) {
            console.log(err)
            return dispatch({
                type: 'SHARED_PUNISHMENT_INVALID',
                msg: 'Invalid punishment. Let\'s create a new one!',
                msgDuration: ERR_DISPLAY_TIME,
            });
        }
    },
});

class App extends React.Component {

    constructor() {
        super();

        this.state = {
            showShareDialog: false,
        }

        this.shareData = null;

        this.shareDialogVisibilityHandler = (value, shareData) => {
            this.shareData = shareData;
            this.setState({ showShareDialog: value });
        }
    }

    componentDidMount() {

        // hendlaj invited usera kao guesta
        this.queryStringData = getQueryStringData();
        let token = window.localStorage.getItem('token');

        // handle showToS ili Privacy policy
        if (typeof this.queryStringData.tos !== 'undefined') this.props.showTermsOfService();
        if (typeof this.queryStringData.pp !== 'undefined') this.props.showPrivacyPolicy();

        if (window.location.pathname.length > 1) {
            this.props.set404Punishment();
        } else if (token) {
            this.props.onLoad(token);
            if (typeof this.queryStringData.uid !== 'undefined') this.props.setUserIdFromUrl(this.queryStringData.uid);
            if (typeof this.queryStringData.id !== 'undefined') this.props.setPunishmentIdFromURL(this.queryStringData.id);
            else if (typeof this.queryStringData.prf !== 'undefined') this.props.showPrefs();
        } else if (typeof this.queryStringData.uid !== 'undefined' && typeof this.queryStringData.id !== 'undefined') {
            this.props.setUserIdFromUrl(this.queryStringData.uid);
            this.props.handleGuest(this.queryStringData.uid, this.queryStringData.id);
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

        if (typeof this.queryStringData.sid !== 'undefined' && this.queryStringData.sid !== null) {
            // detekcija shared kazne
            // requestaj tu kaznu 
            this.props.handleSharedPunishment(this.queryStringData.sid);
            this.queryStringData.sid = null;
        }
    }

    render() {

        const md = new window.MobileDetect(window.navigator.userAgent);
        const isMobile = md.mobile();

        if (isMobile) {
            return (
                <div style={{
                    width: 100 + "vw",
                    height: 100 + "vh",
                    background: "#2B5D64"
                }}>
                    <MobileSplashScreen />
                </div>
            )
        } else {
            return (
                <div>
                    <SharedPunishmentPopUp />
                    {this.state.showShareDialog
                        ? <SharePunishmentDialog
                            data={this.shareData}
                            shareDialogVisibilityHandler={this.shareDialogVisibilityHandler} />
                        : null}
                    <Top />
                    <Game />
                    <PunishmentCreator
                        data={this.shareData}
                        shareDialogVisibilityHandler={this.shareDialogVisibilityHandler} />
                    <Locker />
                    <PunishmentSelectorTable shareDialogVisibilityHandler={this.shareDialogVisibilityHandler} />
                    <Stats />
                    <SkoldBoard />
                    <GoodiesStore />
                    <Prefs />
                    <Footer
                        showTermsOfService={this.props.showTermsOfService}
                        showPrivacyPolicy={this.props.showPrivacyPolicy} />
                    <EULawAbidingCitizen
                        showTermsOfService={this.props.showTermsOfService}
                        showPrivacyPolicy={this.props.showPrivacyPolicy} />
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