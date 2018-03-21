import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';

import Stopwatch from './Stopwatch';
import Clock from './Clock';

const mapStateToProps = state => ({
    ...state.game,
    timerValue: state.game.timerValue,
    activePunishment: state.game.activePunishment,
    gameInProgress: state.game.gameInProgress
});

const mapDispatchToProps = dispatch => ({
    updateTimerValue: (newTimerValue, timeSpent) => {
        dispatch({ type: 'TIMER_VALUE_UPDATED', newTimerValue, timeSpent });
    },
    setClockValue: newClockValue => {
        dispatch({ type: 'CLOCK_VALUE_UPDATED', newClockValue });
    },
})

class Timer extends React.Component {

    constructor() {
        super();

        this.startStopwatch = () => {
            if (!this.stopwatchInterval) {
                this.stopwatchInterval = setInterval(() => {
                    this.updateStopwatch();
                }, 1000);
            }
        };

        this.startClock = () => {
            if (!this.clockInterval) {
                this.updateClock();
                this.clockInterval = setInterval(() => {
                    this.updateClock();
                }, 1000);
            }
        };

        this.stopStopwatch = () => {

            if (this.stopwatchInterval) {
                clearInterval(this.stopwatchInterval);
                this.stopwatchInterval = null;
            }
        };

        this.stopClock = () => {
            if (this.clockInterval) {
                clearInterval(this.clockInterval);
                this.clockInterval = null;
            }
        };

        this.updateStopwatch = () => {
            let timeSpent = this.props.timeSpent + 1;

            let seconds = this.props.timerValue.timerSeconds;
            let minutes = this.props.timerValue.timerMinutes;
            let hours = this.props.timerValue.timerHours;

            seconds++;

            if (seconds === 60) {
                minutes++;
                if (minutes === 60) {
                    hours++;
                    minutes = 0;
                }
                seconds = 0;
            }
            this.props.updateTimerValue({
                timerHours: hours,
                timerMinutes: minutes,
                timerSeconds: seconds
            }, timeSpent);
        };

        this.updateClock = () => {
            let now = new Date();
            this.props.setClockValue({
                hours: now.getHours(),
                minutes: now.getMinutes(),
                seconds: now.getSeconds()
            });
        }
    }

    componentDidMount() {
        this.startClock();
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.boardFocused && nextProps.gameInProgress && !nextProps.boardTextMistake && nextProps.progress !== 100) {
            this.stopClock();
            this.startStopwatch();

        } else if (nextProps.boardFocused && !nextProps.gameInProgress){
            this.stopStopwatch();

        } else if (!nextProps.boardFocused && nextProps.gameInProgress) {
            this.stopStopwatch();

        } else if (nextProps.boardHovered && !nextProps.gameInProgress) {
            this.stopClock();

        } else if (!nextProps.boardHovered && !nextProps.gameInProgress) {
            this.startClock();
        }
    }    

    render() {
        
        const timerValue = this.props.timerValue;

        const clockValue = this.props.clockValue;

        const style = {
            width: "400px",
            height: "50px",
            marginBottom: "50px"
        };

        const flexContainer = {
            padding: "0",
            margin: "0",

            display: "-webkit-box",
            display: "-moz-box",
            display: "-ms-flexbox",
            display: "-webkit-flex",
            display: "flex",

            WebkitFlexFlow: "row wrap",
            justifyContent: "center",
        }

        const flexItem = {
            background: "tomato",
            padding: "5px",
            width: "200px",
            height: "150px",
            marginTop: "10px",

            lineHeight: "150px",
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
        }
        // igra nije u tijeku i hover event
        if ((this.props.boardHovered && !this.props.gameInProgress) || this.props.gameInProgress || this.props.boardFocused) {
            // treba pokazati i tooltip
            return (
                <div id="board-watch-component">
                    <Stopwatch timerValue={timerValue} />
                </div>
            )
        } else {
            return (
                <div id="board-watch-component">
                    <Clock clockValue={clockValue} />
                </div>
            )
        }// else return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer);