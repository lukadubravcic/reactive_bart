import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

const mapStateToProps = state => ({ ...state });

const mapDispatchToProps = dispatch => ({
    onChangeWhom: value => dispatch({
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
    })
});

class PunishmentCreator extends React.Component {
    constructor() {
        super();
        this.changeWhom = ev => this.props.onChangeWhom(ev.target.value);
        this.changeHowManyTimes = ev => this.props.onChangeHowManyTimes(ev.target.value);
        this.changeWhatToWrite = ev => this.props.onChangeWhatToWrite(ev.target.value);
        this.changeWhy = ev => this.props.onChangeWhy(ev.target.value);
        this.incrementHowManyTimes = ev => {
            ev.preventDefault();
            this.props.onChangeHowManyTimes(this.props.punishment.howManyTimes + 1);
        }
        this.decrementHowManyTimes = ev => {
            ev.preventDefault();
            if (this.props.punishment.howManyTimes > 0) this.props.onChangeHowManyTimes(this.props.punishment.howManyTimes - 1);
        }
    }

    render() {

        const whomField = this.props.punishment.whom;
        const howManyTimesField = this.props.punishment.howManyTimes;
        const whatToWriteField = this.props.punishment.whatToWrite;
        const whyField = this.props.punishment.why;

        return (
            <div className="container">

                <form>
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
                                onClick={this.incrementHowManyTimes}
                            >˄</button>
                            <input
                                type="number"
                                placeholder="404"
                                value={howManyTimesField}
                                onChange={this.changeHowManyTimes}
                            />
                            <button
                                onClick={this.decrementHowManyTimes}>˅</button>
                        </fieldset>
                        <fieldset className="form-group">
                            <label>Deadline</label> Date picker
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
                                type="text"
                                placeholder="Feel free to explain your reasons."
                                value={whyField}
                                onChange={this.changeWhy} />
                        </fieldset>
                        <button
                            type="submit">
                            PUNISH</button>
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentCreator);