import React from 'react';

const Stopwatch = props => {

    const stopwatchHours = props.timerValue.timerHours < 10 ? '0' + props.timerValue.timerHours : props.timerValue.timerHours;
    const stopwatchMinutes = props.timerValue.timerMinutes < 10 ? '0' + props.timerValue.timerMinutes : props.timerValue.timerMinutes;
    const stopwatchSeconds = props.timerValue.timerSeconds < 10 ? '0' + props.timerValue.timerSeconds : props.timerValue.timerSeconds;

    return (
        <div id="board-watch-container">

            <div id="watch-AM-PM-container" className="board-watch-block">
                <div id="stopwatch">
                    <svg width="37px" height="44px" viewBox="0 0 37 44" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <title>Fill 20</title>
                        <desc>Created with Sketch.</desc>
                        <defs></defs>
                        <g id="page-02a" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-403.000000, -549.000000)">
                            <g id="Fill-20" transform="translate(403.000000, 549.000000)" fill="#FEFEFE">
                                <path d="M32.299,12.698625 C35.212,15.946625 37,20.224625 37,24.931625 C37,35.062625 28.788,43.274625 18.657,43.274625 C8.526,43.274625 0.313,35.062625 0.313,24.931625 C0.313,15.844625 6.927,8.321625 15.6,6.863625 L15.6,2.511625 L13.561,2.511625 C12.998,2.511625 12.542,2.054625 12.542,1.492625 C12.542,0.930625 12.998,0.473625 13.561,0.473625 L23.752,0.473625 C24.316,0.473625 24.771,0.930625 24.771,1.492625 C24.771,2.054625 24.316,2.511625 23.752,2.511625 L21.714,2.511625 L21.714,6.858625 C25.206,7.450625 28.362,9.022625 30.891,11.291625 L33.264,8.917625 C33.652,8.529625 34.282,8.529625 34.672,8.917625 C35.06,9.305625 35.06,9.936625 34.672,10.324625 L32.299,12.698625 Z M19.676,2.511625 L17.638,2.511625 L17.638,6.639625 C17.977,6.620625 18.312,6.587625 18.657,6.587625 C19.001,6.587625 19.337,6.617625 19.676,6.635625 L19.676,2.511625 Z M18.657,8.626625 C9.652,8.626625 2.351,15.925625 2.351,24.931625 C2.351,33.937625 9.652,41.236625 18.657,41.236625 C27.662,41.236625 34.962,33.937625 34.962,24.931625 C34.962,15.926625 27.662,8.626625 18.657,8.626625 L18.657,8.626625 Z M18.657,29.007625 C16.406,29.007625 14.58,27.182625 14.58,24.931625 C14.58,24.168625 14.803,23.462625 15.17,22.851625 L9.776,17.458625 C9.387,17.070625 9.387,16.439625 9.776,16.051625 C10.165,15.662625 10.795,15.662625 11.183,16.051625 L16.577,21.444625 C17.188,21.078625 17.894,20.855625 18.657,20.855625 C20.908,20.855625 22.733,22.680625 22.733,24.931625 C22.733,27.182625 20.908,29.007625 18.657,29.007625 L18.657,29.007625 Z M18.657,22.893625 C17.532,22.893625 16.619,23.806625 16.619,24.931625 C16.619,26.056625 17.532,26.969625 18.657,26.969625 C19.781,26.969625 20.695,26.056625 20.695,24.931625 C20.695,23.806625 19.781,22.893625 18.657,22.893625 L18.657,22.893625 Z"></path>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
            <div className="board-watch-block">
                <span id="watch-hour" className="watch-digits">{stopwatchHours}</span>
            </div>
            <div className="board-watch-block">
                <span id="watch-min" className="watch-digits">{stopwatchMinutes}</span>
            </div>
            <div id="watch-sec-container" className="board-watch-block">
                <span id="watch-sec" className="watch-digits">{stopwatchSeconds}</span>
            </div>

        </div >
    )
}

export default Stopwatch;