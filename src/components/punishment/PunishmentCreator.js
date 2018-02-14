import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { trimExcessSpaces } from '../../helpers/helpers';

import 'react-datepicker/dist/react-datepicker.css';

const PUNISHMENT_MAX_LENGTH = 100;
const PUNISHMENT_WHY_MAX_LENGTH = 500;
const MAX_HOW_MANY_TIMES_PUNISHMENT = 999;

const mapStateToProps = state => ({
    ...state.punishmentCreation,
    orderedPunishments: state.punishment.orderedPunishments,
    currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
    onChangeWhom: (value) => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'whom',
        value
    }),
    onChangeHowManyTimes: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'howManyTimes',
        value
    }),
    onChangeWhatToWrite: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'whatToWrite',
        value
    }),
    onChangeWhy: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'why',
        value
    }),
    onChangeDeadlineCheckbox: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'deadlineChecked',
        value
    }),
    onDeadlineDateChange: value => dispatch({
        type: 'UPDATE_FIELD_PUNISH_CREATE',
        key: 'deadlineDate',
        value
    }),
    onSubmit: (submitData, orderedPunishments, enableSubmit) => {
        // agent magic
        dispatch({ type: 'SUBMITING_NEW_PUNISHMENT' });
        agent.Punishment.createPunishment(submitData).then((payload) => {

            let newOrderedPunishments = orderedPunishments.length > 0 ? JSON.parse(JSON.stringify(orderedPunishments)) : [];
            newOrderedPunishments.unshift(payload);

            if (!payload.errorMsg) {
                dispatch({ type: 'PUNISHMENT_CREATED', newOrderedPunishments, msg: 'Request sent!' });
            }
            else dispatch({ type: 'PUNISHMENT_CREATED_ERROR', msg: payload.errorMsg });

            enableSubmit();
        });
    }
});

class PunishmentCreator extends React.Component {

