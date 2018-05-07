import React from 'react';
import { connect } from 'react-redux';

const CHAR_SPACING = 16.28;

const mapDispatchToProps = dispatch => ({
    sendPunishment: toWhom => dispatch({ type: 'SEND_PUNISHMENT', toWhom }),
});

class SkoldBoardTableRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            whoHovering: false,
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
            let toWhom = (typeof this.props.item.username === 'undefined'
                || this.props.item.username === ''
                || this.props.item.username === null)
                ? this.props.item.email
                : this.props.item.username;
            this.props.sendPunishment(toWhom);
        }
    }

    render() {
        const rankFieldContent = typeof this.props.item.rank === 'undefined' || this.props.item.rank === null
            ? 'unknown'
            : this.props.item.rank;
        const whoFieldContent =
            (typeof this.props.item.username === 'undefined'
                || this.props.item.username === ''
                || this.props.item.username === null)
                ? this.getTableFieldData(this.props.item.email, 26)
                : this.getTableFieldData(this.props.item.username, 26);
        const fromValue = typeof this.props.item.fromNum === 'undefined' || this.props.item.fromNum === null
            ? 0
            : this.props.item.fromNum;
        const toValue = typeof this.props.item.toNum === 'undefined' || this.props.item.toNum === null
            ? 0
            : this.props.item.toNum;
        const punishBtn = this.props.hasPunishBtn
            ? <button
                className="skoldboard-btn-punish"
                onClick={this.punishHandler}>
                PUNISH
            </button>
            : null;

        return (
            <tr className={`skoldboard-row ${!this.props.hasPunishBtn ? "picker-selected-row" : ""}`}>
                <td className="empty-field"></td>
                <td className="skoldboard-rank-field">
                    {rankFieldContent}
                </td>
                <td
                    className="skoldboard-who-field"
                    onMouseOver={this.whoElementHovering}
                    onMouseOut={this.whoElementHoverOut}>
                    {this.state.whoHovering ? whoFieldContent.HTMLHoverElement : null}
                    {whoFieldContent.content}
                </td>

                <td className="skoldboard-from-field">
                    {fromValue}
                </td>
                <td className="skoldboard-to-field">
                    {toValue}
                </td>
                <td className="skoldboard-table-punish-field">
                    {punishBtn}
                </td>
                <td className="empty-field"></td>
            </tr >
        );
    }
}


export default connect(() => ({}), mapDispatchToProps)(SkoldBoardTableRow);