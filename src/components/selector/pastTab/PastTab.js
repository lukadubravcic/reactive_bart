import React from 'react';
import { connect } from 'react-redux';
import PastTabRow from './PastTabRow';
import TableFooter from '../TableFooter';
import TableHeader from '../TableHeader'

import {
    sortPunishmentsByDate,
    sortPunishmentsByString,
    sortPunishmentsByStatus
} from '../../../helpers/sortingPunishments';
import { getElementById } from '../../../helpers/helpers';

import { ITEMS_PER_PAGE } from '../../../constants/constants';

const mapStateToProps = state => ({
    //state: state,
    pastPunishments: state.punishment.pastPunishments,
    shownPastPunishments: state.punishment.shownPastPunishments,
    currentPage: state.punishment.currentPastPage,
    ignoredPunishmentSet: state.punishment.ignoredPunishmentSet,
    punishmentIdFromURL: state.game.punishmentIdFromURL,
    pastPunishmentsResorted: state.punishment.pastPunishmentsResorted
});

const mapDispatchToProps = dispatch => ({
    onLoadedPastPunishments: punishments => {
        dispatch({ type: 'PAST_PUNISHMENTS_LOADED', punishments });
    },
    changePastPunishments: (punishments, pastPunishmentsResorted = false) => {
        dispatch({ type: 'PAST_PUNISHMENTS_CHANGED', punishments, pastPunishmentsResorted });
    },
    changeShownPunishments: (punishments, newPage) => {
        dispatch({ type: 'UPDATE_SHOWN_PAST_PUNISHMENTS', punishments, newPage });
    }
});


const animationDuration = 500;

const animStyles = {
    tableVisible: { display: 'inline-block' },
};


class PastTab extends React.Component {

    constructor() {
        super();

        this.containerElement = null;
        this.updateTableVisibilityTimeout = null;
        this.numOfRows = null;
        this.rowHeight = 60;
        this.borderThickness = 10;

        this._showFirstPage = (punishments = this.props.pastPunishments) => {
            let firstPage = [];
            if (punishments.length > 0) {
                for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                    if (punishments[i]) firstPage.push(punishments[i]);
                }
            }
            this.props.changeShownPunishments(firstPage, 1);
        };

        this.showIgnoredPunishmentPage = punishments => {
            let pageNum = getPunishmentPageNumber(this.props.punishmentIdFromURL, this.props.pastPunishments);
            this.props.changeShownPunishments(getPageElements(pageNum, punishments), pageNum);
        };

        this.updateAndShowPastPunishments = (punishments, pastPunishmentsResorted = false) => {
            this.props.changePastPunishments(punishments, pastPunishmentsResorted);
            this._showFirstPage(punishments);
        };

