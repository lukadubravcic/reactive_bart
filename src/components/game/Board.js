import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

import ProgressBar from './ProgressBar';

import cheatingCheck from '../../helpers/cheatingCheck';
import { API_ROOT } from '../../constants/constants';

const UPPERCASE = false;

const mapStateToProps = state => ({
    ...state.game,
    acceptedPunishments: state.punishment.acceptedPunishments,
    currentUser: state.common.currentUser,
    guestUserId: state.auth.userIdFromURL,
    token: state.common.token,
    showSetNewPasswordComponent: state.auth.showSetNewPasswordComponent,
    specialPunishments: state.punishment.specialPunishments,
    randomPunishments: state.punishment.randomPunishments,
    showTooltips: state.prefs.show_tooltips,
    soundEnabled: state.prefs.sound
});

const mapDispatchToProps = dispatch => ({
    setStartingSentence: value => {
        dispatch({ type: 'STARTING_SENTANCE_CHANGED', value })
    },
    updateBoardValue: value => {
        dispatch({ type: 'UPDATE_BOARD_VALUE', value });
    },
    boardDisabledStatus: disabled => {
        dispatch({ type: 'TOGGLE_BOARD_DISABLED_STATUS', disabled });
    },
    wrongBoardEntryWarning: status => {
        dispatch({ type: 'BOARD_WRONG_ENTRY', mistake: status });
    },
    updatePunishmentProgress: updatedProgress => {
        dispatch({ type: 'UPDATE_PUNISHMENT_PROGRESS', updatedProgress });
    },
    setActivePunishment: punishment => {
        dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment });
    },
    setActivePunishmentDone: (id, timeSpent) => {
        agent.Punishment.done(id, timeSpent).then(payload => dispatch({ type: 'PUNISHMENT_MARKED_DONE', newRank: payload.rank }));
        dispatch({ type: 'PUNISHMENT_DONE', id });
    },
    setActivePunishmentGuestDone: (userId, punishmentId, timeSpent) => {
        agent.Punishment.guestDone(userId, punishmentId, timeSpent);
    },
    updateAcceptedPunishments: punishments => {
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
    onSpongeHover: () => {
        dispatch({ type: 'SPONGE_HOVER' });
    },
    onSpongeHoverOut: () => {
        dispatch({ type: 'SPONGE_HOVER_OUT' });
    },
    gameReset: () => {
        dispatch({ type: 'GAME_RESETED' });
    },
    logPunishmentTry: (id, timeSpent) => {
        agent.Punishment.logTry(id, timeSpent).then(() => { console.log('Try logged') });
        dispatch({ type: 'PUNISHMENT_TRY_LOGGED' });
    },
    logPunishmentGuestTry: (userId, punishmentId, timeSpent) => {
        agent.Punishment.guestLogTry(userId, punishmentId, timeSpent).then(() => { console.log('Try logged') });
    },
    cheatingDetected: () => {
        dispatch({ type: 'CHEATING_DETECTED' });
    }
});

class Board extends React.Component {

    constructor() {
        super();

        this.clickToStartMessage = 'Click to start!';

        this.audio = document.createElement('audio');
        this.audio.style.display = "none";
        this.audio.src = 'http://www.freesfx.co.uk/rx2/mp3s/6/18460_1464720565.mp3';

        this._wrongCharPlace = null;
        this.adblockDetected = false;
        this.cheatDetected = false;

        this.incorrectBoardEntry = () => {
            /*  if (!specialOrRandomPunishmentIsActive(this.props.activePunishment)) {
                 this.props.logPunishmentTry(this.props.activePunishment._id, this.props.timeSpent);
             } */
            this.props.onBoardLostFocus();
        }

        this.spongeHover = ev => {
            // igra u tijeku -> pokazi tooltip
            if (this.props.gameInProgress && this.props.showTooltips) {
                this.props.onSpongeHover();
            }
        }

        this.spongeHoverOut = ev => {
            if (this.props.spongeHovered) {
                this.props.onSpongeHoverOut();
            }
        }

        this.spongeClick = ev => {
            console.log('sponge click');
            // nema reseta ako je kazna obavljena
            if (this.props.progress < 100) {

                this._wrongCharPlace = null;

                if (!specialOrRandomPunishmentIsActive(this.props.activePunishment) && this.props.gameInProgress) {

                    if (this.props.guestPunishment !== null &&
                        Object.keys(this.props.guestPunishment).length &&
                        typeof this.props.guestPunishment.uid !== 'undefined' &&
                        this.props.guestPunishment.uid === this.props.activePunishment.uid) {

                        this.props.logPunishmentGuestTry(this.props.guestUserId, this.props.activePunishment.uid, this.props.timeSpent);

                    } else this.props.logPunishmentTry(this.props.activePunishment.uid, this.props.timeSpent);
                }

                this.punishmentInit();
            } else if (this.props.progress === 100) { // u slucaju kada je kazna izvrsena (100%) reset tipka ce postaviti random kaznu

                let randomPunishment = getRandomPunishment(this.props.randomPunishments);
                if (randomPunishment) this.props.setActivePunishment(randomPunishment);
            }
        };

        this.boardTextChange = ev => {
            ev.preventDefault();
            if (this.props.boardFocused) this.boardStateUpdate(ev.key);
        };

        this.boardFocused = ev => {
            ev.preventDefault();
            // this.trimClickToStartMessage();
            this.props.onBoardFocus();
        };

        this.trimClickToStartMessage = () => {

            if (this.props.startingSentence.includes(this.clickToStartMessage)) {

                this.props.setStartingSentence(this.props.startingSentence.substring(0, this.props.startingSentence.length - this.clickToStartMessage.length));
            }
        };

        this.boardLostFocus = ev => {
            ev.preventDefault();
            this.props.onBoardLostFocus();
        };

        this.boardHover = ev => {
            if (!this.props.gameInProgress && this.props.showTooltips) this.props.onBoardHover();
        };

        this.boardHoverOut = ev => {
            if (this.props.boardHovered) this.props.onBoardHoverOut();
        };

        this.activePunishmentDone = () => {

            this.props.onBoardLostFocus();

            if (specialOrRandomPunishmentIsActive(this.props.activePunishment)) {
                return;

            } else if (this.props.guestPunishment !== null && Object.keys(this.props.guestPunishment).length && this.props.guestPunishment.uid === this.props.activePunishment.uid) {
                this.props.setActivePunishmentGuestDone(this.props.guestUserId, this.props.activePunishment.uid, this.props.timeSpent);

            } else {
                this.props.setActivePunishmentDone(this.props.activePunishment.uid, this.props.timeSpent);
                this.removeActivePunishmentFromAccepted();
            }

            console.log('Punishment completed!');
        };

        this.removeActivePunishmentFromAccepted = () => {
            let filteredAccPunishments = this.props.acceptedPunishments.filter(punishment => {
                return punishment.uid === this.props.activePunishment.uid ? null : JSON.parse(JSON.stringify(punishment));
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
                        // greska
                        return false;

                    }
                }
            } else if (boardText.length === 0) {
                this.props.wrongBoardEntryWarning(false);
                this._wrongCharPlace = null;
            }

            if (this.props.soundEnabled) this.playTypeSound(char);

            return true;
        };

        this.playTypeSound = char => {
            if (char !== ' ' && (!this.audio.paused || this.audio.currentTime > 0)) {
                // playing
                this.audio.currentTime = 0;

            } else if (char !== ' ') {
                this.audio.play();
            }
        }

        this.boardStateUpdate = key => {
            let boardText = this.props.boardValue.slice();
            let transformedBoardText = '';
            let progress = 0;

            if (cheatingCheck()) {
                // set special pun
                this.cheatDetected = true;
                this.props.cheatingDetected();
            };

            if (inArray(key, validKeys) && this._wrongCharPlace === null && this.props.progress < 100) {

                if (key === ' ' && boardText[boardText.length - 1] === ' ') return;
                else transformedBoardText = boardText + (UPPERCASE ? key.toUpperCase() : key);

                if (!this.validateKey(key, transformedBoardText)) {
                    this.incorrectBoardEntry();
                    return;
                }
                this.props.updateBoardValue(transformedBoardText);
                progress = this.updateProgress(transformedBoardText, this.punishment, this.howManyTimes);
                if (progress === 100) {
                    // punishment DONE
                    this.activePunishmentDone();
                }
            }
        };

