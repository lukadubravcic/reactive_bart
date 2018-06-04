import React from 'react';
import moment from 'moment';
import { getPunishmentStatus, capitalizeFirstLetter } from '../../../helpers/helpers';
import agent from '../../../agent';


class OrderedTabRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showWhenTooltip: false,
            showToWhomTooltip: false,
            showDeadlineTooltip: false,
            showWhatToWriteTooltip: false,
            hoveringStatus: false,
        };

        this.whenUserFieldRef = null;
        this.toWhomUserFieldRef = null;
        // this.orderedUserFieldRef = null;
        this.deadlineUserFieldRef = null;
        this.whatFieldRef = null;

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

            /* let content = `${string.substr(0, len - 3)}...`;
            let elementLen = Math.floor(CHAR_SPACING * string.length) + 35; */

            // let elementPlacingStyle = {
            //     width: "calc(100% + 35px)",
            //     bottom: "55px",
            //     left: `-17.5px`
            // };

            // let wordBreakStyling = {
            //     wordBreak: "break-word",
            //     whiteSpace: "normal"
            // };


            // let HTMLHoverElement = (
            //     <div
            //         className="hover-dialog"
            //         style={elementPlacingStyle}
            //     >
            //         <label
            //             className="hover-dialog-text"
            //             style={wordBreakStyling}>
            //             {string}
            //         </label>
            //         <div className="triangle-hover-box-container">
            //             {triangleSVG}
            //         </div>
            //     </div>
            // )

            // return {
            //     string,
            //     HTMLHoverElement
            // }
        }

        this.statusHoverIn = ev => this.setState({ hoveringStatus: true });
        this.statusHoverOut = ev => this.setState({ hoveringStatus: false });

        this.pokeUser = async ev => {
            agent.Punishment.poke(this.props.punishment.uid);
            this.props.updatePokedPunishment(this.props.punishment.uid);
        }
    }

    render() {

        let punishmentStatus = getPunishmentStatus(this.props.punishment);
        const statusFieldCssClass = `ordered-status-field ${this.getCssClassForStatusField(punishmentStatus)}`;

        const tableRowClass = 'picker-table-row';

        let whenUserField = this.getTableFieldData(moment(this.props.punishment.created).fromNow(), this.whenUserFieldRef);

        let toWhomData = this.props.punishment.user_taking_punishment
            ? this.props.punishment.user_taking_punishment
            : this.props.punishment.fk_user_email_taking_punishment;

        let toWhomUserField = this.getTableFieldData(toWhomData, this.toWhomUserFieldRef);
        // let orderedUserField = this.getTableFieldData(this.props.punishment.user_ordering_punishment, 10);
        let deadlineUserField = this.props.punishment.deadline !== null
            ? this.getTableFieldData(moment(this.props.punishment.deadline).fromNow(), this.deadlineUserFieldRef)
            : { content: 'no deadline', HTMLHoverElement: null }
        let whatToWriteUserField = this.getTableFieldData(this.props.punishment.what_to_write, this.whatFieldRef);

        return (
            <tr className={tableRowClass}>
                <td className="empty-field"></td>
                <td className="when-field">

                    {this.state.showWhenTooltip ? whenUserField.HTMLHoverElement : null}
                    <span
                        id="when-field"
                        onMouseOver={this.elementHovering}
                        onMouseOut={this.elementHoverOut}
                        ref={elem => this.whenUserFieldRef = elem}
                        className="table-cell-content">
                        {whenUserField.content}
                    </span>
                </td>

                <td className="to-whom-field">

                    {this.state.showToWhomTooltip ? toWhomUserField.HTMLHoverElement : null}
                    <span
                        id="to-whom-field"
                        onMouseOver={this.elementHovering}
                        onMouseOut={this.elementHoverOut}
                        ref={elem => this.toWhomUserFieldRef = elem}
                        className="table-cell-content">
                        {toWhomUserField.content}
                    </span>
                </td>

                <td className="ordered-deadline-field">

                    {this.state.showDeadlineTooltip ? deadlineUserField.HTMLHoverElement : null}
                    <span
                        id="deadline-field"
                        onMouseOver={this.elementHovering}
                        onMouseOut={this.elementHoverOut}
                        ref={elem => this.deadlineUserFieldRef = elem}
                        className="table-cell-content">
                        {deadlineUserField.content}
                    </span>
                </td>

                <td
                    id="num-time-field"
                    className="ordered-num-time-field">

                    {this.props.punishment.how_many_times}
                </td>

                <td className="ordered-what-field">

                    {this.state.showWhatToWriteTooltip ? whatToWriteUserField.HTMLHoverElement : null}
                    <span
                        id="what-to-write-field"
                        onMouseOver={this.elementHovering}
                        onMouseOut={this.elementHoverOut}
                        ref={elem => this.whatFieldRef = elem}
                        className="table-cell-content">
                        {whatToWriteUserField.content}
                    </span>
                </td>

                <td className={statusFieldCssClass}
                    onMouseEnter={this.statusHoverIn}
                    onMouseLeave={this.statusHoverOut}
                    style={punishmentStatus === 'PENDING' && this.state.hoveringStatus && this.props.punishment.poked !== true
                        ? { textDecoration: 'underline' }
                        : {}}>

                    {this.props.punishment.poked === true
                        ? 'POKED'
                        : punishmentStatus === 'PENDING'
                            ? this.state.hoveringStatus
                                ? <u
                                    onClick={this.pokeUser}
                                    style={{ cursor: 'pointer' }}>
                                    POKE
                            </u>
                                : punishmentStatus
                            : punishmentStatus
                    }
                </td>

                <td className="empty-field"></td>
            </tr >
        );
    }
}


export default OrderedTabRow;


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
);


function isEllipsisActive(e) {
    return (e.offsetWidth < e.scrollWidth);
}