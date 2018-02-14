import React from 'react';

const Clock = props => {

    const am_pm = props.clockValue.hours > 12 ? 'PM' : 'AM';
    const hours = get12HourTime(props.clockValue.hours);
    const minutes = props.clockValue.minutes < 10 ? "0" + props.clockValue.minutes : props.clockValue.minutes;
    const seconds = props.clockValue.seconds < 10 ? "0" + props.clockValue.seconds : props.clockValue.seconds;
  
    return (
        <div id="board-watch-container">
            <div id="watch-AM-PM-container" className="board-watch-block">
                <span id="watch-AM-PM" className="watch-digits">{am_pm}</span>
            </div>
            <div className="board-watch-block">
                <span id="watch-hour" className="watch-digits">{hours}</span>
            </div>
            <div className="board-watch-block">
                <span id="watch-min" className="watch-digits">{minutes}</span>
            </div>
            <div className="board-watch-block">
                <span id="watch-sec" className="watch-digits">{seconds}</span>
            </div>
        </div>
    );
}

export default Clock;

function get12HourTime(hours) {
    let hour = hours;

    if (hour < 10) return "0" + hour;
    else if (hour <= 12) return hour;
    else return '0' + (hour - 12); // hour > 12
}