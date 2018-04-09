import React from 'react';
import { connect } from 'react-redux';
import Calendar from 'react-calendar';

// Validacija: 
// na unos dana:
//     - ako mjesec nije jos unesen:
//         - provjera jel 0 < unos < 31,
//         - update state sa varijablom
//     - ako je mjesec unesen: 
//         - provjera jel validna vrijednost dana:
//                 - ako je unesena godina, uzeti u obzir jel prijestupna,
//                 - provjeriti jel dan validan za odredeni mjesec
//         - update state sa varijablom
// na unos mjeseca:
//     - provjera jel validna vrijednost (1-12),
//     - update statea
// na unos godine:
//     - provjera validne godine (trenutna godina >= x < 3000?)
//     - update statea
// klik na calendar btn: 
//     - pokušati dobiti date-picker kalendar
//     - sa odabirom prenijeti informacije na ostale textfieldove
//     - potecijalno:
//         - prenijeti date-picker iz modula i modificirati css
//         - modifikacija da se aktivira na btn, bez text-fielda


const mapStateToProps = state => ({
    ...state.punishmentCreation
});

const mapDispatchToProps = dispatch => ({
    updateFieldValue: (value, key) => dispatch({ type: 'UPDATE_DEADLINE_FIELD', field: key, value }),
    changeDeadlineValidity: value => dispatch({ type: 'UPDATE_DEADLINE_VALIDITY', value })
});

class DateElement extends React.Component {

    constructor(props) {
        super(props);

        this.lastFocusedElement = null;
        this.lastBluredElement = null;

        this.timeoutID = null;

        this.state = {
            validDeadline: true,
            isManagingFocus: false,
        };

        this.showCalendar = ev => {
            ev.preventDefault();
            this.setState({
                isManagingFocus: true,
            });
            setTimeout(() => {
                this.calendarContainer.focus();
            }, 1);
        };

        this.dayChange = ev => {
            let day = parseInt(ev.target.value);

            if (isNaN(day)) day = '';

            this.props.updateFieldValue(day, 'dayField');
            this.validateTime({
                day,
                month: this.props.monthField,
                year: this.props.yearField
            });
        };

        this.monthChange = ev => {
            let month = parseInt(ev.target.value);

            if (isNaN(month)) month = '';

            this.props.updateFieldValue(month, 'monthField');
            this.validateTime({
                day: this.props.dayField,
                month,
                year: this.props.yearField
            });
        };

        this.yearChange = ev => {
            let year = parseInt(ev.target.value);

            if (isNaN(year)) year = '';

            this.props.updateFieldValue(year, 'yearField');
            this.validateTime({
                day: this.props.dayField,
                month: this.props.monthField,
                year
            });
        };

        this.validateTime = timeData => {

            let yearSet = timeData.year !== '';
            let monthSet = timeData.month !== '';
            let daySet = timeData.day !== '';

            let validYear = yearSet ? validateYear(timeData.year) : true;
            let validMonth = monthSet ? validateMonth(timeData.month) : true;
            let validDay = daySet ? validateDay(timeData.day, timeData.month, timeData.year) : true;

            if ((yearSet && monthSet && daySet) && (validYear && validMonth && validDay)) {
                // provjera jel deadline veci od trenutnog datuma (barem + 1 dan)
                let deadlineDate = new Date(timeData.year, timeData.month - 1, timeData.day)
                let now = new Date();

                this.setState({ validDeadline: (deadlineDate > now) });
                this.props.changeDeadlineValidity((deadlineDate > now));
            } else {
                this.setState({ validDeadline: (validYear && validMonth && validDay) });
                this.props.changeDeadlineValidity((validYear && validMonth && validDay));
            }
        };

        this.onCalendarChange = selectedDate => {
            this.props.updateFieldValue(selectedDate.getFullYear(), 'yearField');
            this.props.updateFieldValue(selectedDate.getMonth() + 1, 'monthField');
            this.props.updateFieldValue(selectedDate.getDate(), 'dayField');
            this.props.changeDeadlineValidity(true);
            // sakrij calendar
            this.setState({ isManagingFocus: false });
        };


        this.onBlur = ev => {
            let isCalendar = false;
            if (ev.nativeEvent.relatedTarget !== null) {
                const string = ev.nativeEvent.relatedTarget.className;
                const substring = 'calendar';
                if (string.indexOf(substring) !== -1) {
                    isCalendar = true;
                }
            }
            // klik van calendar diva
            if (!isCalendar) {
                this.timeoutID = setTimeout(() => {
                    if (this.state.isManagingFocus) {
                        this.setState({
                            isManagingFocus: false,
                        });
                    }
                }, 0);
            }
        };

        this.onFocus = () => {
            clearTimeout(this._timeoutID);
            if (!this.state.isManagingFocus) {
                this.setState({
                    isManagingFocus: true,
                });
            }
        };
    }

    render() {
        const deadlineStyle = this.state.validDeadline ? {} : { backgroundColor: 'rgb(247, 200, 234)' };
        let now = new Date();
        let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const maxDate = new Date(2100, 1, 1);

        return (
            <div>
                <input id="day-picker"
                    className={`float-left text-input ${this.state.validDeadline ? "" : "input-wrong-entry"}`}
                    type="text"
                    placeholder="dd"
                    value={this.props.dayField}
                    onChange={this.dayChange}
                    required />

                <input id="month-picker"
                    className={`float-left text-input ${this.state.validDeadline ? "" : "input-wrong-entry"}`}
                    type="text"
                    placeholder="mm"
                    value={this.props.monthField}
                    onChange={this.monthChange}
                    required />

                <input id="year-picker"
                    className={`float-left text-input ${this.state.validDeadline ? "" : "input-wrong-entry"}`}
                    type="text"
                    placeholder="yyyy"
                    value={this.props.yearField}
                    onChange={this.yearChange}
                    required />

                <div
                    style={{
                        display: 'inline-block',
                        position: 'relative'
                    }}>

                    <button
                        id="btn-calendar"
                        type="button"
                        onClick={this.showCalendar}>

                        {calendarBtnSvg}
                    </button>

                    {this.state.isManagingFocus ?
                        <div
                            ref={elem => this.calendarContainer = elem}
                            style={{
                                position: 'absolute',
                                zIndex: '20',
                                top: '10px',
                                left: '100%',
                                outline: 'none',
                            }}
                            tabIndex="1"
                            autoFocus
                            onBlur={this.onBlur}
                            onFocus={this.onFocus} >

                            <Calendar
                                onChange={this.onCalendarChange}
                                minDate={tomorrow}
                                maxDate={maxDate}
                            />
                        </div>
                        : null}

                </div>

            </div>
        );
    }

}


export default connect(mapStateToProps, mapDispatchToProps)(DateElement);


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


const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const leapYearDaysPerMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


function isLeapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function validateDay(day, month = '', year = '') {
    if (typeof day !== 'number') return false;
    if (day < 1 || day > 31) return false;

    if (month === '' && year === '') {
        return true;

    } else if (month !== '' && year === '') { // ako je postavaljen mjesec
        return (day <= daysPerMonth[month - 1])

    } else if (month !== '' && year !== '') { // ako je postavljen i mjesec i godina
        const monthData = isLeapYear(year) ? leapYearDaysPerMonth : daysPerMonth;
        return (day <= monthData[month - 1]);
    }
}

function validateMonth(month) {
    return (month >= 1 && month <= 12);
}

function validateYear(year) {
    return (year >= (new Date().getFullYear()) && year < 2100);
}