import React from 'react';
import { connect } from 'react-redux';

import AcceptedTabRow from './AcceptedTabRow';
import TableFooter from '../TableFooter';
import TableHeader from '../TableHeader';

import { sortPunishmentsByOrderedBy, sortPunishmentsByDeadline, sortPunishmentsByHowManyTimes } from '../../../helpers/sortingPunishments';

import agent from '../../../agent';

import { ITEMS_PER_PAGE } from '../../../constants/constants';


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
    onResorting: (punishments) => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_RESORTED', punishments })
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

class AcceptedTab extends React.Component {

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
        this._showFirstPage = () => {
            let firstPage = [];
            for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                if (this.props.acceptedPunishments[i]) firstPage.push(this.props.acceptedPunishments[i]);
            }
            this.props.changeShownPunishments(firstPage, 1);
        };
        this.loadAndShowAcceptedPunishments = (punishments) => { // poziv kada stigne payload sa accepted punishmentima
            this.props.onLoadedAcceptedPunishments(punishments);
            this._showFirstPage();
        }
        this.changeElement = () => {

        }

        this.reSortPunishments = (id) => {

            let sortedPunishments = [];
            switch (id) {
                case 'orderedBy':
                    sortedPunishments = sortPunishmentsByOrderedBy(this.props.acceptedPunishments, 1);
                    if (sortedPunishments) {
                        this.props.onResorting(sortedPunishments);
                        setTimeout(() => {
                            this._showFirstPage();
                        }, 1);
                        let element = getByValue(this.columns, id);
                        element.sortOrder *= -1;
                        this.changeElement();
                        console.log(this.columns);

                    }
                    break;
                case 'deadline':
                    sortedPunishments = sortPunishmentsByDeadline(this.props.acceptedPunishments, 1);
                    if (sortedPunishments) {
                        this.props.onResorting(sortedPunishments);
                        this._showFirstPage();
                    }
                    break;
                case 'howManyTimes':
                    sortedPunishments = sortPunishmentsByHowManyTimes(this.props.acceptedPunishments, 1);
                    if (sortedPunishments) {
                        this.props.onResorting(sortedPunishments);
                        this._showFirstPage();
                    }
                    break;
            }
            //console.log(this.props.acceptedPunishments[0].user_ordering_punishment);
            //for (let pun of this.props.acceptedPunishments) console.log(pun.user_ordering_punishment)

        }

        this.columns = [
            {
                name: 'ORDERED BY',
                clickHandler: this.reSortPunishments,
                id: 'orderedBy',
                sortOrder: 1,
            },
            {
                name: 'DEADLINE',
                clickHandler: this.reSortPunishments,
                id: 'deadline',
                sortOrder: 1,
            },
            {
                name: 'X',
                clickHandler: this.reSortPunishments,
                id: 'howManyTimes',
                sortOrder: 1,
            },
            {
                name: 'WHAT',
                clickHandler: null,
                id: 'whatToWrite'
            }
        ]
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
        /*  const tableHeader = (
             <div className="container">
                 <hr />
                 <label style={style}>ORDERED BY</label>
                 <label style={style}>DEADLINE</label>
                 <label style={style}>X</label>
                 <label style={style}>WHAT</label>
                 <hr />
             </div>
         ); */

        if (shownPunishments !== 'empty') {
            return (
                <div className="container">
                    {/* {tableHeader} */}
                    <TableHeader columns={this.columns} style={style} />
                    {
                        shownPunishments.map(punishment => {
                            return (
                                <AcceptedTabRow punishment={punishment} style={style} key={punishment._id}
                                    id={punishment._id} onGoClick={this.goPunishment} onGiveUpClick={this.giveUpPunishment} />
                            )
                        })
                    }
                    <TableFooter currentPage={currentPage} punishments={this.props.acceptedPunishments} changeShownPunishments={this.props.changeShownPunishments} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AcceptedTab);


function getByValue(arr, value) {

    for (let i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].id == value) return arr[i];
    }
    return null;
}