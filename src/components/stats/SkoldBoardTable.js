import React from 'react';
import TableHeader from '../selector/TableHeader';
import SkoldBoardTableRow from './SkoldBoardTableRow';
import SkoldboardPager from './SkoldboardPager';

class SkoldBoardTable extends React.Component {
    constructor(props) {
        super(props);

        this.state({
            currentPage: 1,
        });

        this.tableColumns = [
            {
                name: 'RANK',
                clickHandler: null,
                id: 'rank_skolboard',
                sortOrder: 0,
                style: 'float-left def-cursor skoldboard-table-header-rank'
            },
            {
                name: 'WHOM',
                clickHandler: null,
                id: 'whom_skoldboard',
                sortOrder: null,
                style: 'float-left def-cursor skoldboard-table-header-who'
            },
            {
                name: 'FROM',
                clickHandler: null,
                id: 'from_skoldboard',
                sortOrder: null,
                style: 'float-left def-cursor skoldboard-table-header-from'
            },
            {
                name: 'TO',
                clickHandler: null,
                id: 'to_skoldboard',
                sortOrder: null,
                style: 'float-left def-cursor skoldboard-table-header-to'
            },
        ];
    }

    render() {
        if (Object.keys(this.props.data).length === 0) return null;

        const rowsToDisplay = Object.keys(this.props.data).map((item, index) => {
            let hasPunishBtn = !(this.props.currentUser.email === item);
            return (<SkoldBoardTableRow item={this.props.data[item]} key={index} userEmail={item} hasPunishBtn={hasPunishBtn} />)
        }
        );

        return (
            <div>
                <TableHeader columns={this.tableColumns} />
                <table className="picker-table" style={{ borderBottom: '10px solid #515151' }}>
                    <tbody>
                        {rowsToDisplay.map(elem => elem)}
                    </tbody>
                </table>
                <SkoldboardPager />
            </div>
        )
    }
}

export default SkoldBoardTable;