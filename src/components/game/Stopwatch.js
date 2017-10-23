import React from 'react';

const Stopwatch = props => {    

    const stopwatchDays = props.timerValue.timerDays;
    const stopwatchHours = props.timerValue.timerHours;
    const stopwatchMinutes = props.timerValue.timerMinutes;
    const stopwatchSeconds = props.timerValue.timerSeconds;

    return (
        <div style={props.style}>
            <div style={props.flexContainer}>
                <img src={props.stopwatchimg} width="60px" height="60px" />
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{stopwatchDays}</h2></label>
                    <br />
                    <label>Days</label>
                </div>
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{stopwatchHours}</h2></label>
                    <br />
                    <label>Hours</label>
                </div>
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{stopwatchMinutes}</h2></label>
                    <br />
                    <label>Minutes</label>
                </div>
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{stopwatchSeconds}</h2></label>
                    <br />
                    <label>Seconds</label>
                </div>
            </div>
        </div>
    )
}

export default Stopwatch;