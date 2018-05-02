import React from 'react';

class SkoldBoardTableRow extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        // item: {fromNum: 5, username: "Luka", toNum: 5}__proto__: Object
    }

    render() {
        return (
            <tr>
                <td className="empty-field"></td>
                <td
                    id="ordering-field"
                    className="ordering-field">

                    X
                </td>
                <td
                    id="ordering-field"
                    className="ordering-field">
                    {this.props.item.username}
                </td>

                <td
                    id="deadline-field"
                    className="deadline-field">

                    {this.props.item.fromNow}
                    </td>
                <td
                    id="deadline-field"
                    className="deadline-field">

                    {this.props.item.toNum}
                    </td>
            </tr >
        );
    }
}


export default SkoldBoardTableRow;