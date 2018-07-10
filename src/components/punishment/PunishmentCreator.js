import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { trimExcessSpaces } from '../../helpers/helpers';

import DateElement from './DateElement';
import ShareAnonCheckbox from './ShareAnonCheckbox';
import SharePunishmentDialog from '../SharePunishmentDialog';

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
            if (this.props.howManyTimes < MAX_HOW_MANY_TIMES_PUNISHMENT) this.props.onChangeHowManyTimes(parseInt(this.props.howManyTimes) + 1, 10);
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
        const deadlineDate = this.props.deadlineDate;
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
            <path d="M47.7249399,0.297451403 C48.0237754,5.21421271 48.1503102,10.1484332 48.0596148,15.0354861 C47.5228739,43.9485747 37.0578452,67.5076325 20.1523983,69.114125 C13.4488162,69.7511499 7.96875726,67.483077 3.15986122,65.2154764 C2.07847077,64.7053805 1.03103141,64.1952949 0.0112649336,63.7182621 L0.0112649336,79.6092874 C3.42328703,80.0468753 7.07793562,80.2725334 10.7636914,80.2774068 L11.0164425,80.2774068 C23.6705601,80.2599346 36.6347002,77.6395856 41.3512995,72.0588892 C48.8528933,63.1820969 57.7611839,52.0060652 57.8113555,18.4656924 L57.8113555,17.9009173 C57.8085156,16.0347037 57.7786966,14.0971848 57.7200054,12.0902497 C57.6036095,8.12311627 57.3946749,4.18675683 57.1071882,0.297451403 L47.7249399,0.297451403 L47.7249399,0.297451403 Z" id="path-1"></path>
            <path d="M7.70659157,41.9853671 C7.70659157,41.9853671 98.2397394,-17.119582 132.483244,5.04076004 C162.268581,24.3163098 157.706756,52.1584034 143.216644,65.8121736 C128.726531,79.4654716 120.706656,79.8923586 112.089455,80.8042155 C94.3793697,82.6779846 0.280280829,80.8042155 0.280280829,80.8042155 L7.70659157,41.9853671 Z" id="path-3"></path>
            <path d="M80.2092978,18.1565203 C72.7973825,17.494124 64.8224984,16.0965645 57.692553,16.0965645 C50.1791263,16.0965645 3.77706599,21.1965409 0.825464045,18.5190533 C-2.1261379,15.8420379 2.70405739,-1.55927057 17.4625404,0.314970767 C32.637542,2.24162853 62.5752864,2.44893313 76.4964725,4.33025777 C77.7913732,4.50537067 79.0481481,4.20613675 80.2092978,3.65206909 L80.2092978,18.1565203 L80.2092978,18.1565203 Z" id="path-5"></path>
            <path d="M56.3507006,13.2983774 C56.3507006,13.2983774 49.1392498,7.60954261 39.0765402,7.44237672 C38.8962066,7.43907118 38.7220261,7.46362662 38.5506855,7.5032931 C38.3798183,7.46362662 38.2051645,7.43907118 38.0248308,7.44237672 C27.9621212,7.60954261 20.7506704,13.2983774 20.7506704,13.2983774 L0.457697094,0.414798083 C0.457697094,0.414798083 -1.21689682,28.4009187 4.65080832,50.2769843 C8.70476448,65.3913311 35.5020537,74.3502897 38.5506855,73.9692082 C41.5993174,74.3502897 68.3966066,65.3913311 72.451036,50.2769843 C78.3187412,28.4009187 76.643674,0.414798083 76.643674,0.414798083 L56.3507006,13.2983774 Z" id="path-7"></path>
        </defs>
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="page-04" transform="translate(-893.000000, -2233.000000)">
                <g id="Maca" transform="translate(893.000000, 2232.000000)">
                    <path d="M231.322572,39.7744633 C231.322572,39.7744633 250.64288,88.766348 252.25263,143.647761 C253.383856,182.197444 243.842742,194.198916 235.884397,203.616401 C224.345887,217.269699 163.453714,213.203412 178.460215,196.655405 C188.656873,185.411374 197.780523,202.277657 214.685496,200.671164 C231.590943,199.065144 242.055972,175.506086 242.592713,146.592997 C243.450362,100.379183 224.882628,49.9474997 224.882628,49.9474997 L231.322572,39.7744633 Z" id="Fill-1" fill="#00BBD6"></path>
                    <g id="Group-6" transform="translate(194.533098, 131.557511)">
                        <mask id="mask-2" fill="white">
                            <use xlinkHref="#path-1"></use>
                        </mask>
                        <g id="Clip-5"></g>
                        <polygon id="Fill-4" fill="#234F78" mask="url(#mask-2)" points="6.71958025 61.5373073 0.0112649336 86.9701342 10.7446641 86.3009984 10.7446641 61.8721113 20.4717923 61.5373073 24.8324576 83.289179 34.8951672 79.6082238 23.4906052 59.8642317 30.8700834 57.8563521 46.2992559 69.9036297 50.9950293 64.8839307 34.2240044 52.167045 37.9139801 43.4663908 62.7346995 50.1596376 62.7346995 38.7814958 39.926522 36.7736162 40.2616302 29.0769017 66.4246752 27.0690221 65.7535123 18.7026997 39.5909406 21.3801873 40.5972116 14.6869405 65.7535123 9.66724143 64.0765518 0.297451403 40.2616302 5.31715043 26.8449995 41.7933152"></polygon>
                    </g>
                    <g id="trbuh-pruge" transform="translate(77.307329, 6.891421)">
                        <g id="Group-14" transform="translate(0.069461, 0.000000)">
                            <g id="Fill-12-+-Fill-9-Mask">
                                <mask id="mask-4" fill="white">
                                    <use xlinkHref="#path-3"></use>
                                </mask>
                                <use id="Mask" fill="#00BBD6" xlinkHref="#path-3"></use>
                                <path d="M62.493833,9.51131438 L80.6067103,25.5743513 L72.8916507,2.81853975 L82.6192523,-0.862887679 L95.7003015,22.8968636 L90.66942,-6.88605429 L106.434174,23.5664716 L104.086051,-7.2208583 L118.508952,22.8968636 L118.508952,-9.8978737 C118.508952,-9.8978737 95.0296119,-14.2484369 92.6819619,-14.2484369 C90.3338386,-14.2484369 59.4750201,-1.19721947 59.4750201,-1.19721947 L62.493833,9.51131438 Z" id="Fill-12" fill="#234F78" mask="url(#mask-4)"></path>
                                <path d="M24.9266519,25.5742568 C24.9266519,25.5742568 53.437347,42.9755653 40.6914059,52.3458275 C32.8603838,58.102662 14.1932527,82.1292177 14.1932527,82.1292177 L103.750422,89.1567963 L86.3087074,36.6175947 C86.3087074,36.6175947 82.954313,51.3418877 72.2209139,41.6372937 C61.4875147,31.9326996 50.4185341,13.8617832 50.4185341,13.8617832 L43.7102188,16.2039946 L64.1707462,56.6963908 L31.9705487,19.215814 L24.9266519,25.5742568 Z" id="Fill-9" fill="#FFFFFF" mask="url(#mask-4)"></path>
                            </g>
                        </g>
                    </g>
                    <g id="prednja-nogica-fill" transform="translate(0.000000, 64.974486)" fill="#00BBD6">
                        <path d="M111.261893,0.28630701 C111.261893,0.28630701 104.999169,22.6624536 91.9411344,24.7151941 C82.0480712,26.2706869 68.6031698,22.7073145 57.2966104,22.7073145 C49.8347419,22.7073145 3.75156934,27.8077632 0.819751654,25.1302755 C-2.11159597,22.4532601 2.68545382,5.05195165 17.342662,6.92572077 C32.4135305,8.85285075 62.1463079,9.05968313 75.9714947,10.94148 C81.2809193,11.6639767 85.9449396,4.30206623 85.9449396,4.30206623" id="Fill-16"></path>
                    </g>
                    <g id="prednja-nogica" transform="translate(0.000000, 71.585566)">
                        <mask id="mask-6" fill="white">
                            <use xlinkHref="#path-5"></use>
                        </mask>
                        <g id="Clip-20"></g>
                        <path d="M23.1440428,22.4546296 C23.1440428,22.4546296 21.8021904,11.7460957 29.51725,9.73821611 C37.2318363,7.7303365 48.9715065,6.72639669 59.7049056,6.72639669 C70.4383048,6.72639669 82.5135564,11.7460957 79.8303249,2.71063747 C77.1466201,-6.32482077 54.6735508,-16.3642188 19.4545404,-9.67097197 C-15.7649433,-2.97819735 -32.2003868,20.4467499 -30.8585344,20.4467499 C-29.5171554,20.4467499 23.1440428,22.4546296 23.1440428,22.4546296" id="Fill-19" fill="#FEFEFE" mask="url(#mask-6)"></path>
                    </g>
                    <g id="Group-32" transform="translate(2.839899, 28.511393)">
                        <path d="M4.37510143,52.7034952 C0.883445321,56.5327275 0.0778605708,62.1488404 0.0778605708,62.1488404" id="Stroke-22" stroke="#C4ACE4"></path>
                        <path d="M9.74648685,54.8606436 C6.3594337,57.9484904 5.57751477,62.4770806 5.57751477,62.4770806" id="Stroke-24" stroke="#C4ACE4"></path>
                        <path d="M197.896722,8.82063923 C197.896722,8.82063923 150.937568,-16.0766902 146.107846,19.5291731 C143.002416,42.4200395 168.916497,50.0487542 168.916497,50.0487542 C168.916497,50.0487542 139.399057,40.9863795 129.47077,44.1592259 C119.542482,47.3316001 116.858777,54.2434849 119.274111,58.883519 C121.688972,63.5230809 200.311583,61.5605344 200.311583,61.5605344 C200.311583,61.5605344 209.435232,54.1773741 208.36175,41.4817383" id="Fill-26" fill="#00BBD6"></path>
                        <path d="M128.078462,50.9303418 C124.586806,54.7595741 123.781221,60.3756871 123.781221,60.3756871" id="Stroke-28" stroke="#FEFEFE"></path>
                        <path d="M135.93154,52.2734301 C132.436098,55.9099966 131.629566,61.2441942 131.629566,61.2441942" id="Stroke-30" stroke="#FEFEFE"></path>
                    </g>
                    <g id="Glava" transform="translate(62.143224, 50.611086) rotate(-26.000000) translate(-62.143224, -50.611086) translate(23.643224, 13.611086)">
                        <g id="Group" transform="translate(-0.000000, 0.000000)">
                            <mask id="mask-8" fill="white">
                                <use xlinkHref="#path-7"></use>
                            </mask>
                            <use id="Mask" fill="#00BBD6" xlinkHref="#path-7"></use>
                            <g mask="url(#mask-8)" fill="#234F78">
                                <g transform="translate(39.957253, 16.942935) rotate(3.000000) translate(-39.957253, -16.942935) translate(20.457253, 2.942935)">
                                    <path d="M9.16799938,4.07069229 C9.16799938,4.07069229 3.23402992,8.93355248 1.51115772,16.7199451 C0.028730314,23.4211638 0.253082354,26.6453166 0.253082354,26.6453166 L8.91998151,11.1653315 L10.701545,22.04844 L19.6491208,3.09269601 L9.16799938,4.07069229 Z" id="Fill-6"></path>
                                    <path d="M27.0472003,3.17896097 C27.0472003,3.17896097 32.9811698,8.04182116 34.704042,15.8282138 C36.1864694,22.5294325 35.9621174,25.7535853 35.9621174,25.7535853 L27.2952182,10.2736002 L25.5136548,21.1567087 L16.5660789,2.2009647 L27.0472003,3.17896097 Z" id="Fill-9" transform="translate(26.270154, 13.977275) rotate(-15.000000) translate(-26.270154, -13.977275) "></path>
                                </g>
                            </g>
                            <path d="M73.3507161,54.7239276 C73.3507161,54.7239276 70.7389555,55.7042565 67.9023694,58.4048829 C65.0899226,61.0818983 44.7022859,50.7081684 44.7022859,50.7081684 L43.2960625,38.326559 L38.7200382,35.0587963 L38.7266646,34.8127697 L38.5505909,34.937908 L33.8051192,38.326559 L32.3993691,50.7081684 C32.3993691,50.7081684 12.0112592,61.0818983 9.1992856,58.4048829 C6.36269958,55.7042565 3.75093891,54.7239276 3.75093891,54.7239276 L37.3204412,87.853469 L39.7812139,87.853469 L73.3507161,54.7239276 Z" id="Fill-3" fill="#FEFEFE" mask="url(#mask-8)"></path>
                        </g>
                        <path d="M10.8309024,43.4276215 C10.8309024,43.4276215 17.8094814,51.171558 29.8430811,44.8938647" id="Stroke-14" stroke="#234F78"></path>
                        <path d="M66.2707053,43.4276215 C66.2707053,43.4276215 59.2921263,51.171558 47.2585266,44.8938647" id="Stroke-16" stroke="#234F78"></path>
                        <polygon id="Fill-19" fill="#E76C98" points="33.1840333 57.7263027 43.9174324 57.7263027 38.5509695 61.7420619"></polygon>
                        <path d="M29.3102687,63.1548026 C29.3102687,63.1548026 36.8236955,69.0443309 47.8254651,63.1548026" id="Stroke-20" stroke="#234F78"></path>
                        <path d="M38.5507802,61.7420147 L38.5507802,65.4900251" id="Stroke-22" stroke="#234F78"></path>
                        <polygon id="Fill-23" fill="#E76C98" points="4.92897645 22.0077677 16.4674871 15.0472443 2.78248594 5.14148457"></polygon>
                        <polygon id="Fill-24" fill="#E76C98" points="72.1725839 22.0077677 60.6340733 15.0472443 74.3190744 5.14148457"></polygon>
                    </g>
                </g>
            </g>
        </g>
    </svg>
)