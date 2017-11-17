import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

import ProgressBar from './ProgressBar';

import chalkboardImg from '../../assets/chalkboard.jpg';

const UPPERCASE = false;

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
    updateAcceptedPunishments: (punishments) => {
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

        this.clickToStartMessage = 'Click to start!'

        this.audio = document.createElement('audio');
        this.audio.style.display = "none";
        this.audio.src = 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-five/zapsplat_office_blackboard_rubber_duster_rub_remove_chalk_from_blackboard.mp3?_=2';

        this._wrongCharPlace = null;

        this.spongeHover = ev => {
            // igra u tijeku -> pokazi tooltip
            if (this.props.gameInProgress) console.log('sponge hover');
        };

        this.spongeClick = ev => {
            console.log('sponge click');
            this.audio.play();
            // reset sponge (position), log try, optionally send (trying) mail, 
            // reset board, restart stopwatch
            this._wrongCharPlace = null;
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
            this.trimClickToStartMessage();
            this.props.onBoardFocus();
        };

        this.trimClickToStartMessage = () => {

            if (this.startingSentence.includes(this.clickToStartMessage)) {

                this.startingSentence = this.startingSentence.substring(0, this.startingSentence.length - this.clickToStartMessage.length);
            }
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

            if (!specialOrRandomPunishmentIsActive(this.props.activePunishment)) {

                this.props.setActivePunishmentDone(this.props.activePunishment._id);
                this.removeActivePunishmentFromAccepted();
            }

            this.props.onBoardLostFocus();
            console.log('Punishment completed!');

            /* 
                    TODO: odvojiti funkciju za ispis poruka preko ploce (done/failed/...)
            */

            setTimeout(() => {
                // prikaz poruke na odredeno vrijeme, pa zatim prebacivanje na sljedecu kaznu i mjenjanje board focusa u state storu-u


                this.props.setActivePunishment(this.props.acceptedPunishments[0])
            }, 5000)
        };

        this.removeActivePunishmentFromAccepted = () => {
            let filteredAccPunishments = this.props.acceptedPunishments.filter((punishment) => {
                return punishment._id === this.props.activePunishment._id ? null : JSON.parse(JSON.stringify(punishment));
            });
            this.props.updateAcceptedPunishments(filteredAccPunishments);
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
                    else transformedBoardText = boardText + (UPPERCASE ? key.toUpperCase() : key);
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
            //this.clearStartingSentence();
            this.props.updateBoardValue('');

            const write = (i) => {
                if (this.punishmentExplanation.length <= i) {
                    this.activeWriteTimeout = setTimeout(() => {
                        this.addToStartingSentence(this.clickToStartMessage);
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
            let progress = Math.floor((boardText.length / ((punishment.length * howManyTimes) - 1)) * 100);
            if (progress > 100) return 100;
            else if (progress < 0) return 0;
            else return progress;
        };

        this.handleBeforeunload = () => {
            if (!specialOrRandomPunishmentIsActive(this.props.activePunishment)) this.props.logPunishmentTry(this.props.activePunishment._id, this.props.timeSpent);
        };

        // this.loadRandomPunishment = this.loadRandomPunishment.bind(this);

        this.activePunishmentChanged = () => { // potrebno loggirat kaznu

            if (this.props.gameInProgress && !specialOrRandomPunishmentIsActive(this.props.activePunishment)) { // ako je kazna bila u tijeku (i nije specijalna kazna), logiraj ju

                this.props.logPunishmentTry(this.props.activePunishment._id, this.props.timeSpent);
            }
            // init nove aktivne kazne
            this.newPunishmentInit();
        };

        this.newPunishmentInit = () => {

            if (this.activeWriteTimeout) clearTimeout(this.activeWriteTimeout);

            // incijalni setup
            this.punishment = UPPERCASE ? this.props.activePunishment.what_to_write.toUpperCase() : this.props.activePunishment.what_to_write;
            this.punishmentId = this.props.activePunishment._id;
            this.howManyTimes = this.props.activePunishment.how_many_times;
            this.punishmentExplanation = "Write " + this.howManyTimes + "x \"" +
                (this.punishment[this.punishment.length - 1] === ' ' ?
                    this.punishment.substring(0, this.punishment.length - 1) : this.punishment) +
                "\". ";
            this.clearStartingSentence();
            this._wrongCharPlace = null;
            this.props.boardDisabledStatus(true);
            this.writeStartingSentance();
        };
    }
    componentDidMount() {
        window.addEventListener("beforeunload", this.handleBeforeunload);
        this.startingSentence = '';
    }

    componentDidUpdate(prevProps) {
        if (Object.keys(this.props.activePunishment).length &&
            (this.props.activePunishment._id !== prevProps.activePunishment._id)) { // postavljena nova kazna

            this.activePunishmentChanged();
        }
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

function specialOrRandomPunishmentIsActive(punishment) { // specijalne kazne nemaju created property
    return punishment.created ? false : true;
}