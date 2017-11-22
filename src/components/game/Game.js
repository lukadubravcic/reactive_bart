import React from 'react';
import Board from './Board';
import Timer from './Timer';
import { connect } from 'react-redux';

import { checkIfIgnoredPunishment } from '../../helpers/helpers';


const mapStateToProps = state => ({
    ...state.punishment,
    activePunishment: state.game.activePunishment,
    currentUser: state.common.currentUser,
    loadInProgress: state.common.loadInProgress,
    punishmentIdFromURL: state.game.punishmentIdFromURL
});

const mapDispatchToProps = dispatch => ({
    setActivePunishment: (punishment, ignoredPunishmentSet = false) => {
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment, ignoredPunishmentSet });
    }
});

class Game extends React.Component {

    constructor() {
        super();

        this.changeActivePunishmentNotLoggedIn = () => {
            if (window.canRunAds === undefined) { // adblocker detektiran

                let specialPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('ADBLOCKER_DETECTED', this.props.specialPunishments));

                if (specialPunishment) {

                    this.props.setActivePunishment(specialPunishment);

                } else return;

            } else if (this.props.punishmentIdFromURL) {
                let randomPunishment = getRandomPunishment(this.props.randomPunishments);
                this.props.randomPunishments[0] && this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(randomPunishment), true);

            } else {
                let randomPunishment = getRandomPunishment(this.props.randomPunishments);
                this.props.randomPunishments[0] && this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(randomPunishment));
            }
        }

        this.changeActivePunishmentLoggedIn = () => { // dispatch akciju koja stavlja odabrani punishment na trenutni 

            if (window.canRunAds === undefined) { // adblocker detektiran

                let specialPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('ADBLOCKER_DETECTED', this.props.specialPunishments));

                if (specialPunishment) {

                    this.props.setActivePunishment(specialPunishment);

                } else return;

            } else if (this.props.punishmentIdFromURL && this.props.currentUser._id) { // kazna sa url-a

                let punishmentInURL = getByValue(this.props.acceptedPunishments, this.props.punishmentIdFromURL);

                if (punishmentInURL) {  // kazna je aktivna
                    this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(punishmentInURL));

                } else { // kazna nije pronadena u accepted

                    punishmentInURL = getByValue(this.props.pastPunishments, this.props.punishmentIdFromURL) // pronadi je u past kaznama
                    /* console.log(this.props.pastPunishments)
                    console.log(this.props.currentUser) */
                    if (punishmentInURL && checkIfIgnoredPunishment(punishmentInURL)) { // ako je u past kaznama i status = ignored

                        let specialPunishment = addSpacingToPunishmentWhatToWrite(getSpecialPunishment('ACCESING_IGNORED_PUNISHMENT', this.props.specialPunishments))
                        specialPunishment && this.props.setActivePunishment(specialPunishment, true);

                    } else { // pristup kazni koja se ne moze izvrsiti, prebaci na random

                        let randomPunishment = getRandomPunishment(this.props.randomPunishments);
                        this.props.setActivePunishment(addSpacingToPunishmentWhatToWrite(randomPunishment));
                    }
                }

            } else { // ako ne postoji postavi random punishment

                let randomPunishment = null;

                if (this.props.randomPunishments[0]) {

                    randomPunishment = addSpacingToPunishmentWhatToWrite(this.props.randomPunishments[0])
                }

                this.props.setActivePunishment(randomPunishment);
            }
        };
    }

    componentDidUpdate(prevProps) {

        const userNotLoggedIn = Object.keys(prevProps.currentUser).length === 0 && Object.keys(this.props.currentUser).length === 0;
        const userJustLoggedIn = Object.keys(prevProps.currentUser).length !== Object.keys(this.props.currentUser).length;
        const userLoggedIn = Object.keys(this.props.currentUser).length;
        const appFinishedLoadingUser = prevProps.loadInProgress === true && this.props.loadInProgress === false && userJustLoggedIn;
        const appFinishedLoadingUserNotFound = !window.localStorage.getItem('token') || (window.localStorage.getItem('token') && userNotLoggedIn && prevProps.loadInProgress === true & this.props.loadInProgress === false);
        const randomAndSpecialPunishmentsLoaded = this.props.randomPunishments !== 'empty' && this.props.randomPunishments.length > 0 && this.props.specialPunishments !== 'empty' && this.props.specialPunishments.length > 0;
        const activePunishmentNotSet = !Object.keys(prevProps.activePunishment).length && !Object.keys(this.props.activePunishment).length;
        const acceptedAndPastPunishmentsLoaded = this.props.acceptedPunishments !== 'empty' && this.props.pastPunishments !== 'empty';
        const userJustLoggedOut = Object.keys(prevProps.activePunishment).length > 0 && Object.keys(this.props.activePunishment).length === 0 && !userLoggedIn;

        // nema usera ili se desio logout
        if ((appFinishedLoadingUserNotFound && randomAndSpecialPunishmentsLoaded && activePunishmentNotSet) || userJustLoggedOut) {

            this.changeActivePunishmentNotLoggedIn();
            // ima usera
        } else if (userLoggedIn && randomAndSpecialPunishmentsLoaded && acceptedAndPastPunishmentsLoaded && activePunishmentNotSet) {

            this.changeActivePunishmentLoggedIn();

        }

        /* if (Object.keys(this.props.currentUser).length === 0) {
            console.log(!Object.keys(this.props.currentUser).length)
            console.log(this.props.currentUser)
            if (//prevProps.currentUser._id !== this.props.currentUser._id &&
                this.props.randomPunishments !== 'empty' &&
                this.props.specialPunishments !== 'empty' ||
                !Object.keys(prevProps.activePunishment).length &&
                !Object.keys(this.props.activePunishment).length &&
                this.props.randomPunishments !== 'empty' &&
                Object.keys(this.props.specialPunishments).length) {

                this.changeActivePunishment();
            }

        } else if (

            (this.props.acceptedPunishments !== 'empty' &&
                this.props.pastPunishments !== 'empty' &&
                prevProps.currentUser._id !== this.props.currentUser._id &&
                this.props.randomPunishments !== 'empty' &&
                this.props.specialPunishments !== 'empty') ||
            (this.props.acceptedPunishments !== 'empty' &&
                this.props.pastPunishments !== 'empty' &&
                !Object.keys(prevProps.activePunishment).length &&
                !Object.keys(this.props.activePunishment).length &&
                this.props.randomPunishments !== 'empty' &&
                Object.keys(this.props.specialPunishments).length)) {
            console.log('drugi if')
            this.changeActivePunishment();
        } */
    }


    render() {
        return (
            <div className="container">
                <Timer />
                <Board />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);


function getByValue(arr, value) {
    for (let i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i]._id === value) return arr[i];
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

        return { ...punishment };

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