import React from 'react';

const OrderedTabRow = props => {

    return (
        <div className="picker-table-header">
            {
                props.columns.map((column) => {
                    return (
                        <div
                            className={column.style}
                            key={column.id}
                            id={column.id}
                            onClick={() => (column.clickHandler) ? column.clickHandler(column.id) : () => { }}>

                            <span className="noselect">
                                {column.name}
                            </span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default OrderedTabRow;