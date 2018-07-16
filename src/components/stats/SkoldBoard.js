import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import SkoldBoardDisplayContainer from './SkoldBoardDisplayContainer';
import RankInfo from './RankInfo';

const mapStateToProps = state => ({
    currentUser: state.common.currentUser,
    acceptedPunishments: state.punishment.acceptedPunishments,
    pastPunishments: state.punishment.pastPunishments,
    claimSuccessfulFlag: state.game.claimSuccessfulFlag,
});

const mapDispatchToProps = dispatch => ({
    updateUserRank: newRank => dispatch({ type: 'UPDATE_RANK_VALUE', newRank }),
});

class SkoldBoard extends React.Component {
    constructor() {
        super();
        this.skoldboardTimeout = null;
        this.state = {
            skoldboardData: null,
        }

        this.getSkoldboardData = async () => {
            let res = await agent.Punishment.skoldboard();
            if (res) {
                this.setState({ skoldboardData: res });
                this.getUserRankAndUpdate(res);
            }
        }

        this.getUserRankAndUpdate = skoldboardData => {
            let rank = this.getRankFromSkoldboardData(skoldboardData);
            if (rank) this.props.updateUserRank(rank);
        }

        this.getRankFromSkoldboardData = skoldboardData => {
            let rank = null;

            skoldboardData.forEach(element => {
                if (element.self === 1) return rank = element.rank;
            });

            return rank;
        }

        this.setDummySkoldboardData = () => {
            this.setState({ skoldboardData: dummySkoldboardData });
        }
    }

    componentDidUpdate(prevProps) {
        const userJustLoggedIn =
            (
                typeof prevProps.currentUser === 'undefined'
                || prevProps.currentUser === null
                || Object.keys(prevProps.currentUser).length === 0
            )
            && (
                typeof this.props.currentUser !== 'undefined'
                && this.props.currentUser !== null
                && Object.keys(this.props.currentUser).length > 0
            );

        const userJustLoggedOut =
            (
                typeof prevProps.currentUser !== 'undefined'
                && prevProps.currentUser !== null
                && Object.keys(prevProps.currentUser).length > 0
            )
            && (
                typeof this.props.currentUser === 'undefined'
                || this.props.currentUser === null
                || Object.keys(this.props.currentUser).length === 0
            )

        if (userJustLoggedIn) {
            this.getSkoldboardData();
        } else if (userJustLoggedOut) {
            this.setDummySkoldboardData();
        }
        // app prepozna da se user logginao nakon claim zahtjeva, nakon logina povuci nove skoldboard podatke (da ukljuci i nove podatke poslije claim-a)
        if (prevProps.claimSuccessfulFlag === null && this.props.claimSuccessfulFlag === true) {
            this.getSkoldboardData();
        }

        if (
            Object.keys(this.props.currentUser).length
            && (
                (prevProps.acceptedPunishments.length !== this.props.acceptedPunishments.length)
                || (prevProps.pastPunishments.length !== this.props.pastPunishments.length)
            )
        ) {
            this.getSkoldboardData();
        }
    }

    componentDidMount() {
        if (
            typeof this.props.currentUser !== 'undefined'
            && this.props.currentUser !== null
            && Object.keys(this.props.currentUser).length > 0
        ) {
            this.getSkoldboardData();
        } else {
            this.setDummySkoldboardData();
        }
    }

    render() {
        const skoldboardData = this.state.skoldboardData;
        let userLoggedIn =
            typeof this.props.currentUser !== 'undefined'
            && this.props.currentUser !== null
            && Object.keys(this.props.currentUser).length > 0;

        if (skoldboardData) {
            return (
                <div className={`parent-component rank-component-container${userLoggedIn ? "" : " greyscale-filter"}`}>
                    {userLoggedIn ? null : <div id="form-overlay"></div>}

                    <RankInfo />
                    <SkoldBoardDisplayContainer data={skoldboardData} currentUser={this.props.currentUser} />
                    <div className="rank-bottom-image-container">
                        {componentSVG}
                    </div>
                </div>
            )
        }
        else return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SkoldBoard);

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


const dummySkoldboardData = [
    {
        rank: 2,
        self: 0,
        whom: "Donald Trump",
        _from: 471,
        _to: 8531,
    },
    {
        rank: 14,
        self: 0,
        whom: "Santa Claus",
        _from: 13,
        _to: 1,
    },
    {
        rank: 117,
        self: 0,
        whom: "Bill Gates",
        _from: 640,
        _to: 2674,
    },
    {
        rank: 1314,
        self: 0,
        whom: "Ricky Gervais",
        _from: 81,
        _to: 1112,
    },
    {
        rank: 23011,
        self: 0,
        whom: "Pope Francis",
        _from: 665,
        _to: 0,
    },
    {
        rank: 47860,
        self: 0,
        whom: "Oprah Winfrey",
        _from: 187,
        _to: 512,
    },
    {
        rank: 89041,
        self: 0,
        whom: "Homer Simpson",
        _from: 4,
        _to: 23,
    },
    {
        rank: 110847,
        self: 0,
        whom: "Beyoncé",
        _from: 69,
        _to: 374,
    },
    {
        rank: 470874,
        self: 1,
        whom: "Myself",
        _from: 42,
        _to: 109,
    },
    {
        rank: 1272236,
        self: 0,
        whom: "Arnold Schwarzenegger",
        _from: 271,
        _to: 37,
    }
];