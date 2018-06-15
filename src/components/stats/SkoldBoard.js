import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import SkoldBoardDisplayContainer from './SkoldBoardDisplayContainer';

const mapStateToProps = state => ({
    currentUser: state.common.currentUser,
    acceptedPunishments: state.punishment.acceptedPunishments,
    claimSuccessfulFlag: state.game.claimSuccessfulFlag,
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
            if (res) this.setState({ skoldboardData: res });
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

        if (prevProps.claimSuccessfulFlag === null && this.props.claimSuccessfulFlag === true) {
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

        if (skoldboardData) {
            return <SkoldBoardDisplayContainer data={skoldboardData} currentUser={this.props.currentUser} />
        }
        else return null;
    }
}

export default connect(mapStateToProps, () => ({}))(SkoldBoard);


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