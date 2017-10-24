import React from 'react';
import { connect } from 'react-redux';

import AcceptedTabRow from './AcceptedTabRow';
import TableFooter from '../TableFooter';
import TableHeader from '../TableHeader';

import { sortPunishmentsByString, sortPunishmentsByDate, sortPunishmentsByNumber } from '../../../helpers/sortingPunishments';

import agent from '../../../agent';

import { ITEMS_PER_PAGE } from '../../../constants/constants';


const mapStateToProps = state => ({
    acceptedPunishments: state.punishment.acceptedPunishments,
    shownAcceptedPunishments: state.punishment.shownAcceptedPunishments,
    currentPage: state.punishment.currentAcceptedPage,
    activePunishment: state.game.activePunishment,
});

const mapDispatchToProps = dispatch => ({
    onLoadedAcceptedPunishments: (punishments) => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_LOADED', punishments })
    },
    changeAcceptedPunishments: (punishments) => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_CHANGED', punishments })
    },
    setActivePunishment: (punishment) => {
        if (punishment.what_to_write[punishment.what_to_write.length - 1] !== ' ') punishment.what_to_write += ' ';
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment })
    },
    giveUpPunishment: (id, newAcceptedPunishments) => {
        // poslat backendu odustajanje
        agent.Punishment.giveUp(id).then(dispatch({ type: 'GIVE_UP_ON_PUNISHMENT', newAcceptedPunishments }))
    },
    changeShownPunishments: (punishments, newPage) => {
        dispatch({ type: 'UPDATE_SHOWN_ACCEPTED_PUNISHMENTS', punishments, newPage })
    },
    savePunishmentProgress: (id, progress) => {
        dispatch({ type: 'SAVING_ACTIVE_PUNISHMENT', id, progress })
        agent.Punishment.saveProgress(id, progress).then(
            dispatch({ type: 'ACTIVE_PUNISHMENT_SAVED' })
        );
    },
    logPunishmentTry: (id, startTime = 0) => {
        let timeSpent = startTime ? Date.now() - startTime : 0;
        agent.Punishment.logTry(id, timeSpent);
    }
});

class AcceptedTab extends React.Component {

    constructor() {
        super();

        this.setDefaultPunishment = () => { // dispatch akciju koja stavlja odabrani punishment na trenutni       
            this.props.setActivePunishment(this.props.acceptedPunishments[0]);
        };

        this.handleGoPunishment = id => ev => { // dispatch akciju koja stavlja odabrani punishment na trenutni       
            ev.preventDefault();

            if (id !== this.props.activePunishment._id) {
                //this.savePunishment(this.props.activePunishment._id, this.props.activePunishment.progress);
                this.props.logPunishmentTry(this.props.activePunishment._id)
                for (let pun of this.props.acceptedPunishments) {
                    if (pun._id === id) {
                        if (!pun.progress) pun.progress = 0;
                        if (pun.what_to_write[pun.what_to_write.length - 1] !== ' ') pun.what_to_write += ' '; // dodaj razmak na kraju ako ga nema
                        this.props.setActivePunishment(pun);
                        return;
                    }
                }
            } else if (id === this.props.activePunishment._id) { // odabir trenutne kazne, nema promjene
                return;
            } else { // id ne postoji -> slucaj kada se automatski postavlja proizvoljna aktivna kazna 
                this.props.setDefaultPunishment();
            }
        };

        // promjeni acceptedPunishmente u stateu i u bazi (savePunishmentProgress())
        this.savePunishment = (id, progress) => {
            let accPunishments = JSON.parse(JSON.stringify(this.props.acceptedPunishments));

            for (let pun of accPunishments) {
                if (pun._id === id) {
                    pun.progress = progress || 0;
                    break;
                }
            }
            this.props.savePunishmentProgress(id, progress);
            this.props.changeAcceptedPunishments(accPunishments);
        };

        this.giveUpPunishment = id => { // makni tu kaznu iz statea
            let filteredPunishments = this.props.acceptedPunishments.filter((punishment) => {
                return punishment._id === id ? null : punishment;
            });
            this.props.giveUpPunishment(id, filteredPunishments);
        };

        this._showFirstPage = (punishments = this.props.acceptedPunishments) => {
            let firstPage = [];
            for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                if (punishments[i]) firstPage.push(punishments[i]);
            }
            this.props.changeShownPunishments(firstPage, 1);
        };

        this.loadAndShowAcceptedPunishments = (punishments) => { // poziv kada stigne payload sa accepted punishmentima
            this.props.onLoadedAcceptedPunishments(punishments);
            this._showFirstPage();
        };

