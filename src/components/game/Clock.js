import React from 'react';

const Clock = props => {

    return (
        <div style={props.style}>
            <div style={props.flexContainer}>
                <img src={props.clockimg} width="60px" height="60px" />
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{props.clockValue.hours}</h2></label>
                </div>
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{props.clockValue.minutes}</h2></label>
                </div>
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>{props.clockValue.seconds}</h2></label>
                </div>                
            </div>
        </div>
    );
}

export default Clock;