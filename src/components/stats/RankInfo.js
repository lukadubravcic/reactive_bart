import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    currentUser: state.common.currentUser,
    rank: state.common.rank,
});

class RankInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let rank = typeof this.props.rank === 'undefined' || this.props.rank === null || this.props.rank === 'unknown' ? '#42' : ('#' + this.props.rank);

        return (
            <div className="container">
                <label id="rank-heading" className="heading">Your rank is&nbsp;</label>
                <label id="user-rank">{rank}</label>

                <div className="rank-description-container">
                    <p className="rank-description">
                        Ranking is based on your activity. EVERYTHING counts. Especially good deeds.
                    </p>
                </div>
            </div>
        )
    }
}


export default connect(mapStateToProps, () => ({}))(RankInfo);