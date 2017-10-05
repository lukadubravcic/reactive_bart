import React from 'react';
import { connect } from 'react-redux';
import AcceptedTabRow from './AcceptedTabRow';

import agent from '../../agent';

const ITEMS_PER_PAGE = 3;

const mapStateToProps = state => ({
    state: state,
    acceptedPunishments: state.punishment.acceptedPunishments,
    shownAcceptedPunishments: state.punishment.shownAcceptedPunishments,
    currentPage: state.punishment.currentPage
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
        this.showLastPage = () => {
            let lastPage = [];
            let counterStartingValue = this.props.acceptedPunishments.length / 10;

            if (this.props.acceptedPunishments.length >= ITEMS_PER_PAGE) {
                for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                    lastPage.push(this.props.acceptedPunishments[i]);
                }
            } else {
                lastPage = this.props.acceptedPunishments.slice();
            }
            this.props.changeShownPunishments(lastPage);
        };

        this.showPage = ev => {

            const currentPage = this.props.currentPage;
            const punishments = this.props.acceptedPunishments;
            const punishmentsLength = punishments.length;

            let startingIndex;
            let destinationPage;
            let lastPage = (punishmentsLength % ITEMS_PER_PAGE) ? Math.floor(punishmentsLength / ITEMS_PER_PAGE) + 1
                : Math.floor(punishmentsLength / ITEMS_PER_PAGE);
            let shownPunishments = [];

            switch (ev.target.id) {
                case 'firstPageMark':
                    destinationPage = 1;
                    startingIndex = 0;
                    break;
                case 'decrementPage':
                    destinationPage = currentPage === 1 ? currentPage : currentPage - 1;
                    startingIndex = getCounterStartingValue(destinationPage, punishmentsLength, ITEMS_PER_PAGE);
                    break;
                case 'incrementPage':
                    destinationPage = currentPage < lastPage ? currentPage + 1 : currentPage;
                    startingIndex = getCounterStartingValue(destinationPage, punishmentsLength, ITEMS_PER_PAGE);
                    console.log(startingIndex);
                    break;
                case 'lastPageMark':
                    destinationPage = lastPage;
                    startingIndex = getCounterStartingValue(-1, punishmentsLength, ITEMS_PER_PAGE);
                    console.log(startingIndex);
                    break;
            }

            for (let i = startingIndex; i < (startingIndex + ITEMS_PER_PAGE); i++) {
                if (punishments[i]) {
                    shownPunishments.push(punishments[i])
                };
            }
            this.props.changeShownPunishments(shownPunishments, destinationPage);
        }

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
        }

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

        const tableFooter = (
            <div className="container">
                <hr />
                <label id="firstPageMark" onClick={this.showPage}>FIRST</label>
                <label id="decrementPage" onClick={this.showPage}>&nbsp;&lt;&nbsp;</label>
                <label>{currentPage}</label>
                <label id="incrementPage" onClick={this.showPage}>&nbsp;&gt;&nbsp;</label>
                <label id="lastPageMark" onClick={this.showPage}>LAST</label>
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
                    {tableFooter}
                </div>
            )
        } else if (shownPunishments === 'empty') {
            return (
                <div className="container">
                    {tableHeader}
                    <h3>Loading data...</h3>
                    {tableFooter}
                </div>
            );
        }
        else {
            return (<h3>No data.</h3>);
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SelectedTab);


function getCounterStartingValue(pageNumber, arrayLength, itemsPerPage) {

    let maxPage = (arrayLength % itemsPerPage) ? Math.floor(arrayLength / itemsPerPage) + 1 : arrayLength / itemsPerPage;

    if (pageNumber <= maxPage) {
        let numOfPages = Math.floor(arrayLength / itemsPerPage);
        let remainder = arrayLength % itemsPerPage;
        if (pageNumber === 1) { // trazi se prva stranica
            return 0;
        } else if (pageNumber === -1) { // trazi se last page
            if (remainder === 0) return arrayLength - itemsPerPage - 1;
            else if (remainder > 0) return (maxPage - 1) * itemsPerPage;
        } else if (pageNumber > 0 && pageNumber < arrayLength) {
            return ((pageNumber - 1) * itemsPerPage);
        }
    }

    return null;
};