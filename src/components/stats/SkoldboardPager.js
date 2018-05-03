import React from 'react';

class SkoldboardPager extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
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
                </button>

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