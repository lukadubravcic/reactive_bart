import React from 'react';

const PastTabRow = props => {

    let punishmentStatus = '';
    console.log('ulaz' + props.punishment.accepted)
    // IDEJA: "middleware" funkcija koja bi dodijelila status punishmentima prilikom primitka istih 
    if (props.punishment.accepted !== null) punishmentStatus = 'ACCEPTED';
    else if (props.punishment.accepted === 'rejected') {

        punishmentStatus = 'REJECTED';
        
    }

    if (props.punishment.given_up !== null) punishmentStatus = 'GIVEN UP';
    if (props.punishment.done) punishmentStatus = "DONE";
    if (props.punishment.failed) punishmentStatus = "FAILED";

    let createdPlus30Days = (new Date(props.punishment.created).getTime()) + (30 * 24 * 60 * 60 * 1000);
    if ((createdPlus30Days - Date.now() < 0) && (props.punishment.accepted === null)) punishmentStatus = 'IGNORED'


    return (
        <div className="container">
            {/* stuktura tog reda u tablici */}
            <span style={props.style}>{props.punishment.created}</span>
            <span style={props.style}>{props.punishment.user_ordering_punishment}</span>
            <span style={props.style}>{props.punishment.how_many_times}</span>
            <span style={props.style}>{props.punishment.what_to_write}</span>
            <span style={props.style}>{punishmentStatus}</span>
        </div>
    )

}

export default PastTabRow;