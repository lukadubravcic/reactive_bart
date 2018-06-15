import React from 'react';
import moment from 'moment';
import { getPunishmentStatus } from '../../../helpers/helpers';


class PastTabRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showOrderedOnTooltip: false,
            showByWhomTooltip: false,
            showWhatToWriteTooltip: false,
        };

        this.orderedFieldRef = null;
        this.whomFieldRef = null;
        this.whatFieldRef = null;

        this.elementHovering = ev => {

            switch (ev.target.id) {
                case 'ordered-on-field':
                    this.setState({ showOrderedOnTooltip: true });
                    break;
                case 'by-whom-field':
                    this.setState({ showByWhomTooltip: true });
                    break;
                case 'what-to-write-field':
                    this.setState({ showWhatToWriteTooltip: true });
            }
        }

        this.elementHoverOut = ev => {

            switch (ev.target.id) {
                case 'ordered-on-field':
                    this.setState({ showOrderedOnTooltip: false });
                    break;
                case 'by-whom-field':
                    this.setState({ showByWhomTooltip: false });
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
            if (string === null) {
                return {
                    content: 'Anonymous',
                    HTMLHoverElement: null,
                }
            } else if (typeof string !== 'string'
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
        let punishmentStatus = getPunishmentStatus(this.props.punishment);
        const statusFieldCssClass = `ordered-status-field ${this.getCssClassForStatusField(punishmentStatus)}`;
        const tableRowClass = 'picker-table-row ' + this.props.style;

        let orderedOnUserField = this.getTableFieldData(moment(this.props.punishment.created).fromNow(), this.orderedFieldRef);
        let byWhomUserField = this.getTableFieldData(this.props.punishment.user_ordering_punishment, this.whomFieldRef);
        let whatToWriteUserField = this.getTableFieldData(this.props.punishment.what_to_write, this.whatFieldRef);

        return (
            <tr className={tableRowClass}>
                <td className="empty-field"></td>
                <td className="ordered-on-field">

                    {this.state.showOrderedOnTooltip ? orderedOnUserField.HTMLHoverElement : null}
                    <span
                        id="ordered-on-field"
                        onMouseOver={this.elementHovering}
                        onMouseOut={this.elementHoverOut}
                        ref={elem => this.orderedFieldRef = elem}
                        className="table-cell-content">
                        {orderedOnUserField.content}
                    </span>
                </td>

                <td className="by-whom-field">

                    {this.state.showByWhomTooltip ? byWhomUserField.HTMLHoverElement : null}
                    <span
                        id="by-whom-field"
                        onMouseOver={this.elementHovering}
                        onMouseOut={this.elementHoverOut}
                        ref={elem => this.whomFieldRef = elem}
                        className="table-cell-content">
                        {byWhomUserField.content}
                    </span>
                </td>

                <td
                    id="num-time-field"
                    className="past-num-time-field">

                    {this.props.punishment.how_many_times}
                </td>

                <td className="what-field-longer">

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

                <td className={statusFieldCssClass}>
                    <b>{punishmentStatus}</b>
                </td>

                <td className="empty-field"></td>
            </tr >
        );
    }
}


export default PastTabRow;


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