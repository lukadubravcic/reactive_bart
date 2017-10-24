import React from 'react';

const ProgressBar = props => {

    let width = 1024;
    const spongeWidth = 5;
    const progress = props.progress;
    const pxPerProgressPercent = (width - spongeWidth) / 100;
    const leftMargin = progress * 0.95;

    const style = {
        marginLeft: leftMargin + "%",
        padding: "0px",
        width: spongeWidth + "%",
        height: "30px",
        backgroundColor: "yellow",
        border: "0.5px solid red"
    }

    return (
        <div className="container">
            <label style={style} onClick={props.spongeClick} onMouseOver={props.onHover}>{progress + "%"}</label>
        </div>
    );
}

export default ProgressBar;