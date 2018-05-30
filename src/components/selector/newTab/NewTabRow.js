import React from 'react';
import moment from 'moment';

const CHAR_SPACING = 16.28;


class NewTabRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showOrderingTooltip: false,
            showDeadlineTooltip: false,
            showWhatTooltip: false
        };

        this.orderingFieldRef = null;
        this.deadlineFieldRef = null;
        this.whatFieldRef = null;

        this.elementHovering = ev => {

            switch (ev.target.id) {
                case 'ordering-field':
                    this.setState({ showOrderingTooltip: true });
                    break;
                case 'deadline-field':
                    this.setState({ showDeadlineTooltip: true });
                    break;
                case 'what-field':
                    this.setState({ showWhatTooltip: true });
            }
        }

        this.elementHoverOut = ev => {
            switch (ev.target.id) {
                case 'ordering-field':
                    this.setState({ showOrderingTooltip: false });
                    break;
                case 'deadline-field':
                    this.setState({ showDeadlineTooltip: false });
                    break;
                case 'what-field':
                    this.setState({ showWhatTooltip: false });
            }
        }

        this.getTableFieldData = (string, elementRef) => {
            if (typeof string !== 'string'
                || string.length === 0
            ) {
                return null;
            } else if (elementRef && isEllipsisActive(elementRef)) {

                let elementPlacingStyle = {
                    width: "calc(100% + 35px)",
                    bottom: "55px",
                    left: `-17.5px`
                };

                let wordBreakStyling = {
                    wordBreak: "break-word",
                    whiteSpace: "normal"
                };

                let HTMLHoverElement = (
                    <div
                        className="hover-dialog"
                        style={elementPlacingStyle}>

                        <label
                            className="hover-dialog-text"
                            style={wordBreakStyling}>
                            {string}
                        </label>
                        <div className="triangle-hover-box-container">
                            {triangleSVG}
                        </div>
                    </div>
                )

                return {
                    content: string,
                    HTMLHoverElement,
                }
            } else {
                return {
                    content: string,
                    HTMLHoverElement: null,
                }
            }
        }
    }

    render() {

        const tableRowClass = 'picker-table-row ' + this.props.style;

        let orderingUserField = this.getTableFieldData(this.props.punishment.user_ordering_punishment, this.orderingFieldRef);
        let deadlineUserField = this.props.punishment.deadline !== null
            ? this.getTableFieldData(moment(this.props.punishment.deadline).fromNow(), this.deadlineFieldRef)
            : { content: 'no deadline', HTMLHoverElement: null }
        let whatToWriteUserField = this.getTableFieldData(this.props.punishment.what_to_write, this.whatFieldRef);

        return (
            <tr className={tableRowClass}>
                <td className="empty-field"></td>
                <td className="ordering-field">

                    {this.state.showOrderingTooltip ? orderingUserField.HTMLHoverElement : null}
                    <span
                        id="ordering-field"
                        onMouseOver={this.elementHovering}
                        onMouseOut={this.elementHoverOut}
                        ref={elem => this.orderingFieldRef = elem}
                        className="table-cell-content">
                        {orderingUserField.content}
                    </span>
                </td>
                {this.props.punishment.deadline != null
                    ? <td className="deadline-field">

                        {this.state.showDeadlineTooltip ? deadlineUserField.HTMLHoverElement : null}
                        <span
                            id="deadline-field"
                            onMouseOver={this.elementHovering}
                            onMouseOut={this.elementHoverOut}
                            ref={elem => this.deadlineFieldRef = elem}
                            className="table-cell-content">
                            {deadlineUserField.content}
                        </span>
                    </td>
                    : <td
                        id="deadline-field"
                        className="deadline-field">

                        no deadline
                    </td>}
                <td
                    id="num-time-field"
                    className="num-time-field">

                    {this.props.punishment.how_many_times}
                </td>
                <td
                    style={{ width: "258px" }}
                    className="what-field">

                    {this.state.showWhatTooltip ? whatToWriteUserField.HTMLHoverElement : null}
                    <span
                        id="what-field"
                        onMouseOver={this.elementHovering}
                        onMouseOut={this.elementHoverOut}
                        ref={elem => this.whatFieldRef = elem}
                        className="table-cell-content">
                        {whatToWriteUserField.content}
                    </span>
                </td>
                <td
                    className="accept-field">
                    <button
                        className="picker-btn picker-btn-go"
                        disabled={this.props.disabledGo}
                        onClick={this.props.onAcceptClick(this.props.punishment)}>
                        ACCEPT
                    </button>
                </td>
                <td
                    className="reject-field">
                    <button
                        className="picker-btn picker-btn-giveup"
                        onClick={() => this.props.onRejectClick(this.props.punishment)}>
                        REJECT
                    </button>
                </td>
                <td className="empty-field"></td>
            </tr >
        );
    }
}

export default NewTabRow;


const triangleSVG = (
    <svg
        id="triangle-element"
        width="23px"
        height="14px"
        viewBox="0 0 23 14"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink">

        <g
            id="page-03"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
            transform="translate(-528.000000, -981.000000)">

            <g
                id="Fill-2-+-LOG-IN-+-Triangle-4-Copy"
                transform="translate(456.000000, 916.000000)"
                fill="#323232">

                <polygon
                    id="Triangle-4-Copy"
                    transform="translate(83.500000, 72.000000) scale(1, -1) translate(-83.500000, -72.000000)"
                    points="83.5 65 95 79 72 79">
                </polygon>
            </g>
        </g>
    </svg>
)

function isEllipsisActive(e) {
    return (e.offsetWidth < e.scrollWidth);
}