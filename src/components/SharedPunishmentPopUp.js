import React from 'react';
import { connect } from 'react-redux';
import agent from '../agent';
import { ERR_DISPLAY_TIME } from '../constants/constants';


const mapStateToProps = state => ({
    sharedPunishment: state.game.sharedPunishment,
    currentUser: state.common.currentUser,
    claimFlag: state.game.claimFlag,
    claimSuccessfulFlag: state.game.claimSuccessfulFlag,
    acceptedPunishments: state.punishment.acceptedPunishments,
});

const mapDispatchToProps = dispatch => ({
    claimPunishment: async (id) => {
        let res = null;

        try {
            res = await agent.Punishment.claimPunishment(id);
        } catch (err) {
            dispatch({
                type: 'SHARED_PUNISHMENT_INVALID',
                msg: 'Could not claim that punishment!',
                msgDuration: ERR_DISPLAY_TIME,
            });
            return false;
        }
console.log(res)
        if (
            res !== null
            && typeof res.err_code !== 'undefined'
            && typeof res.msg !== 'undefined'
        ) {
            dispatch({
                type: 'SHARED_PUNISHMENT_INVALID',
                msg: res.msg,
                msgDuration: ERR_DISPLAY_TIME,
            });
            return true;
        }

        if (
            res !== null
            && res && typeof res.msg !== 'undefined'
            && res.msg === 'OK'
            && typeof res.punishment !== 'undefined'
            && res.punishment.uid
        ) {
            return res.punishment;
        } else return false;
    },
    trySharedPunishment: id => {
        agent.Punishment.trySharedPunishment(id);
    },
    setActivePunishment: punishment => dispatch({ type: 'SET_ACTIVE_PUNISHMENT', punishment }),
    setClaimFlag: () => dispatch({ type: 'SET_CLAIM_FLAG' }),
    setClaimSuccessfulFlag: value => {

        dispatch({ type: 'SET_CLAIM_SUCCESSFUL_FLAG', value })
    },
    updateAcceptedPunishments: punishments => dispatch({ type: 'ACCEPTED_PUNISHMENTS_CHANGED', punishments }),
    removeSharedPunishment: () => dispatch({ type: 'REMOVE_SHARED_PUNISHMENT' }),
});

class SharedPunishmentPopUp extends React.Component {
    constructor(props) {
        super(props);

        this.claimBtnRef = null;
        this.tryBtnRef = null;

        this.state = {
            showComponent: false,
            claimBtnDisabled: false,
            tryBtnDisabled: false,
        }

        this.hidePopup = ev => {
            ev && ev.preventDefault();
            this.setState({ showComponent: false });
        }

        this.outsideElementClick = ev => {
            if (ev.target.id !== 'claim-popup-outside') return;

            this.removeSharedPunishment();
            this.hidePopup();
        }

        this.btnCloseClick = ev => {
            ev && ev.preventDefault();
            this.removeSharedPunishment();
            this.hidePopup();
        }

        this.ignoreClick = ev => {
            ev.preventDefault();
            this.removeSharedPunishment();
            this.hidePopup();
        }

        this.tryClick = ev => {
            ev.preventDefault();
            if (this.props.sharedPunishment === null) return;
            // tryShared be req
            // postaviti kaznu kao aktivnu

            this.setState({ tryBtnDisabled: true })
            this.props.trySharedPunishment(this.props.sharedPunishment.uid);
            this.props.setActivePunishment(this.props.sharedPunishment);
            this.removeSharedPunishment();
            this.hidePopup();
        }

        this.claimClick = async ev => {
            ev.preventDefault();
            if (this.props.sharedPunishment === null) return;
            // claim be request
            // postaviti kaznu kao aktivnu
            if (
                Object.keys(this.props.currentUser).length > 0
                && this.props.currentUser._id !== null
            ) {
                this.setState({ claimBtnDisabled: true });
                this.claimPunishment();
            } else {
                this.props.setClaimFlag();
            }

            return this.hidePopup();
        }

        this.claimPunishment = async () => {
            if (this.props.sharedPunishment === null) throw new Error('No shared punishment to claim');
            let claimedPunishment = await this.props.claimPunishment(this.props.sharedPunishment.uid);

            // provjera ako je ta kazna vec u accepted kaznama -> postavi je na plocu

            console.log(getPunishmentByUid(this.props.acceptedPunishments, this.props.sharedPunishment.uid));
            return;

            this.props.setClaimSuccessfulFlag(!!claimedPunishment);
            if (!!claimedPunishment === false) return;

            this.props.setActivePunishment(claimedPunishment);
        }

        this.removeSharedPunishment = () => {
            this.props.removeSharedPunishment();
        }
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.sharedPunishment === null
            && this.props.sharedPunishment !== null
            && typeof this.props.sharedPunishment === 'object'
        ) {
            this.setState({ showComponent: true });
        }

        const userJustLoggedIn = Object.keys(prevProps.currentUser).length === 0 && Object.keys(this.props.currentUser).length;

        if (
            userJustLoggedIn
            && this.props.claimFlag === true
        ) {
            this.claimPunishment();
        }
    }

    render() {
        if (this.state.showComponent !== true || this.props.sharedPunishment === null) return null;

        const orderedBy = typeof this.props.sharedPunishment.ordering_username !== 'undefined' && this.props.sharedPunishment.ordering_username !== null
            ? this.props.sharedPunishment.ordering_username
            : null;
        const howManyTimes = this.props.sharedPunishment.how_many_times;
        const whatToWrite = this.props.sharedPunishment.what_to_write;
        const deadline = getDeadlineString(this.props.sharedPunishment.deadline);
        const claims = this.props.sharedPunishment.shared_claims;
        const tries = this.props.sharedPunishment.shared_tries;
        const userLoggedIn = Object.keys(this.props.currentUser).length > 0 && this.props.currentUser._id !== null;

        return (
            <div
                id="claim-popup-outside"
                className="popup-component"
                onClick={this.outsideElementClick}>

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
                            id="claim-close-btn"
                            className="btn-close-share-dialog"
                            onClick={this.btnCloseClick}>
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
                                <button
                                    ref={elem => this.claimBtnRef = elem}
                                    id="claim-btn"
                                    className="btn-submit shared-popup-btns"
                                    disabled={this.state.claimBtnDisabled}
                                    onClick={this.claimClick}>
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
                                    ref={elem => this.tryBtnRef = elem}
                                    className="btn-submit shared-popup-btns"
                                    onClick={this.tryClick}
                                    disabled={this.state.tryBtnDisabled}>
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
    <svg id="claim-close-btn" width="20px" height="19px" viewBox="0 0 20 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
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
    let day = date.getDate();
    day = day < 10 ? "0" + day : day;
    let month = date.getMonth() + 1;
    month = month > 9 ? month : "0" + month;
    let year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


function getPunishmentByUid(arr, uid) {
    if (!arr.length) return null;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i].uid === uid) return arr[i];
    }

    return null;
}