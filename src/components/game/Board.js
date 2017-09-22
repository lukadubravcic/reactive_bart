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
    },
    wrongBoardEntryWarning: (status) => {
        dispatch({ type: 'BOARD_WRONG_ENTRY', mistake: status });
    }
});

class Board extends React.Component {

    constructor(props) {
        super(props);
        // TODO: punishment bi trebalo bit dohvacen sa backenda i nalaziti se u store-u
        this.punishment = 'Rečenica. ';
        this.howManyTimes = 3;

        this._startingText = 'Write ' + this.howManyTimes + 'x: ' + this.punishment;
        this._charCircularCounter = 0; // circural counter
        this._wrongCharPlace = null;

        this.boardTextChange = (ev) => {
            ev.preventDefault();
            this.boardStateUpdate(ev.key);
        }
        this.addToStartingSentence = char => {
            this.props.onBoardTextChange(this.props.game.boardValue + char);
        }
        this.validateKey = this.validateKey.bind(this);
        this.boardStateUpdate = this.boardStateUpdate.bind(this);
    }

    boardStateUpdate(key) {
        let boardText = this.props.game.boardValue.slice();
        let transformedBoardText = '';

        if (inArray(key, validKeys)) {

            if (key === 'Backspace') {
                transformedBoardText = boardText.slice(0, -1);
                this.validateKey(key, transformedBoardText);
                this._decrementCharCounter();

            } else {
                transformedBoardText = boardText + key;
                this.validateKey(key, transformedBoardText);
                this._incrementCharCounter();
            }
            // console.log('Entered char: ' + ev.key + "   Board: " + transformedBoardText);
            this.props.onBoardTextChange(transformedBoardText);

        }
    }

    componentDidMount() {
        this.props.boardDisabledStatus(true);
        this.writeStartingSentance(this);
    }

    _incrementCharCounter() {
        if (this._charCircularCounter === this.punishment.length - 1) {
            this._charCircularCounter = 0;
        } else {
            this._charCircularCounter++;
        }
    }

    _decrementCharCounter() {
        if (this._charCircularCounter === 0) {
            this._charCircularCounter = this.punishment.length - 1;
        } else {
            this._charCircularCounter--;
        }
    }

    validateKey(char, boardText) {

        // ako postoji vec wrong char
        if (this._wrongCharPlace !== null) {
            // ako se trenutni char nalazi na poziciji greske
            if (boardText.length === (this._wrongCharPlace)) {
                this._wrongCharPlace = null;
                this.props.wrongBoardEntryWarning(false);
            }
        }
        // ako ne postoji wrong char
        else {
            // ako je neispravan char
            console.log()
            if (this.punishment[this._charCircularCounter] !== boardText[boardText.length - 1]) {
                console.log('greska');
                this._wrongCharPlace = boardText.length - 1;
                this.props.wrongBoardEntryWarning(true);
            }
        }

        console.log('--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------')
        console.log('Char: ' + char);
        console.log('Wrong char place: ' + (this._wrongCharPlace === null ? null : this._wrongCharPlace));
        console.log('BoardText (duljna = ' + boardText.length + '): "' + boardText + '"');
        console.log('Punishment: "' + this.punishment + '"');
        console.log('CircularCounter: ' + this._charCircularCounter);
        console.log('Punishment [CircularCounter]: ' + this.punishment[this._charCircularCounter]);
        console.log('Punishment [CircularCounter - 1]: ' + this.punishment[this._charCircularCounter - 1]);
        console.log('Zadnji unešeni char: ' + boardText[boardText.length - 1]);
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
        const boardTextMistake = this.props.game.boardTextMistake;

        return (
            <div className="container">
                <textarea id="writing-board" rows="5" cols="100"
                    style={boardTextMistake ? { backgroundColor: '#f2cbcb' } : { backgroundColor: '' }}
                    value={this.props.game.boardValue}
                    disabled={this.props.game.boardDisabled}
                    onKeyDown={this.boardTextChange}
                />

                <div id="textarea"
                    style={{
                        "border": "1px solid gray",
                        "font": "medium -moz-fixed",
                        "font": "-webkit-small-control",
                        "height": "400px",
                        "overflow": "auto",
                        "padding": "2px",
                        "width": "822px"
                    }}
                >Write xX: <u>{this.punishment}</u>{this.props.game.boardValue}</div>


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
    "^", "Ω", "≈", "ç", "√", "∫", "µ", "≤", "≥", "÷", "Backspace"
]

function inArray(target, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === target) {
            return true;
        }
    }
    return false;
}
