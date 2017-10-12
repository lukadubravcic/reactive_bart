import React from 'react';
import { connect } from 'react-redux';
import PastTabRow from './PastTabRow';
import TableFooter from '../TableFooter';
import TableHeader from '../TableHeader'

import { sortPunishmentsByDate, sortPunishmentsByNumber, sortPunishmentsByString } from '../../../helpers/sortingPunishments';

import agent from '../../../agent';

import { ITEMS_PER_PAGE } from '../../../constants/constants';

const mapStateToProps = state => ({
    state: state,
    pastPunishments: state.punishment.pastPunishments,
    shownPastPunishments: state.punishment.shownPastPunishments,
    currentPage: state.punishment.currentPastPage
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
    }
});

class PastTab extends React.Component {

    constructor() {
        super();
        this._showFirstPage = () => {
            let firstPage = [];
            if (this.props.pastPunishments.length > 0) {
                for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                    if (this.props.pastPunishments[i]) firstPage.push(this.props.pastPunishments[i]);
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
            let element = getByValue(this.columns, id);

            switch (id) {
                case 'created':
                sortedPunishments = sortPunishmentsByDate(this.props.acceptedPunishments, element.sortOrder, 'created');
                break;
                case 'orderedBy':
                    sortedPunishments = sortPunishmentsByString(this.props.acceptedPunishments, element.sortOrder, 'user_ordering_punishment');
                    break;
                
                case 'deadline':
                    sortedPunishments = sortPunishmentsByDate(this.props.acceptedPunishments, element.sortOrder, 'deadline');
                    break;
                case 'howManyTimes':
                    sortedPunishments = sortPunishmentsByNumber(this.props.acceptedPunishments, element.sortOrder, 'how_many_times');
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
                sortOrder: 1,
            },
            {
                name: 'DEADLINE',
                defaultName: 'DEADLINE',
                clickHandler: this.reSortPunishments,
                id: 'deadline',
                sortOrder: 1,
            },
            {
                name: 'X',
                defaultName: 'X',
                clickHandler: this.reSortPunishments,
                id: 'howManyTimes',
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
        const style = {
            "width": "210px",
            "display": "inline-block"
        };

        const tableHeader = (
            <div className="container">
                <hr />
                <label style={style}>ORDERED ON</label>
                <label style={style}>BY WHOM</label>
                <label style={style}>X</label>
                <label style={style}>WHAT</label>
                <label style={style}>STATUS</label>
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

function getByValue(arr, value) {
    
        for (let i = 0, iLen = arr.length; i < iLen; i++) {
            if (arr[i].id === value) return arr[i];
        }
        return null;
    }