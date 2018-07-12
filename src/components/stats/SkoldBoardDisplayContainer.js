import React from 'react';
import SkoldBoardTable from './SkoldBoardTable';

class SkoldBoardDisplayContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
        }
    }

    render() {
        if (!this.props.data) return null;

        return (
            <div
                id="skoldboard"
                className="skoldboard-table-container">
                <div style={{ marginTop: 60 + "px" }} className="picker-nav-container">
                    <nav className="picker-navigation">
                        <button
                            style={{ cursor: "default" }}
                            className="picker-tab picker-selected-tab">
                            SKOLDBOARD
                        </button>
                    </nav>
                </div>
                <SkoldBoardTable data={this.props.data} currentUser={this.props.currentUser} />
            </div>
        )
    }
}

export default SkoldBoardDisplayContainer;
