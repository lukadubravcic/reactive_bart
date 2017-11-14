import React from 'react';
import Board from './Board';
import Timer from './Timer';
import {connect} from 'react-redux';


const mapStateToProps = state => ({
    ...state.punishment,
    activePunishment: state.game.activePunishment,
    randomPunishments: state.punishment.randomPunishments,
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
            console.log('mjenjanje')

            if (this.props.punishmentIdFromURL) { // postavi kaznu sa urla (ako postoji)

                let punishmentInURL = getByValue(this.props.acceptedPunishments, this.props.punishmentIdFromURL);
                if (punishmentInURL) this.props.setActivePunishment(punishmentInURL);
                else this.props.setActivePunishment(this.props.randomPunishments[0]);

            } else { // ako ne postoji postavi random punishment

                this.props.setActivePunishment(this.props.randomPunishments[0]);
            }
        };
    }

    componentDidUpdate(prevProps) {
        
        if (!Object.keys(prevProps.activePunishment).length &&
            !Object.keys(this.props.activePunishment).length &&
            this.props.randomPunishments !== 'empty' &&
            Object.keys(this.props.specialPunishments).length) {
            console.log('ulaz')
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