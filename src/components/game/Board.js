import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

import ProgressBar from './ProgressBar';
import CompletedStamp from './CompletedStamp';
import FailedStamp from './FailedStamp';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

import cheatingCheck from '../../helpers/cheatingCheck';
import keysound from '../../helpers///keysound';
import { API_ROOT } from '../../constants/constants';

const UPPERCASE = false; // uppercase flag - kontrolira ako se kazna ispisuje u uppercase-u te da igra zanemaruje case slova (tretira ih isto)

const mapStateToProps = state => ({
    ...state.game,
    acceptedPunishments: state.punishment.acceptedPunishments,
    pastPunishments: state.punishment.pastPunishments,
    currentUser: state.common.currentUser,
    guestUser: state.common.guestUser,
    guestUserId: state.auth.userIdFromURL,
    token: state.common.token,
    showSetNewPasswordComponent: state.auth.showSetNewPasswordComponent,
    specialPunishments: state.punishment.specialPunishments,
    randomPunishments: state.punishment.randomPunishments,
    showTooltips: state.prefs.show_tooltips,
    soundEnabled: state.prefs.sound,
    firstTimePlaying: state.punishment.firstTimePlaying,
});

const mapDispatchToProps = dispatch => ({
    startingSentenceWritingStarted: () => {
        dispatch({ type: 'START_SENTENCE_WRITING_START' });
    },
    startingSentenceWritingFinished: () => {
        dispatch({ type: 'START_SENTENCE_WRITING_FINISHED' });
    },
    setStartingSentence: stringArray => {
        dispatch({ type: 'STARTING_SENTANCE_CHANGED', stringArray });
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
        agent.Punishment.done(id, timeSpent).then(payload => {
            if (typeof payload !== 'undefined' && payload !== null && typeof payload.rank !== 'undefined' && payload.rank !== null) {
                dispatch({ type: 'PUNISHMENT_MARKED_DONE', newRank: payload.rank });
            }
        });
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
    logPunishmentTry: (id, timeSpent, typedCharsNum = 0) => {
        agent.Punishment.logTry(id, timeSpent, typedCharsNum);
        dispatch({ type: 'PUNISHMENT_TRY_LOGGED' });
    },
    logPunishmentGuestTry: (userId, punishmentId, timeSpent, typedCharsNum = 0) => {
        agent.Punishment.guestLogTry(userId, punishmentId, timeSpent, typedCharsNum).then(() => { console.log('Try logged') });
    },
    cheatingDetected: () => {
        dispatch({ type: 'CHEATING_DETECTED' });
    },
    updatePastPunishments: newPastPunishments => {
        dispatch({ type: 'PAST_PUNISHMENTS_CHANGED', punishments: newPastPunishments });
    },
    updateUserHasTriedPunishments: boolean => {
        dispatch({ type: 'UPDATE_USER_HAS_TRIED_PLAYING_BEFORE', value: boolean });
    },
    removeToS: () => dispatch({ type: 'REMOVE_TERMS_OF_SERVICE' }),
    removePrivacyPolicy: () => dispatch({ type: 'REMOVE_PRIVACY_POLICY' }),
    displayPrivacyPolicy: () => dispatch({ type: 'SHOW_PRIVACY_POLICY' }),
    randomPunishmentDone: (randomPunId, timeSpent) => {
        agent.Punishment.randomPunDone(randomPunId, timeSpent);
    },
    randomPunishmentTry: (randomPunId, timeSpent, textLen) => {
        agent.Punishment.randomPunTry(randomPunId, timeSpent);
    },
});

class Board extends React.Component {

    constructor() {
        super();

        keysound.initSound();

        this.cheatingCheck = new cheatingCheck();
        this._wrongCharPlace = null;
        this.adblockDetected = false;
        this.cheatDetected = false;
        this.textBoard = null;
        this.lastPunishmentPlayedId = null;

        this.cursorTimeout = null;
        this.elementKreda = null;

        this.state = {
            boardCursor: false,
            showBoardCursor: false,
            screw1: true,
            screw2: true,
            screw3: true,
            screw4: true,
            showBoard: true,
        }

        this.reactToEnterKey = e => {
            if (
                e.key === 'Enter'
                && this.props.boardTextMistake
            ) {
                this.cheatingCheck.clearData();
                this.punishmentInit(false);
                this.boardFocused(); // kreni sa igrom (fokusiranje boarda -> moze se poceti pisati)
                requestAnimationFrame(() => this.textBoard.focus());
            }
        }


        this.listenOnKey = () => {
            document.addEventListener("keydown", this.reactToEnterKey, false);
        }

        this.usersFirstPunishment = (currentUser, activePunishment, pastPunishments) => {
            // nakon odigrane kazne (fail/completed) pregledaj past i accepted kazne ako je "nesto" već odigrano
            // provjera jel postoji vec zavrsena (past kazne)
            let firstTimePlaying = true;
            // if (specialOrRandomPunishmentIsActive(activePunishment)) return false;
            if (Object.keys(currentUser).length) {
                for (let pastPunishment of pastPunishments) {
                    if (pastPunishment.tries > 0) firstTimePlaying = false;
                }
            } else if (this.props.guestUser !== null && Object.keys(this.props.guestUser).length) {
                if (this.props.guestUser.userHasTriedPunishments) firstTimePlaying = false;
            }
            return this.props.updateUserHasTriedPunishments(firstTimePlaying);
        }

        this.incorrectBoardEntry = () => {
            this.props.onBoardLostFocus();
            keysound.playChalkDownAudio();
            setTimeout(() => {
                this.elementKreda.style.opacity = 1;
            }, 200);
        }

        this.spongeHover = ev => {
            // igra u tijeku -> pokazi tooltip
            if (this.props.gameInProgress && this.props.showTooltips || this.props.showToS || this.props.showPrivacyPolicy) {
                this.props.onSpongeHover();
            }
        }

        this.spongeHoverOut = ev => {
            if (this.props.spongeHovered) {
                this.props.onSpongeHoverOut();
            }
        }
        // restart kazne
        this.spongeClick = ev => {
            // nema reseta ako je kazna obavljena
            if (this.props.showToS) {
                // ako je prikazan toa -> klik na spuzvu vraca na igru
                this.props.removeToS();
                return this.punishmentInit();
            } else if (this.props.showPrivacyPolicy) {
                this.props.removePrivacyPolicy();
                return this.punishmentInit();
            }

            this.elementKreda.style.opacity = 1;

            if (this.props.progress < 100) {
                this._wrongCharPlace = null;
                this.punishmentInit(false);
                this.boardFocused(); // kreni sa igrom (fokusiranje boarda -> moze se poceti pisati)
                requestAnimationFrame(() => this.textBoard.focus());

            } else if (this.props.progress === 100) { // u slucaju kada je kazna izvrsena (100%) reset tipka ce postaviti random kaznu
                let randomPunishment = getRandomPunishment(this.props.randomPunishments);
                if (randomPunishment) this.props.setActivePunishment(randomPunishment);
            }
            keysound.resetAudio();
        };

        this.boardTextChange = ev => {
            ev.preventDefault();
            if (this.props.boardFocused) this.boardStateUpdate(ev.key);
        };

        this.boardFocused = ev => {
            if (this.props.progress === 100 || this.props.boardTextMistake || !this.state.showBoard) return;
            this.elementKreda.style.opacity = 0;
            this.cheatingCheck.start();
            ev && ev.preventDefault();
            this.props.onBoardFocus();
            this.stopBoardCursorToggling();
            this.boardCursorToggle();
        };

        this.boardLostFocus = ev => {
            ev.preventDefault();
            this.stopBoardCursorToggling();
            this.props.onBoardLostFocus();
            this.cheatingCheck.stop();
        };

        this.boardHover = ev => {
            if (!this.props.gameInProgress && this.props.showTooltips) this.props.onBoardHover();
        };

        this.boardHoverOut = ev => {
            if (this.props.boardHovered) this.props.onBoardHoverOut();
        };

        this.activePunishmentDone = () => {
            this.props.onBoardLostFocus();
            keysound.playChalkDownAudio();
            setTimeout(() => {
                this.elementKreda.style.opacity = 1;
            }, 200);
            // cekaj na potencijalni enter
            if (
                specialOrRandomPunishmentIsActive(this.props.activePunishment)
                && typeof this.props.currentUser !== 'undefined'
                && this.props.currentUser !== null
                && Object.keys(this.props.currentUser).length > 0
                && typeof this.props.activePunishment.type === 'undefined'
            ) {
                this.props.randomPunishmentDone(this.props.activePunishment.uid, this.props.timeSpent);
            } else if (
                this.props.guestPunishment !== null
                && Object.keys(this.props.guestPunishment).length
                && this.props.guestPunishment.uid === this.props.activePunishment.uid
            ) {
                this.props.setActivePunishmentGuestDone(this.props.guestUserId, this.props.activePunishment.uid, this.props.timeSpent);
            } else if (
                !specialOrRandomPunishmentIsActive(this.props.activePunishment)
                && Object.keys(this.props.currentUser).length > 0
            ) {
                this.props.setActivePunishmentDone(this.props.activePunishment.uid, this.props.timeSpent);

                if (this.props.activePunishment.fk_user_email_taking_punishment === null) return;

                this.updatePastPunishments(this.props.activePunishment);
                this.removeActivePunishmentFromAccepted();
            }
        };

        this.updatePastPunishments = newPunishment => {
            if (!newPunishment) return null;
            let newPastPunishments = JSON.parse(JSON.stringify(this.props.pastPunishments))
            newPunishment.done = new Date().toISOString().slice(0, 19);
            newPastPunishments.unshift(newPunishment)
            this.props.updatePastPunishments(newPastPunishments);
        }

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
                        this.cheatingCheck.clearData();
                        // greska
                        return false;
                    }
                }
            } else if (boardText.length === 0) {
                this.props.wrongBoardEntryWarning(false);
                this._wrongCharPlace = null;
            }

            if (this.props.soundEnabled) {
                keysound.onKeyPress();
            }
            return true;
        };

        this.boardStateUpdate = key => {
            if (!this.props.boardFocused) return;

            let boardText = this.props.boardValue.slice();
            let transformedBoardText = '';
            let progress = 0;

            if (inArray(key, validKeys) && this._wrongCharPlace === null && this.props.progress < 100) {

                if (!this.cheatDetected && this.cheatingCheck.onKeyPress(key)) {
                    // set special pun
                    this.cheatDetected = true;
                    this.props.cheatingDetected();
                    this.props.onBoardLostFocus();
                };

                if (key === ' ' && boardText[boardText.length - 1] === ' ') return;
                else transformedBoardText = boardText + (UPPERCASE ? key.toUpperCase() : key);

                if (!this.validateKey(key, transformedBoardText)) {
                    this.props.updateBoardValue(transformedBoardText)
                    this.incorrectBoardEntry();

                    this.logTry();
                    return;
                }

                this.props.updateBoardValue(transformedBoardText);
                if (this.textBoard) {
                    this.textBoard.scrollTo(0, this.textBoard.scrollHeight);
                }
                progress = this.updateProgress(transformedBoardText, this.punishment, this.howManyTimes);
                if (progress === 100) {
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
                    xhttp.send(`userId=${this.props.guestUserId}&punishmentId=${this.props.activePunishment.uid}&timeSpent=${this.props.timeSpent}&typedCharsNum=${this.props.boardValue.length}`);
                    xhttp.send();

                } else {
                    this.props.logPunishmentTry(this.props.activePunishment.uid, this.props.timeSpent, this.props.boardValue.length - 1);
                }
            }
        };

        this.activePunishmentChanged = () => {
            // init nove aktivne kazne           
            this.punishmentInit();
        };

        // rekurzivno ispisvanje pocetne recenice i dodavanje vec napisanih znakova (ako ih ima)
        this.writeStartingSentence = (textArray = []) => {

            let sentenceString = ['', ''];

            const ghostWrite = (textArray, i = 0, j = 0) => {

                let lastElementHit = textArray.length <= j;
                let randomTypeTime = Math.floor(Math.random() * 150) + 20;

                if (lastElementHit) {
                    this.activeWriteTimeout = clearTimeout(this.activeWriteTimeout);
                    this.props.startingSentenceWritingFinished();
                    this.props.boardDisabledStatus(false);

                    return;
                }

                let counterHitsLastChar = textArray[j].length <= i;

                if (counterHitsLastChar) {
                    j++;
                    i = 0;
                } else {
                    sentenceString[j] += textArray[j][i];
                    this.props.setStartingSentence(sentenceString);
                    i++;
                }

                this.activeWriteTimeout = setTimeout(() => {
                    ghostWrite(textArray, i, j);
                }, randomTypeTime);
            }

            ghostWrite(textArray, 0, 0);
        };

        this.punishmentInit = (punishmentChanged = true) => {
            //keysound.resetAudio();
            this.stopBoardCursorToggling();
            // if (this.props.firstTimePlaying === true && !specialOrRandomPunishmentIsActive(this.props.activePunishment)) this.props.updateUserHasTriedPunishments(false);
            if (this.activeWriteTimeout) clearTimeout(this.activeWriteTimeout);
            // incijalni setup
            this.props.gameReset();
            this.punishment = UPPERCASE ? this.props.activePunishment.what_to_write.toUpperCase() : this.props.activePunishment.what_to_write;
            if (this.punishment[this.punishment.length - 1] !== ' ') this.punishment = this.punishment + ' ';
            this.punishmentId = this.props.activePunishment.uid;
            this.howManyTimes = this.props.activePunishment.how_many_times === 0 ? 'gazillion' : this.props.activePunishment.how_many_times;

            let punishmentExplanation = [
                `Write ${this.howManyTimes}${(this.adblockDetected ? ' times ' : 'x ')}`,
                `${this.punishment}`
            ];

            this._wrongCharPlace = null;
            this.props.boardDisabledStatus(true);
            this.props.startingSentenceWritingStarted();

            if (punishmentChanged === false) {
                this.props.setStartingSentence(punishmentExplanation);
                this.props.startingSentenceWritingFinished();
            } else {
                this.writeStartingSentence(punishmentExplanation);
            }
        };

        this.stopBoardCursorToggling = () => {
            clearInterval(this.cursorInterval);
            this.setState({ boardCursor: false });
        };

        this.boardCursorToggle = () => {
            const toggleIntervalTime = 500;
            this.cursorInterval = setInterval(() => {
                this.setState({ boardCursor: !this.state.boardCursor });
            }, toggleIntervalTime);
        };

        this.screwClick = ev => {
            ev.preventDefault();
            let targetScrew = null;
            let stateCopy = { ...this.state };

            switch (ev.currentTarget.id) {
                case 'btn-board-screw-01':
                    targetScrew = 'screw1'
                    break;
                case 'btn-board-screw-02':
                    targetScrew = 'screw2';
                    break;
                case 'btn-board-screw-03':
                    targetScrew = 'screw3';
                    break;
                case 'btn-board-screw-04':
                    targetScrew = 'screw4';
                    break;
                default:
                    break;
            }

            if (targetScrew) this.setState({ [targetScrew]: false });
            stateCopy[targetScrew] = false;
            if (stateCopy.screw1 === false
                && stateCopy.screw2 === false
                && stateCopy.screw3 === false
                && stateCopy.screw4 === false
            ) {
                this.setState({ showBoard: false });
            }

            return;
        }

        this.preloadStampImages = () => {
            // hacky preload rjesenje - loadaj sve slike koje koriste stamp komponente u cache,
            // te kad ih te komponente budu zahtjevale, slike se vade iz cache-a 
            this.completedStampImg = new Image();
            this.completedStampImg.src = 'board-completed-stamp.png';
            this.failedStampImg = new Image();
            this.failedStampImg.src = 'board-failed-stamp.png';
            this.completedSocialImg = new Image();
            this.completedSocialImg.src = 'board-completed-social.png';
            this.failedSocialImg = new Image();
            this.failedSocialImg.src = 'board-failed-social.png';
        };

        this.logTry = () => {
            if (
                typeof this.props.currentUser !== 'undefined'
                && this.props.currentUser !== null
                && Object.keys(this.props.currentUser).length
                && this.props.boardValue.length > 0
            ) {
                if (
                    specialOrRandomPunishmentIsActive(this.props.activePunishment)
                    && typeof this.props.activePunishment.type === 'undefined'
                ) {
                    return this.props.randomPunishmentTry(this.props.activePunishment.uid, this.props.boardValue.length);
                } else if (!specialOrRandomPunishmentIsActive(this.props.activePunishment)) {
                    return this.props.logPunishmentTry(this.props.activePunishment.uid, this.props.timeSpent, this.props.boardValue.length);
                }
            } else if ( // guest user
                this.props.guestPunishment !== null
                && Object.keys(this.props.guestPunishment).length
                && typeof this.props.guestPunishment.uid !== 'undefined'
                && this.props.guestPunishment.uid === this.props.activePunishment.uid
                && this.props.boardValue.length > 0
            ) {
                return this.props.logPunishmentGuestTry(this.props.guestUserId, this.props.activePunishment.uid, this.props.timeSpent, this.props.boardValue.length);
            }
        }
    }

    componentDidMount() {
        // special snowflake - zahtjeva sinkroni ajax request
        window.addEventListener("beforeunload", this.handleBeforeunload);
        window.addEventListener('keydown', function (e) {
            if (e.keyCode == 32 && e.target == document.body) {
                e.preventDefault();
            }
        });
        this.listenOnKey();
        this.preloadStampImages();
    }

    componentDidUpdate(prevProps) {

        if (prevProps.gameInProgress === true && this.props.gameInProgress === false) {
            if (this.elementKreda) this.elementKreda.style.opacity = 1;
        }

        if ((Object.keys(this.props.activePunishment).length
            && (this.props.activePunishment.uid !== prevProps.activePunishment.uid))
            || (Object.keys(this.props.activePunishment).length
                && (this.props.activePunishment.uid === prevProps.activePunishment.uid)
                && (prevProps.activePunishment.what_to_write !== this.props.activePunishment.what_to_write))) { // postavljena nova kazna
            // ako je trenutna kazna bila u tijeku, logiraj ju
            if (specialOrRandomPunishmentIsActive(prevProps.activePunishment)
                && prevProps.gameInProgress
                && prevProps.boardValue.length > 0
                && prevProps.progress !== 100
                && typeof this.props.currentUser !== 'undefined'
                && this.props.currentUser !== null
                && Object.keys(this.props.currentUser).length > 0
                && typeof prevProps.activePunishment.type === 'undefined'
            ) {
                this.props.randomPunishmentTry(prevProps.activePunishment.uid, prevProps.boardValue.length);
            } else if (
                prevProps.gameInProgress
                && prevProps.boardValue.length > 0
                && prevProps.progress !== 100
                && !specialOrRandomPunishmentIsActive(prevProps.activePunishment)
            ) {
                if (
                    prevProps.guestPunishment !== null
                    && Object.keys(prevProps.guestPunishment).length
                    && typeof prevProps.guestPunishment.uid !== 'undefined'
                    && prevProps.guestPunishment.uid === prevProps.activePunishment.uid
                ) {
                    this.props.logPunishmentGuestTry(prevProps.guestUserId, prevProps.activePunishment.uid, prevProps.timeSpent, prevProps.boardValue.length);
                } else {
                    this.props.logPunishmentTry(prevProps.activePunishment.uid, prevProps.timeSpent, prevProps.boardValue.length);
                }
            }
            // specijalni slucaj detektiranja adblocker-a
            if (specialOrRandomPunishmentIsActive(this.props.activePunishment) && this.props.activePunishment.type === 'ADBLOCKER_DETECTED') {
                this.adblockDetected = true;
            }
            if (this.props.firstTimePlaying === true && !specialOrRandomPunishmentIsActive(prevProps.activePunishment)) this.props.updateUserHasTriedPunishments(false);
            else if (this.props.firstTimePlaying === null) this.usersFirstPunishment(this.props.currentUser, this.props.activePunishment, this.props.pastPunishments);

            this.stopBoardCursorToggling();
            this.activePunishmentChanged();
        }
    }

    componentWillUnmount() {
        if (this.activeWriteTimeout) clearTimeout(this.activeWriteTimeout);
        if (this.cursorInterval) clearTimeout(this.cursorInterval);
    }

    render() {
        const activePunishmentSet = Object.keys(this.props.activePunishment).length > 0;
        const startingSentenceFirstPart = this.props.startingSentenceFirstPart;
        const startingSentenceSecondPart = this.props.startingSentenceSecondPart;
        const boardText = this.props.boardValue;
        const progress = this.props.progress;
        const isPunishmentFailed = this.props.boardTextMistake;
        const makeFocusable = this.props.startSentenceBeingWritten || isPunishmentFailed || progress === 100 ? {} : { tabIndex: "1" };
        const showTextCursor = this.props.gameInProgress && this.props.boardFocused;
        const isUserLoggedIn = !!Object.keys(this.props.currentUser).length;

        if (activePunishmentSet) {

            return (

                <div id="board-writing-board-component">
                    <div
                        style={this.state.showBoard ? {} : { opacity: 0 }}
                        id="board-frame"
                        className="opacity-tran"
                        onMouseOver={!this.props.showToS && !this.props.showPrivacyPolicy && this.boardHover}
                        onMouseOut={!this.props.showToS && !this.props.showPrivacyPolicy && this.boardHoverOut}>

                        {this.state.screw1
                            ? <button
                                id="btn-board-screw-01"
                                className="btn-board-screw"
                                onClick={this.screwClick}>
                                {boardScrewSVG}
                            </button>
                            : null}
                        {this.state.screw2
                            ? <button
                                id="btn-board-screw-02"
                                className="btn-board-screw"
                                onClick={this.screwClick}>
                                {boardScrewSVG}

                            </button>
                            : null}
                        {this.state.screw3
                            ? <button
                                id="btn-board-screw-03"
                                className="btn-board-screw"
                                onClick={this.screwClick}>
                                {boardScrewSVG}
                            </button>
                            : null}
                        {this.state.screw4
                            ? <button
                                id="btn-board-screw-04"
                                className="btn-board-screw"
                                onClick={this.screwClick}>
                                {boardScrewSVG}
                            </button>
                            : null}
                        <div id="drawing-board">

                            {this.props.showToS ?
                                <TermsOfService displayPrivacyPolicy={this.props.displayPrivacyPolicy} />
                                : this.props.showPrivacyPolicy ?
                                    <PrivacyPolicy />
                                    : <div
                                        ref={elem => this.textBoard = elem}
                                        id="board-textarea"
                                        className="noselect"
                                        {...makeFocusable}
                                        disabled={this.props.boardDisabled || !this.state.showBoard}
                                        onKeyDown={this.boardTextChange}
                                        onFocus={this.boardFocused}
                                        onBlur={this.boardLostFocus}>

                                        {startingSentenceFirstPart}
                                        <span style={{ color: '#FFD75F' }}>{startingSentenceSecondPart}</span>
                                        {boardText}
                                        <wbr />
                                        {showTextCursor ? <span style={this.state.boardCursor ? { opacity: 1 } : { opacity: 0 }}>|</span> : null}
                                    </div>
                            }

                            {progress === 100 && !this.props.showToS && !this.props.showPrivacyPolicy ? <CompletedStamp punishment={this.props.activePunishment} /> : null}
                            {isPunishmentFailed && !this.props.showToS && !this.props.showPrivacyPolicy ? <FailedStamp punishment={this.props.activePunishment} /> : null}

                            {!this.props.gameInProgress && this.props.startSentenceBeingWritten === false ? // prikazi click to start poruku kada igra nije jos pocela i dok se ne ispisuje "zadatak"
                                <div
                                    id="click-to-start-element"
                                    className="hover-dialog" >

                                    <label className="hover-dialog-text noselect">
                                        CLICK
                                        <br /> TO START
                                    </label>

                                    <div className="triangle-hover-box-container">

                                        <svg id="triangle-element" width="23px" height="14px" viewBox="0 0 23 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-528.000000, -981.000000)">
                                                <g id="Fill-2-+-LOG-IN-+-Triangle-4-Copy" transform="translate(456.000000, 916.000000)" fill="#323232">
                                                    <polygon id="Triangle-4-Copy" transform="translate(83.500000, 72.000000) scale(1, -1) translate(-83.500000, -72.000000) "
                                                        points="83.5 65 95 79 72 79"></polygon>
                                                </g>
                                            </g>
                                        </svg>

                                    </div>

                                </div> : null}

                        </div>

                        <div
                            id="chalk-container">

                            <ProgressBar
                                showToS={this.props.showToS || this.props.showPrivacyPolicy}
                                progress={progress}
                                spongeClick={this.spongeClick}
                                onHover={this.spongeHover}
                                onHoverOut={this.spongeHoverOut}
                                hovering={this.props.spongeHovered}
                                firstTimePlaying={isUserLoggedIn ? this.props.firstTimePlaying : true}
                                isPunishmentFailed={isPunishmentFailed}
                            />

                            <svg id="board-chalks" width="486px" height="22px" viewBox="0 0 486 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <g id="page-01" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-226.000000, -918.000000)">
                                    <g id="Ploca" transform="translate(0.000000, 150.000000)">
                                        <g id="krede-na-ploci" transform="translate(226.000000, 768.000000)">
                                            <polygon id="kreda" fill="#FEFEFE" points="0.34306 22 38.34306 22 38.34306 13 0.34306 13"></polygon>
                                            <polygon id="zuta-kreda" fill="#FFD75F" transform="translate(45.343060, 11.273000) rotate(20.000000) translate(-45.343060, -11.273000) "
                                                points="26.34306 15.7730005 64.34306 15.7730005 64.34306 6.77300048 26.34306 6.77300048"></polygon>
                                            <polygon className="opacity-tran-long" style={{ opacity: 1 }} ref={elem => this.elementKreda = elem} id="kreda_za_micanje" fill="#FEFEFE" points="448 22 486 22 486 13 448 13"></polygon>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>

                    </div>

                    <div
                        style={this.state.showBoard ? {} : { opacity: 0 }}
                        id="board-shelf"
                        className="opacity-tran"
                    ></div>

                </div>

            )
        } else {
            return (
                <div id="board-writing-board-component">
                    <div
                        id="board-frame">

                        <div id="drawing-board">
                            <div
                                id="board-textarea"
                                disabled={null}
                                onKeyDown={null}
                                onFocus={null}
                                onBlur={null}>
                            </div>

                        </div>

                        <div
                            id="chalk-container">

                            <div
                                id="sponge"
                                className="tran-all"
                            />

                            <svg id="board-chalks" width="486px" height="22px" viewBox="0 0 486 22" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <g id="page-01" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-226.000000, -918.000000)">
                                    <g id="Ploca" transform="translate(0.000000, 150.000000)">
                                        <g id="krede-na-ploci" transform="translate(226.000000, 768.000000)">
                                            <polygon id="kreda" fill="#FEFEFE" points="0.34306 22 38.34306 22 38.34306 13 0.34306 13"></polygon>
                                            <polygon id="zuta-kreda" fill="#FFD75F" transform="translate(45.343060, 11.273000) rotate(20.000000) translate(-45.343060, -11.273000) "
                                                points="26.34306 15.7730005 64.34306 15.7730005 64.34306 6.77300048 26.34306 6.77300048"></polygon>
                                            <polygon id="Fill-15" fill="#FEFEFE" points="448 22 486 22 486 13 448 13"></polygon>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>

                    </div>

                    <div id="board-shelf"></div>

                </div>
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


const boardScrewSVG = (
    <svg style={{ position: "absolute", top: "0", left: "0" }} width="7px" height="7px" viewBox="0 0 7 7" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <circle id="Oval-1" fill="#2B80B2" cx="3.5" cy="3.5" r="3.5"></circle>
        </g>
    </svg>
);