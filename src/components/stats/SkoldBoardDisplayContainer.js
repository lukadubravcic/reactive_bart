import React from 'react';
import SkoldBoardTable from './SkoldBoardTable';

class SkoldBoardDisplayContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.data) return null;

        return (
            <div>
                <div style={{ marginTop: 50 + "px" }} className="picker-nav-container">
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