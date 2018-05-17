import React from 'react';
import Board from './Board';
import Timer from './Timer';
import Ads from '../ads/Ads';
import { connect } from 'react-redux';

import { checkIfIgnoredPunishment } from '../../helpers/helpers';

const defaultMsgDuration = 5000;

const mapStateToProps = state => ({
    ...state.punishment,
    activePunishment: state.game.activePunishment,
    currentUser: state.common.currentUser,
    loadInProgress: state.common.loadInProgress,
    punishmentIdFromURL: state.game.punishmentIdFromURL,
    showSetNewPasswordComponent: state.auth.showSetNewPasswordComponent,
    cheating: state.game.cheating,
    guestPunishment: state.game.guestPunishment,
    guestDataLoadingInProgress: state.common.guestDataLoadingInProgress,
    userIdFromURL: state.auth.userIdFromURL,
    punishmentProgress: state.game.progress,
    showToS: state.game.showToS,
    showPrivacyPolicy: state.game.showPrivacyPolicy,
});

const mapDispatchToProps = dispatch => ({
    setActivePunishment: (punishment, ignoredPunishmentSet = false) => {
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment, ignoredPunishmentSet });
    },
    gameUnmount: () => {
        dispatch({ type: 'GAME_UNMOUNT' });
    },
    faultyPunishmentSet: msg => {
        let msgDuration = defaultMsgDuration;

        dispatch({
            type: 'GUEST_PUNISHMENT_INVALID',
            msg: msg,
            msgDuration
        });
    }
});

class Game extends React.Component {

    constructor() {
        super();

        this.writingBoard = null;
        this.boardInViewportTimeout = null;

        this.setCheatingPunishment = () => {
            let cheatingPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('CHEAT_DETECTED', this.props.specialPunishments));
            if (cheatingPunishment) this.props.setActivePunishment(cheatingPunishment);
        }

