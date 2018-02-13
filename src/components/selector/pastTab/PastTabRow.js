import React from 'react';
import moment from 'moment';
import { getPunishmentStatus } from '../../../helpers/helpers';

const PastTabRow = props => {

    let punishmentStatus = getPunishmentStatus(props.punishment);

    const tableRowClass = 'picker-table-row ' + props.style;
    const statusFieldCssClass = getCssClassForStatusField(punishmentStatus);
    const statusFieldCss = `status-field ${statusFieldCssClass}`;


    return (
        <tr className={tableRowClass}>
            <td className="empty-field"></td>
            <td className="ordered-on-field">{moment(props.punishment.created).fromNow()}</td>
            <td className="by-whom-field">{props.punishment.user_ordering_punishment}</td>
            <td className="past-num-time-field">{props.punishment.how_many_times}</td>
            <td className="what-field-longer">{props.punishment.what_to_write}</td>
            <td className={statusFieldCss}>
                <b>{punishmentStatus}</b>
            </td>
            <td className="empty-field"></td>
        </tr>
    )
}

export default PastTabRow;


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