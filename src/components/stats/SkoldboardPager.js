import React from 'react';
import { ITEMS_PER_PAGE } from '../../constants/constants';


class SkoldboardPager extends React.Component {
    constructor(props) {
        super(props);

        this.showPage = id => {
            const currentPage = this.props.currentPage;
            const dataRows = this.props.dataToDisplay;
            const rowsLength = Object.keys(dataRows).length;

            let startingIndex;
            let destinationPage;
            let lastPage = (rowsLength % ITEMS_PER_PAGE) ? Math.floor(rowsLength / ITEMS_PER_PAGE) + 1 : Math.floor(rowsLength / ITEMS_PER_PAGE);
            let shownItems = [];

            switch (id) {
                case 1: // first page
                    destinationPage = 1;
                    startingIndex = 0;
                    break;
                case 2: // prev page
                    destinationPage = currentPage === 1 ? currentPage : currentPage - 1;
                    startingIndex = getCounterStartingValue(destinationPage, rowsLength, ITEMS_PER_PAGE);
                    break;
                case 3: // next page
                    destinationPage = currentPage < lastPage ? currentPage + 1 : currentPage;
                    startingIndex = getCounterStartingValue(destinationPage, rowsLength, ITEMS_PER_PAGE);
                    break;
                case 4: // last page
                    destinationPage = lastPage;
                    startingIndex = getCounterStartingValue(-1, rowsLength, ITEMS_PER_PAGE);
                    break;
            }

            let dataObjKeys = Object.keys(dataRows).map(item => item);

            for (let i = startingIndex; i < (startingIndex + ITEMS_PER_PAGE); i++) {
                if (dataObjKeys[i]) {
                    shownItems.push({ ...dataRows[dataObjKeys[i]], email: dataObjKeys[i] });
                    // shownPunishments.push(punishments[i])
                };
            }

            this.props.changeShownItems(shownItems, destinationPage);
            // this.changeShownPunishments(shownPunishments, destinationPage);
        }

        this.firstPageClickHandler = ev => {
            ev.preventDefault();
            this.showPage(1);
        }

        this.previousPageClickHandler = ev => {
            ev.preventDefault();
            this.showPage(2);
        }

        this.nextPageClickHandler = ev => {
            ev.preventDefault();
            this.showPage(3);
        }

        this.lastPageClickHandler = ev => {
            ev.preventDefault();
            this.showPage(4);
        }

    }

    render() {
        const currentPage = this.props.currentPage;
        const maxPage = getMaxPage(Object.keys(this.props.dataToDisplay).length, ITEMS_PER_PAGE);
        const firstPageBtnDisabled = currentPage === 1;
        const previousPageBtnDisabled = currentPage === 1;
        const nextPageBtnDisabled = currentPage === maxPage;
        const lastPageBtnDisabled = currentPage === maxPage;
        const disabledStyle = {
            pointerEvents: "none",
            opacity: 0.5,
        };

        return (
            <div className="page-listing-component">

                <button
                    style={firstPageBtnDisabled ? disabledStyle : {}}
                    id="first-page-button"
                    onClick={this.firstPageClickHandler}
                    disabled={firstPageBtnDisabled}>
                    FIRST
                </button>

                <button
                    style={previousPageBtnDisabled ? disabledStyle : {}}
                    id="punishment-previous-page-navigation-btn"
                    className="punishment-page-navigation-btn"
                    onClick={this.previousPageClickHandler}
                    disabled={previousPageBtnDisabled}>
                    <svg id="previous-page-btn" width="14px" height="23px" viewBox="0 0 14 23" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-592.000000, -3152.000000)"
                            opacity="0.300000012">
                            <g id="Group-prev-btn" transform="translate(0.000000, 2508.000000)" stroke="#FFFFFF" strokeWidth="3">
                                <g transform="translate(497.000000, 645.214000)" id="Path-181">
                                    <polyline transform="translate(103.000000, 10.000000) rotate(90.000000) translate(-103.000000, -10.000000) " points="93.1514953 5.30299068 102.848505 15 112.848505 5"></polyline>
                                </g>
                            </g>
                        </g>
                    </svg>
                </button >

                <button
                    style={{ pointerEvents: "none" }}
                    id="picker-page">
                    {currentPage}
                </button>

                <button
                    style={nextPageBtnDisabled ? disabledStyle : {}}
                    id="punishment-next-page-navigation-btn"
                    className="punishment-page-navigation-btn"
                    onClick={this.nextPageClickHandler}
                    disabled={nextPageBtnDisabled}>

                    <svg id="next-page-btn" width="14px" height="23px" viewBox="0 0 14 23" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="page-04" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-675.000000, -3152.000000)"
                            opacity="0.300000012">
                            <g id="Group-next-btn" transform="translate(0.000000, 2508.000000)" stroke="#FFFFFF" strokeWidth="3">
                                <g transform="translate(497.000000, 645.214000)" id="Path-181-Copy">
                                    <polyline transform="translate(184.000000, 10.000000) rotate(-90.000000) translate(-184.000000, -10.000000) " points="174.151495 5.30299068 183.848505 15 193.848505 5"></polyline>
                                </g>
                            </g>
                        </g>
                    </svg>
                </button >

                <button
                    style={lastPageBtnDisabled ? disabledStyle : {}}
                    id="last-page-button"
                    onClick={this.lastPageClickHandler}
                    disabled={lastPageBtnDisabled}>
                    LAST
                </button>

            </div >
        );
    }
}

export default SkoldboardPager;


function getCounterStartingValue(pageNumber, arrayLength, itemsPerPage) {

    let maxPage = getMaxPage(arrayLength, itemsPerPage);

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

function getMaxPage(arrayLength, itemsPerPage) {
    return (arrayLength % itemsPerPage) ? Math.floor(arrayLength / itemsPerPage) + 1 : arrayLength / itemsPerPage;
}

