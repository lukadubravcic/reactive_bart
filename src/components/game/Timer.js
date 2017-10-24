import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';

import stopwatchimg from '../../assets/stopwatch02.png';
import clockimg from '../../assets/clock01.png';

import Stopwatch from './Stopwatch';
import Clock from './Clock';

const mapStateToProps = state => ({
    ...state.game,
    timerValue: state.game.timerValue,
    activePunishment: state.game.activePunishment
});

const mapDispatchToProps = dispatch => ({
    stopTimer: () => { },
    updateTimerValue: newTimerValue => {
        dispatch({ type: 'TIMER_VALUE_UPDATED', newTimerValue });
    },
    setClockValue: newClockValue => {
        dispatch({ type: 'CLOCK_VALUE_UPDATED', newClockValue });
    }
})

class Timer extends React.Component {

    constructor() {
        super();

        this.getDecimalNumber = num => {

            let decimals = num - Math.floor(num);
            let decimalPlaces = num.toString().split('.')[1].length;
            decimals = decimals.toFixed(decimalPlaces);
            return parseFloat(decimals);
        };

        this.transformDecimalDaysToHours = days => {
            let decimalDays = this.getDecimalNumber(days);
            return (decimalDays * 24);
        };

        this.transformDecimalHoursToMinutes = hours => {
            let decimalHours = this.getDecimalNumber(hours);
            return (decimalHours * 60);
        };

        this.transformDecimalMinutesToSeconds = minutes => {
            let decimalMinutes = this.getDecimalNumber(minutes);
            return (decimalMinutes * 60);
        };

        this.startStopwatch = deadline => {
            this.stopwatchInterval = setInterval(() => {
                this.setStopwatchValues(deadline);
            }, 1000);
        };

        this.setStopwatchValues = deadline => {
            let deadlineTime = new Date(deadline).getTime();

            let now = Date.now();
            let distance = deadlineTime - now;

            let days = (distance / (24 * 60 * 60 * 1000)); // transform miliseconds to days
            let hours = this.transformDecimalDaysToHours(days);
            let minutes = this.transformDecimalHoursToMinutes(hours)
            let seconds = this.transformDecimalMinutesToSeconds(minutes);

            let timerDays = Math.floor(days);
            let timerHours = Math.floor(hours);
            let timerMinutes = Math.floor(minutes);
            let timerSeconds = Math.floor(seconds);

            this.props.updateTimerValue({
                timerDays: timerDays,
                timerHours: timerHours,
                timerMinutes: timerMinutes,
                timerSeconds: timerSeconds
            });
        }

        this.stopStopwatch = () => {
            if (this.stopStopwatch) {
                clearInterval(this.stopwatchInterval);
                this.stopwatchInterval = null;
            }
        };

        this.startClock = () => {
            this.clockInterval = setInterval(() => {
                let now = new Date();
                let hours = now.getHours();
                let minutes = now.getMinutes();
                let seconds = now.getSeconds();
                this.props.setClockValue({
                    hours: hours,
                    minutes: minutes,
                    seconds: seconds
                });
            }, 500);
        };

        this.stopClock = () => {
            if (this.clockInterval) {
                clearInterval(this.clockInterval);
                this.clockInterval = null;
            }
        };
    }

    componentDidMount() {
        this.startClock();
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.activePunishment.deadline !== nextProps.activePunishment.deadline) { // setaj deadline (ako postoji) u state prilikom odabira druge kazne
            if (nextProps.activePunishment.deadline) this.setStopwatchValues(nextProps.activePunishment.deadline);
        } else if (nextProps.boardFocused && this.props.activePunishment.deadline) { // board fokusiran && deadline postoji, stoperica krece
            if (!this.stopwatchInterval) {                
                this.stopClock();
                this.startStopwatch(this.props.activePunishment.deadline);
            }
        } else if (!nextProps.boardFocused) { // board unfocused -> zaustavi stopericu
            this.stopStopwatch();
        }

    }

    render() {

        const timerValue = this.props.timerValue;
        const stopwatchDays = this.props.timerValue.timerDays;
        const stopwatchHours = this.props.timerValue.timerHours;
        const stopwatchMinutes = this.props.timerValue.timerMinutes;
        const stopwatchSeconds = this.props.timerValue.timerSeconds;

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

        if ((this.props.activePunishment.deadline && this.props.boardFocused) || this.props.boardHovered) {
            return (
                <div className="container">
                    <Stopwatch style={style} flexContainer={flexContainer} stopwatchimg={stopwatchimg} timerValue={timerValue} />
                </div>
            )
        } else if (!this.props.activePunishment.deadline || !this.props.boardFocused) {
            return (
                <div className="container">
                    <Clock style={style} flexContainer={flexContainer} clockimg={clockimg} clockValue={clockValue} />
                </div>
            )
        } else return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer);