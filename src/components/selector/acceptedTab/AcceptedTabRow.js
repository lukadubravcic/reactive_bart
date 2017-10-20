import React from 'react';

const AcceptedTabRow = props => {

    return (
        <div className="container">
            {/* stuktura tog reda u tablici */}
            <span style={props.style}>{props.punishment.user_ordering_punishment}</span>
            {props.punishment.deadline != null ? <span style={props.style}>{props.punishment.deadline}</span>
                : <span style={props.style}>No deadline</span>}
            <span style={props.style}>{props.punishment.how_many_times}</span>
            <span style={props.style}>{props.punishment.what_to_write}</span>
            <button onClick={props.onGoClick(props.id)}>GO</button>
            <button onClick={() => props.onGiveUpClick(props.id)}>GIVE UP</button>
        </div>
    )

}

export default AcceptedTabRow;