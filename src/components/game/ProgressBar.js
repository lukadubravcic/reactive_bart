import React from 'react';

const ProgressBar = props => {

    
    const progress = props.progress;
    let spongeOffset = Math.floor(836 * (progress/100));
    

    if (props.hovering) {
        return (
            <div
                id="sponge"
                style={{ left: spongeOffset }}
                onClick={props.spongeClick}
                onMouseOver={props.onHover}
                onMouseOut={props.onHoverOut}
            >
                <div id="restart-hover-element" className="hover-dialog">

                    <label className="hover-dialog-text">
                        RESTART
                    </label>

                    <div className="triangle-hover-box-container">

                        <svg id="triangle-element" width="23px" height="14px" viewBox="0 0 23 14" version="1.1" xmlns="http://www.w3.org/2000/svg">

                            <title>Triangle 4 Copy</title>
                            <desc>Created with Sketch.</desc>
                            <defs></defs>
                            <g id="page-03" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-528.000000, -981.000000)">
                                <g id="Fill-2-+-LOG-IN-+-Triangle-4-Copy" transform="translate(456.000000, 916.000000)" fill="#323232">
                                    <polygon id="Triangle-4-Copy" transform="translate(83.500000, 72.000000) scale(1, -1) translate(-83.500000, -72.000000) "
                                        points="83.5 65 95 79 72 79"></polygon>
                                </g>
                            </g>
                        </svg>

                    </div>
                </div >
            </div >
        )

    } else {
        return (

            <div
                id="sponge"
                style={{ left: spongeOffset }}
                onClick={props.spongeClick}
                onMouseOver={props.onHover}
                onMouseOut={props.onHoverOut}
            ></div>

        );
    }
}

export default ProgressBar;