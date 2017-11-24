import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import DatePicker from 'react-datepicker';
import moment from 'moment';

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
    onSubmit: (submitData, orderedPunishments) => {
        // agent magic
        agent.Punishment.createPunishment(submitData).then((payload) => {

            let newOrderedPunishments = orderedPunishments.length > 0 ? JSON.parse(JSON.stringify(orderedPunishments)) : [];
            newOrderedPunishments.unshift(payload);

            if (!payload.errorMsg) {
                dispatch({ type: 'PUNISHMENT_CREATED', newOrderedPunishments, msg: 'Request sent!' });
            }
            else dispatch({ type: 'PUNISHMENT_CREATED_ERROR', msg: payload.errorMsg });
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

        };

        this.validateToWhomValue = value => {
            if (!isMail(value)) {
                if (value.length > 30)
                    this.toWhomErrorText = 'Username can\'t be that long. Maximum 30 characters.';
                else
                    this.toWhomErrorText = null;
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

            let submitData = {};
            isMail(whomField) ? submitData.whomEmail = whomField : submitData.whomUsername = whomField;
            submitData.howManyTimes = howManyTimesField;
            submitData.deadlineDate = deadlineChecked ? deadlineDate : null;
            submitData.whatToWrite = whatToWriteField;
            submitData.why = whyField;

            this.props.onSubmit(submitData, this.props.orderedPunishments);
        };
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
                <div className="container">

                    <form onSubmit={this.submitForm(whomField, howManyTimesField, deadlineChecked, deadlineDate, whatToWriteField, whyField)}>
                        <fieldset>
                            <fieldset className="form-group">
                                <label>To whom</label>
                                <input
                                    type="text"
                                    placeholder="email/username"
                                    value={whomField}
                                    onChange={this.changeWhom}
                                    required />
                                {this.toWhomErrorText ? <label>{this.toWhomErrorText}</label> : null}
                            </fieldset>
                            <fieldset className="form-group">
                                <label htmlFor="first_name">How many times</label>
                                <button
                                    type="button"
                                    onClick={this.incrementHowManyTimes}
                                >˄</button>
                                <input
                                    type="number"
                                    placeholder=""
                                    value={howManyTimesField}
                                    onChange={this.changeHowManyTimes}
                                />
                                <button
                                    type="button"
                                    onClick={this.decrementHowManyTimes}
                                >˅</button>
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Deadline</label>
                                <input
                                    type="checkbox"
                                    checked={deadlineChecked}
                                    onChange={this.toggleDeadlineCheckbox} />
                                <DatePicker
                                    // default deadline = tjedan od trenutnog datuma
                                    selected={moment(deadlineDate)}
                                    onChange={this.deadlineDateChange}
                                    minDate={moment().add(1, 'days')}
                                    disabled={!deadlineChecked} />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>What to write</label>
                                <input
                                    type="text"
                                    placeholder="Desired punishment."
                                    value={whatToWriteField}
                                    onChange={this.changeWhatToWrite}
                                    required />
                                {this.whatToWriteErrorText ? <label>{this.whatToWriteErrorText}</label> : null}
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Why</label>
                                <textarea
                                    rows="5" cols="100"
                                    type="text"
                                    placeholder="Feel free to explain your reasons."
                                    value={whyField}
                                    onChange={this.changeWhy} />
                                {this.whyErrorText ? <label>{this.whyErrorText}</label> : null}
                            </fieldset>
                            <button
                                type="submit">
                                <b>PUNISH</b>
                            </button>
                            {this.props._message !== null ? <label>{this.props._message}</label> : null}
                        </fieldset>
                    </form>

                </div>
            );
        } else return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentCreator);

function isMail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}