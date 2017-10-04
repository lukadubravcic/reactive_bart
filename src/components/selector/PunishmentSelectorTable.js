import React from 'react';
import { connect } from 'react-redux';

import AcceptedTab from './AcceptedTab'

const mapStateToProps = state => ({
    ...state,
    tabStyles: state.punishment.tabStyles
});

const mapDispatchToProps = dispatch => ({
    changeSelectedTab: (id) => {
        dispatch({ type: 'SWITCH_SELECTED_PUNISHMENT_TAB', id })
    }
});

class PunishmentSelectorTable extends React.Component {

    constructor() {
        super();
        this.selectTab = ev => {
            //console.log(ev.target.id);
            /* if (ev.target.id !== this.props.punishment.selectedTab) { */ // ako se selektira razlicit tab od trenutnog

            switch (ev.target.id) {
                case 'acceptedTab':
                    this.acceptedStyle = this.placeholderStyles.selectedStyle;
                    this.pastStyle = this.orderedStyle = this.placeholderStyles.defaultStyle;
                    break;
                case 'pastTab':
                    this.pastStyle = this.placeholderStyles.selectedStyle;
                    this.acceptedStyle = this.orderedStyle = this.placeholderStyles.defaultStyle;
                    break;
                case 'orderedTab':
                    this.orderedStyle = this.placeholderStyles.selectedStyle;
                    this.acceptedStyle = this.pastStyle = this.placeholderStyles.defaultStyle;
                    break;
            }

            this.props.changeSelectedTab(ev.target.id);
            /*  } */
        };

        this.placeholderStyles = {
            defaultStyle: {
                margin: "5px 10px",
                padding: "5px 10px",
                fontWeight: "bold",
                textAlign: "center"
            },
            selectedStyle: {
                margin: "5px 10px",
                padding: "5px 10px",
                fontWeight: "bold",
                textAlign: "center",
                borderBottom: "6px solid grey"
            }
        };

        this.acceptedStyle = this.placeholderStyles.selectedStyle;
        this.pastStyle = this.placeholderStyles.defaultStyle;
        this.orderedStyle = this.placeholderStyles.defaultStyle;
    }

    render() {
        let viewTab = null;

        let tableTabNamesElement = (
            <div style={{ display: "flex", alignItems: "center" }}>
                <label id="acceptedTab" style={this.acceptedStyle} onClick={this.selectTab}>ACCEPTED</label>
                <label id="pastTab" style={this.pastStyle} onClick={this.selectTab}>PAST</label>
                <label id="orderedTab" style={this.orderedStyle} onClick={this.selectTab}>ORDERED</label>
            </div>
        );

        if (this.props.common.currentUser._id) { // user logged in?
            if (this.props.punishment.selectedTab === 'acceptedTab') {

                return (
                    <div className="container">
                        {tableTabNamesElement}
                        <AcceptedTab />
                    </div>
                );
            }
            else if (this.props.punishment.selectedTab === 'pastTab') {
                return (
                    <div className="container">
                        {tableTabNamesElement}

                    </div>
                );
            }
            else if (this.props.punishment.selectedTab === 'orderedTab') {
                return (
                    <div className="container">
                        {tableTabNamesElement}
                    </div>
                );
            }
        }
        else { // user not logged in
            return null;
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PunishmentSelectorTable)