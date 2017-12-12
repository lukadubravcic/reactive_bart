import React from 'react';
import moment from 'moment';
import { capitalizeFirstLetter } from '../../../helpers/helpers';
import { checkIfIgnoredPunishment } from '../../../helpers/helpers';

const PastTabRow = props => {

    let punishmentStatus = getPunishmentStatus(props.punishment);

    /* if (props.punishment.accepted) punishmentStatus = 'ACCEPTED';
    if (props.punishment.given_up) punishmentStatus = 'GIVEN UP';
    if (props.punishment.done) punishmentStatus = "DONE";
    if (props.punishment.failed) punishmentStatus = "FAILED";
    if (!props.punishment.accepted && checkIfIgnoredPunishment(props.punishment)) punishmentStatus = 'IGNORED';
    if (props.punishment.rejected) punishmentStatus = 'REJECTED'; */

    return (
        <div className="container">
            <span style={props.style}>{capitalizeFirstLetter(moment(props.punishment.created).fromNow())}</span>
            <span style={props.style}>{props.punishment.user_ordering_punishment}</span>
            <span style={props.style}>{props.punishment.how_many_times}</span>
            <span style={props.style}>{props.punishment.what_to_write}</span>
            <span style={props.style}>{punishmentStatus}</span>
        </div>
    )

}

export default PastTabRow;


function getPunishmentStatus(punishment) {

    let punishmentStatus = 'UNKNOWN';

    const acceptedTimeDefined = typeof punishment.accepted !== 'undefined' && punishment.accepted !== null;
    const givenUpTimeDefined = typeof punishment.given_up !== 'undefined' && punishment.given_up !== null;
    const deadlinePassed = typeof punishment.deadline !== 'undefined' && punishment.deadline !== null && hasPunishmentDeadlinePassed(punishment.deadline);
    const failedTimeDefined = typeof punishment.failed !== 'undefined' && punishment.failed !== null;
    const doneTimeDefined = typeof punishment.done !== 'undefined' && punishment.done !== null;
    const punishmentIgnored = checkIfIgnoredPunishment(punishment);
    const rejectedTimeDefined = typeof punishment.rejected !== 'undefined' && punishment.rejected !== null;
    const waitingForAccept = !punishmentIgnored && !deadlinePassed;

    if (acceptedTimeDefined) {
        // ako je kazna acceptana, moze biti inprogress (accepted), givenup, done, failed
        if (givenUpTimeDefined) {
            punishmentStatus = 'GIVEN UP';
        } else if (failedTimeDefined || (deadlinePassed && !doneTimeDefined)) {
            punishmentStatus = 'FAILED';
        } else if (doneTimeDefined) {
            punishmentStatus = 'DONE';
        } else {
            punishmentStatus = 'ACCEPTED';
        }
    } else {
        // ignored, rejected, pending, failed (nije acceptano, deadline je prosao)
        if (punishmentIgnored) {
            punishmentStatus = 'IGNORED';
        } else if (rejectedTimeDefined) {
            punishmentStatus = 'REJECTED';
        } else if (waitingForAccept) {
            punishmentStatus = 'PENDING';
        } else if (deadlinePassed) {
            punishmentStatus = 'FAILED';
        }
    }

    return punishmentStatus;
}

function hasPunishmentDeadlinePassed(deadline) {
    return (Date.now() > new Date(deadline).getTime());
}