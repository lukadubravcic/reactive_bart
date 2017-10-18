import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

import ProgressBar from './ProgressBar';

import { randomPunishments } from '../../constants/constants';

/* 
TODO: agent mora dobiti punishment, na koji se dodaje razmak na kraju
*/

const mapStateToProps = state => ({
    state: state,
    ...state.game,
    activePunishment: state.game.activePunishment,
    progress: state.game.activePunishment.progress
});

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
    },
    updatePunishmentProgress: (updatedProgress) => {
        dispatch({ type: 'UPDATE_PUNISHMENT_PROGRESS', updatedProgress });
    },
    setActivePunishment: punishment => {
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment });
    },
    setActivePunishmentDone: id => {
        dispatch({ type: 'PUNISHMENT_DONE', id });
    }
});

class Board extends React.Component {

    constructor() {
        super();

        this._wrongCharPlace = null;

        this.boardTextChange = (ev) => {
            ev.preventDefault();
            this.boardStateUpdate(ev.key);
        };

        this.addToStartingSentence = char => {
            this.startingSentence += char;
            this.forceUpdate(); // force re-render -> startingSentence nije u stateu
        };

        this.validateKey = (char, boardText) => {

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
            } else if (boardText.length === 0 && char === 'Backspace') {
                this.props.wrongBoardEntryWarning(false);
                this._wrongCharPlace = null;
            }
        };

        this.boardStateUpdate = (key) => {
            let boardText = this.props.boardValue.slice();
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
                this.updateProgress(transformedBoardText, this.punishment, this.howManyTimes)

                if(this.props.progress === 100) {
                    // punishment DONE
                }
            }
        };

        this.updateProgress = (transformedBoardText, punishment, howManyTimes) => {
            if (this._wrongCharPlace === null) {
                let updatedProgress = this.calculateProgress(transformedBoardText, punishment, howManyTimes);
                this.props.updatePunishmentProgress(updatedProgress);
            }
        };

        // rekurzivno ispisvanje početne rečenice
        this.writeStartingSentance = that => {
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
        };

        this.calculateProgress = (boardText, punishment, howManyTimes) => {
            let progress = Math.floor((boardText.length / (punishment.length * howManyTimes)) * 100);
            if (progress > 100) return 100;
            else if (progress < 0) return 0;
            else return progress;
        };

        this.loadRandomPunishment = this.loadRandomPunishment.bind(this);
    }



    componentDidUpdate() {
        if (Object.keys(this.props.activePunishment).length && this.props.activePunishment._id !== this.punishmentId) {
            this.punishment = this.props.activePunishment.what_to_write;
            this.punishmentId = this.props.activePunishment._id;
            this.howManyTimes = this.props.activePunishment.how_many_times;
            this.punishmentExplanation = "Write " + this.howManyTimes + "x \"" + this.punishment + "\": ";
            this.startingSentence = '';
            this.props.boardDisabledStatus(true);
            this.writeStartingSentance(this);
        }
    }

    loadRandomPunishment() {
        let randomPunishment = randomPunishments[Math.floor(Math.random() * randomPunishments.length)];
    }

    render() {
        const boardText = this.props.boardValue;
        const progress = this.props.activePunishment.progress;
        const boardTextMistake = this.props.boardTextMistake;
        const bcgColor = boardTextMistake ? '#f2cbcb' : '';

        if (Object.keys(this.props.activePunishment).length) {
            return (
                <div className="container">
                    <div style={{ width: "1024px" }}>
                        <textarea id="writing-board"
                            style={{
                                backgroundColor: bcgColor,
                                height: "400px",
                                width: "100%"
                            }}
                            value={this.startingSentence + boardText}
                            disabled={this.props.boardDisabled}
                            onKeyDown={this.boardTextChange}
                            onChange={() => { }}
                        />
                        <ProgressBar />
                    </div>
                </div >
            )
        } else {
            return (
                <h3>Loading...</h3>
            )
        }
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