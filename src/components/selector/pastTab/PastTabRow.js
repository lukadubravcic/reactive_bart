import React from 'react';
import moment from 'moment';
import { getPunishmentStatus, capitalizeFirstLetter } from '../../../helpers/helpers';

const PastTabRow = props => {

    let punishmentStatus = getPunishmentStatus(props.punishment);

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


