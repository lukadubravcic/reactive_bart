import React from 'react';

class SkoldBoardTableRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <tr className={tableRowClass}>
                <td className="empty-field"></td>
                <td
                    id="ordering-field"
                    className="ordering-field">

                    Bla
                </td>
                <td
                    id="ordering-field"
                    className="ordering-field">
                    BlaBla
                </td>

                <td
                    id="deadline-field"
                    className="deadline-field">

                    Balblabla
                    </td>
                <td
                    id="deadline-field"
                    className="deadline-field">

                    Blablabla
                    </td>}
            </tr >
        );
    }
}