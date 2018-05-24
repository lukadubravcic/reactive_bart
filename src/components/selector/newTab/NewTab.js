import React from 'react';
import { connect } from 'react-redux';

import NewTabRow from './NewTabRow';
import TableFooter from '../TableFooter';
import TableHeader from '../TableHeader';

import { sortPunishmentsByString, sortPunishmentsByDate, sortPunishmentsByNumber } from '../../../helpers/sortingPunishments';

import agent from '../../../agent';

import { ITEMS_PER_PAGE } from '../../../constants/constants';


const mapStateToProps = state => ({
    newPunishments: state.punishment.newPunishments,
    shownNewPunishments: state.punishment.shownNewPunishments,
    acceptedPunishments: state.punishment.acceptedPunishments,
    pastPunishments: state.punishment.pastPunishments,
    shownAcceptedPunishments: state.punishment.shownAcceptedPunishments,
    currentPage: state.punishment.currentNewPage,
    activePunishment: state.game.activePunishment,
    punishmentIdFromURL: state.game.punishmentIdFromURL,
});

const mapDispatchToProps = dispatch => ({
    onLoadedNewPunishments: punishments => {
        dispatch({ type: 'NEW_PUNISHMENTS_LOADED', punishments })
    },
    changeNewPunishments: punishments => {
        dispatch({ type: 'NEW_PUNISHMENTS_CHANGED', punishments })
    },
    setActivePunishment: punishment => {
        if (punishment.what_to_write[punishment.what_to_write.length - 1] !== ' ') punishment.what_to_write += ' ';
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment })
    },
    rejectPunishment: punishment => {
        // poslat backendu odustajanje
        agent.Punishment.reject(punishment.uid);
    },
    changeShownPunishments: (punishments, newPage) => {
        dispatch({ type: 'UPDATE_SHOWN_NEW_PUNISHMENTS', punishments, newPage })
    },
    updatePastPunishments: newPastPunishments => {
        dispatch({ type: 'PAST_PUNISHMENTS_CHANGED', punishments: newPastPunishments });
    },
    switchActiveTab: tab => {
        dispatch({ type: 'SWITCH_SELECTED_PUNISHMENT_TAB', id: tab });
    },
    updateAcceptedPunishments: punishments => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_CHANGED', punishments });
    },
    acceptPunishment: punishment => {
        agent.Punishment.accept(punishment.uid);
    }
});

const animationDuration = 500;

const animStyles = {
    tableVisible: { display: 'inline-block' }
}

class NewTab extends React.Component {

