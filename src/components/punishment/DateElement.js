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
    updateFieldValue: (value, key) => dispatch({ type: 'UPDATE_DEADLINE_FIELD', field: key, value })
});


class DateElement extends React.Component {

    constructor(props) {
        super(props);

        this.showCalendar = ev => {
            ev.preventDefault();
            console.log('pokazi date-picker');
        }

        this.dayChange = ev => {
            let day = parseInt(ev.target.value);
            console.log(day)
            if (typeof day == NaN) console.log('NANNANANNAN')
            this.props.updateFieldValue(day, 'dayField');

            console.log(validateDay(day))
        }

        this.monthChange = ev => {
            let month = parseInt(ev.target.value);
            this.props.updateFieldValue(month, 'monthField');

            console.log(validateMonth(month))

        }

        this.yearChange = ev => {
            
            let year = parseInt(ev.target.value);
            this.props.updateFieldValue(year, 'yearField');

            console.log(validateYear(year))
        }
    }

    render() {
        return (
            <div>
                <input id="day-picker"
                    className="float-left text-input"
                    type="text"
                    placeholder="dd"
                    value={this.props.dayField}
                    onChange={this.dayChange}
                    required />

                <input id="month-picker"
                    className="float-left text-input"
                    type="text"
                    placeholder="mm"
                    value={this.props.monthField}
                    onChange={this.monthChange}
                    required />

                <input id="year-picker"
                    className="float-left text-input"
                    type="text"
                    placeholder="yyyy"
                    value={this.props.yearField}
                    onChange={this.yearChange}
                    required />

                <button
                    id="btn-calendar"
                    type="button"
                    onClick={this.showCalendar}>

                    {calendarBtnSvg}
                </button>
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

function validateDay(day, month = null, year = null) {

    if (typeof day !== 'number'
        && typeof month !== 'number'
        && typeof year !== 'number') return false;

    if (day < 1 || day > 31) return false;

    if (month === null && year === null) {
        return true;

    } else if (month !== null && year === null) {
        return (day <= daysPerMonth[month - 1])

    } else if (month !== null && year !== null) {
        // provjera ako je godina prijestupna        
        const monthData = isLeapYear(year) ? leapYearDaysPerMonth : daysPerMonth;

        return (day > monthData[month - 1]);
    }
}

function validateMonth(month) {
    return (month >= 1 && month <= 12);
}

function validateYear(year) {
    return (year >= (new Date().getFullYear()) && year < 2100);
}