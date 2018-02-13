import React from 'react';
import moment from 'moment';

const AcceptedTabRow = props => {

    const tableRowClass = 'picker-table-row ' + props.style;

    return (
        <tr className={tableRowClass}>
            <td className="empty-field"></td>
            <td className="ordering-field">{props.punishment.user_ordering_punishment}</td>
            {props.punishment.deadline != null ?
                <td className="deadline-field">
                    {moment(props.punishment.deadline).fromNow()}
                </td>
                : <td className="deadline-field">No deadline</td>}
            <td className="num-time-field">{props.punishment.how_many_times}</td>
            <td className="what-field">{props.punishment.what_to_write}</td>
            <td className="go-field">
                {props.disabledGo ? null :
                    <button
                        className="picker-btn picker-btn-go"
                        onClick={props.onGoClick(props.id)} disabled={props.disabledGo}>
                        GO
                    </button>
                }
            </td>
            <td className="giveup-field">
                <button
                    className="picker-btn picker-btn-giveup"
                    onClick={() => props.onGiveUpClick(props.id)}>
                    GIVE UP
                </button>
            </td>
            <td className="empty-field"></td>

        </tr>
    )

}

export default AcceptedTabRow;

