import React from 'react';
import agent from '../../agent';
import SkoldBoardDisplayContainer from './SkoldBoardDisplayContainer';

class SkoldBoard extends React.Component {
    constructor(props) {
        super(props);

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

        if (skoldboardData) return <SkoldBoardDisplayContainer data={skoldboardData} />
        else return null;
    }

}

export default SkoldBoard;