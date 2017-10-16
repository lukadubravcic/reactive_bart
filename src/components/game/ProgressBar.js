import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    punishmentProgress: state.game.punishmentProgress
});

const mapDispatchToProps = dispatch => ({

});

class ProgressBar extends React.Component {
    constructor() {
        super();
    }

    render() {
        let width = 1024;
        const spongeWidth = 5;
        const progress = this.props.punishmentProgress;
        const pxPerProgressPercent = (width - spongeWidth) / 100;
        const leftMargin = progress * 0.95;

        const style = {
            marginLeft: leftMargin + "%",
            padding: "0px",
            width: spongeWidth + "%",
            height: "20px",
            backgroundColor: "yellow",
            border: "0.5px solid red"
        }

        return (
            <div className="container">
                <label style={style}>{progress + "%"}</label>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar)