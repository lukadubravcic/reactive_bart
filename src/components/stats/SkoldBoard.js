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
                this.setState({ skoldboardData: res });
                // this.setState({ skoldboardData: testData });
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


const testData = {
    "lukadubravcic@yahoo.com": {
        "fromNum": 4,
        "username": "Luka",
        "toNum": 4,
        "rank": 1
    },
    "ldubravcic@kreativni.hr": {
        "fromNum": 1,
        "username": null,
        "toNum": 3,
        "rank": 4
    },
    "marko@test.hr": {
        "fromNum": 2,
        "username": "Marko",
        "toNum": 6,
        "rank": 4
    },
    "slavko@test.hr": {
        "fromNum": 2,
        "username": "Slavko",
        "toNum": 6,
        "rank": 4
    },
    "Čečenija@test.hr": {
        "fromNum": 2,
        "username": "Čečen",
        "toNum": 6,
        "rank": 4
    },
    "list@test.hr": {
        "fromNum": 2,
        "username": "Šižt",
        "toNum": 6,
        "rank": 4
    },
    "darko@test.hr": {
        "fromNum": 2,
        "username": null,
        "toNum": 6,
        "rank": 4
    },
    "igor@test.hr": {
        "fromNum": 2,
        "username": "IgorZvanIgorKojiUlaziANe KucaNaVrataVragJedan",
        "toNum": 6,
        "rank": 4
    },
    "ante@test.hr": {
        "fromNum": 2,
        "username": "Ante",
        "toNum": 6,
        "rank": 4
    },
    "bepo@test.hr": {
        "fromNum": 2,
        "username": "Bepo",
        "toNum": 6,
        "rank": 4
    },
    "zenza@test.hr": {
        "fromNum": 2,
        "username": "Zem",
        "toNum": 6,
        "rank": 4
    },
    "ibrica@test.hr": {
        "fromNum": 2,
        "username": null,
        "toNum": 6,
        "rank": 4
    },
    "milo@test.hr": {
        "fromNum": 2,
        "username": "Milo",
        "toNum": 6,
        "rank": 4
    },
    "igor2@test.hr": {
        "fromNum": 2,
        "username": "IgorZvanIgorKojiUlaziANe KucaNaVrataVragJedan",
        "toNum": 6,
        "rank": 4
    },
    "ante2@test.hr": {
        "fromNum": 2,
        "username": "Ante",
        "toNum": 6,
        "rank": 4
    },
    "bepo2@test.hr": {
        "fromNum": 2,
        "username": "Bepo",
        "toNum": 6,
        "rank": 4
    },
    "zenza2@test.hr": {
        "fromNum": 2,
        "username": "Zem",
        "toNum": 6,
        "rank": 4
    },
    "ibrica2@test.hr": {
        "fromNum": 2,
        "username": null,
        "toNum": 6,
        "rank": 4
    },
    "milo2@test.hr": {
        "fromNum": 2,
        "username": "Milo",
        "toNum": 6,
        "rank": 4
    },
    "ante3@test.hr": {
        "fromNum": 2,
        "username": "Ante",
        "toNum": 6,
        "rank": 4
    },
    "bepo3@test.hr": {
        "fromNum": 2,
        "username": "Bepo",
        "toNum": 6,
        "rank": 4
    },
    "zenza3@test.hr": {
        "fromNum": 2,
        "username": "Zem",
        "toNum": 6,
        "rank": 4
    },
    "ibrica3@test.hr": {
        "fromNum": 2,
        "username": null,
        "toNum": 6,
        "rank": 4
    },
    "milo3@test.hr": {
        "fromNum": 2,
        "username": "Milo",
        "toNum": 6,
        "rank": 4
    },
}
