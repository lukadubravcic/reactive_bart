import { connect } from 'react-redux'
import React from 'react';
import agent from '../../agent'
import { isNullOrUndefined } from 'util';

const mapStateToProps = state => ({
    ...state.prefs,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
    updatePref: newPref => {
        agent.Pref.updatePreferences(newPref)
        dispatch({ type: 'PREFS_UPDATED', newPref })
    }
});


class Prefs extends React.Component {

    constructor() {
        super();

        this.clickHandler = ev => {
            this.props.updatePref({ [ev.target.name]: !this.props[ev.target.name] });
        };
    }

    render() {

        const userLoggedIn = Object.keys(this.props.currentUser).length > 0;
        const tooltips = this.props.show_tooltips;
        const notifyTrying = this.props.notify_trying;
        const notifyDone = this.props.notify_done;
        const notifyFailed = this.props.notify_failed;
        const sound = this.props.sound;

        if (userLoggedIn) {

            return (
                <div className="container">
                    <br />
                    <label>Preferences</label>
                    <div className="container">
                        <label><input type="checkbox" name="show_tooltips" checked={tooltips} onChange={this.clickHandler} />Tooltips</label><br />
                        <label><input type="checkbox" name="notify_trying" checked={notifyTrying} onChange={this.clickHandler} />Notify trying</label><br />  {/* onChange={this.toggleCheckboxChange}  */}
                        <label><input type="checkbox" name="notify_done" checked={notifyDone} onChange={this.clickHandler} />Notify completed</label><br />
                        <label><input type="checkbox" name="notify_failed" checked={notifyFailed} onChange={this.clickHandler} />Notify failed</label><br />
                        <label><input type="checkbox" name="sound" checked={sound} onChange={this.clickHandler} />Sound</label><br />
                    </div>
                </div>
            );

        } else return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Prefs);