import React from 'react';
import Board from './Board';
import Timer from './Timer';
import { connect } from 'react-redux';

import { checkIfIgnoredPunishment } from '../../helpers/helpers';


const mapStateToProps = state => ({
    ...state.punishment,
    activePunishment: state.game.activePunishment,
    currentUser: state.common.currentUser,
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

        this.changeActivePunishment = () => { // dispatch akciju koja stavlja odabrani punishment na trenutni 

            if (window.canRunAds === undefined) { // adblocker detektiran

                let specialPunishment = getSpecialPunishment('ADBLOCKER_DETECTED', this.props.specialPunishments);

                if (specialPunishment) this.props.setActivePunishment(specialPunishment);
                else return;

            } else if (this.props.punishmentIdFromURL) { // kazna sa url-a
                
                let punishmentInURL = getByValue(this.props.acceptedPunishments, this.props.punishmentIdFromURL);

                if (punishmentInURL) this.props.setActivePunishment(punishmentInURL); // kazna je aktivna

                else { // kazna nije pronadena u accepted
                    
                    punishmentInURL = getByValue(this.props.pastPunishments, this.props.punishmentIdFromURL) // pronadi je u past kaznama
                    /* console.log(this.props.pastPunishments)
                    console.log(this.props.currentUser) */
                    if (punishmentInURL && checkIfIgnoredPunishment(punishmentInURL)) { // ako je u past kaznama i status = ignored
                        console.log('game: kazna sa urla')
                        let specialPunishment = getSpecialPunishment('ACCESING_IGNORED_PUNISHMENT', this.props.specialPunishments)
                        specialPunishment && this.props.setActivePunishment(specialPunishment, true);

                    } else { // pristup kazni koja se ne moze izvrsiti, prebaci na random

                        this.props.setActivePunishment(this.props.randomPunishments[0]);
                    }
                }

            } else { // ako ne postoji postavi random punishment

                this.props.setActivePunishment(this.props.randomPunishments[0]);
            }
        };
    }

    componentDidUpdate(prevProps) {

        if (!Object.keys(this.props.currentUser).length) {

            if (//prevProps.currentUser._id !== this.props.currentUser._id &&
                this.props.randomPunishments !== 'empty' &&
                this.props.specialPunishments !== 'empty' ||
                !Object.keys(prevProps.activePunishment).length &&
                !Object.keys(this.props.activePunishment).length &&
                this.props.randomPunishments !== 'empty' &&
                Object.keys(this.props.specialPunishments).length) {

                this.changeActivePunishment();
            }

        } else if (this.props.acceptedPunishments !== 'empty' && this.props.pastPunishments !== 'empty') {
           
            if (prevProps.currentUser._id !== this.props.currentUser._id &&
                this.props.randomPunishments !== 'empty' &&
                this.props.specialPunishments !== 'empty' ||
                !Object.keys(prevProps.activePunishment).length &&
                !Object.keys(this.props.activePunishment).length &&
                this.props.randomPunishments !== 'empty' &&
                Object.keys(this.props.specialPunishments).length) {

                this.changeActivePunishment();
            } // startup setanje aktivne kazne
        }
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