    constructor() {
        super();

        this.toWhomErrorText = null;
        this.whatToWriteErrorText = null;
        this.whyErrorText = null;

        this.changeWhom = ev => {
            this.validateToWhomValue(ev.target.value);
            this.props.onChangeWhom(ev.target.value);
        }

        this.validateToWhomValue = value => {
            if (!isMail(value)) {
                if (value.length > 30) this.toWhomErrorText = 'Username can\'t be that long. Maximum 30 characters.';
                else this.toWhomErrorText = null;
            }
        }

        this.changeHowManyTimes = ev => {
            if (ev.target.value > MAX_HOW_MANY_TIMES_PUNISHMENT) ev.target.value = MAX_HOW_MANY_TIMES_PUNISHMENT;
            else if (ev.target.value < 1) ev.target.value = 1;
            this.props.onChangeHowManyTimes(ev.target.value);
        }

        this.changeWhatToWrite = ev => {
            if (ev.target.value.length < PUNISHMENT_MAX_LENGTH && ev.target.value.length > 0) {
                this.whatToWriteErrorText = null;
            } else {
                // warning da je text predugacak (maks duljina = PUNISHMENT_MAX_LENGTH)
                this.whatToWriteErrorText = 'Punishment too long or empty. Maximum is ' + PUNISHMENT_MAX_LENGTH + ' characters.'
            }
            this.props.onChangeWhatToWrite(ev.target.value);
        }

        this.changeWhy = ev => {
            if (ev.target.value.length < PUNISHMENT_WHY_MAX_LENGTH && ev.target.value.length > 0 || ev.target.value.length === 0) {
                this.whyErrorText = null;
            } else {
                this.whyErrorText = 'Punishment explanation too long. Maximum is ' + PUNISHMENT_WHY_MAX_LENGTH + ' characters.'
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

        this.deadlineDateChange = date => {
            this.props.onDeadlineDateChange(moment(date).toDate().valueOf());
        }

        this.toggleDeadlineCheckbox = ev => {
            this.props.onChangeDeadlineCheckbox(!this.props.deadlineChecked);
        }

        this.submitForm = (whomField, howManyTimesField, deadlineChecked, deadlineDate, whatToWriteField, whyField) => ev => {
            ev.preventDefault();
            this.refs.submitPunishmentBtn.setAttribute('disabled', 'true');
            let submitData = {};
            isMail(whomField) ? submitData.whomEmail = whomField : submitData.whomUsername = whomField;
            submitData.howManyTimes = howManyTimesField;
            submitData.deadlineDate = deadlineChecked ? deadlineDate : null;
            submitData.whatToWrite = trimExcessSpaces(whatToWriteField);
            submitData.why = trimExcessSpaces(whyField);

            this.props.onSubmit(submitData, this.props.orderedPunishments, this.enableSubmit);
        }

        this.enableSubmit = () => {
            this.refs.submitPunishmentBtn.removeAttribute('disabled');
        }
    }

    render() {

        const usrLoggedIn = Object.keys(this.props.currentUser).length;
        const whomField = this.props.whom;
        const howManyTimesField = this.props.howManyTimes;
        const whatToWriteField = this.props.whatToWrite;
        const whyField = this.props.why;
        const deadlineDate = this.props.deadlineDate;
        const deadlineChecked = this.props.deadlineChecked;

        if (usrLoggedIn && window.canRunAds) {

            return (

                <div id="creator-component-container" className="parent-component">

                    <div className="container">

                        <div id="creator-heading-container">
                            <h1 id="creator-heading">Your turn to punish someone!</h1>
                        </div>

                        <form
                            id="pun-creation-form"
                            onSubmit={this.submitForm(whomField, howManyTimesField, deadlineChecked, deadlineDate, whatToWriteField, whyField)}
                        >

                            <fieldset className="form-row">
                                <label className="float-left input-field-name">WHOM</label>
                                <input
                                    id="whom-input"
                                    className="float-left text-input"
                                    type="text"
                                    placeholder="e-mail/username"
                                    value={whomField}
                                    onChange={this.changeWhom}
                                    required
                                />
                                <label id="whom-feedback" className="float-left form-feedback">TRY E-MAIL INSTEAD</label>
                            </fieldset>

                            <fieldset className="form-row">
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
                                <fieldset className="form-row">
                                    <label className="float-left input-field-name">DEADLINE</label>

                                    <label className="float-left custom-chexbox-container">
                                        <input
                                            type="checkbox"
                                            checked={deadlineChecked}
                                            onChange={this.toggleDeadlineCheckbox}
                                        />
                                        <span id="checkmark"></span>
                                    </label>

                                    <input id="day-picker" className="float-left text-input" type="text" placeholder="dd" required />
                                    <input id="month-picker" className="float-left text-input" type="text" placeholder="mm" required />
                                    <input id="year-picker" className="float-left text-input" type="text" placeholder="yyyy" required />

                                    <button id="btn-calendar" type="button">
                                        {calendarBtnSvg}
                                    </button>
                                </fieldset>

                                : <fieldset className="form-row">
                                    <label 
                                    className="float-left input-field-name"
                                    style={{"padding-bottom": "18px"}} >
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


                            <fieldset className="form-row">
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
                            </fieldset>

                            <fieldset id="why-form-row" className="form-row">
                                <label className="float-left input-field-name">WHY</label>
                                <textarea
                                    id="why-input"
                                    className="float-left text-input"
                                    type="text"
                                    placeholder="Feel free to explain your reasons."
                                    value={whyField}
                                    onChange={this.changeWhy}
                                    required>
                                </textarea>
                            </fieldset>

                            <fieldset className="form-row">
                                <button
                                    id="btn-pun-submit"
                                    className="float-left btn-submit"
                                    ref="submitPunishmentBtn"
                                    type="submit">PUNISH
                                </button>
                                <label id="form-submit-feedback" className="float-left form-feedback">PLEASE ENTER REQUIRED FIELDS.</label>
                            </fieldset>

                        </form>

                        <div id="form-bottom-props-container">
                            {creatorBottomSvg}
                        </div >

                    </div >
                </div >

            )

        } else return (

            <div id="creator-component-container" className="parent-component greyscale-filter">

                <div id="form-overlay"></div>

                <div className="container">

                    <div id="creator-heading-container">
                        <h1 id="creator-heading">Your turn to punish someone!</h1>
                    </div>

                    <form id="pun-creation-form">

                        <fieldset className="form-row">
                            <label className="float-left input-field-name">WHOM</label>
                            <input id="whom-input" className="float-left text-input" type="text" placeholder="e-mail/username" required />
                            <label id="whom-feedback" className="float-left form-feedback">TRY E-MAIL INSTEAD</label>
                        </fieldset>

                        <fieldset className="form-row">
                            <label className="float-left input-field-name">HOW MANY TIMES</label>
                            <button id="decrement-button" className="float-left btn-range" type="button">
                                {decrementBtnSvg}
                            </button>

                            <input id="how-many-times-input" className="float-left text-input" type="number" min="1" max="999" placeholder="999" required />

                            <button id="increment-button" className="float-left btn-range" type="button">
                                {incrementBtnSvg}
                            </button>
                        </fieldset>

                        <fieldset className="form-row">
                            <label className="float-left input-field-name">DEADLINE</label>

                            <label className="float-left custom-chexbox-container">
                                <input type="checkbox" />
                                <span id="checkmark"></span>
                            </label>

                            <input id="day-picker" className="float-left text-input" type="text" placeholder="dd" required />
                            <input id="month-picker" className="float-left text-input" type="text" placeholder="mm" required />
                            <input id="year-picker" className="float-left text-input" type="text" placeholder="yyyy" required />

                            <button id="btn-calendar" type="button">
                                {calendarBtnSvg}
                            </button>
                        </fieldset>

                        <fieldset className="form-row">
                            <label className="float-left input-field-name">WHAT TO WRITE</label>
                            <input id="what-to-write-input" className="float-left text-input" type="text" placeholder="One line." required />
                        </fieldset>

                        <fieldset id="why-form-row" className="form-row">
                            <label className="float-left input-field-name">WHY</label>
                            <textarea id="why-input" className="float-left text-input" type="text" placeholder="Feel free to explain your reasons." required></textarea>
                        </fieldset>

                        <fieldset className="form-row">
                            <button id="btn-pun-submit" className="float-left btn-submit" type="submit">PUNISH</button>
                            <label id="form-submit-feedback" className="float-left form-feedback">PLEASE ENTER REQUIRED FIELDS.</label>
                        </fieldset>

                    </form>

                    <div id="form-bottom-props-container">
                        {creatorBottomSvg}
                    </div >

                </div >
            </div >

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
        <g id="page-03" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-100.000000, -2315.000000)">
            <g id="Group" transform="translate(0.000000, 1478.000000)">
                <g id="form-bottom-props" transform="translate(100.000000, 846.000000)">
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
                    <g id="Group-Copy-13" transform="translate(725.000000, 37.489900)">
                        <polygon id="Fill-23-Copy" fill="#234F78" transform="translate(11.000000, 63.500000) rotate(-90.000000) translate(-11.000000, -63.500000) "
                            points="-52 74 74 74 74 53 -52 53"></polygon>
                        <polygon id="Fill-24-Copy" fill="#2BD7F3" transform="translate(11.000000, 8.500000) rotate(-90.000000) translate(-11.000000, -8.500000) "
                            points="8 19 14 19 14 -2 8 -2"></polygon>
                        <polygon id="Fill-25-Copy" fill="#2BD7F3" transform="translate(11.000000, 20.500000) rotate(-90.000000) translate(-11.000000, -20.500000) "
                            points="8 31 14 31 14 10 8 10"></polygon>
                        <polygon id="Fill-26-Copy" fill="#2BD7F3" transform="translate(11.000000, 100.500000) rotate(-90.000000) translate(-11.000000, -100.500000) "
                            points="5 106 17 106 17 95 5 95"></polygon>
                        <polygon id="Fill-27-Copy" fill="#2BD7F3" transform="translate(11.000000, 115.500000) rotate(-90.000000) translate(-11.000000, -115.500000) "
                            points="8 126 14 126 14 105 8 105"></polygon>
                    </g>
                    <g id="Group-Copy-14" transform="translate(748.000000, 37.489900)">
                        <polygon id="Fill-23-Copy" fill="#4F69A8" transform="translate(11.000000, 63.500000) rotate(-90.000000) translate(-11.000000, -63.500000) "
                            points="-52 74 74 74 74 53 -52 53"></polygon>
                        <polygon id="Fill-24-Copy" fill="#FF545F" transform="translate(11.000000, 8.500000) rotate(-90.000000) translate(-11.000000, -8.500000) "
                            points="8 19 14 19 14 -2 8 -2"></polygon>
                        <polygon id="Fill-25-Copy" fill="#FF545F" transform="translate(11.000000, 20.500000) rotate(-90.000000) translate(-11.000000, -20.500000) "
                            points="8 31 14 31 14 10 8 10"></polygon>
                        <polygon id="Fill-26-Copy" fill="#FF545F" transform="translate(11.000000, 100.500000) rotate(-90.000000) translate(-11.000000, -100.500000) "
                            points="5 106 17 106 17 95 5 95"></polygon>
                        <polygon id="Fill-27-Copy" fill="#FF545F" transform="translate(11.000000, 115.500000) rotate(-90.000000) translate(-11.000000, -115.500000) "
                            points="8 126 14 126 14 105 8 105"></polygon>
                    </g>
                    <g id="Group-Copy-15" transform="translate(712.053000, 100.989900) rotate(3.000000) translate(-712.053000, -100.989900) translate(701.053000, 37.489900)">
                        <polygon id="Fill-23-Copy" fill="#4F69A8" transform="translate(11.000000, 63.500000) rotate(-90.000000) translate(-11.000000, -63.500000) "
                            points="-52 74 74 74 74 53 -52 53"></polygon>
                        <polygon id="Fill-24-Copy" fill="#FF545F" transform="translate(11.000000, 8.500000) rotate(-90.000000) translate(-11.000000, -8.500000) "
                            points="8 19 14 19 14 -2 8 -2"></polygon>
                        <polygon id="Fill-25-Copy" fill="#FF545F" transform="translate(11.000000, 20.500000) rotate(-90.000000) translate(-11.000000, -20.500000) "
                            points="8 31 14 31 14 10 8 10"></polygon>
                        <polygon id="Fill-26-Copy" fill="#FF545F" transform="translate(11.000000, 100.500000) rotate(-90.000000) translate(-11.000000, -100.500000) "
                            points="5 106 17 106 17 95 5 95"></polygon>
                        <polygon id="Fill-27-Copy" fill="#FF545F" transform="translate(11.000000, 115.500000) rotate(-90.000000) translate(-11.000000, -115.500000) "
                            points="8 126 14 126 14 105 8 105"></polygon>
                    </g>
                    <g id="Fill-30-Copy-2-+-Fill-28-Copy-2-+-Fill-33-Copy-2-Copy" transform="translate(770.053000, 132.479800)">
                        <path d="M7.9448,6 L7.9448,26 L96.8848,26 C96.8848,26 104.8848,26 104.8848,17.3513514 L104.8848,14.6486486 C104.8848,14.6486486 104.8848,6 96.8848,6 L7.9448,6 Z"
                            id="Fill-30-Copy-2" fill="#2BD7F3" transform="translate(56.414800, 16.000000) scale(-1, 1) translate(-56.414800, -16.000000) "></path>
                        <path d="M111.053,17.1162791 L111.053,14.8837209 C111.053,14.8837209 111.053,0 96.3185733,0 L0.5448,0 L0.5448,6.69767442 L95.581852,6.69767442 C103.685787,6.69767442 103.685787,14.8837209 103.685787,14.8837209 L103.685787,17.1162791 C103.685787,25.3023256 95.581852,25.3023256 95.581852,25.3023256 L0.5448,25.3023256 L0.5448,32 L96.3185733,32 C96.3185733,32 111.053,32 111.053,17.1162791"
                            id="Fill-28-Copy-2" fill="#3B8DBC" transform="translate(55.798900, 16.000000) scale(-1, 1) translate(-55.798900, -16.000000) "></path>
                        <polygon id="Fill-33-Copy-2" fill="#234F78" transform="translate(42.553000, 23.201700) scale(-1, 1) translate(-42.553000, -23.201700) "
                            points="37.053 15.0397 37.053 31.3637 42.553 26.1397 48.053 31.3637 48.053 15.0397"></polygon>
                    </g>
                    <g id="Fill-30-Copy-3-+-Fill-28-Copy-3-Copy" transform="translate(793.000000, 100.489900)">
                        <path d="M6.9671,6 L6.9671,26 L95.9071,26 C95.9071,26 103.9071,26 103.9071,17.3513514 L103.9071,14.6486486 C103.9071,14.6486486 103.9071,6 95.9071,6 L6.9671,6 Z"
                            id="Fill-30-Copy-3" fill="#FF948A"></path>
                        <path d="M111.3071,17.1162791 L111.3071,14.8837209 C111.3071,14.8837209 111.3071,0 96.5726733,0 L0.7989,0 L0.7989,6.69767442 L95.835952,6.69767442 C103.939887,6.69767442 103.939887,14.8837209 103.939887,14.8837209 L103.939887,17.1162791 C103.939887,25.3023256 95.835952,25.3023256 95.835952,25.3023256 L0.7989,25.3023256 L0.7989,32 L96.5726733,32 C96.5726733,32 111.3071,32 111.3071,17.1162791"
                            id="Fill-28-Copy-3" fill="#234F78"></path>
                    </g>
                </g>
            </g>
        </g>
    </svg>
)


const calendarBtnSvg = (
    <svg width="50px" height="50px" viewBox="0 0 50 50" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-762.000000, -1887.000000)">
            <g id="Group" transform="translate(0.000000, 1478.000000)">
                <g id="Rectangle-4-+-Group" transform="translate(762.000000, 408.000000)">
                    <rect id="calendar-btn-rect" fill="#323232" transform="translate(25.000000, 26.000000) scale(1, -1) rotate(-180.000000) translate(-25.000000, -26.000000) "
                        x="0" y="1" width="50" height="50"></rect>
                    <g id="calendar-btn-g" transform="translate(10.000000, 9.000000)" stroke="#FFFFFF" strokeWidth="2">
                        <rect id="Rectangle-4" x="1" y="4" width="28" height="28"></rect>
                        <path d="M1.10000038,13 L28.8999996,13" id="Line" strokeLinecap="square"></path>
                        <path d="M8,6.99999981 L8,1" id="Line" strokeLinecap="square"></path>
                        <path d="M22,6.99999981 L22,1" id="Line-Copy" strokeLinecap="square"></path>
                    </g>
                </g>
            </g>
        </g>
    </svg>
);


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