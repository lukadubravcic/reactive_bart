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
    pastPunishments: state.punishment.pastPunishments,
    shownAcceptedPunishments: state.punishment.shownAcceptedPunishments,
    currentPage: state.punishment.currentAcceptedPage,
    activePunishment: state.game.activePunishment,
    punishmentIdFromURL: state.game.punishmentIdFromURL,
});

const mapDispatchToProps = dispatch => ({
    onLoadedAcceptedPunishments: punishments => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_LOADED', punishments })
    },
    changeAcceptedPunishments: punishments => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_CHANGED', punishments })
    },
    setActivePunishment: punishment => {
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
    updatePastPunishments: newPastPunishments => {
        dispatch({ type: 'PAST_PUNISHMENTS_CHANGED', punishments: newPastPunishments });
    },
});

const animationDuration = 500;

const animStyles = {
    tableVisible: { display: 'inline-block' }
}

class AcceptedTab extends React.Component {

    constructor() {
        super();

        this.containerElement = null;
        this.updateTableVisibilityTimeout = null;
        this.numOfRows = null;
        this.rowHeight = 60;
        this.borderThickness = 10;


        this.handleGoPunishment = id => ev => { // dispatch akciju koja stavlja odabrani punishment na trenutni       
            ev.preventDefault();
            let newActivePunishment = {};

            if (id !== this.props.activePunishment.uid && window.canRunAds) {
                newActivePunishment = JSON.parse(JSON.stringify(getPunishmentById(id, this.props.acceptedPunishments)));

                if (newActivePunishment.what_to_write[newActivePunishment.what_to_write.length - 1] !== ' ') {
                    newActivePunishment.what_to_write += ' ';  // dodaj razmak na kraju ako ga nema
                }
                if (newActivePunishment) this.props.setActivePunishment(newActivePunishment);

            } else if (id === this.props.activePunishment.uid) { // odabir trenutne kazne, nema promjene
                return;
            }
        };

        this.giveUpPunishment = id => { // makni tu kaznu iz statea
            let newPastPunishments = JSON.parse(JSON.stringify(this.props.pastPunishments));
            let givenUpPunishment = null;
            let filteredPunishments = this.props.acceptedPunishments.filter(punishment => {
                if (decodeURIComponent(punishment.uid) === decodeURIComponent(id)) {
                    givenUpPunishment = punishment;
                    return null;
                } else return punishment;
                // return decodeURIComponent(punishment.uid) === decodeURIComponent(id) ? null : punishment;
            });
            this.updatePastPunishments(givenUpPunishment, newPastPunishments);
            this.props.giveUpPunishment(id, filteredPunishments);
        };

        this.updatePastPunishments = (newPunishment, newPastPunishments) => {
            if (!newPunishment) return null;
            newPunishment.given_up = new Date().toISOString().slice(0, 19);
            newPastPunishments.unshift(newPunishment)
            this.props.updatePastPunishments(newPastPunishments);
        }

        this._showFirstPage = (punishments = this.props.acceptedPunishments) => {
            let firstPage = [];
            for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                if (punishments[i]) firstPage.push(punishments[i]);
            }
            this.props.changeShownPunishments(firstPage, 1);
        };

        this.updateAndShowAcceptedPunishments = punishments => {
            this.props.changeAcceptedPunishments(punishments);
            this._showFirstPage(punishments);
        };

        this.reSortPunishments = id => {
            let sortedPunishments = [];
            let acceptedPunishments = this.props.acceptedPunishments;
            let element = getByValue(this.state.columns, id);

            if (element === null) return;

            element.sortOrder === 0
                ? element.sortOrder = 1
                : element.sortOrder === 1
                    ? element.sortOrder = -1
                    : element.sortOrder = 1;

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
                this._resetElements(element, this.columns);
                this.setState({ columns: [...this.columns] });
            }
        };

        this._resetElements = (element, columns) => {
            // default vrijednosti za sve elemente osim određenog (element)
            for (let col of columns) {
                if (element.id !== col.id) {
                    col.name = col.defaultName;
                    col.sortOrder = 0;
                }
            }
        };

        this.startAnimation = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.containerElement !== null && this.setState({
                        tableContainerStyle: {
                            ...this.state.tableContainerStyle,
                            height: this.numOfRows * this.rowHeight + this.borderThickness - 1
                        },
                        tableStyle: { display: 'none' }
                    });
                });
            });

            this.showTable();
        }

        this.showTable = () => {
            requestAnimationFrame(() => {
                this.updateTableVisibilityTimeout = setTimeout(() => {
                    this.containerElement !== null && this.setState({ tableStyle: { ...this.state.tableStyle, ...animStyles.tableVisible } });
                }, animationDuration);
            });
        }

        this.columns = [
            {
                name: 'ORDERED BY',
                defaultName: 'ORDERED BY',
                clickHandler: this.reSortPunishments,
                id: 'orderedBy',
                fieldName: 'user_ordering_punishment',
                sortOrder: 0,
                style: 'float-left ordering-field'
            },
            {
                name: 'DEADLINE',
                defaultName: 'DEADLINE',
                clickHandler: this.reSortPunishments,
                id: 'deadline',
                fieldName: 'deadline',
                sortOrder: 0,
                style: 'float-left deadline-field'
            },
            {
                name: 'X',
                defaultName: 'X',
                clickHandler: this.reSortPunishments,
                id: 'howManyTimes',
                fieldName: 'how_many_times',
                sortOrder: 0,
                style: 'float-left num-time-field num-time-field-pad-left'
            },
            {
                name: 'WHAT',
                defaultName: 'WHAT',
                clickHandler: null,
                id: 'whatToWrite',
                style: 'float-left what-field'
            }
        ];

        this.state = {
            tableStyle: { display: 'none' },
            tableContainerStyle: {
                height: 0,
                borderBottom: '10px solid #515151',
                transition: 'height 0.5s'
            },
            columns: [...this.columns],
        };
    }

    componentDidMount() {
        if (this.props.acceptedPunishments !== 'empty' && this.props.acceptedPunishments.length > 0) {
            this.updateAndShowAcceptedPunishments(this.props.acceptedPunishments);
            this.numOfRows = this.props.acceptedPunishments.length > ITEMS_PER_PAGE ? ITEMS_PER_PAGE : this.props.acceptedPunishments.length;
            this.startAnimation();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.acceptedPunishments.length !== this.props.acceptedPunishments.length) {
            this.updateAndShowAcceptedPunishments(nextProps.acceptedPunishments);
        }

        if (this.props.shownAcceptedPunishments.length !== nextProps.shownAcceptedPunishments.length) {
            this.numOfRows = nextProps.shownAcceptedPunishments.length;
            this.startAnimation();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.updateTableVisibilityTimeout);
    }

    render() {

        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownAcceptedPunishments;
        const activePunishment = this.props.activePunishment;
        const columns = this.columns;

        const selectedStyle = 'picker-selected-row';


        if (shownPunishments !== 'empty') {
            return (
                <div ref={elem => this.containerElement = elem}>
                    <TableHeader columns={columns} />
                    <div style={this.state.tableContainerStyle}>

                        <table
                            style={this.state.tableStyle}
                            className="picker-table">

                            <tbody>
                                {
                                    shownPunishments.map(punishment => {

                                        if (punishment.uid === activePunishment.uid) {
                                            return (
                                                <AcceptedTabRow punishment={punishment} style={selectedStyle} key={punishment.uid}
                                                    id={punishment.uid} onGoClick={this.handleGoPunishment} onGiveUpClick={this.giveUpPunishment}
                                                    disabledGo={true} />
                                            )
                                        }
                                        else {
                                            return (
                                                <AcceptedTabRow punishment={punishment} key={punishment.uid}
                                                    id={punishment.uid} onGoClick={this.handleGoPunishment} onGiveUpClick={this.giveUpPunishment}
                                                    disabledGo={false} />
                                            )
                                        }
                                    })
                                }

                            </tbody>
                        </table>
                    </div>
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


function getByValue(arr, id) {

    for (let i = 0, iLen = arr.length; i < iLen; i++) {

        if (arr[i].id === id) return arr[i];
    }

    return null;
}


function getPunishmentById(id, punishments) {
    if (punishments.length === 0) return null;

    else if (punishments.length === 1) return punishments[0];

    if (id) {
        for (let pun of punishments) {
            if (pun.uid === id) {
                return pun;
            }
        }
    } else if (!id) console.log('getPunishmentById(): Theres no id');
}


const descendingSVG = (
    <svg style={{ marginLeft: "10px" }} width="17px" height="13px" viewBox="0 0 17 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-507.000000, -2786.000000)">
            <g id="Group" transform="translate(0.000000, 2508.000000)" fill="#FFD75F">
                <polygon id="Triangle-1" transform="translate(515.500000, 284.214000) rotate(-180.000000) translate(-515.500000, -284.214000) "
                    points="515.5 278.214 524 290.214 507 290.214"></polygon>
            </g>
        </g>
    </svg>
)

const ascendingSVG = (
    <svg style={{ marginLeft: "10px" }} width="17px" height="13px" viewBox="0 0 17 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-507.000000, -2786.000000)">
            <g id="Group" transform="translate(0.000000, 2508.000000)" fill="#FFD75F">
                <polygon id="Triangle-1" transform="translate(515.500000, 284.214000) rotate(0) translate(-515.500000, -284.214000) "
                    points="515.5 278.214 524 290.214 507 290.214"></polygon>
            </g>
        </g>
    </svg>
)