import React from 'react';
import SkoldBoardTable from './SkoldBoardTable';
import { isNumber } from 'util';

class SkoldBoardDisplayContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }

    componentDidMount() {
        // let dataArray = tranformAndSortData(this.props.data);
        if (this.props.data.length) this.setState({ data: this.props.data });
    }

    render() {
        if (!this.state.data) return null;

        return (
            <div className="skoldboard-table-container">
                <div style={{ marginTop: 60 + "px" }} className="picker-nav-container">
                    <nav className="picker-navigation">
                        <button
                            style={{ cursor: "default" }}
                            className="picker-tab picker-selected-tab">
                            SKOLDBOARD
                        </button>
                    </nav>
                </div>
                <SkoldBoardTable data={this.state.data} currentUser={this.props.currentUser} />
            </div>
        )
    }
}

export default SkoldBoardDisplayContainer;


/* function tranformAndSortData(data) {
    let dataArray = [];

    for (let key in data) {
        dataArray.push({ ...data[key], email: key });
    }

    return sortDataByRank(dataArray, 1);
}

function sortDataByRank(data, order) {
    let tmp = [...data];

    tmp.sort((a, b) => {
        if ((typeof b.rank === 'undefined' || b.rank === null) && (typeof a.rank !== 'undefined' || a.rank !== 'null')) return -1;
        else if ((typeof a.rank === 'undefined' || a.rank === null) && (typeof b.rank !== 'undefined' || b.rank !== 'null')) return 1;
        return ((a.rank - b.rank) * order);
    });

    return tmp;
}; */
