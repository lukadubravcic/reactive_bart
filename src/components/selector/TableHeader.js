import React from 'react';

const OrderedTabRow = props => {

    return (
        <div className="picker-table-header">
            {
                props.columns.map(column => {
                    return (
                        <div
                            className={column.style}
                            key={column.id}
                            id={column.id}
                            onClick={() => (column.clickHandler) ? column.clickHandler(column.id) : () => { }}>

                            <span className="noselect">
                                <label>
                                    {column.name}
                                </label>
                                {column.sortOrder === 1
                                    ? ascendingSVG
                                    : column.sortOrder === -1
                                        ? descendingSVG
                                        : null}
                            </span>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default OrderedTabRow;

const descendingSVG = (
    <svg style={{ marginLeft: "10px" }} width="17px" height="13px" viewBox="0 0 17 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-507.000000, -2786.000000)">
            <g id="Group" transform="translate(0.000000, 2508.000000)" fill="#FFD75F">
                <polygon id="Triangle-1" transform="translate(515.500000, 284.214000) rotate(-180.000000) translate(-515.500000, -284.214000) "
                    points="515.5 278.214 524 290.214 507 290.214"></polygon>
            </g>
        </g>
    </svg>
)

const ascendingSVG = (
    <svg style={{ marginLeft: "10px" }} width="17px" height="13px" viewBox="0 0 17 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-507.000000, -2786.000000)">
            <g id="Group" transform="translate(0.000000, 2508.000000)" fill="#FFD75F">
                <polygon id="Triangle-1" transform="translate(515.500000, 284.214000) rotate(0) translate(-515.500000, -284.214000) "
                    points="515.5 278.214 524 290.214 507 290.214"></polygon>
            </g>
        </g>
    </svg>
)