import React from 'react';
import moment from 'moment';
import { getPunishmentStatus, capitalizeFirstLetter } from '../../../helpers/helpers';

const CHAR_SPACING = 16.28;


class OrderedTabRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showWhenTooltip: false,
            showToWhomTooltip: false,
            showDeadlineTooltip: false,
            showWhatToWriteTooltip: false,
        };

        this.elementHovering = ev => {

            switch (ev.target.id) {
                case 'when-field':
                    this.setState({ showWhenTooltip: true });
                    break;
                case 'to-whom-field':
                    this.setState({ showToWhomTooltip: true });
                    break;
                case 'deadline-field':
                    this.setState({ showDeadlineTooltip: true });
                    break;
                case 'what-to-write-field':
                    this.setState({ showWhatToWriteTooltip: true });
            }
        }

        this.elementHoverOut = ev => {

            switch (ev.target.id) {
                case 'when-field':
                    this.setState({ showWhenTooltip: false });
                    break;
                case 'to-whom-field':
                    this.setState({ showToWhomTooltip: false });
                    break;
                case 'deadline-field':
                    this.setState({ showDeadlineTooltip: false });
                    break;
                case 'what-to-write-field':
                    this.setState({ showWhatToWriteTooltip: false });
            }
        }

        this.getCssClassForStatusField = punishmentStatus => {

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
                    style={elementPlacingStyle}
                >
                    <label
                        className="hover-dialog-text"
                        style={wordBreakStyling}>
                        {string}
                    </label>
                    <div className="triangle-hover-box-container">
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

        let punishmentStatus = getPunishmentStatus(this.props.punishment);
        const statusFieldCssClass = `ordered-status-field ${this.getCssClassForStatusField(punishmentStatus)}`;

        const tableRowClass = 'picker-table-row';

        let whenUserField = this.getTableFieldData(moment(this.props.punishment.created).fromNow(), 10);

        let toWhomData = this.props.punishment.user_taking_punishment
            ? this.props.punishment.user_taking_punishment
            : this.props.punishment.fk_user_email_taking_punishment;

        let toWhomUserField = this.getTableFieldData(toWhomData, 12);
        let orderedUserField = this.getTableFieldData(this.props.punishment.user_ordering_punishment, 10);
        let deadlineUserField = this.props.punishment.deadline !== null
            ? this.getTableFieldData(moment(this.props.punishment.deadline).fromNow(), 11)
            : { content: 'no deadline', HTMLHoverElement: null }
        let whatToWriteUserField = this.getTableFieldData(this.props.punishment.what_to_write, 20);

        return (
            <tr className={tableRowClass}>
                <td className="empty-field"></td>
                <td
                    id="when-field"
                    className="when-field"
                    onMouseOver={this.elementHovering}
                    onMouseOut={this.elementHoverOut}>

                    {this.state.showWhenTooltip ? whenUserField.HTMLHoverElement : null}
                    {whenUserField.content}
                </td>

                <td
                    id="to-whom-field"
                    className="to-whom-field"
                    onMouseOver={this.elementHovering}
                    onMouseOut={this.elementHoverOut}>

                    {this.state.showToWhomTooltip ? toWhomUserField.HTMLHoverElement : null}
                    {toWhomUserField.content}
                </td>

                <td
                    id="deadline-field"
                    className="ordered-deadline-field"
                    onMouseOver={this.elementHovering}
                    onMouseOut={this.elementHoverOut}>
                    {this.state.showDeadlineTooltip ? deadlineUserField.HTMLHoverElement : null}
                    {deadlineUserField.content}
                </td>
                
                <td
                    id="num-time-field"
                    className="ordered-num-time-field">

                    {this.props.punishment.how_many_times}
                </td>

                <td
                    id="what-to-write-field"
                    className="ordered-what-field"
                    onMouseOver={this.elementHovering}
                    onMouseOut={this.elementHoverOut}>

                    {this.state.showWhatToWriteTooltip ? whatToWriteUserField.HTMLHoverElement : null}
                    {whatToWriteUserField.content}
                </td>

                <td className={statusFieldCssClass}>
                    <b>{punishmentStatus}</b>
                </td>

                <td className="empty-field"></td>
            </tr >
        );
    }
}


export default OrderedTabRow;


