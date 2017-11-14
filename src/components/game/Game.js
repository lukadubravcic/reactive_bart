import React from 'react';
import Board from './Board';
import Timer from './Timer';
import { connect } from 'react-redux';


const mapStateToProps = state => ({
    ...state.punishment,
    activePunishment: state.game.activePunishment,
    randomPunishments: state.punishment.randomPunishments,
    specialPunishments: state.punishment.specialPunishments,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
    setActivePunishment: punishment => {
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment });
    }
});

class Game extends React.Component {

    constructor() {
        super();

        this.changeActivePunishment = () => { // dispatch akciju koja stavlja odabrani punishment na trenutni 

            if (window.canRunAds === undefined) { // adblocker

                let specialPunishment = getSpecialPunishment('ADBLOCKER_DETECTED', this.props.specialPunishments);
                
                if (specialPunishment) this.props.setActivePunishment(specialPunishment);
                else return;

            } else if (this.props.punishmentIdFromURL) { // postavi kaznu sa urla (ako postoji)

                let punishmentInURL = getByValue(this.props.acceptedPunishments, this.props.punishmentIdFromURL);

                if (punishmentInURL) this.props.setActivePunishment(punishmentInURL);

                else this.props.setActivePunishment(this.props.randomPunishments[0]);

            } else { // ako ne postoji postavi random punishment

                this.props.setActivePunishment(this.props.randomPunishments[0]);
            }
        };
    }

    componentDidUpdate(prevProps) {

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