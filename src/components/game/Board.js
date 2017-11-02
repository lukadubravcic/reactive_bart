import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

import ProgressBar from './ProgressBar';

import { randomPunishments } from '../../constants/constants';

import chalkboardImg from '../../assets/chalkboard.jpg';


const mapStateToProps = state => ({
    ...state.game,
    acceptedPunishments: state.punishment.acceptedPunishments,
    activePunishment: state.game.activePunishment,
    progress: state.game.progress
});

const mapDispatchToProps = dispatch => ({
    updateBoardValue: (value) => {
        dispatch({ type: 'UPDATE_BOARD_VALUE', value });
    },
    boardDisabledStatus: (disabled) => {
        dispatch({ type: 'TOGGLE_BOARD_DISABLED_STATUS', disabled });
    },
    wrongBoardEntryWarning: (status) => {
        dispatch({ type: 'BOARD_WRONG_ENTRY', mistake: status });
    },
    updatePunishmentProgress: (updatedProgress) => {
        dispatch({ type: 'UPDATE_PUNISHMENT_PROGRESS', updatedProgress });
    },
    setActivePunishment: punishment => {
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment });
    },
    setActivePunishmentDone: id => {
        agent.Punishment.done(id).then(dispatch({ type: 'PUNISHMENT_MARKED_DONE' }));
        dispatch({ type: 'PUNISHMENT_DONE', id });
    },
    updateActivePunishments: (punishments) => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_CHANGED', punishments })
    },
    onBoardFocus: () => {
        // štoperica krece, sve što slijedi se pribraja u sljedeći pokušaj (try) gameInProgress = true
        dispatch({ type: 'GAME_BOARD_FOCUSED' });
    },
    onBoardLostFocus: () => {
        dispatch({ type: 'GAME_BOARD_UNFOCUSED' });
    },
    onBoardHover: () => {
        dispatch({ type: 'GAME_BOARD_HOVER' });
    },
    onBoardHoverOut: () => {
        dispatch({ type: 'GAME_BOARD_HOVER_OUT' });
    },
    resetProgress: () => {
        dispatch({ type: 'GAME_RESETED' })
    },
    logPunishmentTry: (id, timeSpent) => {
        agent.Punishment.logTry(id, timeSpent).then(() => { console.log('Try logged') });
        dispatch({ type: 'PUNISHMENT_TRY_LOGGED' });
    }
});

class Board extends React.Component {

