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

   /*  componentDidMount() {
        if (this.props.data.length) this.setState({ data: this.props.data });
    }

    componentDidUpdate(prevProps) {
        // if (this.props.data) this.setState({ data: this.props.data });
    } */

    render() {
        if (!this.props.data) return null;

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
                <SkoldBoardTable data={this.props.data} currentUser={this.props.currentUser} />
            </div>
        )
    }
}

export default SkoldBoardDisplayContainer;
