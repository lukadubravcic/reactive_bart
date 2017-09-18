import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = dispatch => ({
    onBoardTextChange: (value) => {
        dispatch({ type: 'UPDATE_BOARD_VALUE', value });
    },
    boardDisabledStatus: (disabled) => {
        dispatch({ type: 'TOGGLE_BOARD_DISABLED_STATUS', disabled });
    }
})

class Board extends React.Component {

    constructor() {
        super();
        // TODO: ovo bi trebalo biti dohvaceno sa backenda
        this.punishment = 'Neka suvisla rečenica.';
        this.boardChange = ev => {
            if(ev.key!=='Enter'){
                console.log(ev.key)
                this.props.onBoardTextChange(ev.target.value + ev.key);
            }
            
        };
        this.addToStartingSentence = char => {
            this.props.onBoardTextChange(this.props.game.boardValue + char);
        }
    }

    componentDidMount() {
        this.props.boardDisabledStatus(true);
        this.writeStartingSentance(this);
        
    }

    writeStartingSentance(that) {
        (function write(i) {
            if (that.punishment.length <= i) {
                that.props.boardDisabledStatus(false);
                return;
            }
            that.addToStartingSentence(that.punishment[i]);
            i++;
            setTimeout(() => {
                write(i);
            }, Math.floor(Math.random() * 150) + 30);
        })(0)
    }

    render() {

        const boardText = this.props.game.boardValue;
        const progress = this.props.progress;

        return (
            <div>
                <textarea id="writing-board" rows="20" cols="100"
                    value={boardText}
                    disabled={this.props.game.boardDisabled}
                    onKeyPress={this.boardChange}
                />
                <div id="progress-sponge">
                    <label>Sponge</label>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)