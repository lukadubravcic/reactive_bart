import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

/* 
TODO: agent mora dobiti punishment, na koji se dodaje razmak na kraju
*/

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
    },
    getPunishment: () => { 
    }
});

class Board extends React.Component {

    constructor() {
        super();
        // TODO: punishment bi trebalo bit dohvacen sa backenda i nalaziti se u store-u
        this.punishment = 'Rečenica.';                
        this.howManyTimes = 3;
        this.punishmentExplanation = "Write " + this.howManyTimes + "x: " + this.punishment;
        this.punishmentExample = '';

        this._wrongCharPlace = null;

        this.boardTextChange = (ev) => {
            ev.preventDefault();
            this.boardStateUpdate(ev.key);
        }
        this.addToStartingSentence = char => {
            this.punishmentExample += char;
            this.forceUpdate(); // forcing re-rendering because punishmentExample isn't in state
            //this.props.onBoardTextChange(this.props.game.boardValue + char);
        }
        this.validateKey = this.validateKey.bind(this);
        this.boardStateUpdate = this.boardStateUpdate.bind(this);
    }

    boardStateUpdate(key) {
        let boardText = this.props.game.boardValue.slice();
        let transformedBoardText = '';

        if (inArray(key, validKeys)) {

            if (key === 'Backspace') {
                if (boardText.length > 0) transformedBoardText = boardText.slice(0, -1);
            } else {
                if (key === ' ' && boardText[boardText.length - 1] === ' ') return;
                else transformedBoardText = boardText + key;
            }
            this.validateKey(key, transformedBoardText);
            this.props.onBoardTextChange(transformedBoardText);

        }
    }

    componentDidMount() {
        this.props.boardDisabledStatus(true);
        this.writeStartingSentance(this);
    }

    validateKey(char, boardText) {
        if (boardText.length > 0) {
            let rightCharForCurrentPosition = (boardText.length % this.punishment.length) - 1 >= 0 ? (boardText.length % this.punishment.length) - 1 : this.punishment.length - 1;

            if (this._wrongCharPlace !== null) {
                if (boardText.length - 1 < this._wrongCharPlace) {
                    this._wrongCharPlace = null;
                    this.props.wrongBoardEntryWarning(false);
                }
            } else {
                if (boardText[boardText.length - 1] !== this.punishment[rightCharForCurrentPosition]) {
                    this._wrongCharPlace = boardText.length - 1;
                    this.props.wrongBoardEntryWarning(true);
                }
            }

            /* console.log('--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------')
            console.log('Char: ' + char);
            console.log('Wrong char place: ' + (this._wrongCharPlace === null ? null : this._wrongCharPlace));
            console.log('BoardText (duljna = ' + boardText.length + '): "' + boardText + '"');
            console.log('Punishment: "' + this.punishment + '"');
            console.log('Punishment [trenutni char]: ' + this.punishment[rightCharForCurrentPosition]);
            console.log('Zadnji unešeni char: ' + boardText[boardText.length - 1]); */
        }
    }

    writeStartingSentance(that) {
        (function write(i) {
            if (that.punishmentExplanation.length <= i) {
                that.props.boardDisabledStatus(false);
                return;
            }
            that.addToStartingSentence(that.punishmentExplanation[i]);
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
        const bcgColor = boardTextMistake ? '#f2cbcb' : '';

        return (
            <div className="container">
                <textarea id="writing-board"
                    style={{
                        backgroundColor: bcgColor,
                        width: "1024px",
                        height: "400px"
                    }}
                    value={this.punishmentExample + boardText}
                    disabled={this.props.game.boardDisabled}
                    onKeyDown={this.boardTextChange}
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
