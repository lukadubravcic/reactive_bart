import React from 'react';
import SkoldBoard from './SkoldBoard';


class RankInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let rank = typeof this.props.rank === 'undefined' || this.props.rank === null || this.props.rank === 'unknown' ? 'unranked' : ('#' + this.props.rank);

        return (

            <div className="parent-component rank-component-container">

                <div className="container">

                    <label id="rank-heading" className="heading">Your rank is&nbsp;</label>
                    <label id="user-rank">{rank}</label>

                    <div className="rank-description-container">
                        <p className="rank-description">
                            Ranking is based on your activity. EVERYTHING counts. Especially good deeds.
                        </p>
                    </div>

                    <SkoldBoard />

                </div>

                <div className="rank-bottom-image-container">
                    {componentSVG}
                </div>

            </div>
        )
    }
}


export default RankInfo;


const componentSVG = (
    <svg id="rank-bottom-image" width="1080px" height="74px" viewBox="0 0 1080 74" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-100.000000, -5168.000000)">
            <g id="Group" transform="translate(0.000000, 4844.000000)">
                <g id="Group-12" transform="translate(100.000000, 324.000000)">
                    <polygon id="Fill-7-Copy-9" fill="#FFBC24" points="-2.38411233e-13 74 1080 74 1080 54 -2.38411233e-13 54"></polygon>
                    <polygon id="Fill-15-Copy-4" fill="#FEFEFE" points="684 54 722 54 722 45 684 45"></polygon>
                    <g id="Fill-30-Copy-+-Fill-28-Copy-+-Fill-33-Copy" transform="translate(760.000000, 0.000000)">
                        <path d="M6.1682,6.5 L6.1682,26.5 L95.1082,26.5 C95.1082,26.5 103.1082,26.5 103.1082,17.8513514 L103.1082,15.1486486 C103.1082,15.1486486 103.1082,6.5 95.1082,6.5 L6.1682,6.5 Z"
                            id="Fill-30-Copy" fill="#FF948A"></path>
                        <path d="M110.5082,17.6162791 L110.5082,15.3837209 C110.5082,15.3837209 110.5082,0.5 95.7737733,0.5 L0,0.5 L0,7.19767442 L95.037052,7.19767442 C103.140987,7.19767442 103.140987,15.3837209 103.140987,15.3837209 L103.140987,17.6162791 C103.140987,25.8023256 95.037052,25.8023256 95.037052,25.8023256 L0,25.8023256 L0,32.5 L95.7737733,32.5 C95.7737733,32.5 110.5082,32.5 110.5082,17.6162791"
                            id="Fill-28-Copy" fill="#A479E1"></path>
                        <polygon id="Fill-33-Copy" fill="#FF545F" points="63 15.5397 63 31.8637 68.5 26.6397 74 31.8637 74 15.5397"></polygon>
                    </g>
                    <g id="Group" transform="translate(778.000000, 32.000000)">
                        <g>
                            <polygon id="Fill-34-Copy" fill="#234F78" points="0 21.9798 148 21.9798 148 0 0 0"></polygon>
                            <polygon id="Fill-37-Copy" fill="#2B80B2" points="21 21.9798 28 21.9798 28 0 21 0"></polygon>
                            <polygon id="Fill-38-Copy" fill="#2B80B2" points="7 22 14 22 14 0 7 0"></polygon>
                            <polygon id="Fill-37-Copy-4" fill="#2B80B2" points="134 21.9798 141 21.9798 141 0 134 0"></polygon>
                            <polygon id="Fill-37-Copy-5" fill="#2B80B2" points="120 21.9798 127 21.9798 127 0 120 0"></polygon>
                            <path d="M107,18 C110.866137,18 114,14.8661367 114,11 C114,7.13386328 110.866137,4 107,4 C103.133863,4 100,7.13386328 100,11 C100,14.8661367 103.133863,18 107,18"
                                id="Fill-39-Copy" fill="#00BBD6"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
);