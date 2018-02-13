import React from 'react';
import moment from 'moment';
import { getPunishmentStatus, capitalizeFirstLetter } from '../../../helpers/helpers';

const OrderedTabRow = props => {

    let punishmentStatus = getPunishmentStatus(props.punishment);
    const statusFieldCssClass = getCssClassForStatusField(punishmentStatus);
    const statusFieldCss = `ordered-status-field ${statusFieldCssClass}`;

    return (
        <tr className="picker-table-row">
            <td className="empty-field"></td>
            <td className="when-field">{moment(props.punishment.created).fromNow()}</td>
            <td className="to-whom-field">
                {props.punishment.user_taking_punishment
                    ? props.punishment.user_taking_punishment
                    : props.punishment.fk_user_email_taking_punishment}
            </td>
            <td className="ordered-deadline-field">
                {props.punishment.deadline
                    ? moment(props.punishment.deadline).fromNow()
                    : 'no deadline'}
            </td>
            <td className="ordered-num-time-field">{props.punishment.how_many_times}</td>
            <td className="ordered-what-field">{props.punishment.what_to_write}</td>
            <td className={statusFieldCss}>
                <b>{punishmentStatus}</b>
            </td>
            <td className="empty-field"></td>
        </tr >
    )

}

export default OrderedTabRow;


function getCssClassForStatusField(punishmentStatus) {

    switch (punishmentStatus) {
        case 'GIVEN UP':
            return 'givenup-status';
        case 'DONE':
            return 'completed-status';
        case 'ACCEPTED':
            return 'accepted-status';
        case 'IGNORED':
            return 'ignored-status';
        case 'REJECTED':
            return 'rejected-status';
        case 'PENDING':
            return '';
        case 'FAILED':
            return 'failed-status';
        default:
            return '';
    }
}