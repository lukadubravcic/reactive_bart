import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import Board from './Board';
import Timer from './Timer'


const mapStateToProps = state => ({
    ...state
});

class Game extends React.Component {

    render() {
        return (
            <div className="container">
                <Timer />
                <Board />
            </div>
        );
    }
}

export default connect(mapStateToProps)(Game);
