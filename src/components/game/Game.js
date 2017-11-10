import React from 'react';
import Board from './Board';
import Timer from './Timer';


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

export default Game;
