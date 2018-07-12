import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import { trimExcessSpaces } from '../../helpers/helpers';

import DateElement from './DateElement';
import ShareAnonCheckbox from './ShareAnonCheckbox';

import 'react-datepicker/dist/react-datepicker.css';

const SHOW_ENTRY_LENGTH_MSG_CHAR_LIMIT = 20;
const PUNISHMENT_MAX_LENGTH = 100;
const PUNISHMENT_WHY_MAX_LENGTH = 500;
const MAX_HOW_MANY_TIMES_PUNISHMENT = 999;

const mapStateToProps = state => ({
    ...state.punishmentCreation,
    orderedPunishments: state.punishment.orderedPunishments,
    currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
    onChangeWhom: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'whom',
        value,
    }),
    onChangeHowManyTimes: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'howManyTimes',
        value,
    }),
    onChangeWhatToWrite: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'whatToWrite',
        value,
    }),
    onChangeWhy: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'why',
        value,
    }),
    onChangeDeadlineCheckbox: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'deadlineChecked',
        value,
    }),
    onChangeAnonShareCheckbox: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'anonShare',
        value,
    }),
    setErrMsg: msg => dispatch({ type: 'SHOW_ERR_MESSAGE', msg }),
    onSubmit: (submitData, orderedPunishments, enableSubmit) => {
        // agent magic
        dispatch({ type: 'SUBMITING_NEW_PUNISHMENT' });
        agent.Punishment.createPunishment(submitData).then(payload => {

            let newOrderedPunishments = orderedPunishments.length > 0
                ? JSON.parse(JSON.stringify(orderedPunishments))
                : [];
            if (orderedPunishments.length === 0) newOrderedPunishments.push(payload);
            else newOrderedPunishments.unshift(payload);

            if (!payload.errorMsg) {
                dispatch({ type: 'PUNISHMENT_CREATED', newOrderedPunishments, msg: 'Request sent!' });
            } else dispatch({ type: 'PUNISHMENT_CREATED_ERROR', msg: payload.errorMsg });

            enableSubmit();
        }, rejected => {
            dispatch({ type: 'PUNISHMENT_CREATED_ERROR', msg: 'Ouch! Something went wrong.' });
        });
    },
    submitSharedPunishment: async (submitData, enableSubmit) => {
        dispatch({ type: 'SUBMITING_NEW_PUNISHMENT' });
        let res = null;

        try {
            res = await agent.Punishment.createdSharedPunishment(submitData);
        } catch (err) {
            dispatch({ type: 'PUNISHMENT_CREATED_ERROR', msg: 'SOMETHING WENT WRONG' });
            return false;
        }

        if (typeof res.err !== 'undefined') {
            dispatch({ type: 'PUNISHMENT_CREATED_ERROR', msg: res.err });
            return false;
        }
        else if (typeof res.msg === 'undefined') {
            dispatch({ type: 'PUNISHMENT_CREATED_ERROR', msg: 'SOMETHING WENT WRONG' });
            return false;
        }

        enableSubmit();
        return res;
    },
    clearDisplayMessage: () => dispatch({ type: 'CLEAR_DISPLAY_MSG' }),
    clearPunishingUser: () => dispatch({ type: 'CLEAR_PUNISHING_USER' }),
    updateOrderedPunishments: (newOrderedPunishments, msg) => dispatch({ type: 'PUNISHMENT_CREATED', newOrderedPunishments, msg }),
    showLoginForm: () => dispatch({ type: 'SHOW_LOGIN_FORM' }),
    clearFormEntries: () => dispatch({ type: 'CLEAR_FORM_ENTRIES' }),
});

const animationDuration = 500; // 0.5s
const formMsgDuration = 5000; // 5s

const animStyles = {
    shownDateComponent: { opacity: 1 },
    hiddenDateComponent: { opacity: 0 },
}


class PunishmentCreator extends React.Component {