        this.updateProgress = (transformedBoardText, punishment, howManyTimes) => {

            // specijalni adblocker slucaj gdje nije moguce odraditi kaznu
            if (this.adblockDetected || this.cheatDetected) {
                return 0;

            } else if (this._wrongCharPlace === null) {
                let updatedProgress = this.calculateProgress(transformedBoardText, punishment, howManyTimes);
                this.props.updatePunishmentProgress(updatedProgress);
                return updatedProgress;
            }
        };

        // rekurzivno ispisvanje pocetne recenice i dodavanje vec napisanih znakova (ako ih ima)
        this.writeStartingSentence = () => {

            const write = i => {

                if (this.punishmentExplanation.length <= i && !this.props.showSetNewPasswordComponent) {
                    this.activeWriteTimeout = setTimeout(() => {
                        //this.props.setStartingSentence(this.props.startingSentence + this.clickToStartMessage);
                        this.props.boardDisabledStatus(false);
                    }, 100);
                    return;
                }
                i === 0 ? this.props.setStartingSentence(this.punishmentExplanation[i])
                    : this.props.setStartingSentence(this.props.startingSentence + this.punishmentExplanation[i]);
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

            const xhttp = new XMLHttpRequest();

            if (!specialOrRandomPunishmentIsActive(this.props.activePunishment) && this.props.gameInProgress) {

                if (this.props.guestPunishment !== null &&
                    Object.keys(this.props.guestPunishment).length &&
                    typeof this.props.guestPunishment.uid !== 'undefined' &&
                    this.props.guestPunishment.uid === this.props.activePunishment.uid) {

                    xhttp.open("POST", `${API_ROOT}/punishment/guestLog`, false);
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.send(`userId=${this.props.guestUserId}&punishmentId=${this.props.activePunishment.uid}&timeSpent=${this.props.timeSpent}`);
                    xhttp.send();

                    //this.props.logPunishmentGuestTry(this.props.guestUserId, this.props.activePunishment._id, this.props.timeSpent);

                } else {

                    /* xhttp.open("POST", `${API_ROOT}/punishment/log`, false);
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.send(`id=${this.props.activePunishment._id}&timeSpent=${this.props.timeSpent}`);
                    xhttp.send(); */

                    this.props.logPunishmentTry(this.props.activePunishment.uid, this.props.timeSpent);
                }
            }
        };

        this.activePunishmentChanged = () => {
            // init nove aktivne kazne           
            this.punishmentInit();
        };

        this.punishmentInit = () => {

            if (this.activeWriteTimeout) clearTimeout(this.activeWriteTimeout);
            // incijalni setup
            this.props.gameReset();
            this.punishment = UPPERCASE ? this.props.activePunishment.what_to_write.toUpperCase() : this.props.activePunishment.what_to_write;
            this.punishmentId = this.props.activePunishment.uid;
            this.howManyTimes = this.props.activePunishment.how_many_times === 0 ? 'Gazzilion' : this.props.activePunishment.how_many_times;

            this.punishmentExplanation = `Write ${this.howManyTimes}${(this.adblockDetected || this.cheatDetected ? ' times "' : 'x "')}${(this.punishment[this.punishment.length - 1] === ' ' ? this.punishment.substring(0, this.punishment.length - 1) : this.punishment)}": `;

            this._wrongCharPlace = null;
            this.props.boardDisabledStatus(true);
            this.writeStartingSentence();
        };
    }

    componentDidMount() {
        // special snowflake - zahtjeva sinkroni ajax request, te radi browser supporta, mora biti i beforeunload i onunload
        // window.onunload = window.onbeforeunload
        window.addEventListener("beforeunload", this.handleBeforeunload);
    }

