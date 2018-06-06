import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import SkoldBoardDisplayContainer from './SkoldBoardDisplayContainer';

const mapStateToProps = state => ({
    currentUser: state.common.currentUser,
    acceptedPunishments: state.punishment.acceptedPunishments,
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

export default connect(mapStateToProps)(SkoldBoard);


const dummySkoldboardData = [
    {
        rank: 1,
        self: 1,
        whom: "dummy1",
        _from: 3,
        _to: 4,
    },
    {
        rank: 3,
        self: 0,
        whom: "dummy2",
        _from: 3,
        _to: 4,
    },
    {
        rank: 35,
        self: 0,
        whom: "dummy3",
        _from: 3,
        _to: 4,
    },
    {
        rank: 299,
        self: 0,
        whom: "dummy4",
        _from: 3,
        _to: 4,
    }
];