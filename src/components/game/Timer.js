import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    ...state.game
});

const mapDispatchToProps = dispatch =>({
    stopTimer: () =>{}
})

class Timer extends React.Component {

    constructor() {
        super();        
    }

    render() {
        return (
            <div style={{
                width: "125px",
                height: "50px",
                marginBottom: "20px"
            }}>
                <div style={{ float: "left" }}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 640 640">
                        <g id="icomoon-ignore"></g>
                        <path d="M320 25.6c-162.592 0-294.4 131.84-294.4 294.4 0 162.592 131.808 294.4 294.4 294.4s294.4-131.808 294.4-294.4c0-162.592-131.808-294.4-294.4-294.4zM320 550.4c-127.264 0-230.4-103.168-230.4-230.4s103.136-230.4 230.4-230.4 230.4 103.168 230.4 230.4-103.136 230.4-230.4 230.4zM342.4 153.6h-44.8v175.68l108.96 108.96 31.68-31.68-95.84-95.84z"></path>
                    </svg>
                </div>
                <div style={{ float: "right" }}>
                    <label>{}</label>:
                    <label>{}</label>:
                    <label>{}</label>:
                    <label>{}</label>
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer);