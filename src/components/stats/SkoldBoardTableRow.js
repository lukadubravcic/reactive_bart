import React from 'react';
import { connect } from 'react-redux';


const mapDispatchToProps = dispatch => ({
    sendPunishment: toWhom => dispatch({ type: 'SEND_PUNISHMENT', toWhom }),
});

class SkoldBoardTableRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            whoHovering: false,
        }

        this.whoFieldRef = null;

        this.whoElementHovering = ev => {
            this.setState({
                whoHovering: true,
            });
        }

        this.whoElementHoverOut = ev => {
            this.setState({
                whoHovering: false,
            });
        }

        this.punishHandler = ev => {
            ev.preventDefault();
            this.props.sendPunishment(this.props.item.whom);
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
        const rankFieldContent = typeof this.props.item.rank === 'undefined' || this.props.item.rank === null
            ? 'unranked'
            : this.props.item.rank;
        const whoFieldContent = this.getTableFieldData(this.props.item.whom, this.whoFieldRef)

        const fromValue = typeof this.props.item._from === 'undefined' || this.props.item._from === null
            ? 0
            : this.props.item._from;
        const toValue = typeof this.props.item._to === 'undefined' || this.props.item._to === null
            ? 0
            : this.props.item._to;
        const isCurrentUser = this.props.item.self === 0
            ? <button
                className="skoldboard-btn-punish"
                disabled={this.props.disabled}
                onClick={this.punishHandler}>
                PUNISH
            </button>
            : this.props.disabled
                ? <a>
                    <button
                        className="skoldboard-btn-punish">
                        TREAT
                    </button>
                </a>
                : <a
                    href="https://skolded.threadless.com"
                    target="_blank"
                    rel="noopener noreferrer">
                    <button
                        className="skoldboard-btn-punish">
                        TREAT
                    </button>
                </a>;

        return (
            <tr className={`skoldboard-row ${this.props.item.self === 1 ? "picker-selected-row" : ""}`}>
                <td className="empty-field"></td>
                <td className="skoldboard-rank-field">
                    {rankFieldContent}
                </td>
                <td className="skoldboard-who-field">

                    {this.state.whoHovering ? whoFieldContent.HTMLHoverElement : null}
                    <span
                        className="table-cell-content"
                        ref={elem => this.whoFieldRef = elem}
                        onMouseOver={this.whoElementHovering}
                        onMouseOut={this.whoElementHoverOut}>
                        {whoFieldContent.content}
                    </span>
                </td>

                <td className="skoldboard-from-field">
                    {fromValue}
                </td>
                <td className="skoldboard-to-field">
                    {toValue}
                </td>
                <td className="skoldboard-table-punish-field">
                    {isCurrentUser}
                </td>
                <td className="empty-field"></td>
            </tr >
        );
    }
}


export default connect(() => ({}), mapDispatchToProps)(SkoldBoardTableRow);


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