import React from 'react';
import { connect } from 'react-redux';
import OrderedTabRow from './OrderedTabRow';
import TableFooter from '../TableFooter';
import TableHeader from '../TableHeader';

import { sortPunishmentsByDate, sortPunishmentsByNumber, sortPunishmentsByString } from '../../../helpers/sortingPunishments';

import agent from '../../../agent';

import { ITEMS_PER_PAGE } from '../../../constants/constants';

const mapStateToProps = state => ({
    //state: state,
    orderedPunishments: state.punishment.orderedPunishments,
    shownOrderedPunishments: state.punishment.shownOrderedPunishments,
    currentPage: state.punishment.currentOrderedPage
});


const mapDispatchToProps = dispatch => ({
    onLoadedOrderedPunishments: punishments => {
        dispatch({ type: 'ORDERED_PUNISHMENTS_LOADED', punishments })
    },
    changeOrderedPunishments: (punishments, orderedPunishmentsResorted = false) => {
        dispatch({ type: 'ORDERED_PUNISHMENTS_CHANGED', punishments, orderedPunishmentsResorted })
    },
    changeShownPunishments: (punishments, newPage) => {
        dispatch({ type: 'UPDATE_SHOWN_ORDERED_PUNISHMENTS', punishments, newPage })
    },
});


const animationDuration = 500;

const animStyles = {
    tableVisible: { display: 'inline-block' },
}


class OrderedTab extends React.Component {

    constructor() {
        super();

        this.containerElement = null;
        this.updateTableVisibilityTimeout = null;
        this.numOfRows = null;
        this.rowHeight = 60;
        this.borderThickness = 10;
        this.state = {
            tableStyle: { display: 'none' },
            tableContainerStyle: {
                height: 0,
                borderBottom: '10px solid #515151',
                transition: 'height 0.5s'
            }
        };

        this._showFirstPage = (punishments = this.props.orderedPunishments) => {
            let firstPage = [];
            if (punishments.length > 0) {
                for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                    if (punishments[i]) firstPage.push(punishments[i]);
                }
            }
            this.props.changeShownPunishments(firstPage, 1);
        };

        this.loadAndShowOrderedPunishments = punishments => { // poziv kada stigne payload sa past punishmentima
            this.props.onLoadedOrderedPunishments(punishments);
            this._showFirstPage();
        };

        this.changeElement = element => {
            element.name = (
                <span>
                    <label>
                        {element.defaultName}
                    </label>
                    {element.sortOrder === 1
                        ? ascendingSVG
                        : element.sortOrder === -1
                            ? descendingSVG
                            : element.name}
                </span>
            )

            element.sortOrder *= -1;
        }

        this.updateAndShowOrderedPunishments = (punishments, orderedPunishmentsResorted = false) => {
            this.props.changeOrderedPunishments(punishments, orderedPunishmentsResorted);
            this._showFirstPage(punishments);
        };

        this.reSortPunishments = id => {

            let sortedPunishments = [];
            let orderedPunishments = this.props.orderedPunishments;
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
                this.updateAndShowOrderedPunishments(sortedPunishments, true);
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
                style: 'float-left when-field ordered-on-lmargin-field'
            },
            {
                name: 'TO WHOM',
                defaultName: 'TO WHOM',
                clickHandler: this.reSortPunishments,
                id: 'toWhom',
                fieldName: 'user_taking_punishment',
                sortOrder: 1,
                style: 'float-left to-whom-field'
            },
            {
                name: 'DEADLINE',
                defaultName: 'DEADLINE',
                clickHandler: this.reSortPunishments,
                id: 'deadline',
                fieldName: 'deadline',
                sortOrder: 1,
                style: 'float-left ordered-deadline-field'
            },
            {
                name: 'X',
                defaultName: 'X',
                clickHandler: this.reSortPunishments,
                id: 'howManyTimes',
                fieldName: 'how_many_times',
                sortOrder: 1,
                style: 'float-left num-time-field num-time-field-pad-left'
            },
            {
                name: 'WHAT',
                defaultName: 'WHAT',
                clickHandler: null,
                id: 'whatToWrite',
                style: 'float-left ordered-what-field'
            },
            {
                name: 'STATUS',
                defaultName: 'STATUS',
                clickHandler: null,
                id: 'status',
                style: 'float-left ordered-status-field'
            }
        ];

        this.startAnimation = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.containerElement !== null && this.setState({
                        tableContainerStyle: {
                            ...this.state.tableContainerStyle,
                            height: this.numOfRows * this.rowHeight + this.borderThickness - 1  // -1 jer zadnji row nema bottom border
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
    }

    componentDidMount() {
        if (this.props.orderedPunishments !== 'empty' && this.props.orderedPunishments.length > 0) {
            this.updateAndShowOrderedPunishments(this.props.orderedPunishments);
            this.numOfRows = this.props.orderedPunishments.length > ITEMS_PER_PAGE ? ITEMS_PER_PAGE : this.props.orderedPunishments.length;
            this.startAnimation();
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((this.props.orderedPunishments === 'empty' && nextProps.orderedPunishments !== 'empty' && nextProps.orderedPunishments.length > 0)
            || (this.props.orderedPunishments.length !== nextProps.orderedPunishments.length)) {
            this.updateAndShowOrderedPunishments(nextProps.orderedPunishments);
        }

        if (this.props.shownOrderedPunishments.length !== nextProps.shownOrderedPunishments.length) {
            this.numOfRows = nextProps.shownOrderedPunishments.length;
            this.startAnimation();
        }
    }

    componentWillUnmount() {
        clearTimeout(this.updateTableVisibilityTimeout);
    }

    render() {
        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownOrderedPunishments;

        if (shownPunishments !== 'empty') {
            return (
                <div ref={elem => this.containerElement = elem}>
                    <TableHeader columns={this.columns} />
                    <div style={this.state.tableContainerStyle}>

                        <table
                            style={this.state.tableStyle}
                            className="picker-table">

                            <tbody>
                                {
                                    shownPunishments.map((punishment, index) => {
                                        return (
                                            <OrderedTabRow punishment={punishment} key={punishment.uid || index} id={punishment.uid} />
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
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