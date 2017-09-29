import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

const PUNISHMENT_MAX_LENGTH = 100;
const PUNISHMENT_WHY_LENGTH = 500;
const MAX_HOW_MANY_TIMES_PUNISHMENT = 999;

const mapStateToProps = state => ({ ...state });

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
    onSubmit: submitData => {
        // agent magic
        agent.Punishment.createPunishment(submitData).then((payload) => {
            console.log(payload);
            if (!payload.errorMsg) dispatch({ type: 'PUNISHMENT_CREATED', payload, msg: 'Request sent!' });
            else dispatch({ type: 'PUNISHMENT_CREATED_ERROR', msg: payload.errorMsg });
        });
    }
});

class PunishmentCreator extends React.Component {

    constructor() {
        super();
        this.changeWhom = ev => this.props.onChangeWhom(ev.target.value);
        this.changeHowManyTimes = ev => {
            if (ev.target.value > MAX_HOW_MANY_TIMES_PUNISHMENT) ev.target.value = MAX_HOW_MANY_TIMES_PUNISHMENT;
            this.props.onChangeHowManyTimes(ev.target.value);
        }
        this.changeWhatToWrite = ev => {
            if (ev.target.value.length < PUNISHMENT_MAX_LENGTH) {
                this.props.onChangeWhatToWrite(ev.target.value);
            } else {
                // warning da je  text predugacak (maks duljina = PUNISHMENT_MAX_LENGTH)
                console.log('TODO WARNING: PUNISHMENT (whatToWrite) FIELD TOO LONG');
            }
        }
        this.changeWhy = ev => {
            if (ev.target.value.length < PUNISHMENT_WHY_LENGTH) {
                this.props.onChangeWhy(ev.target.value);
            } else {
                console.log('TODO WARNING: WHY FIELD TOO LONG')
            }

        }
        this.incrementHowManyTimes = ev => {
            ev.preventDefault();
            if (this.props.punishment.howManyTimes < 999) this.props.onChangeHowManyTimes(parseInt(this.props.punishment.howManyTimes) + 1);
        }
        this.decrementHowManyTimes = ev => {
            ev.preventDefault();
            if (this.props.punishment.howManyTimes > 0) this.props.onChangeHowManyTimes(this.props.punishment.howManyTimes - 1);
        }
        this.deadlineDateChange = date => {
            this.props.onDeadlineDateChange(moment(date).toDate().valueOf());
        }
        this.toggleDeadlineCheckbox = ev => {
            this.props.onChangeDeadlineCheckbox(!this.props.punishment.deadlineChecked);
        }

        this.submitForm = (whomField, howManyTimesField, deadlineChecked, deadlineDate, whatToWriteField, whyField) => ev => {
            ev.preventDefault();
            // na submitu dodaj tocku na punishment rečenicu ako nije stavljena
            let submitData = {};
            validateEmail(whomField) ? submitData.whomEmail = whomField : submitData.whomUsername = whomField;
            submitData.howManyTimes = howManyTimesField;
            submitData.deadlineDate = deadlineChecked ? deadlineDate : null;
            submitData.whatToWrite = whatToWriteField;
            submitData.why = whyField;
            this.props.onSubmit(submitData);
        };
    }

    render() {

        const whomField = this.props.punishment.whom;
        const howManyTimesField = this.props.punishment.howManyTimes;
        const whatToWriteField = this.props.punishment.whatToWrite;
        const whyField = this.props.punishment.why;
        const deadlineDate = this.props.punishment.deadlineDate;
        const deadlineChecked = this.props.punishment.deadlineChecked;

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
                        </fieldset>
                        <fieldset className="form-group">
                            <label>How many times</label>
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
                                onChange={this.changeWhatToWrite} />
                        </fieldset>
                        <fieldset className="form-group">
                            <label>Why</label>
                            <textarea
                                rows="5" cols="100"
                                type="text"
                                placeholder="Feel free to explain your reasons."
                                value={whyField}
                                onChange={this.changeWhy} />
                        </fieldset>
                        <button
                            type="submit">
                            <b>PUNISH</b>
                        </button>
                    </fieldset>
                </form>
                <label><h1>{this.props.punishment._message !== null ? this.props.punishment._message : null}</h1></label>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentCreator);

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}