    constructor() {
        super();
        this.formMsgTimeout = null;
        this.formContainerRef = null;
        this.topElement = null;

        this.state = {
            dateElementStyle: {
                display: 'inline-block',
                opacity: 0,
                transition: 'opacity 0.5s'
            },
            showTryMailTooltip: false,
            whatToWriteFieldValid: true,
            whyFieldValid: true,
            showMasochistTooltip: false,

            showFormMsg: false,
            submitDisabled: false,
        }

        this.onWhomBlur = async ev => {
            ev.preventDefault();
            // provjeri jel unesen username (!isMail):
            //  - ako je, provjeri jel postoji:
            //      - postoji - nista
            //      - ne postoji - poruka "try email instead"      
            if (checkIfSameUser(this.props.whom, this.props.currentUser)) return this.setState({ showMasochistTooltip: true });

            if (isMail(this.props.whom) || this.props.whom.length === 0) return this.setState({ showTryMailTooltip: false });
            let { exist } = await agent.Auth.checkIfUserExists(this.props.whom);
            if (!exist) return this.setState({ showTryMailTooltip: true });
        }

        this.changeWhom = ev => {
            this.setState({
                showTryMailTooltip: false, showMasochistTooltip: false
            });
            // this.validateToWhomValue(ev.target.value);
            this.props.onChangeWhom(ev.target.value);
        }

        /* this.validateToWhomValue = value => {
            if (!isMail(value)) {
                if (value.length > 30) this.toWhomErrorText = 'Username can\'t be that long. Maximum 30 characters.';
                else this.toWhomErrorText = null;
            }
        } */

        this.changeHowManyTimes = ev => {
            if (ev.target.value > MAX_HOW_MANY_TIMES_PUNISHMENT) ev.target.value = MAX_HOW_MANY_TIMES_PUNISHMENT;
            else if (ev.target.value < 1) ev.target.value = 1;
            this.props.onChangeHowManyTimes(ev.target.value);
        }

        this.changeWhatToWrite = ev => {
            if (ev.target.value.length <= PUNISHMENT_MAX_LENGTH && ev.target.value.length > 0) {
                this.setState({ whatToWriteFieldValid: true });
            } else if (ev.target.value.length > PUNISHMENT_MAX_LENGTH) {
                return; //this.setState({ whatToWriteFieldValid: false });
            }
            this.props.onChangeWhatToWrite(ev.target.value);
        }

        this.changeWhy = ev => {
            if (ev.target.value.length < PUNISHMENT_WHY_MAX_LENGTH && ev.target.value.length >= 0) {
                this.setState({ whyFieldValid: true });
            } else if (ev.target.value.length > PUNISHMENT_WHY_MAX_LENGTH) {
                return; //this.setState({ whyFieldValid: false });
            }
            this.props.onChangeWhy(ev.target.value);
        }

        this.incrementHowManyTimes = ev => {
            ev.preventDefault();
            if (this.props.howManyTimes < MAX_HOW_MANY_TIMES_PUNISHMENT) this.props.onChangeHowManyTimes(parseInt(this.props.howManyTimes, 10) + 1, 10);
        }

        this.decrementHowManyTimes = ev => {
            ev.preventDefault();
            if (this.props.howManyTimes > 1) this.props.onChangeHowManyTimes(this.props.howManyTimes - 1);
        }

        this.toggleDeadlineCheckbox = ev => {
            if (!this.props.deadlineChecked) {
                this.props.onChangeDeadlineCheckbox(!this.props.deadlineChecked);
                this.animateDateFadeIn();
            } else {
                this.animateDateFadeOut();
                setTimeout(() => {
                    this.props.onChangeDeadlineCheckbox(!this.props.deadlineChecked);
                }, animationDuration);
            }
        }

        this.toggleAnonShareCheckbox = ev => {
            this.props.onChangeAnonShareCheckbox(!this.props.anonShare);
        }

        this.submitForm = (whomField, howManyTimesField, deadlineChecked, whatToWriteField, whyField, anonShare) => ev => {
            ev.preventDefault();

            if (deadlineChecked && !this.props.deadlineValid) return this.props.setErrMsg('Invalid deadline.');
            if (whomField === '') return this.createSharedPunishment(whomField, howManyTimesField, deadlineChecked, whatToWriteField, whyField, anonShare);

            this.refs.submitPunishmentBtn.setAttribute('disabled', 'true');

            let submitData = {};
            isMail(whomField)
                ? submitData.whomEmail = whomField
                : submitData.whomUsername = whomField;
            submitData.howManyTimes = howManyTimesField;
            submitData.deadlineDate = deadlineChecked
                ? new Date(this.props.yearField, this.props.monthField - 1, this.props.dayField, 12, 0, 0, 0).toString()
                : null;
            submitData.whatToWrite = trimExcessSpaces(whatToWriteField);
            submitData.why = trimExcessSpaces(whyField);

            this.props.onSubmit(submitData, this.props.orderedPunishments, this.enableSubmit);
        }

        this.createSharedPunishment = async (whomField, howManyTimesField, deadlineChecked, whatToWriteField, whyField, anonShare) => {
            // napravi punishment object i salji ga send funkciji
            this.disableSubmit();

            let submitData = {};

            isMail(whomField)
                ? submitData.whomEmail = whomField
                : submitData.whomUsername = whomField;
            submitData.howManyTimes = howManyTimesField;
            submitData.deadlineDate = deadlineChecked
                ? new Date(this.props.yearField, this.props.monthField - 1, this.props.dayField, 12, 0, 0, 0).toString()
                : null;
            submitData.whatToWrite = trimExcessSpaces(whatToWriteField);
            submitData.why = trimExcessSpaces(whyField);
            submitData.anon = anonShare;

            let result = await this.props.submitSharedPunishment(submitData, this.enableSubmit);

            if (result === false) return this.enableSubmit();

            // update ordered kazni ako kazna nije anon
            if (result.punishment.fk_user_uid_ordering_punishment !== null) {
                let newOrderedPunishments = [...this.props.orderedPunishments];
                newOrderedPunishments.unshift(result.punishment);
                this.props.updateOrderedPunishments(newOrderedPunishments, result.msg)
            }

            // otvaranje share prozora
            let shareData = {
                shareLink: result.shareLink,
                anon: anonShare,
                punishment: { ...result.punishment, why: submitData.why },
            };

            this.props.shareDialogVisibilityHandler(true, shareData);
            this.props.clearFormEntries();
        }

        this.disableSubmit = () => {
            this.refs.submitPunishmentBtn.setAttribute('disabled', 'true');
            this.setState({ submitDisabled: true });
        }

        this.enableSubmit = () => {
            this.refs.submitPunishmentBtn.removeAttribute('disabled');
            this.setState({ submitDisabled: false });
        }

        this.animateDateFadeIn = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.setState({ dateElementStyle: { ...this.state.dateElementStyle, ...animStyles.shownDateComponent } });
                });
            });
        }

        this.animateDateFadeOut = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.setState({ dateElementStyle: { ...this.state.dateElementStyle, ...animStyles.hiddenDateComponent } });
                });
            });
        }

        this.displayFormMessage = () => {
            this.setState({ showFormMsg: true });
            this.formMsgTimeout = setTimeout(() => {
                this.setState({ showFormMsg: false });
                this.props.clearDisplayMessage();
            }, formMsgDuration)
        }

        this.goToLoginForm = () => {
            this.props.showLoginForm();
            if (this.topElement) this.topElement.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps._errMsg === null && this.props._errMsg !== null) {
            this.displayFormMessage();
        }

        if (
            prevProps.punishingUserSetFromOuterComponent === null
            && this.props.punishingUserSetFromOuterComponent !== null
            && this.props.punishingUserSetFromOuterComponent.length
        ) {
            if (this.formContainerRef !== null) this.formContainerRef.scrollIntoView({ behavior: 'smooth' });
            this.props.clearPunishingUser();
        }
    }

    componentDidMount() {
        this.topElement = document.getElementById("top");
    }

    componentWillUnmount() {
        clearTimeout(this.formMsgTimeout);
    }

    render() {
        const usrLoggedIn = Object.keys(this.props.currentUser).length;
        const whomField = this.props.whom;
        const howManyTimesField = this.props.howManyTimes;
        const whatToWriteField = this.props.whatToWrite;
        const whyField = this.props.why;
        const deadlineChecked = this.props.deadlineChecked;
        const anonShare = this.props.anonShare;
        const validDeadline = deadlineChecked
            ? (this.props.deadlineValid
                && this.props.yearField !== ''
                && this.props.monthField !== ''
                && this.props.dayField !== '')
            : true;
        const submitDisabled =
            this.state.showTryMailTooltip
            || this.state.showMasochistTooltip
            || !validDeadline
            || whatToWriteField === ''
            || !this.state.whatToWriteFieldValid
            || !this.state.whyFieldValid
            || this.state.showFormMsg
            || this.state.submitDisabled;
        const submitBtnStyle = this.state.showFormMsg || submitDisabled
            ? { opacity: 0.5, pointerEvents: "none" }
            : { opacity: 1 };
        const heading = usrLoggedIn /* && window.canRunAds */ ? 'Your turn to punish someone!' : 'Punish them all!';

        return (

            <div id="creator-component-container" className="parent-component height-tran">

                <div
                    ref={elem => this.formContainerRef = elem}
                    className="container">

                    <div id="creator-heading-container">
                        <h1 id="creator-heading">{heading}</h1>
                    </div>

                    <form
                        id="pun-creation-form"
                        disabled={false/* !window.canRunAds */}
                        onSubmit={this.submitForm(whomField, howManyTimesField, deadlineChecked, whatToWriteField, whyField, anonShare)}>

                        <fieldset
                            className="form-row"
                            disabled={!usrLoggedIn/* !window.canRunAds */}>

                            <label
                                style={usrLoggedIn ? {} : { opacity: 0.6 }}
                                className="float-left input-field-name">
                                WHOM
                            </label>
                            <input
                                style={usrLoggedIn ? {} : { opacity: 0.6 }}
                                id="whom-input"
                                className={`float-left text-input ${this.state.showTryMailTooltip || this.state.showMasochistTooltip ? "input-wrong-entry" : ""}`}
                                type="text"
                                placeholder="e-mail/username"
                                value={whomField}
                                onChange={this.changeWhom}
                                onBlur={this.onWhomBlur}
                                spellCheck="false"
                            />
                            {this.state.showTryMailTooltip ? <label id="whom-feedback" className="float-left form-feedback"><span className="form-submit-feedback-content">TRY E-MAIL INSTEAD</span></label> : null}
                            {this.state.showMasochistTooltip ? <label id="whom-feedback" className="float-left form-feedback"><span className="form-submit-feedback-content">MASOCHIST?</span></label> : null}
                            {!this.state.showTryMailTooltip && !this.state.showMasochistTooltip && usrLoggedIn
                                ? <label id="form-submit-feedback" className="float-left form-feedback"><span className="form-submit-feedback-content">LEAVE EMPTY TO<br /> SHARE A PUNISHMENT</span></label>
                                : !this.state.showTryMailTooltip && !this.state.showMasochistTooltip && !usrLoggedIn
                                    ? <label id="form-submit-feedback" className="float-left form-feedback">
                                        <span className="form-submit-feedback-content">
                                            <a
                                                className="login-link"
                                                onClick={this.goToLoginForm}>

                                                LOG IN</a>&nbsp;
                                            TO ENABLE<br />PERSONAL PUNISHMENTS
                                            </span>
                                    </label>
                                    : null
                            }
                        </fieldset>

                        <fieldset
                            className="form-row"
                            disabled={false/* !window.canRunAds */}>

                            <label className="float-left input-field-name">HOW MANY TIMES</label>
                            <button
                                id="decrement-button"
                                className="float-left btn-range"
                                type="button"
                                onClick={this.decrementHowManyTimes}
                            >
                                {decrementBtnSvg}
                            </button>

                            <input
                                id="how-many-times-input"
                                className="float-left text-input"
                                type="number"
                                min="1"
                                max="999"
                                placeholder="999"
                                value={howManyTimesField}
                                onChange={this.changeHowManyTimes}
                                required
                            />

                            <button
                                id="increment-button"
                                className="float-left btn-range"
                                type="button"
                                onClick={this.incrementHowManyTimes}
                            >
                                {incrementBtnSvg}
                            </button>
                        </fieldset>

                        {deadlineChecked ?
                            <fieldset
                                className="form-row"
                                disabled={false/* !window.canRunAds */}>

                                <label className="float-left input-field-name">DEADLINE</label>

                                <label className="float-left custom-chexbox-container">
                                    <input
                                        type="checkbox"
                                        checked={deadlineChecked}
                                        onChange={this.toggleDeadlineCheckbox}
                                    />
                                    <span id="checkmark"></span>
                                </label>
                                <div style={this.state.dateElementStyle}>
                                    <DateElement />
                                </div>
                            </fieldset>

                            : <fieldset
                                className="form-row"
                                disabled={false/* !window.canRunAds */}>

                                <label
                                    className="float-left input-field-name"
                                    style={{ paddingBottom: "18px" }} >
                                    DEADLINE</label>

                                <label className="float-left custom-chexbox-container">
                                    <input
                                        type="checkbox"
                                        checked={deadlineChecked}
                                        onChange={this.toggleDeadlineCheckbox}
                                    />
                                    <span id="checkmark"></span>
                                </label>

                            </fieldset>
                        }

                        <fieldset
                            className="form-row"
                            disabled={false/* !window.canRunAds */}>

                            <label className="float-left input-field-name">WHAT TO WRITE</label>
                            <input
                                id="what-to-write-input"
                                className="float-left text-input"
                                type="text"
                                placeholder="One line."
                                value={whatToWriteField}
                                onChange={this.changeWhatToWrite}
                                required
                            />

                            {whatToWriteField.length >= PUNISHMENT_MAX_LENGTH - SHOW_ENTRY_LENGTH_MSG_CHAR_LIMIT
                                ? <label id="form-submit-feedback" className="float-left form-feedback">
                                    <span className="form-submit-feedback-content">
                                        {PUNISHMENT_MAX_LENGTH - whatToWriteField.length > 1
                                            ? (PUNISHMENT_MAX_LENGTH - whatToWriteField.length) + " CHARACTERS LEFT"
                                            : PUNISHMENT_MAX_LENGTH - whatToWriteField.length === 1
                                                ? "1 CHARACTER LEFT"
                                                : "LIMIT REACHED"
                                        }
                                    </span>
                                </label>
                                : null}
                        </fieldset>

                        <fieldset id="why-form-row"
                            className="form-row"
                            disabled={false/* !window.canRunAds */}>

                            <label className="float-left input-field-name">WHY</label>
                            <textarea
                                id="why-input"
                                className="float-left text-input"
                                type="text"
                                placeholder="Feel free to explain your reasons."
                                value={whyField}
                                onChange={this.changeWhy}>
                            </textarea>

                            {whyField.length >= PUNISHMENT_WHY_MAX_LENGTH - SHOW_ENTRY_LENGTH_MSG_CHAR_LIMIT
                                ? <label style={{ /* height: 160 + "px"  */ }} id="form-submit-feedback" className="float-left form-feedback">
                                    <span className="form-submit-feedback-content">
                                        {PUNISHMENT_WHY_MAX_LENGTH - whyField.length > 1
                                            ? (PUNISHMENT_WHY_MAX_LENGTH - whyField.length) + " CHARACTERS LEFT"
                                            : PUNISHMENT_WHY_MAX_LENGTH - whyField.length === 1
                                                ? "1 CHARACTER LEFT"
                                                : "LIMIT REACHED"
                                        }
                                    </span>
                                </label>
                                : null}
                        </fieldset>

                        <fieldset
                            style={{ height: whomField === '' && usrLoggedIn ? 66 + "px" : 0 }}
                            className="form-row height-tran"
                            disabled={(false/* !window.canRunAds */) || whomField !== ''}>

                            <ShareAnonCheckbox
                                show={usrLoggedIn && whomField === ''}
                                currentUser={this.props.currentUser}
                                usrLoggedIn={usrLoggedIn}
                                value={anonShare}
                                toggle={this.toggleAnonShareCheckbox} />

                        </fieldset>

                        <fieldset
                            className="form-row"
                            disabled={false/* !window.canRunAds */ || this.state.showFormMsg}>

                            <button
                                style={submitBtnStyle}
                                id="btn-pun-submit"
                                className="float-left btn-submit opacity-tran"
                                ref="submitPunishmentBtn"
                                type="submit"
                                disabled={submitDisabled}>
                                {whomField === '' ? 'SHARE' : 'PUNISH'}
                            </button>

                            {this.state.showFormMsg && this.props._errMsg !== null
                                ? <label style={{ height: 61 + "px" }} id="form-submit-feedback" className="float-left form-feedback">
                                    <span className="form-submit-feedback-content">
                                        {this.props._errMsg.toUpperCase()}
                                    </span>
                                </label>
                                : null}

                        </fieldset>

                    </form>

                    <div id="form-bottom-props-container">
                        {creatorBottomSvg}
                        {catSVG}
                    </div>

                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentCreator);



function isMail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


const creatorBottomSvg = (
    <svg id="form-bottom-props" width="1080px" height="193px" viewBox="0 0 1080 193" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="page-04" transform="translate(-100.000000, -2147.000000)">
                <g id="Group-Copy-3" transform="translate(0.000000, 1310.000000)">
                    <g id="Group-2" transform="translate(100.000000, 846.000000)">
                        <polygon id="Fill-7-Copy-6" fill="#A479E1" points="-2.38411233e-13 184 1080 184 1080 164 -2.38411233e-13 164"></polygon>
                        <g id="Imported-Layers-Copy" transform="translate(111.614865, 0.000000)">
                            <g id="Group-7" transform="translate(4.284614, 0.000000)" stroke="#00BBD6" strokeLinecap="round">
                                <path d="M35.962064,116.526008 L35.962064,0.647629473" id="Stroke-1" strokeWidth="17.9"></path>
                                <polyline id="Stroke-3" strokeWidth="10.74" strokeLinejoin="round" points="0.488958931 38.4846746 0.488958931 76.3225125 26.5024724 76.3225125"></polyline>
                                <polyline id="Stroke-5" strokeWidth="10.74" strokeLinejoin="round" points="69.0696437 19.5666805 69.0696437 45.580194 43.0561302 45.580194"></polyline>
                            </g>
                            <polygon id="Fill-8" fill="#234F78" points="4.77383738 128.349275 21.5326702 163.823569 58.9609505 163.823569 75.7184622 128.349275"></polygon>
                            <polygon id="Fill-9" fill="#4F69A8" points="0.0437113091 128.350068 80.4491167 128.350068 80.4491167 111.796014 0.0437113091 111.796014"></polygon>
                        </g>
                        <polygon id="Fill-15-Copy-5" fill="#FEFEFE" points="442 164 480 164 480 155 442 155"></polygon>
                        <g id="Group-Copy-13" transform="translate(605.000000, 37.489900)">
                            <polygon id="Fill-23-Copy" fill="#234F78" transform="translate(11.000000, 63.500000) rotate(-90.000000) translate(-11.000000, -63.500000) " points="-52 74 74 74 74 53 -52 53"></polygon>
                            <polygon id="Fill-24-Copy" fill="#2BD7F3" transform="translate(11.000000, 8.500000) rotate(-90.000000) translate(-11.000000, -8.500000) " points="8 19 14 19 14 -2 8 -2"></polygon>
                            <polygon id="Fill-25-Copy" fill="#2BD7F3" transform="translate(11.000000, 20.500000) rotate(-90.000000) translate(-11.000000, -20.500000) " points="8 31 14 31 14 10 8 10"></polygon>
                            <polygon id="Fill-26-Copy" fill="#2BD7F3" transform="translate(11.000000, 100.500000) rotate(-90.000000) translate(-11.000000, -100.500000) " points="5 106 17 106 17 95 5 95"></polygon>
                            <polygon id="Fill-27-Copy" fill="#2BD7F3" transform="translate(11.000000, 115.500000) rotate(-90.000000) translate(-11.000000, -115.500000) " points="8 126 14 126 14 105 8 105"></polygon>
                        </g>
                        <g id="Group-Copy-14" transform="translate(628.000000, 37.489900)">
                            <polygon id="Fill-23-Copy" fill="#4F69A8" transform="translate(11.000000, 63.500000) rotate(-90.000000) translate(-11.000000, -63.500000) " points="-52 74 74 74 74 53 -52 53"></polygon>
                            <polygon id="Fill-24-Copy" fill="#FF545F" transform="translate(11.000000, 8.500000) rotate(-90.000000) translate(-11.000000, -8.500000) " points="8 19 14 19 14 -2 8 -2"></polygon>
                            <polygon id="Fill-25-Copy" fill="#FF545F" transform="translate(11.000000, 20.500000) rotate(-90.000000) translate(-11.000000, -20.500000) " points="8 31 14 31 14 10 8 10"></polygon>
                            <polygon id="Fill-26-Copy" fill="#FF545F" transform="translate(11.000000, 100.500000) rotate(-90.000000) translate(-11.000000, -100.500000) " points="5 106 17 106 17 95 5 95"></polygon>
                            <polygon id="Fill-27-Copy" fill="#FF545F" transform="translate(11.000000, 115.500000) rotate(-90.000000) translate(-11.000000, -115.500000) " points="8 126 14 126 14 105 8 105"></polygon>
                        </g>
                        <g id="Group-Copy-15" transform="translate(592.053000, 100.989900) rotate(3.000000) translate(-592.053000, -100.989900) translate(581.053000, 37.489900)">
                            <polygon id="Fill-23-Copy" fill="#4F69A8" transform="translate(11.000000, 63.500000) rotate(-90.000000) translate(-11.000000, -63.500000) " points="-52 74 74 74 74 53 -52 53"></polygon>
                            <polygon id="Fill-24-Copy" fill="#FF545F" transform="translate(11.000000, 8.500000) rotate(-90.000000) translate(-11.000000, -8.500000) " points="8 19 14 19 14 -2 8 -2"></polygon>
                            <polygon id="Fill-25-Copy" fill="#FF545F" transform="translate(11.000000, 20.500000) rotate(-90.000000) translate(-11.000000, -20.500000) " points="8 31 14 31 14 10 8 10"></polygon>
                            <polygon id="Fill-26-Copy" fill="#FF545F" transform="translate(11.000000, 100.500000) rotate(-90.000000) translate(-11.000000, -100.500000) " points="5 106 17 106 17 95 5 95"></polygon>
                            <polygon id="Fill-27-Copy" fill="#FF545F" transform="translate(11.000000, 115.500000) rotate(-90.000000) translate(-11.000000, -115.500000) " points="8 126 14 126 14 105 8 105"></polygon>
                        </g>
                        <g id="Fill-30-Copy-2-+-Fill-28-Copy-2-+-Fill-33-Copy-2-Copy" transform="translate(650.053000, 132.479800)">
                            <path d="M7.9448,6 L7.9448,26 L96.8848,26 C96.8848,26 104.8848,26 104.8848,17.3513514 L104.8848,14.6486486 C104.8848,14.6486486 104.8848,6 96.8848,6 L7.9448,6 Z" id="Fill-30-Copy-2" fill="#2BD7F3" transform="translate(56.414800, 16.000000) scale(-1, 1) translate(-56.414800, -16.000000) "></path>
                            <path d="M111.053,17.1162791 L111.053,14.8837209 C111.053,14.8837209 111.053,0 96.3185733,0 L0.5448,0 L0.5448,6.69767442 L95.581852,6.69767442 C103.685787,6.69767442 103.685787,14.8837209 103.685787,14.8837209 L103.685787,17.1162791 C103.685787,25.3023256 95.581852,25.3023256 95.581852,25.3023256 L0.5448,25.3023256 L0.5448,32 L96.3185733,32 C96.3185733,32 111.053,32 111.053,17.1162791" id="Fill-28-Copy-2" fill="#3B8DBC" transform="translate(55.798900, 16.000000) scale(-1, 1) translate(-55.798900, -16.000000) "></path>
                            <polygon id="Fill-33-Copy-2" fill="#234F78" transform="translate(42.553000, 23.201700) scale(-1, 1) translate(-42.553000, -23.201700) " points="37.053 15.0397 37.053 31.3637 42.553 26.1397 48.053 31.3637 48.053 15.0397"></polygon>
                        </g>
                        <g id="Fill-30-Copy-3-+-Fill-28-Copy-3-Copy" transform="translate(673.000000, 100.489900)">
                            <path d="M6.9671,6 L6.9671,26 L95.9071,26 C95.9071,26 103.9071,26 103.9071,17.3513514 L103.9071,14.6486486 C103.9071,14.6486486 103.9071,6 95.9071,6 L6.9671,6 Z" id="Fill-30-Copy-3" fill="#FF948A"></path>
                            <path d="M111.3071,17.1162791 L111.3071,14.8837209 C111.3071,14.8837209 111.3071,0 96.5726733,0 L0.7989,0 L0.7989,6.69767442 L95.835952,6.69767442 C103.939887,6.69767442 103.939887,14.8837209 103.939887,14.8837209 L103.939887,17.1162791 C103.939887,25.3023256 95.835952,25.3023256 95.835952,25.3023256 L0.7989,25.3023256 L0.7989,32 L96.5726733,32 C96.5726733,32 111.3071,32 111.3071,17.1162791" id="Fill-28-Copy-3" fill="#234F78"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
)


const decrementBtnSvg = (
    <svg className="creator-range-symbol" width="30px" height="17px" viewBox="0 0 30 17" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-375.000000, -1814.000000)">
            <g id="decrement-btn-g" transform="translate(0.000000, 1478.000000)" stroke="#FFFFFF" strokeWidth="2">
                <g id="Rectangle-4-+-Path-181" transform="translate(365.000000, 319.000000)">
                    <polyline id="Path-181" points="11 18.423884 24.5661158 31.9899998 38.5561156 18"></polyline>
                </g>
            </g>
        </g>
    </svg>
);