        this.updateAndShowAcceptedPunishments = punishments => {
            this.props.changeAcceptedPunishments(punishments);
            this._showFirstPage(punishments);
        };

        this.changeElement = (element) => {
            let ASC = ' (ʌ)';
            let DESC = ' (v)';
            let lastFourChars = element.name.substring(element.name.length - 4);

            if ((lastFourChars === ASC) || (lastFourChars === DESC)) {
                element.name = element.sortOrder === 1 ? element.name.substring(0, element.name.length - 4) + ASC : element.name.substring(0, element.name.length - 4) + DESC;
            } else {
                element.name = element.sortOrder === 1 ? element.name + ASC : element.name + DESC;
            }
            element.sortOrder *= -1;
        };

        this.reSortPunishments = (id) => {

            let sortedPunishments = [];
            let acceptedPunishments = this.props.acceptedPunishments;
            let element = getByValue(this.columns, id);

            switch (id) {
                case 'orderedBy':
                    sortedPunishments = sortPunishmentsByString(acceptedPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'deadline':
                    sortedPunishments = sortPunishmentsByDate(acceptedPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'howManyTimes':
                    sortedPunishments = sortPunishmentsByNumber(acceptedPunishments, element.sortOrder, element.fieldName);
                    break;
                default:
            }

            if (sortedPunishments) {
                this.updateAndShowAcceptedPunishments(sortedPunishments);
                this.changeElement(element);
                this._resetElements(element, this.columns);
            }
        };

        this._resetElements = (element, columns) => {
            // default vrijednosti za sve elemente osim određenog (element)
            for (let col of columns) {
                if (element.id !== col.id) {
                    col.name = col.defaultName;
                    col.sortOrder = 1;
                }
            }
        };

        this.columns = [
            {
                name: 'ORDERED BY',
                defaultName: 'ORDERED BY',
                clickHandler: this.reSortPunishments,
                id: 'orderedBy',
                fieldName: 'user_ordering_punishment',
                sortOrder: 1,
            },
            {
                name: 'DEADLINE',
                defaultName: 'DEADLINE',
                clickHandler: this.reSortPunishments,
                id: 'deadline',
                fieldName: 'deadline',
                sortOrder: 1,
            },
            {
                name: 'X',
                defaultName: 'X',
                clickHandler: this.reSortPunishments,
                id: 'howManyTimes',
                fieldName: 'how_many_times',
                sortOrder: 1,
            },
            {
                name: 'WHAT',
                defaultName: 'WHAT',
                clickHandler: null,
                id: 'whatToWrite'
            }
        ];
    }

    componentDidMount() { // dohvat accepted kazni sa backenda
        agent.Punishment.getAccepted().then((payload) => {
            if (payload) {
                this.loadAndShowAcceptedPunishments(payload.acceptedPunishments);
                if (this.props.acceptedPunishments[0] && !this.props.activePunishment._id) this.setDefaultPunishment();
            } else {
                console.log("error: accepted punishments payload wasn't received");
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.acceptedPunishments.length !== this.props.acceptedPunishments.length) {
            this.updateAndShowAcceptedPunishments(nextProps.acceptedPunishments);
        }
    }

    render() {
        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownAcceptedPunishments;
        const activePunishment = this.props.activePunishment;
        const columns = this.columns;
        const style = {
            "width": "220px",
            "display": "inline-block"
        };
        const selectedStyle = {
            ...style,
            backgroundColor: "rgba(158, 234, 86, 0.75)"
        };


        if (shownPunishments !== 'empty') {
            return (
                <div className="container">
                    <TableHeader columns={columns} style={style} />
                    {
                        shownPunishments.map(punishment => {
                            if (punishment._id === activePunishment._id) {
                                return (
                                    <AcceptedTabRow punishment={punishment} style={selectedStyle} key={punishment._id}
                                        id={punishment._id} onGoClick={this.handleGoPunishment} onGiveUpClick={this.giveUpPunishment}
                                        disabledGo={true} />
                                )
                            }
                            else {
                                return (
                                    <AcceptedTabRow punishment={punishment} style={style} key={punishment._id}
                                        id={punishment._id} onGoClick={this.handleGoPunishment} onGiveUpClick={this.giveUpPunishment}
                                        disabledGo={false} />
                                )
                            }
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
        if (arr[i].id === value) return arr[i];
    }
    return null;
}

function getPunishmentById(arr, id) {

    for (let i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i]._id === id) return arr[i];
    }
    return null;
}