        this.reSortPunishments = id => {
            let sortedPunishments = [];
            let pastPunishments = this.props.pastPunishments;
            let element = getElementById(this.state.columns, id);

            if (element === null) return;

            element.sortOrder === 0
                ? element.sortOrder = 1
                : element.sortOrder === 1
                    ? element.sortOrder = -1
                    : element.sortOrder = 1;

            switch (id) {
                case 'created':
                    sortedPunishments = sortPunishmentsByDate(pastPunishments, element.sortOrder * -1, element.fieldName);
                    break;
                case 'userOrdering':
                    sortedPunishments = sortPunishmentsByString(pastPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'howManyTimes':
                    sortedPunishments = sortPunishmentsByDate(pastPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'whatToWrite':
                    sortedPunishments = sortPunishmentsByString(pastPunishments, element.sortOrder, element.fieldName);
                    break;
                case 'status':
                    sortedPunishments = sortPunishmentsByStatus(pastPunishments, element.sortOrder);
                    break;
                default:
                    break;
            }

            if (sortedPunishments) {
                this.updateAndShowPastPunishments(sortedPunishments, true);
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

        this.didPunishmentsChangeDeep = nextPastPunishments => {
            if (this.props.pastPunishments.length !== nextPastPunishments.length) return true;
            for (let i = 0; i < this.props.pastPunishments.length; i++) {
                if (!comparePunishments(this.props.pastPunishments[i], nextPastPunishments[i])) return true;
            }
            return false;
        };

        this.columns = [
            {
                name: 'ORDERED ON',
                defaultName: 'ORDERED ON',
                clickHandler: this.reSortPunishments,
                id: 'created',
                fieldName: 'created',
                sortOrder: 1,
                style: 'float-left ordered-on-field ordered-on-lmargin-field',
            },
            {
                name: 'BY WHOM',
                defaultName: 'BY WHOM',
                clickHandler: this.reSortPunishments,
                id: 'userOrdering',
                fieldName: 'user_ordering_punishment',
                sortOrder: 0,
                style: 'float-left by-whom-field',
            },
            {
                name: 'X',
                defaultName: 'X',
                clickHandler: this.reSortPunishments,
                id: 'howManyTimes',
                fieldName: 'how_many_times',
                sortOrder: 0,
                style: 'float-left num-time-field num-time-field-pad-left',
            },
            {
                name: 'WHAT',
                defaultName: 'WHAT',
                clickHandler: this.reSortPunishments,
                id: 'whatToWrite',
                fieldName: 'what_to_write',
                sortOrder: 0,
                style: 'float-left what-field-longer',
            },
            {
                name: 'STATUS',
                defaultName: 'STATUS',
                clickHandler: this.reSortPunishments,
                id: 'status',
                fieldName: 'status',
                sortOrder: 0,
                style: 'float-left status-field',
            }
        ];

        this.state = {
            tableStyle: { display: 'none' },
            tableContainerStyle: {
                height: 0,
                borderBottom: '10px solid #515151',
                transition: 'height 0.5s',
            },
            columns: [...this.columns],
        };
    }

    componentDidMount() {
        if (this.props.pastPunishments !== 'empty' && this.props.pastPunishments.length > 0) {
            if (this.props.ignoredPunishmentSet) {
                this.showIgnoredPunishmentPage(this.props.pastPunishments);
            } else this.updateAndShowPastPunishments(this.props.pastPunishments);

            this.numOfRows = this.props.pastPunishments.length > ITEMS_PER_PAGE ? ITEMS_PER_PAGE : this.props.pastPunishments.length;
            this.startAnimation();
        }
    }

    componentDidUpdate(prevProps) {
        if (
            (prevProps.pastPunishments === 'empty'
                && this.props.pastPunishments !== 'empty'
                && this.props.pastPunishments.length > 0)
            || this.didPunishmentsChangeDeep(prevProps.pastPunishments)
        ) {
            if (!this.props.pastPunishmentsResorted) {
                this.updateAndShowPastPunishments(this.props.pastPunishments);
            }
        }
        if (this.props.shownPastPunishments.length !== prevProps.shownPastPunishments.length) {
            this.numOfRows = this.props.shownPastPunishments.length;
            this.startAnimation();
        }
    }

    componentWillUpdate(prevProps) {
        if (prevProps.ignoredPunishmentSet && !this.props.ignoredPunishmentSet) {
            this.showIgnoredPunishmentPage(this.props.pastPunishments);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.updateTableVisibilityTimeout);
    }

    render() {
        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownPastPunishments;
        const columns = this.state.columns;
        const styleMarkIgnored = 'picker-selected-row';

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
                                        if (encodeURIComponent(this.props.punishmentIdFromURL) === punishment.uid) {
                                            return <PastTabRow punishment={punishment} style={styleMarkIgnored} key={punishment.uid} id={punishment.uid} />
                                        } else {
                                            return <PastTabRow punishment={punishment} key={punishment.uid} id={punishment.uid} />
                                        }
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <TableFooter currentPage={currentPage} punishments={this.props.pastPunishments} changeShownPunishments={this.props.changeShownPunishments} />
                </div>
            )
        } else return null;
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(PastTab);


function getPunishmentPageNumber(targetId, punishments) {

    let targetIndex = null;

    for (let i = 0; i < punishments.length; i++) {
        if (decodeURIComponent(punishments[i].uid) === targetId) {
            targetIndex = i + 1;
        }
    }

    let pageNum = Math.ceil(targetIndex / ITEMS_PER_PAGE);

    return pageNum;
}

function getPageElements(pageNum, punishments) {

    let startIndex = ((pageNum - 1) * ITEMS_PER_PAGE);
    let endIndex = (pageNum * ITEMS_PER_PAGE) - 1;
    let page = [];

    for (let i = startIndex; i < endIndex; i++) {

        if (punishments[i]) page.push(punishments[i]);
    }

    return page;
};


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

function comparePunishments(pun1, pun2) {
    // iterate trough object properties
    for (let prop in pun1) {
        if (pun1[prop] !== pun2[prop]) {
            return false;
        }
    }
    return true;
};