const incrementBtnSvg = (
    <svg className="creator-range-symbol" width="30px" height="17px" viewBox="0 0 30 17" version="1.1" xmlns="http://www.w3.org/2000/svg" >
        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-591.000000, -1813.000000)">
            <g id="increment-btn-g" transform="translate(0.000000, 1478.000000)" stroke="#FFFFFF" strokeWidth="2">
                <g id="Rectangle-4-+-Path-181-Copy" transform="translate(606.000000, 344.000000) rotate(-180.000000) translate(-606.000000, -344.000000) translate(581.000000, 319.000000)">
                    <polyline id="Path-181" points="11 18.423884 24.5661158 31.9899998 38.5561156 18"></polyline>
                </g>
            </g>
        </g>
    </svg >
)

function checkIfSameUser(whom, currentUserObject) {
    if ((currentUserObject.username !== '' && whom === currentUserObject.username) || whom === currentUserObject.email) return true;
    else return false;
}

const catSVG = (
    <svg id="cat-svg" width="253px" height="211px" viewBox="0 0 253 211" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
            <path d="M7.77605219,41.9853671 C7.77605219,41.9853671 98.3092,-17.119582 132.552705,5.04076004 C162.338042,24.3163098 157.776217,52.1584034 143.286104,65.8121736 C128.795992,79.4654716 120.776116,79.8923586 112.158915,80.8042155 C94.4488303,82.6779846 0.349741454,80.8042155 0.349741454,80.8042155 L7.77605219,41.9853671 Z" id="path-1"></path>
            <path d="M42.7393175,0.262801 C46.5328704,-0.0232618037 50.1667593,-0.00122814703 53.5784128,0.388723558 L53.5784128,22.8968636 L42.7393175,0.262801 L42.7393175,0.262801 Z" id="path-3"></path>
            <path d="M30.3915317,2.10139826 C33.5785615,1.42237958 36.7074793,0.89475509 39.747996,0.547482755 L41.5036346,23.5664716 L30.3915317,2.10139826 L30.3915317,2.10139826 Z" id="path-5"></path>
            <path d="M20.6777258,4.56620314 C22.9257035,3.91161698 25.1605691,3.31477492 27.3725092,2.78505907 L30.7697621,22.8968636 L20.6777258,4.56620314 L20.6777258,4.56620314 Z" id="path-7"></path>
            <path d="M0.182980313,11.8345302 C3.35264644,10.5338724 6.55559013,9.29212456 9.76391273,8.13595918 L15.676171,25.5743513 L0.182980313,11.8345302 L0.182980313,11.8345302 Z" id="path-9"></path>
            <path d="M56.3507006,13.2983774 C56.3507006,13.2983774 49.1392498,7.60954261 39.0765402,7.44237672 C38.8962066,7.43907118 38.7220261,7.46362662 38.5506855,7.5032931 C38.3798183,7.46362662 38.2051645,7.43907118 38.0248308,7.44237672 C27.9621212,7.60954261 20.7506704,13.2983774 20.7506704,13.2983774 L0.457697094,0.414798083 C0.457697094,0.414798083 -1.21689682,28.4009187 4.65080832,50.2769843 C8.70476448,65.3913311 35.5020537,74.3502897 38.5506855,73.9692082 C41.5993174,74.3502897 68.3966066,65.3913311 72.451036,50.2769843 C78.3187412,28.4009187 76.643674,0.414798083 76.643674,0.414798083 L56.3507006,13.2983774 Z" id="path-11"></path>
            <path d="M26.5602204,10.0049897 C29.5374378,8.71348281 33.491835,7.51768072 38.0248308,7.44237672 C38.2051645,7.43907118 38.3798183,7.46362662 38.5506855,7.5032931 C38.7220261,7.46362662 38.8962066,7.43907118 39.0765402,7.44237672 C43.0712198,7.50873799 46.6165639,8.44526979 49.4397963,9.55063612 C51.4719447,11.3337645 53.8007074,13.9200534 55.3537373,17.3315508 C58.1970318,23.5781178 58.6479214,26.7784605 58.6479214,26.7784605 L46.9519449,13.4386998 L47.4720384,24.4543942 L37.6944848,11.6048527 L30.7496332,24.519869 L29.5400892,13.5584355 L20.0749079,28.5636154 C20.0749079,28.5636154 20.0196024,25.3321396 21.8507129,18.7176889 C22.8674842,15.0455183 24.8093778,12.0901736 26.5602204,10.0049897 L26.5602204,10.0049897 Z" id="path-13"></path>
            <path d="M67.6631294,58.5792921 C58.6301914,68.6004915 40.9897676,74.2740955 38.5506855,73.9692082 C36.1116027,74.2740956 18.4711686,68.6004879 9.43847556,58.5792827 C13.0031856,60.5771935 32.3993691,50.7081684 32.3993691,50.7081684 L33.8051192,38.326559 L38.5505909,34.937908 L38.7266646,34.8127697 L38.7200382,35.0587963 L43.2960625,38.326559 L44.7022859,50.7081684 C44.7022859,50.7081684 64.0979581,60.5771624 67.6631294,58.5792921 L67.6631294,58.5792921 Z" id="path-15"></path>
        </defs>
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="page-04" transform="translate(-893.000000, -2233.000000)">
                <g id="maca" transform="translate(893.000000, 2232.000000)">
                    <g id="rep" transform="translate(176.000000, 39.000000)">
                        <path d="M55.3225725,0.774463344 C55.3225725,0.774463344 74.6428803,49.766348 76.2526299,104.647761 C77.3838564,143.197444 67.8427416,155.198916 59.8843973,164.616401 C48.3458867,178.269699 -12.5462861,174.203412 2.46021476,157.655405 C12.656873,146.411374 21.7805226,163.277657 38.6854961,161.671164 C55.590943,160.065144 66.0559717,136.506086 66.5927126,107.592997 C67.4503622,61.3791833 48.8826277,10.9474997 48.8826277,10.9474997 L55.3225725,0.774463344 Z" fill="#00BBD6"></path>
                        <g id="pruge-na-repu" transform="translate(20.000000, 94.000000)" fill="#234F78">
                            <path d="M9.27776191,66.7553262 L9.27776191,78.8348536 C6.26875553,78.8300728 3.28066724,78.6781548 0.4286362,78.3839145 L4.00446404,64.8270964 C5.67227964,65.555066 7.42334629,66.2330547 9.27776191,66.7553262 Z" id="Combined-Shape"></path>
                            <path d="M26.0597508,65.4090957 L31.9095076,75.5364072 C29.1528978,76.5389073 25.9695953,77.3066055 22.5639349,77.8480467 L20.4725375,67.4157379 C22.4299673,67.0402967 24.2943318,66.3620786 26.0597508,65.4090957 L26.0597508,65.4090957 Z" id="Combined-Shape"></path>
                            <path d="M37.0861238,54.0071031 L46.7967284,61.3703173 C45.5286367,63.4410263 44.2108031,65.2668047 42.8946104,66.9481286 L33.2607602,59.425906 C34.6328939,57.8182869 35.9096503,56.0042373 37.0861238,54.0071031 L37.0861238,54.0071031 Z" id="Combined-Shape"></path>
                            <path d="M43.9858835,35.8176229 L55.0394715,36.790707 C54.5109836,40.3963013 53.8397984,43.6122071 53.0592468,46.503601 L41.8207074,43.4729749 C42.6444285,41.0510129 43.3676244,38.4922306 43.9858835,35.8176229 Z" id="Combined-Shape"></path>
                            <path d="M46.3673042,19.0940797 L56.3397743,18.0734933 C56.3191082,20.9854413 56.2306105,23.7256326 56.081287,26.307766 L45.5702387,27.1144274 C45.9256361,24.5119355 46.1923952,21.8333914 46.3673042,19.0940797 Z" id="Combined-Shape"></path>
                            <path d="M46.4369749,2.26383227 L55.7430802,0.302295381 C55.9593508,3.45264148 56.1232525,6.63236433 56.2274172,9.83288763 L46.6166862,11.750617 C46.6404121,8.59878794 46.5765174,5.43078578 46.4369749,2.26383227 Z" id="Combined-Shape"></path>
                        </g>
                    </g>
                    <g id="trbuh" transform="translate(77.307329, 6.891421)">
                        <mask id="mask-2" fill="white">
                            <use xlinkHref="#path-1"></use>
                        </mask>
                        <use fill="#00BBD6" xlinkHref="#path-1"></use>
                        <path d="M29.8989065,28.9091582 C32.1661723,27.6629135 34.5614419,26.3731454 37.0621086,25.0614669 L64.2402068,56.6963908 L45.9676152,20.5340278 C48.1623439,19.4544712 50.4092982,18.3766607 52.6964851,17.3120623 C56.458083,23.035089 64.4634515,34.5605877 72.2903745,41.6372937 C83.0237737,51.3418877 86.378168,36.6175947 86.378168,36.6175947 L101.235475,81.3718547 C79.4968965,81.9672832 37.4231772,81.4241208 15.0971158,81.0639714 C18.8066044,76.3497498 33.9192257,57.3753362 40.7608665,52.3458275 C50.0486371,45.517862 37.4299095,34.425562 29.8989065,28.9091582 L29.8989065,28.9091582 Z" id="bijeli-trbuh" fill="#FFFFFF"></path>
                        <g id="pruge-na-trbuhu" transform="translate(65.000000, 0.000000)">
                            <mask id="mask-4" fill="white">
                                <use xlinkHref="#path-3"></use>
                            </mask>
                            <use id="Combined-Shape" fill="#234F78" xlinkHref="#path-3"></use>
                            <mask id="mask-6" fill="white">
                                <use xlinkHref="#path-5"></use>
                            </mask>
                            <use id="Combined-Shape" fill="#234F78" xlinkHref="#path-5"></use>
                            <mask id="mask-8" fill="white">
                                <use xlinkHref="#path-7"></use>
                            </mask >
                            <use id="Combined-Shape" fill="#234F78" xlinkHref="#path-7"></use>
                            <mask id="mask-10" fill="white">
                                <use xlinkHref="#path-9"></use>
                            </mask >
                            <use id="Combined-Shape" fill="#234F78" xlinkHref="#path-9"></use>
                        </g >
                    </g >
                    <g id="stražnja-nogica" transform="translate(120.839899, 28.511393)">
                        <path d="M79.8967218,8.82063923 C79.8967218,8.82063923 32.9375679,-16.0766902 28.107846,19.5291731 C25.0024162,42.4200395 50.9164967,50.0487542 50.9164967,50.0487542 C50.9164967,50.0487542 21.3990573,40.9863795 11.4707696,44.1592259 C1.54248187,47.3316001 -1.14122291,54.2434849 1.27411139,58.883519 C3.68897238,63.5230809 82.3115828,61.5605344 82.3115828,61.5605344 C82.3115828,61.5605344 91.4352324,54.1773741 90.3617505,41.4817383" fill="#00BBD6"></path>
                        <path d="M10.0784617,50.9303418 C6.58680556,54.7595741 5.78122081,60.3756871 5.78122081,60.3756871" id="prst-desni" stroke="#FEFEFE"></path>
                        <path d="M17.9315404,52.2734301 C14.4360977,55.9099966 13.6295663,61.2441942 13.6295663,61.2441942" id="prst-lijevi" stroke="#FEFEFE"></path>
                    </g>
                    <g id="prednja-nogica" transform="translate(0.000000, 64.585566)">
                        <path d="M111.261893,0.675226452 C111.261893,0.675226452 104.999169,23.051373 91.9411344,25.1041136 C82.0480712,26.6596064 68.6031698,23.0962339 57.2966104,23.0962339 C49.8347419,23.0962339 3.75156934,28.1966826 0.819751654,25.519195 C-2.11159597,22.8421796 2.68545382,5.44087109 17.342662,7.31464021 C32.4135305,9.2417702 62.1463079,9.44860257 75.9714947,11.3303994 C81.2809193,12.0528961 85.9449396,4.69098567 85.9449396,4.69098567" fill="#00BBD6"></path>
                        <path d="M23.160003,25.6080212 C11.9723748,26.3619948 2.12429517,26.7105716 0.819751654,25.519195 C-2.11159597,22.8421796 2.68545382,5.44087109 17.342662,7.31464021 C32.4135305,9.2417702 62.1463079,9.44860257 75.9714947,11.3303994 C77.3958308,11.5242204 78.7737194,11.1362355 80.0275766,10.4646529 C81.8114685,18.45802 70.1257647,13.7263967 59.7049056,13.7263967 C48.9715065,13.7263967 37.2318363,14.7303365 29.51725,16.7382161 C24.8640166,17.9492414 23.5054481,22.3253346 23.160003,25.6080212 L23.160003,25.6080212 Z" id="bijeli-dio" fill="#FEFEFE"></path>
                        <path d="M7.21500067,16.6293222 C3.72334456,20.4585545 2.91775981,26.0746674 2.91775981,26.0746674" id="prst-desni" stroke="#234F78"></path>
                        <path d="M12.5863861,18.7864705 C9.19933293,21.8743174 8.41741401,26.4029076 8.41741401,26.4029076" id="prst-lijevi" stroke="#234F78"></path>
                    </g>
                    <g id="glava" transform="translate(62.143224, 50.611086) rotate(-26.000000) translate(-62.143224, -50.611086) translate(23.643224, 13.611086)">
                        <mask id="mask-12" fill="white">
                            <use xlinkHref="#path-11"></use>
                        </mask>
                        <use fill="#00BBD6" xlinkHref="#path-11"></use>
                        <mask id="mask-14" fill="white">
                            <use xlinkHref="#path-13"></use>
                        </mask >
                        <use id="plavi-dio-glave" fill="#234F78" xlinkHref="#path-13"></use>
                        <mask id="mask-16" fill="white">
                            <use xlinkHref="#path-15"></use>
                        </mask >
                        <use id="bijeli-dio-glave" fill="#FEFEFE" xlinkHref="#path-15"></use>
                        <path d="M10.8309024,43.4276215 C10.8309024,43.4276215 17.8094814,51.171558 29.8430811,44.8938647" id="desno-oko" stroke="#234F78"></path>
                        <path d="M66.2707053,43.4276215 C66.2707053,43.4276215 59.2921263,51.171558 47.2585266,44.8938647" id="lijevo-oko" stroke="#234F78"></path>
                        <polygon id="nos" fill="#E76C98" points="33.1840333 57.7263027 43.9174324 57.7263027 38.5509695 61.7420619"></polygon>
                        <path d="M29.3102687,63.1548026 C29.3102687,63.1548026 36.8236955,69.0443309 47.8254651,63.1548026" id="usta" stroke="#234F78"></path>
                        <path d="M38.5507802,61.7420147 L38.5507802,65.4900251" id="usta-nos" stroke="#234F78"></path>
                        <polygon id="desno-uho" fill="#E76C98" points="4.92897645 22.0077677 16.4674871 15.0472443 2.78248594 5.14148457"></polygon>
                        <polygon id="lijevo-uho" fill="#E76C98" points="72.1725839 22.0077677 60.6340733 15.0472443 74.3190744 5.14148457"></polygon>
                    </g >
                </g >
            </g >
        </g >
    </svg >
)