import React from 'react';
import { connect } from 'react-redux';


const mapStateToProps = state => ({
    newPunishments: state.punishment.newPunishments,
    selectedTab: state.punishment.selectedTab,
});

const mapDispatchToProps = dispatch => ({
    setPickerTab: tabId => dispatch({ type: 'SWITCH_SELECTED_PUNISHMENT_TAB', id: tabId }),
});

class NotificationCount extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = ev => {
            ev.preventDefault();
            let punishmentTableElement = document.getElementById('punishment-picker');

            if (punishmentTableElement) {
                if (this.props.selectedTab !== 'newTab') this.props.setPickerTab('newTab');
                punishmentTableElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    render() {
        let num = this.props.newPunishments !== 'empty' ? this.props.newPunishments.length : 0;
        let width = ((num.toString().length * 14) + 10) + 'px';

        if (num > 0) {
            return (
                <div
                    style={{ width: width }}
                    className="noselect notification-count-container">
                    <span
                        className="notification-count-display"
                        onClick={this.handleClick}>
                        {num}
                    </span>
                </div>
            )
        } else return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCount);