import { connect } from 'react-redux'
import React from 'react';
import agent from '../../agent'
import NewPasswordContainer from '../user/newPassword/NewPasswordContainer';

const mapStateToProps = state => ({
    ...state.prefs,
    currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
    updatePref: newPref => {
        agent.Pref.updatePreferences(newPref);
        dispatch({ type: 'PREFS_UPDATED', newPref });
    },
});


class Prefs extends React.Component {

    constructor() {
        super();

        this.state = {
            showChangePwdForm: false,
        };

        this.clickHandler = ev => {
            this.props.updatePref({ [ev.target.name]: !this.props[ev.target.name] });
        };

        this.toggleShowChangePwdForm = ev => {
            ev.preventDefault();
            this.setState({
                showChangePwdForm: !this.state.showChangePwdForm,
            });
        };

        this.hideChangePwdForm = () => {
            this.setState({
                showChangePwdForm: false,
            });
        }
    }

    render() {
        const userLoggedIn = Object.keys(this.props.currentUser).length > 0;
        const tooltips = this.props.show_tooltips;
        const punishmentAccepted = this.props.punishment_accepted;
        const punishmentRejected = this.props.punishment_rejected;
        const punishmentIgnored = this.props.punishment_ignored;
        const notifyTrying = this.props.notify_trying;
        const notifyDone = this.props.notify_done;
        const notifyFailed = this.props.notify_failed;
        const punishmentGivenUp = this.props.punishment_givenup;
        const sound = this.props.sound;

        if (userLoggedIn) {
            return (
                <div>
                    <div id="prefs" className="parent-component prefs-component-container">
                        <div className="container pref-content-container">
                            <a
                                id="change-pwd-link"
                                onClick={this.toggleShowChangePwdForm}>
                                CHANGE PASSWORD
                            </a>
                            <div className="prefs-left-container float-left">
                                <label id="prefs-heading" className="heading">Prefs</label>
                            </div>
                            <div className="float-left prefs-container">
                                <div className="prefs-row">
                                    <label className="float-left pref-chexbox-cont">
                                        <input
                                            name="show_tooltips"
                                            type="checkbox"
                                            checked={tooltips}
                                            onChange={this.clickHandler} />
                                        <span id="pref-checkmark"></span>
                                    </label>
                                    <label className="pref-name">tooltips</label>
                                </div>
                                <div className="prefs-row">
                                    <label className="float-left pref-chexbox-cont">
                                        <input
                                            name="punishment_accepted"
                                            type="checkbox"
                                            checked={punishmentAccepted}
                                            onChange={this.clickHandler} />
                                        <span id="pref-checkmark"></span>
                                    </label>
                                    <label className="pref-name">notify on accepted</label>
                                </div>
                                <div className="prefs-row">
                                    <label className="float-left pref-chexbox-cont">
                                        <input
                                            name="punishment_rejected"
                                            type="checkbox"
                                            checked={punishmentRejected}
                                            onChange={this.clickHandler} />
                                        <span id="pref-checkmark"></span>
                                    </label>
                                    <label className="pref-name">notify on rejected</label>
                                </div>
                                <div className="prefs-row">
                                    <label className="float-left pref-chexbox-cont">
                                        <input
                                            name="punishment_ignored"
                                            type="checkbox"
                                            checked={punishmentIgnored}
                                            onChange={this.clickHandler} />
                                        <span id="pref-checkmark"></span>
                                    </label>
                                    <label className="pref-name">notify on ignored</label>
                                </div>
                                <div className="prefs-row">
                                    <label className="float-left pref-chexbox-cont">
                                        <input
                                            name="notify_trying"
                                            type="checkbox"
                                            checked={notifyTrying}
                                            onChange={this.clickHandler} />
                                        <span id="pref-checkmark"></span>
                                    </label>
                                    <label className="pref-name">notify trying</label>
                                </div>
                                <div className="prefs-row">
                                    <label className="float-left pref-chexbox-cont">
                                        <input
                                            name="notify_done"
                                            type="checkbox"
                                            checked={notifyDone}
                                            onChange={this.clickHandler} />
                                        <span id="pref-checkmark"></span>
                                    </label>
                                    <label className="pref-name">notify on completed</label>
                                </div>
                                <div className="prefs-row">
                                    <label className="float-left pref-chexbox-cont">
                                        <input
                                            name="notify_failed"
                                            type="checkbox"
                                            checked={notifyFailed}
                                            onChange={this.clickHandler} />
                                        <span id="pref-checkmark"></span>
                                    </label>
                                    <label className="pref-name">notify failed</label>
                                </div>
                                <div className="prefs-row">
                                    <label className="float-left pref-chexbox-cont">
                                        <input
                                            name="punishment_givenup"
                                            type="checkbox"
                                            checked={punishmentGivenUp}
                                            onChange={this.clickHandler} />
                                        <span id="pref-checkmark"></span>
                                    </label>
                                    <label className="pref-name">notify on giving up</label>
                                </div>
                                <div className="prefs-row">
                                    <label className="float-left pref-chexbox-cont">
                                        <input
                                            name="sound"
                                            type="checkbox"
                                            checked={sound}
                                            onChange={this.clickHandler} />
                                        <span id="pref-checkmark"></span>
                                    </label>
                                    <label className="pref-name">sound on/off</label>
                                </div>
                            </div>
                            <div className="prefs-bottom-image-container">
                                {bottomSVG}
                            </div>
                        </div>
                    </div>
                    <NewPasswordContainer showForm={this.state.showChangePwdForm} hideForm={this.hideChangePwdForm} />
                </div>
            );
        } else return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Prefs);


const bottomSVG = (
    <svg id="prefs-bottom-image" width="1080px" height="234px" viewBox="0 0 1080 234" version="1.1" xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="pref-img" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-100.000000, -5423.000000)">
            <g id="Group-Copy-9" transform="translate(0.000000, 5242.000000)">
                <g id="Group-13" transform="translate(100.000000, 181.000000)">
                    <polygon id="Fill-7-Copy-9" fill="#2B80B2" points="-2.38411233e-13 234 1080 234 1080 214 -2.38411233e-13 214"></polygon>
                    <polygon id="Fill-15-Copy-4" fill="#FEFEFE" points="992 214 1030 214 1030 205 992 205"></polygon>
                    <g id="Group" transform="translate(904.000000, 0.000000)">
                        <path d="M36.8397,182.4004 C44.5267,180.3404 43.2437,150.6294 33.9747,116.0374 C24.7067,81.4464 3.2747,57.1334 3.2747,57.1334 C3.2747,57.1334 -3.1303,88.9044 6.1387,123.4964 C15.4077,158.0884 29.1527,184.4604 36.8397,182.4004"
                            id="Fill-17-Copy" fill="#2B80B2"></path>
                        <path d="M42.074,167.2939 C34.387,165.2339 35.67,135.5229 44.939,100.9309 C54.207,66.3399 75.639,42.0269 75.639,42.0269 C75.639,42.0269 82.044,73.7979 72.775,108.3899 C63.506,142.9819 49.761,169.3539 42.074,167.2939"
                            id="Fill-19-Copy" fill="#4F69A8"></path>
                        <path d="M38.0823,155.2449 C46.0403,155.2449 52.4913,120.6839 52.4913,78.0509 C52.4913,35.4179 38.0823,0.8569 38.0823,0.8569 C38.0823,0.8569 23.6733,35.4179 23.6733,78.0509 C23.6733,120.6839 30.1243,155.2449 38.0823,155.2449"
                            id="Fill-21-Copy" fill="#4F69A8"></path>
                        <polygon id="Fill-25-Copy-2" fill="#A479E1" points="0 138.7769 17.992 213.9039 58.173 213.9039 76.165 138.7769"></polygon>
                    </g>
                    <g id="Fill-30-+-Fill-28-+-Fill-33-Copy-4" transform="translate(765.000000, 182.000000)">
                        <path d="M6.1682,6 L6.1682,26 L95.1082,26 C95.1082,26 103.1082,26 103.1082,17.3513514 L103.1082,14.6486486 C103.1082,14.6486486 103.1082,6 95.1082,6 L6.1682,6 Z"
                            id="Fill-30" fill="#FF948A"></path>
                        <path d="M110.5082,17.1162791 L110.5082,14.8837209 C110.5082,14.8837209 110.5082,0 95.7737733,0 L0,0 L0,6.69767442 L95.037052,6.69767442 C103.140987,6.69767442 103.140987,14.8837209 103.140987,14.8837209 L103.140987,17.1162791 C103.140987,25.3023256 95.037052,25.3023256 95.037052,25.3023256 L0,25.3023256 L0,32 L95.7737733,32 C95.7737733,32 110.5082,32 110.5082,17.1162791"
                            id="Fill-28" fill="#A479E1"></path>
                        <polygon id="Fill-33" fill="#FF545F" points="63 15.0397 63 31.3637 68.5 26.1397 74 31.3637 74 15.0397"></polygon>
                    </g>
                </g>
            </g>
        </g>
    </svg>
)