    constructor() {
        super();

        this._wrongCharPlace = null;

        this.spongeHover = ev => {
            // igra u tijeku -> pokazi tooltip
            if (this.props.gameInProgress) console.log('sponge hover');
        };

        this.spongeClick = ev => {
            console.log('sponge click');
            // reset sponge (position), log try, optionally send (trying) mail, 
            // reset board, restart stopwatch
            this.activePunishmentChanged();
            this.props.resetProgress();
        };

        this.boardTextChange = ev => {
            ev.preventDefault();
            this.boardStateUpdate(ev.key);
        };

        this.clearStartingSentence = () => {
            this.startingSentence = '';
            this.forceUpdate();
        }

        this.addToStartingSentence = char => {
            this.startingSentence += char;
            this.forceUpdate(); // force re-render -> startingSentence nije u stateu (potencijalno ga staviti)
        };

        this.boardFocused = ev => {
            ev.preventDefault();
            this.clearStartingSentence();
            this.props.onBoardFocus();
        };

        this.boardLostFocus = ev => {
            ev.preventDefault();
            this.props.onBoardLostFocus();
        };

        this.boardHover = ev => {
            this.props.onBoardHover();
        };

        this.boardHoverOut = ev => {
            this.props.onBoardHoverOut();
        };

        this.activePunishmentDone = () => {
            this.props.setActivePunishmentDone(this.props.activePunishment._id);
            this.removeActivePunishmentFromAccepted();

            setTimeout(() => {
                // prikaz poruke na odredeno vrijeme, pa zatim prebacivanje na sljedecu kaznu
                console.log('Punishment completed!');
                /* 
                    TODO: odvojiti funkciju za ispis poruka preko ploce (done/failed/...)
                */
                this.props.setActivePunishment(this.props.acceptedPunishments[0])
            }, 2000)
        };

        this.removeActivePunishmentFromAccepted = () => {
            let filteredAccPunishments = this.props.acceptedPunishments.filter((punishment) => {
                return punishment._id === this.props.activePunishment._id ? null : punishment;
            });
            this.props.updateActivePunishments(filteredAccPunishments);
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
            let progress = 0;

            if (inArray(key, validKeys)) {

                if (key === 'Backspace') {
                    if (boardText.length > 0) transformedBoardText = boardText.slice(0, -1);
                } else {
                    if (key === ' ' && boardText[boardText.length - 1] === ' ') return;
                    else transformedBoardText = boardText + key;
                }
                this.validateKey(key, transformedBoardText);
                this.props.updateBoardValue(transformedBoardText);
                progress = this.updateProgress(transformedBoardText, this.punishment, this.howManyTimes);
                if (progress === 100) {
                    // punishment DONE
                    this.activePunishmentDone();
                }
            }
        };

        this.updateProgress = (transformedBoardText, punishment, howManyTimes) => {
            if (this._wrongCharPlace === null) {
                let updatedProgress = this.calculateProgress(transformedBoardText, punishment, howManyTimes);
                this.props.updatePunishmentProgress(updatedProgress);
                return updatedProgress;
            }
        };

        // rekurzivno ispisvanje početne rečenice i dodavanje već napisanih znakova (ako ih ima)
        this.writeStartingSentance = () => {
            this.clearStartingSentence();
            this.props.updateBoardValue('');

            const write = (i) => {
                if (this.punishmentExplanation.length <= i) {
                    this.activeWriteTimeout = setTimeout(() => {
                        this.addToStartingSentence("Click to start!");
                        this.props.boardDisabledStatus(false);
                    }, 100);
                    return;
                }
                this.addToStartingSentence(this.punishmentExplanation[i]);
                i++;
                this.activeWriteTimeout = setTimeout(() => {
                    write(i);
                }, Math.floor(Math.random() * 150) + 30);
            }
            write(0);
        };

        this.calculateProgress = (boardText, punishment, howManyTimes) => {
            let progress = Math.floor((boardText.length / (punishment.length * howManyTimes)) * 100);
            if (progress > 100) return 100;
            else if (progress < 0) return 0;
            else return progress;
        };

        this.handleBeforeunload = () => {
            this.props.saveCurrentProgress(this.props.activePunishment._id, this.props.progress);
        };

        this.loadRandomPunishment = this.loadRandomPunishment.bind(this);

        this.activePunishmentChanged = () => { // potrebno loggirat kaznu
            if (this.props.gameInProgress) { // ako je igra bila u tijeku, logiraj ju
                this.props.logPunishmentTry(this.props.activePunishment._id, this.props.timeSpent);
            }
            // init nove aktivne kazne
            this.newPunishmentInit();
        };

        this.newPunishmentInit = () => {
            if (this.activeWriteTimeout) clearTimeout(this.activeWriteTimeout);
            this.punishment = this.props.activePunishment.what_to_write;
            this.punishmentId = this.props.activePunishment._id;
            this.howManyTimes = this.props.activePunishment.how_many_times;
            this.punishmentExplanation = "Write " + this.howManyTimes + "x \"" + this.punishment + "\". ";
            this.clearStartingSentence();
            this.props.boardDisabledStatus(true);
            this.writeStartingSentance();
        };
    }
    componentDidMount() {
        window.addEventListener("beforeunload", this.handleBeforeunload);
        this.startingSentence = '';
    }

    componentDidUpdate() {   
        if (Object.keys(this.props.activePunishment).length && (this.props.activePunishment._id !== this.punishmentId)) { // postavljena nova kazna
            this.activePunishmentChanged();
        }
    }

    loadRandomPunishment() {
        let randomPunishment = randomPunishments[Math.floor(Math.random() * randomPunishments.length)];
    }

    render() {
        const activePunishmentSet = Object.keys(this.props.activePunishment).length > 0;
        const boardText = this.props.boardValue;
        const progress = this.props.progress;
        const boardTextMistake = this.props.boardTextMistake;
        const bcgColor = boardTextMistake ? '#f2cbcb' : '';

        const style = {
            backgroundColor: bcgColor,
            height: "400px",
            width: "100%"
        };

        if (activePunishmentSet) {
            return (
                <div className="container">
                    <div style={{ width: "1024px" }}>
                        <textarea id="writing-board"
                            style={{ ...style, ...this.doneClass }}
                            value={this.startingSentence + boardText}
                            disabled={this.props.boardDisabled}
                            onKeyDown={this.boardTextChange}
                            onChange={() => { }}
                            onFocus={this.boardFocused}
                            onBlur={this.boardLostFocus}
                            onMouseOver={this.boardHover}
                            onMouseOut={this.boardHoverOut}
                        />
                        <ProgressBar progress={progress} spongeClick={this.spongeClick} onHover={this.spongeHover} />
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

function getWrittenText(punishment, charsWritten) {
    let x = Math.ceil(charsWritten / punishment.length);
    let tmpString = punishment.repeat(x);
    return tmpString.slice(0, charsWritten);
} 