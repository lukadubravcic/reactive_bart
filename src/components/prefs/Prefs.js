import { connect } from 'react-redux'
import React from 'react';
import agent from '../../agent'

const mapStateToProps = state => ({ ...state.prefs });

const mapDispatchToProps = dispatch => ({
    updatePrefs: newPrefs => {
        agent.Pref.updatePreferences(newPrefs)
        dispatch({ type: 'PREFS_UPDATED', newPrefs })
    }
});


class Prefs extends React.Component {

    constructor() {
        super();

        this.clickHandler = ev => {
            this.props.updatePrefs({[ev.target.name]: !this.props[ev.target.name]});
        };
    }

    render() {

        const tooltips = this.props.show_tooltips;
        const notifyTrying = this.props.notify_trying;
        const notifyDone = this.props.notify_done;
        const notifyFailed = this.props.notify_failed;

        return (
            <div className="container">
                <br />
                <label>Preferences</label>
                <div className="container">
                    <label><input type="checkbox" name="show_tooltips" checked={tooltips} onChange={this.clickHandler}/>Tooltips</label><br />
                    <label><input type="checkbox" name="notify_trying" checked={notifyTrying} onChange={this.clickHandler}/>Notify trying</label><br />  {/* onChange={this.toggleCheckboxChange}  */}
                    <label><input type="checkbox" name="notify_done"  checked={notifyDone} onChange={this.clickHandler}/>Notify completed</label><br />
                    <label><input type="checkbox" name="notify_failed" checked={notifyFailed} onChange={this.clickHandler}/>Notify failed</label><br />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Prefs);