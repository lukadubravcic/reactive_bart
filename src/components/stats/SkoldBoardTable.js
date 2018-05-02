import React from 'react';
import TableHeader from '../selector/TableHeader';
import SkoldBoardTableRow from './SkoldBoardTableRow';

class SkoldBoardTable extends React.Component {
    constructor(props) {
        super(props);

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

        if (Object.keys(this.props.data).length === 0) return null;

        const rowsToDisplay = [];
        Object.keys(this.props.data).forEach(item => {
            rowsToDisplay.push(<SkoldBoardTableRow item={this.props.data[item]} />)
        });
    
        return (
            <div>
                <TableHeader columns={this.tableColumns} />
                <table

                    className="picker-table">

                    <tbody>
                        {rowsToDisplay.map(elem => elem)}

                    </tbody>
                </table>
            </div>
        )
    }
}

export default SkoldBoardTable;