import { connect } from 'react-redux'
import React from 'react';
import agent from '../../agent'

const mapStateToProps = state => ({ ...state.prefs });

const mapDispatchToProps = dispatch => ({
    updatePrefs: newPrefs => {
        // slanje na back end
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

        const tooltips = this.props.showTooltips;
        const notifyTrying = this.props.notifyTrying;
        const notifyDone = this.props.notifyDone;
        const notifyFailed = this.props.notifyFailed;

        return (
            <div className="container">
                <br />
                <label>Preferences</label>
                <div className="container">
                    <label><input type="checkbox" name="tooltips" checked={tooltips} onChange={this.clickHandler}/>Tooltips</label><br />
                    <label><input type="checkbox" name="notifyTrying" checked={notifyTrying} onChange={this.clickHandler}/>Notify trying</label><br />  {/* onChange={this.toggleCheckboxChange}  */}
                    <label><input type="checkbox" name="notifyDone"  checked={notifyDone} onChange={this.clickHandler}/>Notify completed</label><br />
                    <label><input type="checkbox" name="notifyFailed" checked={notifyFailed} onChange={this.clickHandler}/>Notify failed</label><br />
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Prefs);