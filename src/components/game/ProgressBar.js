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

    const spongeHoverStyle = {
        "position": 'absolute',
        marginLeft: leftMargin + "%",
        width: "70px",        
        "bottom": "50px",
        "height": "30px",
        backgroundColor: "grey",
        border: "0.5px solid red"
    }

    return (
        <div className="container">
            {props.hovering ? <div style={spongeHoverStyle}><label>Restart</label></div> : null}
            <label style={style} onClick={props.spongeClick} onMouseOver={props.onHover} onMouseOut={props.onHoverOut}>{progress + "%"}</label>
        </div>
    );
}

export default ProgressBar;