    componentDidUpdate(prevProps) {

        if (Object.keys(this.props.activePunishment).length && (this.props.activePunishment.uid !== prevProps.activePunishment.uid)
            || Object.keys(this.props.activePunishment).length && (this.props.activePunishment.uid === prevProps.activePunishment.uid) && (prevProps.activePunishment.what_to_write !== this.props.activePunishment.what_to_write)) { // postavljena nova kazna
            // console.log('%cTRUE', 'background: yellow; color: green')

            if (prevProps.gameInProgress && !specialOrRandomPunishmentIsActive(prevProps.activePunishment)) { // ako je trenutna kazna bila u tijeku (i nije specijalna kazna), logiraj ju

                this.props.logPunishmentTry(prevProps.activePunishment.uid, prevProps.timeSpent);
            }
            // specijalni slucaj detektiranja adblocker-a
            if (specialOrRandomPunishmentIsActive(this.props.activePunishment) && this.props.activePunishment.type === 'ADBLOCKER_DETECTED') {
                this.adblockDetected = true;
            }

            this.activePunishmentChanged();
        } // else console.log('%cfalse', 'color: red')
    }

    componentWillUnmount() {
        if (this.activeWriteTimeout) clearTimeout(this.activeWriteTimeout);
    }

    render() {

        const activePunishmentSet = Object.keys(this.props.activePunishment).length > 0;

        const startingSentence = this.props.startingSentence;
        const boardText = this.props.boardValue;
        const progress = this.props.progress;
        const boardTextMistake = this.props.boardTextMistake;
        const bcgColor = boardTextMistake ? '#f2cbcb' : progress === 100 ? '#80f957' : '';

        let style = {
            backgroundColor: bcgColor,
            height: "400px",
            width: "100%"
        };

        const blurFilter = {
            "-webkit-filter": "blur(1.5px)",
            "-moz-filter": "blur(1.5px)",
            "-o-filter": "blur(1.5px)",
            "-ms-filter": "blur(1.5px)",
            "filter": "blur(1.5px)",
        };

        style = boardTextMistake ? { ...style, ...blurFilter } : style;
        style = progress === 100 ? { ...style, ...blurFilter } : style;

        const boardTooltipStyle = {
            "position": 'absolute',
            "width": "100px",
            "top": "200px",
            "left": "50px",
            backgroundColor: "#d8d8d8",
            border: "0.5px solid red"
        }

        if (activePunishmentSet) {
            return (
                <div className="container">
                    <div style={{ width: "1024px", position: "relative" }}>
                        <textarea id="writing-board"
                            style={{
                                ...style,
                                ...this.doneClass
                            }}
                            value={startingSentence + boardText}
                            disabled={this.props.boardDisabled}
                            onKeyDown={this.boardTextChange}
                            onFocus={this.boardFocused}
                            onBlur={this.boardLostFocus}
                            onMouseOver={this.boardHover}
                            onMouseOut={this.boardHoverOut}
                            spellCheck="false"
                        />
                        {boardTextMistake ? (
                            <div style={{
                                "position": 'absolute',
                                "top": 0,
                                "height": "400px",
                                "width": "100%"
                            }}>
                                <h1>FAILED</h1>
                            </div>
                        ) : null}
                        {progress === 100 ? (
                            <div style={{
                                "position": 'absolute',
                                "top": 0,
                                "height": "400px",
                                "width": "100%"
                            }}>
                                <h1>DONE</h1>
                            </div>
                        ) : null}
                        {this.props.boardHovered ? <div style={boardTooltipStyle}><h3>Click to start</h3></div> : null}

                        <ProgressBar progress={progress} spongeClick={this.spongeClick} onHover={this.spongeHover} onHoverOut={this.spongeHoverOut} hovering={this.props.spongeHovered} />
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

function specialOrRandomPunishmentIsActive(punishment) { // specijalne kazne nemaju created property
    return punishment.created ? false : true;
}

function getRandomPunishment(randomPunishments) {

    if (randomPunishments.length === 0) return null;

    let index = Math.floor(Math.random() * randomPunishments.length); 

    if (index > randomPunishments.length - 1) return randomPunishments[0];
    else return randomPunishments[index];    
}