        this.changeActivePunishmentNotLoggedIn = () => {

            if (window.canRunAds === undefined) { // adblocker detektiran
                let specialPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('ADBLOCKER_DETECTED', this.props.specialPunishments));
                if (specialPunishment) {
                    this.props.setActivePunishment(specialPunishment);
                } else return;
            } else if (this.props.guestPunishment) { // invited user
                if (checkIfIgnoredPunishment(this.props.guestPunishment)) {
                    let specialPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('ACCESING_IGNORED_PUNISHMENT', this.props.specialPunishments))
                    specialPunishment && this.props.setActivePunishment(specialPunishment, false);
                } else {
                    this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(this.props.guestPunishment));
                }
            } else if (this.props.punishmentIdFromURL) {
                let randomPunishment = getRandomPunishment(this.props.randomPunishments);
                this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(randomPunishment), true);
            } else {
                this.setRandomActivePunishment();
            }
        }

        this.changeActivePunishmentLoggedIn = () => { // dispatch akciju koja stavlja odabrani punishment na trenutni 

            if (window.canRunAds === undefined) { // adblocker detektiran
                let specialPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('ADBLOCKER_DETECTED', this.props.specialPunishments));
                if (specialPunishment) {
                    this.props.setActivePunishment(specialPunishment);
                } else return;
            } else if (this.props.punishmentIdFromURL) { // kazna sa url-a        
                let punishmentInURL = getByValue(this.props.acceptedPunishments, this.props.punishmentIdFromURL);
                if (punishmentInURL) {  // kazna je aktivna
                    this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(punishmentInURL));
                } else { // kazna nije pronadena u accepted                    
                    punishmentInURL = getByValue(this.props.pastPunishments, this.props.punishmentIdFromURL) // pronadi je u past kaznama
                    if (punishmentInURL) this.handleFaultyAcceptedPunishment(punishmentInURL);
                    else this.setRandomActivePunishment();
                }
            } else { // ako ne postoji postavi random punishment
                this.setRandomActivePunishment();
            }
        }

        this.setRandomActivePunishment = () => {
            let randomPunishment = getRandomPunishment(this.props.randomPunishments);
            this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(randomPunishment));
        }

        this.handleFaultyAcceptedPunishment = punishment => {
            //provjera ignorea
            if (punishment && checkIfIgnoredPunishment(punishment)) {
                let specialPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('ACCESING_IGNORED_PUNISHMENT', this.props.specialPunishments))
                if (specialPunishment) return this.props.setActivePunishment(specialPunishment, true);
            }
            // dobiti status kazne
            let punishmentStatus = getAcceptedPunishmentStatus(punishment);
            // dobiti poruku
            let warningMsg = null;
            switch (punishmentStatus) {
                case 'given_up':
                    warningMsg = 'Punishment was given up.';
                    break;
                case 'done':
                    warningMsg = 'Punishment already completed!';
                    break;
                case 'failed':
                    warningMsg = 'Punishment was failed.';
                    break;
                case 'ignored':
                    warningMsg = 'Punishment was ignored.';
                    break;
                case 'rejected':
                    warningMsg = 'Punishment was rejected.';
                    break;
                default:
                    warningMsg = 'Err... something went wrong. Oh, no! We\'ll get punished!';
                    break;
            }

            // postavi poruku i random kaznu
            this.props.faultyPunishmentSet(warningMsg);
            this.setRandomActivePunishment();
        }

        this.setBoardInViewport = delay => {
            // focusaj board nakon odredenog vremena
            this.boardInViewportTimeout = setTimeout(() => {
                this.writingBoard.scrollIntoView({ behavior: 'smooth' });
            }, delay);
        }
    }

    /*  componentDidMount() {
            // trigera se kod setanja novog pwda
            if (Object.keys(this.props.activePunishment).length && Object.keys(this.props.currentUser).length) {
                this.changeActivePunishmentLoggedIn();
            }
        } */

    componentWillUnmount() {
        this.props.gameUnmount();
        clearTimeout(this.boardInViewportTimeout);
    }

    componentDidUpdate(prevProps) {

        const userNotLoggedIn = Object.keys(prevProps.currentUser).length === 0 && Object.keys(this.props.currentUser).length === 0;
        const userJustLoggedIn = Object.keys(prevProps.currentUser).length !== Object.keys(this.props.currentUser).length;
        const userLoggedIn = Object.keys(this.props.currentUser).length && typeof this.props.currentUser._id !== 'undefined';
        const appFinishedLoadingUser = prevProps.loadInProgress === true && this.props.loadInProgress === false && userJustLoggedIn;
        const appFinishedLoadingUserNotFound = !window.localStorage.getItem('token') || (window.localStorage.getItem('token') && userNotLoggedIn && prevProps.loadInProgress === true & this.props.loadInProgress === false);
        const randomAndSpecialPunishmentsLoaded = this.props.randomPunishments && this.props.specialPunishments && this.props.randomPunishments !== 'empty' && this.props.randomPunishments.length > 0 && this.props.specialPunishments !== 'empty' && this.props.specialPunishments.length > 0;
        const activePunishmentNotSet = !Object.keys(prevProps.activePunishment).length && !Object.keys(this.props.activePunishment).length;
        const acceptedAndPastPunishmentsLoaded = this.props.acceptedPunishments !== 'empty' && this.props.pastPunishments !== 'empty';
        const userJustLoggedOut = Object.keys(prevProps.activePunishment).length > 0 && Object.keys(this.props.activePunishment).length === 0 && !userLoggedIn;
        const cheating = !prevProps.cheating && this.props.cheating;
        const guestPunishmentLoaded = !this.props.guestDataLoadingInProgress;
        const guestPunAvail = this.props.guestPunishment !== null && Object.keys(this.props.guestPunishment).length > 0;
        // detektiraj ako je aktivna kazna givenupana te postavi na random kaznu
        const activePunishmentGivenUpWhileNotDone = typeof this.props.activePunishment.created !== 'undefined' && (!!getByValue(prevProps.acceptedPunishments, prevProps.activePunishment.uid) && !getByValue(this.props.acceptedPunishments, this.props.activePunishment.uid)) && this.props.punishmentProgress < 100;

        if (cheating) this.setCheatingPunishment();
        // slucaj kada user nije logan a setupana je guest kazna
        if (
            !userLoggedIn
            && guestPunishmentLoaded
            && guestPunAvail
            && activePunishmentNotSet
            && randomAndSpecialPunishmentsLoaded
        ) {
            this.changeActivePunishmentNotLoggedIn();
        } else if (
            (guestPunishmentLoaded
                && appFinishedLoadingUserNotFound
                && randomAndSpecialPunishmentsLoaded
                && activePunishmentNotSet)
            || userJustLoggedOut
        ) {
            this.changeActivePunishmentNotLoggedIn();
            // ima usera
        } else if (
            (userLoggedIn
                && randomAndSpecialPunishmentsLoaded
                && acceptedAndPastPunishmentsLoaded
                && activePunishmentNotSet)
            || (userLoggedIn
                && activePunishmentGivenUpWhileNotDone)
        ) {
            this.changeActivePunishmentLoggedIn();
        }

        if (
            Object.keys(this.props.activePunishment).length
            && (this.props.activePunishment.uid !== prevProps.activePunishment.uid)
            && !specialOrRandomPunishmentIsActive(this.props.activePunishment)
        ) {
            this.setBoardInViewport(800);
        }

        if (
            (prevProps.showToS === false && this.props.showToS === true)
            || (prevProps.showPrivacyPolicy === false && this.props.showPrivacyPolicy === true)
        ) {
            this.setBoardInViewport(100);
        }
    }

    render() {

        return (
            <div id="board-component-container" className="parent-component">
                <div className="container">
                    <div
                        ref={elem => this.writingBoard = elem}
                        className="left-side-col">
                        <img id="credits" src="credits.png" alt="" />
                        <Timer />
                        <Board />

                        <div id="board-bottom-books-component">

                            <svg id="books-on-floor" width="157px" height="139px" viewBox="0 0 157 139" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <g id="page-01" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-827.000000, -971.000000)">
                                    <g id="Ploca" transform="translate(0.000000, 150.000000)">
                                        <g id="knjige-ispod-ploce" transform="translate(827.000000, 821.000000)">
                                            <g id="Group" transform="translate(0.000000, 64.000000)">
                                                <polygon id="Fill-23" fill="#4F69A8" points="0 21 126 21 126 0 0 0"></polygon>
                                                <polygon id="Fill-24" fill="#FF545F" points="114 21 120 21 120 0 114 0"></polygon>
                                                <polygon id="Fill-25" fill="#FF545F" points="102 21 108 21 108 0 102 0"></polygon>
                                                <polygon id="Fill-26" fill="#FF545F" points="19 16 31 16 31 5 19 5"></polygon>
                                                <polygon id="Fill-27" fill="#FF545F" points="7 21 13 21 13 0 7 0"></polygon>
                                            </g>
                                            <g id="Fill-30-+-Fill-28-+-Fill-33" transform="translate(31.000000, 85.000000)">
                                                <path d="M6.1682,6 L6.1682,26 L95.1082,26 C95.1082,26 103.1082,26 103.1082,17.3513514 L103.1082,14.6486486 C103.1082,14.6486486 103.1082,6 95.1082,6 L6.1682,6 Z"
                                                    id="Fill-30" fill="#FF948A"></path>
                                                <path d="M110.5082,17.1162791 L110.5082,14.8837209 C110.5082,14.8837209 110.5082,0 95.7737733,0 L0,0 L0,6.69767442 L95.037052,6.69767442 C103.140987,6.69767442 103.140987,14.8837209 103.140987,14.8837209 L103.140987,17.1162791 C103.140987,25.3023256 95.037052,25.3023256 95.037052,25.3023256 L0,25.3023256 L0,32 L95.7737733,32 C95.7737733,32 110.5082,32 110.5082,17.1162791"
                                                    id="Fill-28" fill="#A479E1"></path>
                                                <polygon id="Fill-33" fill="#FF545F" points="63 15.0397 63 31.3637 68.5 26.1397 74 31.3637 74 15.0397"></polygon>
                                            </g>
                                            <g id="Fill-30-+-Fill-28-+-Fill-33-Copy" transform="translate(64.500000, 48.000000) scale(-1, 1) translate(-64.500000, -48.000000) translate(9.000000, 32.000000)">
                                                <path d="M6.1682,6 L6.1682,26 L95.1082,26 C95.1082,26 103.1082,26 103.1082,17.3513514 L103.1082,14.6486486 C103.1082,14.6486486 103.1082,6 95.1082,6 L6.1682,6 Z"
                                                    id="Fill-30" fill="#2BD7F3"></path>
                                                <path d="M110.5082,17.1162791 L110.5082,14.8837209 C110.5082,14.8837209 110.5082,0 95.7737733,0 L0,0 L0,6.69767442 L95.037052,6.69767442 C103.140987,6.69767442 103.140987,14.8837209 103.140987,14.8837209 L103.140987,17.1162791 C103.140987,25.3023256 95.037052,25.3023256 95.037052,25.3023256 L0,25.3023256 L0,32 L95.7737733,32 C95.7737733,32 110.5082,32 110.5082,17.1162791"
                                                    id="Fill-28" fill="#3B8DBC"></path>
                                                <polygon id="Fill-33" fill="#234F78" points="63 15.0397 63 31.3637 68.5 26.1397 74 31.3637 74 15.0397"></polygon>
                                            </g>
                                            <g id="Fill-30-+-Fill-28-+-Fill-33-Copy-2" transform="translate(46.000000, 0.000000)">
                                                <path d="M6.1682,6 L6.1682,26 L95.1082,26 C95.1082,26 103.1082,26 103.1082,17.3513514 L103.1082,14.6486486 C103.1082,14.6486486 103.1082,6 95.1082,6 L6.1682,6 Z"
                                                    id="Fill-30" fill="#FF948A"></path>
                                                <path d="M110.5082,17.1162791 L110.5082,14.8837209 C110.5082,14.8837209 110.5082,0 95.7737733,0 L0,0 L0,6.69767442 L95.037052,6.69767442 C103.140987,6.69767442 103.140987,14.8837209 103.140987,14.8837209 L103.140987,17.1162791 C103.140987,25.3023256 95.037052,25.3023256 95.037052,25.3023256 L0,25.3023256 L0,32 L95.7737733,32 C95.7737733,32 110.5082,32 110.5082,17.1162791"
                                                    id="Fill-28" fill="#EA411E"></path>
                                            </g>
                                            <g id="knjiga-1" transform="translate(3.000000, 117.000000)">
                                                <polygon id="Fill-34" fill="#EA411E" points="0 21.9798 148 21.9798 148 0 0 0"></polygon>
                                                <polygon id="Fill-37" fill="#2B80B2" points="21 21.9798 28 21.9798 28 0 21 0"></polygon>
                                                <polygon id="Fill-38" fill="#2B80B2" points="7 22 14 22 14 0 7 0"></polygon>
                                                <polygon id="Fill-37-Copy-3" fill="#2B80B2" points="134 21.9798 141 21.9798 141 0 134 0"></polygon>
                                                <polygon id="Fill-37-Copy-2" fill="#2B80B2" points="120 21.9798 127 21.9798 127 0 120 0"></polygon>
                                                <path d="M107,18 C110.866137,18 114,14.8661367 114,11 C114,7.13386328 110.866137,4 107,4 C103.133863,4 100,7.13386328 100,11 C100,14.8661367 103.133863,18 107,18"
                                                    id="Fill-39" fill="#00BBD6"></path>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>



                        </div>
                    </div>

                    <div className="right-side-col">

                        <div id="plant-board-right-container">
                            <svg id="board-plant-with-shelf" width="190px" height="237px" viewBox="0 0 190 237" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <g id="page-01" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-1067.000000, -180.000000)">
                                    <g id="Ploca" transform="translate(0.000000, 150.000000)">
                                        <g id="biljka-sa-policom" transform="translate(1067.000000, 30.000000)">
                                            <polygon id="polica" fill="#2B80B2" points="0 237 190 237 190 217 0 217"></polygon>
                                            <g id="cvijet-1" transform="translate(56.000000, 0.000000)">
                                                <path d="M33.9747,116.0374 C24.7067,81.4464 3.2747,57.1334 3.2747,57.1334 C3.2747,57.1334 -3.1303,88.9044 6.1387,123.4964 C15.4077,158.0884 29.1527,184.4604 36.8397,182.4004 C44.5267,180.3404 43.2437,150.6294 33.9747,116.0374 Z"
                                                    id="Fill-17" fill="#2B80B2"></path>
                                                <path d="M42.074,167.2939 C34.387,165.2339 35.67,135.5229 44.939,100.9309 C54.207,66.3399 75.639,42.0269 75.639,42.0269 C75.639,42.0269 82.044,73.7979 72.775,108.3899 C63.506,142.9819 49.761,169.3539 42.074,167.2939"
                                                    id="Fill-19" fill="#4F69A8"></path>
                                                <path d="M38.0823,155.2449 C46.0403,155.2449 52.4913,120.6839 52.4913,78.0509 C52.4913,35.4179 38.0823,0.8569 38.0823,0.8569 C38.0823,0.8569 23.6733,35.4179 23.6733,78.0509 C23.6733,120.6839 30.1243,155.2449 38.0823,155.2449"
                                                    id="Fill-21" fill="#4F69A8"></path>
                                                <polygon id="Fill-25" fill="#A479E1" points="0 138.7769 17.992 213.9039 58.173 213.9039 76.165 138.7769"></polygon>
                                                <polygon id="Fill-26" fill="#4F69A8" points="8.234 217 67.931 217 67.931 202.591 8.234 202.591"></polygon>
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>

                        <div id="rollup-container">
                            <Ads />
                        </div>

                    </div>

                </div>
                <div id="classroom-floor"></div>
            </div >
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);


function getByValue(arr, uid) {

    for (let i = 0, iLen = arr.length; i < iLen; i++) {
        if (decodeURIComponent(arr[i].uid) === decodeURIComponent(uid)) return arr[i];
    }
    return null;
}

function getSpecialPunishment(type, specialPunishments) {

    for (let i = 0; i < specialPunishments.length; i++) {

        if (specialPunishments[i].type === type) {

            return JSON.parse(JSON.stringify(specialPunishments[i]));
        }
    }

    return null;
}

function addSpacingToPunishmentWhatToWrite(punishment) {
    if (punishment.what_to_write[punishment.what_to_write.length - 1] === ' ') {
        return punishment;
    } else {
        return { ...punishment, what_to_write: punishment.what_to_write += ' ' };
    }
}

function getRandomPunishment(punishments) {
    if (punishments.length === 1) {
        return punishments[0];

    } else if (!punishments.length) {
        return null;

    } else {
        const randIndex = Math.floor(Math.random() * punishments.length);
        return punishments[randIndex];
    }
}

function getAcceptedPunishmentStatus(punishment) {
    if (typeof punishment.given_up !== 'undefined' && punishment.given_up !== null) return 'given_up';
    else if (typeof punishment.done !== 'undefined' && punishment.done !== null) return 'done';
    else if (typeof punishment.failed !== 'undefined' && punishment.failed !== null) return 'failed';
    else if (typeof punishment.ignored !== 'undefined' && punishment.ignored !== null) return 'ignored';
    else if (typeof punishment.rejected !== 'undefined' && punishment.rejected !== null) return 'rejected';
    else return null;
}


function specialOrRandomPunishmentIsActive(punishment) { // specijalne kazne nemaju created property
    return punishment.created ? false : true;
}