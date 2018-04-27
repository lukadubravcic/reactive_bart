import React from 'react';

const ProgressBar = props => {

    const progress = props.progress;

    let spongeOffset = 0;
    if (!props.showToA) spongeOffset = Math.floor(836 * (progress / 100)) + 'px';
    // pomak kada se label tekst promijeni 
    const finishedPunishmentHoverOffsetStyle = progress === 100 ? { left: -60 + 'px' } : {};
    let hoverText = props.firstTimePlaying
        ? progress !== 100
            ? 'CLICK TO RESTART'
            : 'CLICK FOR RANDOM PUNISHMENT'
        : progress !== 100
            ? 'RESTART'
            : 'RANDOM PUNISHMENT';
    const showTooltip = (
        props.hovering
        || (
            (progress === 100 && props.firstTimePlaying)
            || (props.isPunishmentFailed && props.firstTimePlaying)
        )

    );

    if (props.showToA) hoverText = 'BACK TO GAME';

    return (
        <div
            id="sponge"
            className="tran-all"
            style={{ left: spongeOffset }}
            onClick={props.spongeClick}
            onMouseOver={props.onHover}
            onMouseOut={props.onHoverOut}
        >
            {showTooltip ?
                <div
                    style={props.showToA ? { ...finishedPunishmentHoverOffsetStyle, left: "-7px" } : finishedPunishmentHoverOffsetStyle}
                    id="restart-hover-element"
                    className={`hover-dialog ${props.firstTimePlaying && !props.hovering ? 'show-delay' : ''}`}>

                    <label className="hover-dialog-text noselect">
                        {hoverText}
                    </label>

                    <div className="triangle-hover-box-container">

                        <svg id="triangle-element" width="23px" height="14px" viewBox="0 0 23 14" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-528.000000, -981.000000)">
                                <g id="Fill-2-+-LOG-IN-+-Triangle-4-Copy" transform="translate(456.000000, 916.000000)" fill="#323232">
                                    <polygon id="Triangle-4-Copy" transform="translate(83.500000, 72.000000) scale(1, -1) translate(-83.500000, -72.000000) "
                                        points="83.5 65 95 79 72 79"></polygon>
                                </g>
                            </g>
                        </svg>

                    </div>
                </div >
                : null}
        </div >
    )
}

export default ProgressBar;