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
        "rank": 3
    },
    "slavko@test.hr": {
        "fromNum": 2,
        "username": "Slavko",
        "toNum": 6,
        "rank": 200
    },
    "Čečenija@test.hr": {
        "fromNum": 2,
        "username": "Čečen",
        "toNum": 6,
        "rank": 117
    },
    "list@test.hr": {
        "fromNum": 2,
        "username": "Šižt",
        "toNum": 6,
        "rank": 8
    },
    "darko@test.hr": {
        "fromNum": 2,
        "username": null,
        "toNum": 6,
        "rank": 36
    },
    "igor@test.hr": {
        "fromNum": 2,
        "username": "IgorZvanIgorKojiUlaziANe KucaNaVrataVragJedan",
        "toNum": 6,
        "rank": 55
    },
    "ante@test.hr": {
        "fromNum": 2,
        "username": "Ante",
        "toNum": 6,
        "rank": 42
    },
    "bepo@test.hr": {
        "fromNum": 2,
        "username": "Bepo",
        "toNum": 6,
        "rank": 89
    },
    "zenza@test.hr": {
        "fromNum": 2,
        "username": "Zem",
        "toNum": 6,
        "rank": 100
    },
    "ibrica@test.hr": {
        "fromNum": 2,
        "username": null,
        "toNum": 6,
        "rank": 71
    },
    "milo@test.hr": {
        "fromNum": 2,
        "username": "Milo",
        "toNum": 6,
        "rank": null
    },
    "igor2@test.hr": {
        "fromNum": 2,
        "username": "IgorZvanIgorKojiUlaziANe KucaNaVrataVragJedan",
        "toNum": 6,
        "rank": 199
    },
    "ante2@test.hr": {
        "fromNum": 2,
        "username": "Ante",
        "toNum": 6,
        "rank": 114
    },
    "bepo2@test.hr": {
        "fromNum": 2,
        "username": "Bepo",
        "toNum": 6,
        "rank": 13
    },
    "zenza2@test.hr": {
        "fromNum": 2,
        "username": "Zem",
        "toNum": 6,
        "rank": 14
    },
    "ibrica2@test.hr": {
        "fromNum": 2,
        "username": null,
        "toNum": 6,
        "rank": 17
    },
    "milo2@test.hr": {
        "fromNum": 2,
        "username": "Milo",
        "toNum": 6,
        "rank": 19
    },
    "ante3@test.hr": {
        "fromNum": 2,
        "username": "Ante",
        "toNum": 6,
        "rank": 22
    },
    "bepo3@test.hr": {
        "fromNum": 2,
        "username": "Bepo",
        "toNum": 6,
        "rank": 33
    },
    "zenza3@test.hr": {
        "fromNum": 2,
        "username": "Zem",
        "toNum": 6,
        "rank": 44
    },
    "ibrica3@test.hr": {
        "fromNum": 2,
        "username": null,
        "toNum": 6,
        "rank": null,
    },
    "milo3@test.hr": {
        "fromNum": 2,
        "username": "Milo",
        "toNum": 6,
        "rank": 300,
    },
}
