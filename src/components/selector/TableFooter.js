import React from 'react';

import { ITEMS_PER_PAGE } from '../../constants/constants';

class TableFooter extends React.Component {

    constructor(props) {
        super(props);
        this.changeShownPunishments = props.changeShownPunishments;
        this.showPage = this.showPage.bind(this);
    }

    showPage(ev) {

        const currentPage = this.props.currentPage;
        const punishments = this.props.punishments;
        const punishmentsLength = punishments.length;

        let startingIndex;
        let destinationPage;
        let lastPage = (punishmentsLength % ITEMS_PER_PAGE) ? Math.floor(punishmentsLength / ITEMS_PER_PAGE) + 1 : Math.floor(punishmentsLength / ITEMS_PER_PAGE);
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
                break;
            case 'lastPageMark':
                destinationPage = lastPage;
                startingIndex = getCounterStartingValue(-1, punishmentsLength, ITEMS_PER_PAGE);
                break;
        }

        for (let i = startingIndex; i < (startingIndex + ITEMS_PER_PAGE); i++) {
            if (punishments[i]) {
                shownPunishments.push(punishments[i])
            };
        }
        this.changeShownPunishments(shownPunishments, destinationPage);
    }

    render() {

        const currentPage = this.props.currentPage;

        return (
            <div className="container" >
                <hr />
                <label id="firstPageMark" onClick={this.showPage}>FIRST</label>
                <label id="decrementPage" onClick={this.showPage}>&nbsp;&lt;&nbsp;</label>
                <label>{currentPage}</label>
                <label id="incrementPage" onClick={this.showPage}>&nbsp;&gt;&nbsp;</label>
                <label id="lastPageMark" onClick={this.showPage}>LAST</label>
                <hr />
            </div>
        );
    }
}

export default TableFooter;


function getCounterStartingValue(pageNumber, arrayLength, itemsPerPage) {

    let maxPage = (arrayLength % itemsPerPage) ? Math.floor(arrayLength / itemsPerPage) + 1 : arrayLength / itemsPerPage;

    if (pageNumber <= maxPage) {
        let remainder = arrayLength % itemsPerPage;
        if (pageNumber === 1) { // trazi se prva stranica
            return 0;
        } else if (pageNumber === -1) { // trazi se last page
            if (remainder === 0) return arrayLength - itemsPerPage;
            else if (remainder > 0) return (maxPage - 1) * itemsPerPage;
        } else if (pageNumber > 0 && pageNumber < arrayLength) {
            return ((pageNumber - 1) * itemsPerPage);
        }
    }
    return null;
};