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

        this.getTableFieldData = (string, len) => {

            if (typeof string !== 'string'
                || string.length === 0
                || typeof len !== 'number'
                || len === 0) {

                return null;
            } else if (string.length <= len) return {
                content: string,
                HTMLHoverElement: null
            }

            let content = `${string.substr(0, len - 3)}...`;
            let elementLen = Math.floor(CHAR_SPACING * string.length) + 35;

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
                content,
                HTMLHoverElement
            }
        }
    }

    render() {

        const tableRowClass = 'picker-table-row ' + this.props.style;

        let orderingUserField = this.getTableFieldData(this.props.punishment.user_ordering_punishment, 13);
        let deadlineUserField = this.props.punishment.deadline !== null
            ? this.getTableFieldData(moment(this.props.punishment.deadline).fromNow(), 11)
            : { content: 'no deadline', HTMLHoverElement: null }
        let whatToWriteUserField = this.getTableFieldData(this.props.punishment.what_to_write, 16);

        return (
            <tr className={tableRowClass}>
                <td className="empty-field"></td>
                <td
                    id="ordering-field"
                    className="ordering-field"
                    onMouseOver={this.elementHovering}
                    onMouseOut={this.elementHoverOut}>

                    {this.state.showOrderingTooltip ? orderingUserField.HTMLHoverElement : null}
                    {orderingUserField.content}
                </td>
                {this.props.punishment.deadline != null
                    ? <td
                        id="deadline-field"
                        className="deadline-field"
                        onMouseOver={this.elementHovering}
                        onMouseOut={this.elementHoverOut}>
                        {this.state.showDeadlineTooltip ? deadlineUserField.HTMLHoverElement : null}
                        {deadlineUserField.content}
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
                    style={{ width: "300px" }}
                    id="what-field"
                    className="what-field"
                    onMouseOver={this.elementHovering}
                    onMouseOut={this.elementHoverOut}>

                    {this.state.showWhatTooltip ? whatToWriteUserField.HTMLHoverElement : null}
                    {whatToWriteUserField.content}
                </td>
                <td
                    style={{ width: "120px" }}
                    className="go-field">
                    <button
                        className="picker-btn picker-btn-go"
                        disabled={this.props.disabledGo}
                        onClick={this.props.onAcceptClick(this.props.punishment)}>
                        ACCEPT
                    </button>

                </td>
                <td
                    style={{ width: "127px" }}
                    className="giveup-field">
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