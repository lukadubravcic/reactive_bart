import React from 'react';
import { connect } from 'react-redux';
import PastTabRow from './PastTabRow';
import TableFooter from '../TableFooter';
import TableHeader from '../TableHeader'

import { sortPunishmentsByDate, sortPunishmentsByNumber, sortPunishmentsByString } from '../../../helpers/sortingPunishments';
import { getElementById } from '../../../helpers/helpers';

import agent from '../../../agent';

import { ITEMS_PER_PAGE } from '../../../constants/constants';

const mapStateToProps = state => ({
    state: state,
    pastPunishments: state.punishment.pastPunishments,
    shownPastPunishments: state.punishment.shownPastPunishments,
    currentPage: state.punishment.currentPastPage,
    headerColumns: state.punishment.pastHeader
});

const mapDispatchToProps = dispatch => ({
    onLoadedPastPunishments: (punishments) => {
        dispatch({ type: 'PAST_PUNISHMENTS_LOADED', punishments })
    },
    changePastPunishments: (punishments) => {
        dispatch({ type: 'PAST_PUNISHMENTS_CHANGED', punishments })
    },
    changeShownPunishments: (punishments, newPage) => {
        dispatch({ type: 'UPDATE_SHOWN_PAST_PUNISHMENTS', punishments, newPage })
    },
    changePastHeader: (columns) => {
        dispatch({ type: 'UPDATE_PAST_HEADER', columns })
    }
});

class PastTab extends React.Component {

    constructor() {
        super();

        this._showFirstPage = (punishments = this.props.pastPunishments) => {
            let firstPage = [];
            if (punishments.length > 0) {
                for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                    if (punishments[i]) firstPage.push(punishments[i]);
                }
            }
            this.props.changeShownPunishments(firstPage, 1);
        };

        this.loadAndShowPastPunishments = (punishments) => { // poziv kada stigne payload sa past punishmentima
            this.props.onLoadedPastPunishments(punishments);
            this._showFirstPage();
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

        this.updateAndShowPastPunishments = punishments => {
            this.props.changePastPunishments(punishments);
            this._showFirstPage(punishments);
        };

        this.reSortPunishments = (id) => {

            let sortedPunishments = [];
            let pastPunishments = this.props.pastPunishments;
            let element = getElementById(this.columns, id);

            switch (id) {
                case 'created':
                    sortedPunishments = sortPunishmentsByDate(pastPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'userOrdering':
                    sortedPunishments = sortPunishmentsByString(pastPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'howManyTimes':
                    sortedPunishments = sortPunishmentsByDate(pastPunishments, element.sortOrder, element.fieldName);
                    break;
                default:
                    break;
            }

            if (sortedPunishments) {
                this.updateAndShowPastPunishments(sortedPunishments);
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
                name: 'ORDERED ON',
                defaultName: 'ORDERED ON',
                clickHandler: this.reSortPunishments,
                id: 'created',
                fieldName: 'created',
                sortOrder: 1,
            },
            {
                name: 'BY WHOM',
                defaultName: 'BY WHOM',
                clickHandler: this.reSortPunishments,
                id: 'userOrdering',
                fieldName: 'user_ordering_punishment',
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
            },
            {
                name: 'STATUS',
                defaultName: 'STATUS',
                clickHandler: null,
                id: 'status'
            }
        ];
    }

    componentDidMount() { // dohvat past kazni sa backenda
        agent.Punishment.getPast().then((payload) => {
            if (payload) {
                this.loadAndShowPastPunishments(payload.pastPunishments);
            } else {
                console.log("error: past punishments payload wasn't received");
            }
        });
    }

    render() {

        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownPastPunishments;
        const columns = this.columns;
        const style = {
            "width": "210px",
            "display": "inline-block"
        };

        if (shownPunishments !== 'empty') {
            return (
                <div className="container">
                    <TableHeader columns={columns} style={style} />
                    {
                        shownPunishments.map(punishment => {
                            return (
                                <PastTabRow punishment={punishment} style={style} key={punishment._id} id={punishment._id} />
                            )
                        })
                    }
                    <TableFooter currentPage={currentPage} punishments={this.props.pastPunishments} changeShownPunishments={this.props.changeShownPunishments} />
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

export default connect(mapStateToProps, mapDispatchToProps)(PastTab);

