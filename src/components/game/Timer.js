import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    ...state
});


class Timer extends React.Component {

    render() {
        return (
            <div>
                <div id="image-clock-div">
                    <img id="clock-image" src="/assets/images/clock.png" alt="CLOCK" />
                </div>
                <div id="countdown-digits-container">
                    <label></label>:
                    <label></label>:
                    <label></label>:
                    <label></label>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Timer);