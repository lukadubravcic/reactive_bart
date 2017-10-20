import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';

import stopwatchimg from '../../assets/stopwatch02.png';
import clockimg from '../../assets/clock01.png';
const mapStateToProps = state => ({
    ...state.game
});

const mapDispatchToProps = dispatch => ({
    stopTimer: () => { }
})

class Timer extends React.Component {

    constructor() {
        super();

        this.clock = {
            clockImageElement: (<img src={clockimg} width="50px" height="50px" />)
        };

        this.stopwatchElements = {
            imageElement: (
                <img src={stopwatchimg} width="60px" height="60px" />
            ),
            daysElement: (
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>17</h2></label>
                    <br />
                    <label>Days</label>
                </div>
            ),
            hoursElement: (
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>20</h2></label>
                    <br />
                    <label>Hours</label>
                </div>
            ),
            minutesElement: (
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>16</h2></label>
                    <br />
                    <label>Minutes</label>
                </div>
            ),
            secondsElement: (
                <div style={{ width: "8ch", border: "solid black 1px" }}>
                    <label><h2>10</h2></label>
                    <br />
                    <label>Seconds</label>
                </div>
            ),
        }
    }

    render() {

        const stopwatchImage = this.stopwatchElements.imageElement;
        const stopwatchDays = this.stopwatchElements.daysElement;
        const stopwatchHours = this.stopwatchElements.hoursElement;
        const stopwatchMinutes = this.stopwatchElements.minutesElement;
        const stopwatchSeconds = this.stopwatchElements.secondsElement;

        const style = {
            width: "400px",
            height: "50px",
            marginBottom: "50px"
        };

        const flexContainer = {
            padding: "0",
            margin: "0",
            
            display: "-webkit-box",
            display: "-moz-box",
            display: "-ms-flexbox",
            display: "-webkit-flex",
            display: "flex",
            
            WebkitFlexFlow: "row wrap",
            justifyContent: "center"
        }

        const flexItem = {
            background: "tomato",
            padding: "5px",
            width: "200px",
            height: "150px",
            marginTop: "10px",
            
            lineHeight: "150px",
            color: "white",
            fontWeight: "bold",
            textAlign: "center"
        }

        return (
            <div style={style}>
                <div style={flexContainer}>
                    {stopwatchImage}
                    {stopwatchDays}
                    {stopwatchHours}
                    {stopwatchMinutes}
                    {stopwatchSeconds}
                </div>
            </div >
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer);