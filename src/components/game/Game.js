import React from 'react';
import Board from './Board';
import Timer from './Timer';
import Ads from '../ads/Ads';
import { connect } from 'react-redux';

import { checkIfIgnoredPunishment } from '../../helpers/helpers';


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
    punishmentProgress: state.game.progress
});

const mapDispatchToProps = dispatch => ({
    setActivePunishment: (punishment, ignoredPunishmentSet = false) => {
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment, ignoredPunishmentSet });
    },
    gameUnmount: () => {
        dispatch({ type: 'GAME_UNMOUNT' });
    }
});

class Game extends React.Component {

    constructor() {
        super();

        this.setCheatingPunishment = () => {
            let cheatingPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('CHEAT_DETECTED', this.props.specialPunishments));

            if (cheatingPunishment) {
                this.props.setActivePunishment(cheatingPunishment);
            }
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
                let randomPunishment = getRandomPunishment(this.props.randomPunishments);
                this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(randomPunishment));
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

                    if (punishmentInURL && checkIfIgnoredPunishment(punishmentInURL)) { // ako je u past kaznama i status = ignored

                        let specialPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('ACCESING_IGNORED_PUNISHMENT', this.props.specialPunishments))
                        specialPunishment && this.props.setActivePunishment(specialPunishment, true);

                    } else { // pristup kazni koja se ne moze izvrsiti, prebaci na random

                        let randomPunishment = getRandomPunishment(this.props.randomPunishments);
                        this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(randomPunishment));
                    }
                }

            } else { // ako ne postoji postavi random punishment

                let randomPunishment = getRandomPunishment(this.props.randomPunishments);

                if (randomPunishment) {
                    this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(randomPunishment));
                }
            }
        };
    }

    componentDidMount() {
        // trigera se kod setanja novog pwda
        if (Object.keys(this.props.activePunishment).length && Object.keys(this.props.currentUser).length) {
            this.changeActivePunishmentLoggedIn();
        }
    }

    componentWillUnmount() {
        this.props.gameUnmount();
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
        const guestPunishmentLoaded = this.props.punishmentIdFromURL ? !this.props.guestDataLoadingInProgress : true;
        // detektiraj ako je aktivna kazna givenupana te postavi na random kaznu
        const activePunishmentGivenUpWhileNotDone = typeof this.props.activePunishment.created !== 'undefined' && (!!getByValue(prevProps.acceptedPunishments, prevProps.activePunishment.uid) && !getByValue(this.props.acceptedPunishments, this.props.activePunishment.uid)) && this.props.progress < 100;
        // console.log('givenUp: ' + activePunishmentGivenUp);
        // console.log('userLoggedIn: ' + (typeof this.props.currentUser._id !== 'undefined'))

        // console.log(activePunishmentNotSet)
        // nema usera ili se desio logout ili invited user
        if ((guestPunishmentLoaded && appFinishedLoadingUserNotFound && randomAndSpecialPunishmentsLoaded && activePunishmentNotSet) || userJustLoggedOut) {
            this.changeActivePunishmentNotLoggedIn();

            // ima usera
        } else if ((userLoggedIn && randomAndSpecialPunishmentsLoaded && acceptedAndPastPunishmentsLoaded && activePunishmentNotSet) || (userLoggedIn && activePunishmentGivenUpWhileNotDone)) {
            this.changeActivePunishmentLoggedIn();
        }

        if (cheating) {
            this.setCheatingPunishment();
        }
    }

    render() {
        return (
            <div className="container">
                <div style={{ float: "left" }}>
                    <Timer />
                    <Board />
                </div>
                <div style={{ overflow: "hidden" }}>
                    <Ads />
                </div>
                <br style={{ "clear": "left" }} />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);


function getByValue(arr, uid) {

    uid = typeof uid !== 'number' ? parseInt(uid) : uid; 
   
    for (let i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].uid === uid) return arr[i];
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