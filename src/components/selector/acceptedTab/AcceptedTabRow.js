import React from 'react';
import moment from 'moment';

const AcceptedTabRow = props => {

    const tableRowClass = 'picker-table-row ' + props.style;

    const orderingFieldCSSClass = 'ordering-field';
    const deadlineFieldCSSClass = 'deadline-field';
    const howManyFieldCSSClass = 'num-time-field';
    const whatToWriteFieldCSSClass = 'what-field';
    const goFieldFieldCSSClass = 'go-field';
    const giveupFieldCSSClass = 'giveup-field';

    let orderingUserField = getTableFieldData(props.punishment.user_ordering_punishment, 13, 290);
    let deadlineUserField = props.punishment.deadline !== null
        ? getTableFieldData(moment(props.punishment.deadline).fromNow(), 11, 491)
        : { content: 'no deadline', HTMLHoverElement: null }
    let howManyTimesUserField = getTableFieldData(props.punishment.how_many_times, 13, 579);
    let whatToWriteUserField = getTableFieldData(props.punishment.what_to_write, 20, 892);

    console.log(whatToWriteUserField);

    return (
        <tr className={tableRowClass}>
            <td className="empty-field"></td>
            <td className="ordering-field">
                {orderingUserField.HTMLHoverElement}
                {orderingUserField.content}
            </td>
            {props.punishment.deadline != null ?
                <td className="deadline-field">
                    {deadlineUserField.content}{deadlineUserField.HTMLHoverElement}
                </td>
                : <td className="deadline-field">no deadline</td>}
            <td className="num-time-field">{props.punishment.how_many_times}</td>
            <td className="what-field">
                {whatToWriteUserField.HTMLHoverElement}
                {whatToWriteUserField.content}
            </td>
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

        </tr >
    )

}

export default AcceptedTabRow;



function getTableFieldData(string, len) {

    if (typeof string !== 'string'
        || string.length === 0
        || typeof len !== 'number'
        || len === 0) {

        return null;
    }

    let content = string;
    let HTMLHoverElement = null;

    if (string.length <= len) return {
        content,
        HTMLHoverElement
    }

    const charSpacing = 16.28; // hardcoded
    let elementLen = Math.floor(charSpacing * string.length) + 35;


    content = `${string.substr(0, len - 3)}...`;

    HTMLHoverElement = (
        <div
            className="hover-dialog"
            style={{ width: "calc(100% + 25px)", bottom: "40px", left: `-12.5px` }}
        >
            <label className="hover-dialog-text" style={{ wordBreak: "break-all" }}>
                {string}
            </label>
            <div className="triangle-hover-box-container">
                <svg id="triangle-element" width="23px" height="14px" viewBox="0 0 23 14" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink">

                    <title>Triangle 4 Copy</title>
                    <desc>Created with Sketch.</desc>
                    <defs></defs>
                    <g id="page-03" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-528.000000, -981.000000)">
                        <g id="Fill-2-+-LOG-IN-+-Triangle-4-Copy" transform="translate(456.000000, 916.000000)" fill="#323232">
                            <polygon id="Triangle-4-Copy" transform="translate(83.500000, 72.000000) scale(1, -1) translate(-83.500000, -72.000000) "
                                points="83.5 65 95 79 72 79"></polygon>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    )



    return {
        content,
        HTMLHoverElement
    }
}