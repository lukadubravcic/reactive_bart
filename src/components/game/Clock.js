import React from 'react';

const Clock = props => {

    const hours = props.clockValue.hours < 10 ? "0" + props.clockValue.hours : props.clockValue.hours;
    const minutes = props.clockValue.minutes < 10 ? "0" + props.clockValue.minutes : props.clockValue.minutes;
    const seconds = props.clockValue.seconds < 10 ? "0" + props.clockValue.seconds : props.clockValue.seconds;
    
    return (
        <div style={props.style}>
            <div style={props.flexContainer}>
                <img src={props.clockimg} width="60px" height="60px" />
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{hours}</h2></label>
                </div>
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{minutes}</h2></label>
                </div>
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{seconds}</h2></label>
                </div>                
            </div>
        </div>
    );
}

export default Clock;