    constructor() {
        super();

        this.containerElement = null;
        this.updateTableVisibilityTimeout = null;
        this.numOfRows = null;
        this.rowHeight = 60;
        this.borderThickness = 10;


        this.handleAcceptPunishment = punishment => ev => { // dispatch akciju koja stavlja odabrani punishment na trenutni       
            ev.preventDefault();
            let newActivePunishment = {};

            if (window.canRunAds) {

                newActivePunishment = { ...punishment };

                if (newActivePunishment.what_to_write[newActivePunishment.what_to_write.length - 1] !== ' ') {
                    newActivePunishment.what_to_write += ' ';  // dodaj razmak na kraju ako ga nema
                }

                // filtracija trenutnih new kazni, update novih, postavljanje aktivne kazne i prebacivanje na accepted tab
                let updatedNewPunishments = [...this.props.newPunishments];

                let filteredPunishments = this.props.newPunishments.filter(punishment => {
                    if (decodeURIComponent(punishment.uid) !== decodeURIComponent(newActivePunishment.uid)) {
                        return { ...punishment };
                    }
                });
                // posalji accept req
                this.props.acceptPunishment(punishment);
                // update novih new kazni
                this.updateAndShowNewPunishments(filteredPunishments);
                // update accepted kazni
                this.updateAcceptedPunishments(newActivePunishment);

                if (newActivePunishment) {
                    this.props.setActivePunishment(newActivePunishment);
                    this.switchToAcceptedTab();
                }
            }
        };

        this.rejectPunishment = rejectedPunishment => { // makni tu kaznu iz statea
            let filteredPunishments = this.props.newPunishments.filter(punishment => {
                if (decodeURIComponent(punishment.uid) !== decodeURIComponent(rejectedPunishment.uid)) {
                    return punishment;
                }
            });
            // update newPunishmentsa
            this.updateAndShowNewPunishments(filteredPunishments);
            this.props.rejectPunishment(rejectedPunishment);
            this.updatePastPunishments(rejectedPunishment);
        };

        this.updateAcceptedPunishments = newPunishment => {
            if (!newPunishment) return null;
            let newAcceptedPunishments = [...this.props.acceptedPunishments];
            newPunishment.accepted = new Date().toISOString().slice(0, 19);
            newAcceptedPunishments.unshift(newPunishment);
            this.props.updateAcceptedPunishments(newAcceptedPunishments);
        }

        this.updatePastPunishments = newPunishment => {
            let newPastPunishments = [...this.props.pastPunishments];
            if (!newPunishment) return null;
            newPunishment.rejected = new Date().toISOString().slice(0, 19);
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

        this.updateAndShowNewPunishments = punishments => {
            this.props.changeNewPunishments(punishments);
            this._showFirstPage(punishments);
        };

        this.switchToAcceptedTab = () => {
            this.props.switchActiveTab('acceptedTab');
        }

        this.reSortPunishments = id => {
            let sortedPunishments = [];
            let newPunishments = this.props.newPunishments;
            let element = getByValue(this.state.columns, id);

            if (element === null) return;

            element.sortOrder === 0
                ? element.sortOrder = 1
                : element.sortOrder === 1
                    ? element.sortOrder = -1
                    : element.sortOrder = 1;

            switch (id) {
                case 'orderedBy':
                    sortedPunishments = sortPunishmentsByString(newPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'deadline':
                    sortedPunishments = sortPunishmentsByDate(newPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'howManyTimes':
                    sortedPunishments = sortPunishmentsByNumber(newPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'whatToWrite':
                    sortedPunishments = sortPunishmentsByString(newPunishments, element.sortOrder, element.fieldName);
                    break;
                default:
                    break;
            }

            if (sortedPunishments) {
                this.updateAndShowNewPunishments(sortedPunishments);
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
                clickHandler: this.reSortPunishments,
                id: 'whatToWrite',
                fieldName: 'what_to_write',
                sortOrder: 0,
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
        if (this.props.newPunishments !== 'empty' && this.props.newPunishments.length > 0) {
            this.updateAndShowNewPunishments(this.props.newPunishments);
            this.numOfRows = this.props.newPunishments.length > ITEMS_PER_PAGE ? ITEMS_PER_PAGE : this.props.newPunishments.length;
            this.startAnimation();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newPunishments.length !== this.props.newPunishments.length) {
            this.updateAndShowNewPunishments(nextProps.newPunishments);
        }

        if (this.props.shownNewPunishments.length !== nextProps.shownNewPunishments.length) {
            this.numOfRows = nextProps.shownNewPunishments.length;
            this.startAnimation();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.updateTableVisibilityTimeout);
    }

    render() {

        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownNewPunishments;
        // const activePunishment = this.props.activePunishment;
        const columns = this.columns;

        // const selectedStyle = 'picker-selected-row';


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
                                    shownPunishments.map(punishment => (
                                        <NewTabRow
                                            punishment={punishment}
                                            key={punishment.uid}
                                            id={punishment.uid}
                                            onAcceptClick={this.handleAcceptPunishment}
                                            onRejectClick={this.rejectPunishment}
                                            disabledGo={false} />
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <TableFooter currentPage={currentPage} punishments={this.props.newPunishments} changeShownPunishments={this.props.changeShownPunishments} />
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

export default connect(mapStateToProps, mapDispatchToProps)(NewTab);


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