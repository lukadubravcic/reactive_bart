import React from 'react';
import TableHeader from '../selector/TableHeader';

class SkoldBoardTable extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)

        this.tableColumns = [
            {
                name: 'RANK',
                clickHandler: null,
                id: 'rank_skolboard',
                sortOrder: 0,
                style: 'float-left ordering-field'
            },
            {
                name: 'WHOM',
                clickHandler: null,
                id: 'whom_skoldboard',
                sortOrder: null,
                style: 'float-left ordering-field'
            },
            {
                name: 'FROM',
                clickHandler: null,
                id: 'from_skoldboard',
                sortOrder: null,
                style: 'float-left deadline-field'
            },
            {
                name: 'TO',
                clickHandler: null,
                id: 'to_skoldboard',
                sortOrder: null,
                style: 'float-left deadline-field'
            },
        ]
    }

    render() {
        return (
            <div>
                <TableHeader columns={this.tableColumns} />
                <table

                    className="picker-table">

                    <tbody>
                        {
                            shownPunishments.map(punishment => {

                                if (punishment.uid === activePunishment.uid) {
                                    return (
                                        <>
                                    )
                                }
                            })
                        }

                    </tbody>
                </table>
            </div>
        )
    }
}

export default SkoldBoardTable;