import React from 'react';
import { connect } from 'react-redux';
import OrderedTabRow from './OrderedTabRow';
import TableFooter from '../TableFooter';
import TableHeader from '../TableHeader';

import { sortPunishmentsByDate, sortPunishmentsByNumber, sortPunishmentsByString } from '../../../helpers/sortingPunishments';

import agent from '../../../agent';

import { ITEMS_PER_PAGE } from '../../../constants/constants';

const mapStateToProps = state => ({
    state: state,
    orderedPunishments: state.punishment.orderedPunishments,
    shownOrderedPunishments: state.punishment.shownOrderedPunishments,
    currentPage: state.punishment.currentOrderedPage
});

const mapDispatchToProps = dispatch => ({
    onLoadedOrderedPunishments: (punishments) => {
        dispatch({ type: 'ORDERED_PUNISHMENTS_LOADED', punishments })
    },
    changeOrderedPunishments: (punishments) => {
        dispatch({ type: 'ORDERED_PUNISHMENTS_CHANGED', punishments })
    },
    changeShownPunishments: (punishments, newPage) => {
        dispatch({ type: 'UPDATE_SHOWN_ORDERED_PUNISHMENTS', punishments, newPage })
    }
});

class OrderedTab extends React.Component {

    constructor() {
        super();

        this._showFirstPage = (punishments = this.props.orderedPunishments) => {
            let firstPage = [];
            if (punishments.length > 0) {
                for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                    if (punishments[i]) firstPage.push(punishments[i]);
                }
            }
            this.props.changeShownPunishments(firstPage, 1);
        };

        this.loadAndShowOrderedPunishments = (punishments) => { // poziv kada stigne payload sa past punishmentima
            this.props.onLoadedOrderedPunishments(punishments);
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

        this.updateAndShowOrderedPunishments = punishments => {
            this.props.changeOrderedPunishments(punishments);
            this._showFirstPage(punishments);
        };

        this.reSortPunishments = (id) => {

            let sortedPunishments = [];
            let orderedPunishments = this.props.orderedPunishments
            let element = getByValue(this.columns, id);

            switch (id) {
                case 'created':
                    sortedPunishments = sortPunishmentsByDate(orderedPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'toWhom':
                    sortedPunishments = sortPunishmentsByString(orderedPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'deadline':
                    sortedPunishments = sortPunishmentsByDate(orderedPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'howManyTimes':
                    sortedPunishments = sortPunishmentsByNumber(orderedPunishments, element.sortOrder, element.fieldName);
                    break;
                /* case 'status':
                    sortedPunishments = sortPunishmentsByString(this.props.orderedPunishments, element.sortOrder), 'status';
                    break; */
                default:
                    break;
            }

            if (sortedPunishments) {
                this.updateAndShowOrderedPunishments(sortedPunishments);
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
                name: 'WHEN',
                defaultName: 'WHEN',
                clickHandler: this.reSortPunishments,
                id: 'created',
                fieldName: 'created',
                sortOrder: 1,
            },
            {
                name: 'TO WHOM',
                defaultName: 'TO WHOM',
                clickHandler: this.reSortPunishments,
                id: 'toWhom',
                fieldName: 'user_taking_punishment',
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
            },
            {
                name: 'STATUS',
                defaultName: 'STATUS',
                clickHandler: null,
                id: 'status',
            }
        ];

        this.styles = {
            wideField: {
                "width": "220px",
                "display": "inline-block"
            },
            narrowField: {
                "width": "100px",
                "display": "inline-block"
            }
        };
    }

    componentDidMount() {
        if (this.props.orderedPunishments !== 'empty' && this.props.orderedPunishments.length > 0) {
            this.updateAndShowOrderedPunishments(this.props.orderedPunishments);
        }
    }

    componentWillReceiveProps(nextProps) {
        
        if (this.props.orderedPunishments === 'empty' && nextProps.orderedPunishments !== 'empty' && nextProps.orderedPunishments.length > 0) {
            this.updateAndShowOrderedPunishments(nextProps.orderedPunishments);
        }
    }

    render() {

        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownOrderedPunishments;
        const style = {
            "width": "220px",
            "display": "inline-block"
        };

        if (shownPunishments !== 'empty') {
            return (
                <div className="container">
                    <TableHeader columns={this.columns} style={style} />
                    {
                        shownPunishments.map(punishment => {
                            return (
                                <OrderedTabRow punishment={punishment} style={style} key={punishment._id} id={punishment._id} />
                            )
                        })
                    }
                    <TableFooter currentPage={currentPage} punishments={this.props.orderedPunishments} changeShownPunishments={this.props.changeShownPunishments} />
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderedTab);

function getByValue(arr, value) {

    for (let i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].id === value) return arr[i];
    }
    return null;
}