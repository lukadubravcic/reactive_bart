import React from 'react';
import { connect } from 'react-redux';
import AcceptedTabRow from './AcceptedTabRow';
import TableFooter from './TableFooter';

import agent from '../../agent';

const ITEMS_PER_PAGE = 3;

const mapStateToProps = state => ({
    state: state,
    acceptedPunishments: state.punishment.acceptedPunishments,
    shownAcceptedPunishments: state.punishment.shownAcceptedPunishments,
    currentPage: state.punishment.currentAcceptedPage
});

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
    },
    changeShownPunishments: (punishments, newPage) => {
        dispatch({ type: 'UPDATE_SHOWN_ACCEPTED_PUNISHMENTS', punishments, newPage })
    }
});

class SelectedTab extends React.Component {

    constructor() {
        super();
        this.goPunishment = id => { // dispatch akciju koja stavlja odabrani punihsment na trenutni
            let resultPnsh;
            this.props.acceptedPunishments.forEach(function (punishment) {
                if (punishment._id === id) resultPnsh = punishment;
            });
            resultPnsh ? this.props.setActivePunishment(resultPnsh) : null;
        };
        this.giveUpPunishment = id => { // makni tu kaznu iz statea
            let filteredPunishments = this.props.acceptedPunishments.filter((punishment) => {
                return punishment._id === id ? null : punishment;
            });
            this.props.giveUpPunishment(id, filteredPunishments);
        };
        this.showFirstPage = () => {
            let firstPage = [];
            for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                if (this.props.acceptedPunishments[i]) firstPage.push(this.props.acceptedPunishments[i]);
            }
            this.props.changeShownPunishments(firstPage, 1);
        };
        this.loadAndShowAcceptedPunishments = (punishments) => { // poziv kada stigne payload sa accepted punishmentima
            this.props.onLoadedAcceptedPunishments(punishments);
            this.showFirstPage();
        }
    }

    componentDidMount() { // dohvat accepted kazni sa backenda
        agent.Punishment.getAccepted().then((payload) => {
            if (payload) {
                this.loadAndShowAcceptedPunishments(payload.acceptedPunishments);
            } else {
                console.log("error: accepted punishments payload wasn't received")
            }
        });
    }

    render() {

        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownAcceptedPunishments;
        const style = {
            "width": "220px",
            "display": "inline-block"
        };

        /* 
            TODO: tableHeader kao zasebna komponenta koja upravlja poredkom prikazivanja itema
        */
        const tableHeader = (
            <div className="container">
                <hr />
                <label style={style}>ORDERED BY</label>
                <label style={style}>DEADLINE</label>
                <label style={style}>X</label>
                <label style={style}>WHAT</label>
                <hr />
            </div>
        );

        if (shownPunishments !== 'empty') {
            return (
                <div className="container">
                    {tableHeader}
                    {
                        shownPunishments.map(punishment => {
                            return (
                                <AcceptedTabRow punishment={punishment} style={style} key={punishment._id}
                                    id={punishment._id} onGoClick={this.goPunishment} onGiveUpClick={this.giveUpPunishment} />
                            )
                        })
                    }
                    <TableFooter currentPage={currentPage} punishments={this.props.acceptedPunishments} changeShownPunishments={this.props.changeShownPunishments}/>
                </div>
            )
        } else if (shownPunishments === 'empty') {
            return (
                <div className="container">
                    <h3>Loading data...</h3>
                </div>
            );
        }
        else {
            return (<h3>No data.</h3>);
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedTab);

