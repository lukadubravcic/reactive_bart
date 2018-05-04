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
                <SkoldBoardTable data={this.props.data} currentUser={this.props.currentUser} />
            </div>
        )
    }
}

export default SkoldBoardDisplayContainer;