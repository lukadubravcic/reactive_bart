import React from 'react';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../../helpers/helpers';
import { checkIfIgnoredPunishment } from '../../../helpers/helpers';

const PastTabRow = props => {

    let punishmentStatus = '';

    if (props.punishment.accepted) punishmentStatus = 'ACCEPTED';
    if (props.punishment.given_up) punishmentStatus = 'GIVEN UP';
    if (props.punishment.done) punishmentStatus = "DONE";
    if (props.punishment.failed) punishmentStatus = "FAILED";
    if(!props.punishment.accepted && checkIfIgnoredPunishment(props.punishment)) punishmentStatus = 'IGNORED';
    if (props.punishment.rejected) punishmentStatus = 'REJECTED';

    return (
        <div className="container">
            {/* stuktura tog reda u tablici */}
            <span style={props.style}>{capitalizeFirstLetter(moment(props.punishment.created).fromNow())}</span>
            <span style={props.style}>{props.punishment.user_ordering_punishment}</span>
            <span style={props.style}>{props.punishment.how_many_times}</span>
            <span style={props.style}>{props.punishment.what_to_write}</span>
            <span style={props.style}>{punishmentStatus}</span>
        </div>
    )

}

export default PastTabRow;