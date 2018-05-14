import React from 'react';
import TableHeader from '../selector/TableHeader';
import SkoldBoardTableRow from './SkoldBoardTableRow';
import SkoldboardPager from './SkoldboardPager';

import { ITEMS_PER_PAGE } from '../../constants/constants';

const sizeOfTableRow = 60; // 60px
const tableBottomBorderSize = 9;


class SkoldBoardTable extends React.Component {
    constructor(props) {
        super(props);
        this.tableOpacityTimeout = null;
        this.state = {
            currentPage: null,
            shownRows: null,
            tableContainerStyle: {
                height: 0,
                borderBottom: '10px solid #515151',
            },
            tableStyle: {
                opacity: 1,
            },
        };

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

        this.changeShownItems = (array, pageNum) => {
            this.setState({
                currentPage: pageNum,
                shownRows: [...array],
            });
        }

        this.changeTableContainerHeight = (rowsLen = this.state.shownRows.length) => {
            // izracunaj novu visinu i animiraj promjenu
            let newHeight = rowsLen * sizeOfTableRow + tableBottomBorderSize;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.setState({
                        tableContainerStyle: { ...this.state.tableContainerStyle, height: newHeight },
                        tableStyle: { opacity: 0 },
                    });
                });
            });

            this.tableOpacityTimeout = setTimeout(() => {
                requestAnimationFrame(() => {
                    this.setState({
                        tableStyle: { ...this.state.tableStyle, opacity: 1 },
                    });
                });
            }, 500);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevState.shownRows === null && this.state.shownRows !== null)
            || (prevState.shownRows !== null && prevState.shownRows.length !== this.state.shownRows.length)) {
            this.changeTableContainerHeight();
        }
    }

    componentDidMount() {
        let shownRows = getFirstPage(this.props.data);

        this.setState({
            currentPage: 1,
            shownRows: [...shownRows],
        });
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                this.changeTableContainerHeight(shownRows.length);
            });
        });
    }

    componentWillUnmount() {
        clearTimeout(this.tableOpacityTimeout)
    }

    render() {
        if (this.state.shownRows === null || this.state.shownRows.length === 0) return null;
        // if (Object.keys(this.props.data).length === 0) return null;
        const rowsToDisplay = this.state.shownRows.map((item, index) => {
            return (<SkoldBoardTableRow item={item} key={index}/>)
        });

        return (
            <div>
                <TableHeader columns={this.tableColumns} />

                <div style={this.state.tableContainerStyle} className="height-tran">
                    <table className="picker-table">
                        <tbody style={this.state.tableStyle}>
                            {rowsToDisplay.map(elem => elem)}
                        </tbody>
                    </table>
                </div>

                <SkoldboardPager
                    currentPage={this.state.currentPage}
                    shownRows={this.state.shownRows}
                    dataToDisplay={this.props.data}
                    changeShownItems={this.changeShownItems} />
            </div>
        )
    }
}

export default SkoldBoardTable;


function getFirstPage(dataObject) {
    if (dataObject.length === 0) return null;
    let tmp = [];

    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        if (dataObject[i]) tmp.push(dataObject[i]);
    }

    return tmp;
}


