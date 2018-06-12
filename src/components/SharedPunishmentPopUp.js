import React from 'react';
import { connect } from 'react-redux';
import agent from '../agent';


const mapStateToProps = state => ({
    sharedPunishment: state.game.sharedPunishment,
    currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
    ignoreSharedPunishment: () => dispatch({ type: 'SHARED_PUNISHMNET_IGNORED' }),
    claimPunishment: id => {
        agent.Punishment.claimPunishment();
    },
    trySharedPunishment: id => {
        agent.Punishment.trySharedPunishment();
    },
    setActivePunishment: punishment => dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment }),
    setClaimFlag: () => dispatch({ type: 'SET_CLAIM_FLAG' }),
});

class SharedPunishmentPopUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showComponent: false,
        }

        this.hidePopup = ev => {
            ev && ev.preventDefault();
            this.setState({ showComponent: false });
        }

        this.closeShareDialog = ev => {
            if (ev.target.id === "shared-popup-outside") // this.hideDialog();
                return;
        }

        this.ignoreClick = ev => {
            ev.preventDefault();
            this.props.ignoreSharedPunishment();
            this.hidePopup();
        }

        this.tryClick = ev => {
            ev.preventDefault();
            if (this.props.sharedPunishment === null) return;
            // tryShared be req
            // postaviti kaznu kao aktivnu
            this.props.claimPunishment(this.props.sharedPunishment.uid);
            this.props.setActivePunishment(this.props.sharedPunishment);
        }

        this.claimClick = ev => {
            ev.preventDefault();
            if (this.props.sharedPunishment === null) return;
            // claim be request
            // postaviti kaznu kao aktivnu
            if (
                Object.keys(this.props.currentUser).length > 0
                && this.props.currentUser._id !== null
            ) {
                this.props.trySharedPunishment(this.props.sharedPunishment.uid);
                this.props.setActivePunishment(this.props.sharedPunishment);
                // dodati u picker (accepted?) kazne i u skoldboard
            } else {
                this.props.setClaimFlag();
            }
        };
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.sharedPunishment === null
            && this.props.sharedPunishment !== null
            && typeof this.props.sharedPunishment === 'object'
        ) {
            this.setState({ showComponent: true });
        }
    }

    render() {
        if (this.state.showComponent !== true) return null;

        const orderedBy = this.props.sharedPunishment.ordering_username !== null ? this.props.sharedPunishment.ordering_username : null;
        const howManyTimes = this.props.sharedPunishment.how_many_times;
        const whatToWrite = this.props.sharedPunishment.what_to_write;
        const deadline = getDeadlineString(this.props.sharedPunishment.deadline);
        const claims = this.props.sharedPunishment.shared_claims;
        const tries = this.props.sharedPunishment.shared_tries;
        const userLoggedIn = Object.keys(this.props.currentUser).length > 0 && this.props.currentUser._id !== null;

        return (
            <div
                id="shared-popup-outside"
                className="popup-component"
                onClick={this.closeShareDialog}>

                <div className="shared-popup-container">

                    <div className="align-center shared-popup-header-container">
                        <div>
                            <label className="shared-popup-title">
                                Take it!
                        </label>
                        </div>
                        {orderedBy
                            ? <div className="shared-popup-pad-top">

                                <span className="shared-popup-ordered-by">
                                    ORDERED BY <span className="shared-popup-ordering-name">{orderedBy}</span>
                                </span>
                            </div>
                            : null}
                        <button
                            className="btn-close-share-dialog"
                            onClick={this.hidePopup}>
                            {closeBtnSVG}
                        </button>
                    </div>

                    <div className="align-center shared-popup-content-container">
                        <div>
                            <span className="shared-popup-how-many-times">Write {howManyTimes}x</span>
                        </div>
                        <div className="pad-bot-30">
                            <span className="shared-popup-pun-text">{whatToWrite}</span>
                        </div>
                        {deadline
                            ? <div className="shared-popup-deadline-container">
                                <span className="shared-popup-deadline-element">
                                    DEADLINE <span className="shared-popup-deadline">{deadline}</span>
                                </span>
                            </div>
                            : null
                        }
                    </div>

                    <div className="align-center shared-popup-footer-container">
                        <div className="shared-popup-btn-container">
                            <div className="btn-container">
                                <button id="claim-btn" className="btn-submit shared-popup-btns">
                                    CLAIM
                                </button>

                                {userLoggedIn
                                    ? null
                                    : <a className="login-to-claim-link">
                                        LOG IN TO CLAIM
                                    </a>
                                }
                            </div>
                            <div className="btn-container">
                                <button
                                    className="btn-submit shared-popup-btns"
                                    onClick={this.tryClick}>
                                    TRY
                                </button>
                            </div>
                            <div className="btn-container">
                                <button
                                    className="btn-submit shared-popup-btns"
                                    onClick={this.ignoreClick}>
                                    IGNORE
                                </button>
                            </div>
                        </div>

                        <div className="shared-popup-pun-info-container">
                            <label className="shared-popup-pun-info">
                                {claims} claims and {tries} tries so far.
                            </label>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SharedPunishmentPopUp);


const closeBtnSVG = (
    <svg width="20px" height="19px" viewBox="0 0 20 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="square">
            <g id="Share" transform="translate(-541.000000, -20.000000)" stroke="#FFFFFF">
                <g id="Line-+-Line-Copy" transform="translate(541.000000, 20.000000)">
                    <path d="M0.526315789,0.526315789 L18.9548854,18.9548854" id="Line"></path>
                    <path d="M0.526315789,0.526315789 L18.9548854,18.9548854" id="Line-Copy" transform="translate(10.000000, 10.000000) scale(-1, 1) translate(-10.000000, -10.000000) "></path>
                </g>
            </g>
        </g>
    </svg>
);


function getDeadlineString(deadline) {
    if (deadline === null) return null;

    const date = new Date(deadline);
    let day = date.getDay();
    day = day < 10 ? "0" + day : day;
    let month = date.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
}