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
});

class Board extends React.Component {

    constructor() {
        super();
        // TODO: punishment bi trebalo bit dohvacen sa backenda i nalaziti se u store-u

        this.punishment = 'Rečenica. ';
        this.howManyTimes = 3;
        this._startingText = 'Write ' + this.howManyTimes + 'x: ' + this.punishment;
        this._charCounter = 0; // circural counter
        this.beforeChar = -1; // pamti zadnji provjereni index

        this.boardChange = ev => {
            this.boardTextChange(ev);
        };
        this.boardTextChange = (ev) => {

            ev.preventDefault();
            let boardText = this.props.game.boardValue.slice();

            if (ev.type === 'keydown') {

                if (ev.key === 'Backspace') {
                    let transformedBoardText = boardText.slice(0, -1);
                    this.props.onBoardTextChange(transformedBoardText);

                } else if (inArray(ev.key, validKeys)) {
                    console.log(ev.key);
                    boardText += ev.key;
                    this.props.onBoardTextChange(boardText);
                    this._incrementCharCounter();
                }

                this.validateKey(ev.key);
            }
        }
        this.addToStartingSentence = char => {
            this.props.onBoardTextChange(this.props.game.boardValue + char);
        }
        this.validateKey = this.validateKey.bind(this);
    }

    componentDidMount() {
        this.props.boardDisabledStatus(true);
        this.writeStartingSentance(this);
    }

    _incrementCharCounter() {
        if (this._charCounter === this.punishment.length - 1) {
            this._charCounter = 0;
        } else {
            this._charCounter++;
        }
    }
    // ovo je SOLID
    validateKey(char) {

        // (char)-> provjeri jel taj char treba biti na tom mjestu
        let boardText = this.props.game.boardValue.slice();
        console.log(this._charCounter);
        // console.log(boardText.indexOf(this._charCounter));

        // ako je novounseni char dobar char, tj ako je char koji je poslije onog iz memorije
        /* if (boardText[this.charCounter-1] === ) { 

        } */
    }

    writeStartingSentance(that) {
        (function write(i) {
            if (that._startingText.length <= i) {
                that.props.boardDisabledStatus(false);
                return;
            }
            that.addToStartingSentence(that._startingText[i]);
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
            <div className="container">
                <textarea id="writing-board" rows="20" cols="100"
                    value={boardText}
                    disabled={this.props.game.boardDisabled}
                    onKeyDown={this.boardChange}
                //onChange={this.boardChange}
                />
                <div id="progress-sponge">
                    <label>Sponge</label>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)

const validKeys = [
    " ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "Q", "W", "E",
    "R", "T", "Z", "U", "I", "O", "P", "Š", "Đ", "A", "S", "D", "F", "G",
    "H", "J", "K", "L", "Č", "Ć", "Ž", "Y", "X", "C", "V", "B", "N", "M",
    "q", "w", "e", "r", "t", "z", "u", "i", "o", "p", "š", "đ", "a", "s",
    "d", "f", "g", "h", "j", "k", "l", "č", "ć", "ž", "y", "x", "c", "v",
    "b", "n", "m", "!", "\"", "#", "$", "%", "&", "/", "(", ")", "=", "?",
    "*", "'", "+", "-", "_", "<", ">", ",", ".", ";", ":", "@", "{", "}",
    "[", "]", "\\", "|", "Œ", "„", "‰", "“", "‘", "”", "’", "É", "Ø", "∏",
    "{", "}", "Å", "Í", "Î", "Ï", "Ì", "Ó", "Ô", "", "Ò", "æ", "Æ", "|",
    "~", "«", "»", "Ç", "◊", "Ñ", "ˆ", "¯", "È", "ˇ", "¿", "œ", "∑", "®",
    "†", "—", "ø", "π", "[", "]", "å", "ß", "∂", "ƒ", "©", "∆", "¬", "…",
    "^", "Ω", "≈", "ç", "√", "∫", "µ", "≤", "≥", "÷"
]

function inArray(target, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === target) {
            return true;
        }
    }
    return false;
}
