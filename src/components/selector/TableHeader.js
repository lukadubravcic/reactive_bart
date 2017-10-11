import React from 'react';

const OrderedTabRow = props => {

    return (
        <div className="container">
            <hr />
            {
                props.columns.map((column) => {
                    return (
                        <label
                            style={props.style}
                            key={column.id}
                            id={column.id}
                            onClick={() => column.clickHandler(column.id)}>
                            {column.name}
                        </label>
                    )
                })
            }
            <hr />
        </div>
    )
}

export default OrderedTabRow;