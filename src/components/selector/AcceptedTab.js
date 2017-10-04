import React from 'react';
import { connect } from 'react-redux';
import AcceptedTabRow from './AcceptedTabRow';

import agent from '../../agent';


const mapStateToProps = state => ({ acceptedPunishments: state.punishment.acceptedPunishments });

const mapDispatchToProps = dispatch => ({
    onLoadedAcceptedPunishments: (punishments) => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_LOADED', punishments })
    },
    setActivePunishment: (punishment) => {
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment })
    },
    giveUpPunishment: (id, newAcceptedPunishments) => {
        // poslat backendu odustajanje
        agent.Punishment.giveUp(id)
            .then(dispatch({ type: 'GIVE_UP_ON_PUNISHMENT', newAcceptedPunishments }))
    }
});

class SelectedTab extends React.Component {

    constructor() {
        super();
        this.goPunishment = id => {
            // dispatch akciju koja stavlja odabrani punihsment na trenutni
            let resultPnsh;
            this.props.acceptedPunishments.forEach(function (punishment) {
                if (punishment._id === id) resultPnsh = punishment;
            });
            resultPnsh ? this.props.setActivePunishment(resultPnsh) : null;
        }
        this.giveUpPunishment = id => {
            // makni tu kaznu iz statea
            let filteredPunishments = this.props.acceptedPunishments.filter((punishment) => {
                return punishment._id === id ? null : punishment;
            });
            this.props.giveUpPunishment(id, filteredPunishments);
        }
    }

    componentDidMount() {
        // dohvat punishmenta ako je user loggan
        /* if (this.props.common.currentUser) */
        agent.Punishment.getAccepted().then((payload) => {
            console.log('Accepted punishment payload');
            console.log(payload);
            if (payload) this.props.onLoadedAcceptedPunishments(payload.acceptedPunishments);
        });
    }

    render() {

        const acceptedPunishments = this.props.acceptedPunishments;
        const style = {
            "width": "220px",
            "display": "inline-block"
        }

        if (acceptedPunishments.length > 0) {
            return (
                <div className="container">
                    <div className="container">
                        <label style={style}>ORDERED BY</label><label style={style}>DEADLINE</label>
                        <label style={style}>X</label><label style={style}>WHAT</label>
                    </div>
                    {
                        this.props.acceptedPunishments.map(punishment => {
                            return (
                                <AcceptedTabRow punishment={punishment} style={style} key={punishment._id}
                                    id={punishment._id} onGoClick={this.goPunishment} onGiveUpClick={this.giveUpPunishment} />
                            )
                        })
                    }
                </div>
            )
        } else if (acceptedPunishments.length === 0) {
            return (<h3>No data</h3>);
        }
        else {
            return (<h3>Loading data...</h3>);
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedTab);