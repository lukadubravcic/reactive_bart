import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import SkoldBoardDisplayContainer from './SkoldBoardDisplayContainer';

const mapStateToProps = state => ({
    currentUser: state.common.currentUser,
});

class SkoldBoard extends React.Component {
    constructor() {
        super();

        this.state = {
            skoldboardData: null,
        }

        this.getSkoldboardData = async () => {
            let res = await agent.Punishment.skoldboard();

            if (res) {
                this.setState({ skoldboardData: res })
            }
        }
    }

    componentDidMount() {
        this.getSkoldboardData();
    }

    render() {
        const skoldboardData = this.state.skoldboardData;

        if (skoldboardData) return <SkoldBoardDisplayContainer data={skoldboardData} currentUser={this.props.currentUser} />
        else return null;
    }
}

export default connect(mapStateToProps)(SkoldBoard);