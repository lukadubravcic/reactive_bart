import React from 'react';

const OrderedTabRow = props => {

    return (
        <div className="picker-table-header">
            <hr />
            {
                props.columns.map((column) => {
                    return (
                        <div
                            className={column.style}
                            key={column.id}
                            id={column.id}
                            onClick={() => (column.clickHandler) ? column.clickHandler(column.id): ()=>{}}>
                            {column.name}
                        </div>
                    )
                })
            }
            <hr />
        </div>
    )
}

export default OrderedTabRow;