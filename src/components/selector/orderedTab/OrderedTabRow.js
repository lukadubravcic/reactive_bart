import React from 'react';
import moment from 'moment';
import { getPunishmentStatus, capitalizeFirstLetter } from '../../../helpers/helpers';

const OrderedTabRow = props => {

    let punishmentStatus = getPunishmentStatus(props.punishment);

    return (
        <div className="container">
            {/* stuktura tog reda u tablici */}
            <span style={props.style}>{capitalizeFirstLetter(moment(props.punishment.created).fromNow())}</span>
            <span style={props.style}>{props.punishment.user_taking_punishment ? props.punishment.user_taking_punishment : props.punishment.fk_user_email_taking_punishment}</span>
            {props.punishment.deadline ? <span style={props.style}>{capitalizeFirstLetter(moment(props.punishment.deadline).fromNow())}</span> : <span style={props.style}>No deadline</span>}
            <span style={props.style}>{props.punishment.how_many_times}</span>
            <span style={props.style}>{props.punishment.what_to_write}</span>
            <span style={props.style}>{punishmentStatus}</span>
        </div>
    )
}

export default OrderedTabRow;