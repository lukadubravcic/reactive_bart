import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

import AcceptedTab from './acceptedTab/AcceptedTab';
import PastTab from './pastTab/PastTab';
import OrderedTab from './orderedTab/OrderedTab';

const mapStateToProps = state => ({
    ...state,
    tabStyles: state.punishment.tabStyles,
    acceptedPunishments: state.punishment.acceptedPunishments,
});

const mapDispatchToProps = dispatch => ({
    changeSelectedTab: (id) => {
        dispatch({ type: 'SWITCH_SELECTED_PUNISHMENT_TAB', id })
    },
    onLoadedAcceptedPunishments: (punishments) => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_LOADED', punishments })
    },
    onLoadedOrderedPunishments: (punishments) => {
        dispatch({ type: 'ORDERED_PUNISHMENTS_LOADED', punishments })
    },
    onLoadedPastPunishments: (punishments) => {
        dispatch({ type: 'PAST_PUNISHMENTS_LOADED', punishments })
    },
});

class PunishmentSelectorTable extends React.Component {

    constructor() {
        super();

        this.onChangeTab = ev => {
            //console.log(ev.target.id);
            this.selectTab(ev.target.id);
        }

        this.selectTab = tab => {
            if (tab !== this.props.punishment.selectedTab) { // ako se selektira razlicit tab od trenutnog
                switch (tab) {
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
                this.props.changeSelectedTab(tab);
            }
        }

        this.placeholderStyles = { // jednostavan styling radi lakseg rada
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

        this.acceptedStyle = this.placeholderStyles.defaultStyle;
        this.pastStyle = this.placeholderStyles.defaultStyle;
        this.orderedStyle = this.placeholderStyles.defaultStyle;

        this.showAcceptedTab = false;
        this.showPastTab = false;
        this.showOrderedTab = false;

        this._handleAcceptedPunFromAgent = (payload) => {
            if (payload) {
                this.props.onLoadedAcceptedPunishments(payload.acceptedPunishments);
                if (payload.acceptedPunishments.length > 0) {
                    this.showAcceptedTab = true;
                    this.acceptedStyle = this.placeholderStyles.selectedStyle;
                }
                // if (this.props.acceptedPunishments[0] && !this.props.activePunishment._id) this.setDefaultPunishment();
            } else {
                console.log("error: accepted punishments payload wasn't received");
            }
        };

        this._handlePastPunFromAgent = (payload) => {
            if (payload) {
                this.props.onLoadedPastPunishments(payload.pastPunishments);
                if (payload.pastPunishments.length > 0) {
                    this.showPastTab = true;
                    if (this.acceptedStyle !== this.placeholderStyles.selectedStyle) {
                        this.pastStyle = this.placeholderStyles.selectedStyle;
                        this.selectTab('pastTab')
                    }
                }
            } else {
                console.log("error: past punishments payload wasn't received");
            }
        };

        this._handleOrderedPunFromAgent = (payload) => {
            if (payload) {
                this.props.onLoadedOrderedPunishments(payload.orderedPunishments);
                if (payload.orderedPunishments.length > 0) {
                    this.showOrderedTab = true;
                    if (this.acceptedStyle !== this.placeholderStyles.selectedStyle && this.pastStyle !== this.placeholderStyles.selectedStyle) {
                        this.orderedStyle = this.placeholderStyles.selectedStyle;
                        this.selectTab('orderedTab');
                    }
                    // if (this.props.acceptedPunishments[0] && !this.props.activePunishment._id) this.setDefaultPunishment();
                } else {
                    console.log("error: ordered punishments payload wasn't received");
                }
            }
        };

    }

    componentDidUpdate(prevProps) {
        if (!prevProps.common.currentUser._id && this.props.common.currentUser._id) { // dohvacen userdata
            agent.Punishment.getAccepted().then((payload) => {
                this._handleAcceptedPunFromAgent(payload);

                agent.Punishment.getPast().then((payload) => {
                    this._handlePastPunFromAgent(payload);

                    agent.Punishment.getOrdered().then((payload) => {
                        this._handleOrderedPunFromAgent(payload);
                    });
                });
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.punishment.acceptedPunishments.length === 0) this.showAcceptedTab = false;
        if (nextProps.punishment.orderedPunishments.length === 0) this.showOrderedTab = false;
        if (nextProps.punishment.pastPunishments.length === 0) this.showPastTab = false;

    }

    render() {

        let shownTab = null;
        const userLoggedIn = this.props.common.currentUser._id;

        const acceptedTabHeader = this.showAcceptedTab ? (<label id="acceptedTab" style={this.acceptedStyle} onClick={this.onChangeTab}>ACCEPTED</label>) : null;
        const pastTabHeader = this.showPastTab ? (<label id="pastTab" style={this.pastStyle} onClick={this.onChangeTab}>PAST</label>) : null;
        const orderedTabHeader = this.showOrderedTab ? (<label id="orderedTab" style={this.orderedStyle} onClick={this.onChangeTab}>ORDERED</label>) : null;

        let tableTabNamesElement = (
            <div style={{ display: "flex", alignItems: "center" }}>
                {acceptedTabHeader}
                {pastTabHeader}
                {orderedTabHeader}
            </div>
        );

        if (this.props.punishment.selectedTab === 'acceptedTab' && this.showAcceptedTab) {
            shownTab = (
                <div className="container">
                    <AcceptedTab />
                </div>
            );
        } else if (this.props.punishment.selectedTab === 'pastTab' && this.showPastTab) {
            shownTab = (
                <div className="container">
                    <PastTab />
                </div>
            );
        } else if (this.props.punishment.selectedTab === 'orderedTab' && this.showOrderedTab) {
            shownTab = (
                <div className="container">
                    <OrderedTab />
                </div>
            ); 
        }

        if (userLoggedIn) {

            return (
                <div className="container">
                    {tableTabNamesElement}
                    {shownTab}
                </div>

            )
        } else return null // no data
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PunishmentSelectorTable)

