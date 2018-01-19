import React from 'react';
import { connect } from 'react-redux';
import agent from '../../agent';

import AcceptedTab from './acceptedTab/AcceptedTab';
import PastTab from './pastTab/PastTab';
import OrderedTab from './orderedTab/OrderedTab';

const mapStateToProps = state => ({
    ...state.punishment,
    user: state.common.currentUser,
    acceptedPunishments: state.punishment.acceptedPunishments,
    activePunishment: state.game.activePunishment,
    cheating: state.game.cheating
});

const mapDispatchToProps = dispatch => ({
    changeSelectedTab: (id) => {
        dispatch({ type: 'SWITCH_SELECTED_PUNISHMENT_TAB', id })
    },
    setAcceptedPunishments: (punishments) => {
        dispatch({ type: 'ACCEPTED_PUNISHMENTS_LOADED', punishments })
    },
    setOrderedPunishments: (punishments) => {
        dispatch({ type: 'ORDERED_PUNISHMENTS_LOADED', punishments })
    },
    setPastPunishments: (punishments) => {
        dispatch({ type: 'PAST_PUNISHMENTS_LOADED', punishments })
    },
    setAcceptedHeaderVisibility: value => {
        dispatch({ type: 'ACCEPTED_TAB_HEADER_VISIBILITY_CHANGED', value });
    },
    setPastHeaderVisibility: value => {
        dispatch({ type: 'PAST_TAB_HEADER_VISIBILITY_CHANGED', value });
    },
    setOrderedHeaderVisibility: value => {
        dispatch({ type: 'ORDERED_TAB_HEADER_VISIBILITY_CHANGED', value });
    },
});

class PunishmentSelectorTable extends React.Component {

    constructor() {
        super();

        this.showAcceptedTabHeader = false;
        this.showPastTabHeader = false;
        this.showOrderedTabHeader = false;

        this.onChangeTab = ev => {
            this.selectTab(ev.target.id);
        }

        this.selectTab = tab => {
            if (tab !== this.props.selectedTab) { // ako se selektira razlicit tab od trenutnog
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

        this._handleAcceptedPunFromAgent = payload => {

            if (payload !== null && typeof payload.acceptedPunishments !== 'undefined') {

                this.props.setAcceptedPunishments(payload.acceptedPunishments);

                if (payload.acceptedPunishments.length > 0) {

                    this.props.setAcceptedHeaderVisibility(true);
                    this.selectTab('acceptedTab');
                }

            } else {

                console.log("warning: accepted punishments empty or payload wasn't received");
                this.props.setAcceptedPunishments([]);
            }
        };

        this._handlePastPunFromAgent = payload => {

            if (payload !== null && typeof payload.pastPunishments !== 'undefined') {

                this.props.setPastPunishments(payload.pastPunishments);

                if (payload.pastPunishments.length > 0) {

                    this.props.setPastHeaderVisibility(true);

                    if (!this.props.selectedTab) {
                        this.selectTab('pastTab')
                    }
                }
            } else {

                console.log("warning: past punishments payload empty or wasn't received");
                this.props.setPastPunishments([]);
            }
        };

        this._handleOrderedPunFromAgent = payload => {

            if (payload !== null && typeof payload.orderedPunishments !== 'undefined') {

                this.props.setOrderedPunishments(payload.orderedPunishments);

                if (payload.orderedPunishments.length > 0) {

                    this.props.setOrderedHeaderVisibility(true);

                    if (!this.props.selectedTab) {

                        this.selectTab('orderedTab');
                    }

                }
            } else {

                console.log("warning: ordered punishments payload empty or wasn't received");
                this.props.setOrderedPunishments([]);
            }
        };
    }

    componentDidUpdate(prevProps) {

        if (!prevProps.user._id && this.props.user._id) { // detektiranje dohvacanja userdata

            agent.Punishment.getAccepted().then(payload => {
                // console.log('accepted answer')
                this._handleAcceptedPunFromAgent(payload);
            });

            agent.Punishment.getPast().then(payload => {
                // console.log('past answer')
                this._handlePastPunFromAgent(payload);
            });

            agent.Punishment.getOrdered().then(payload => {
                // console.log('ordered answer')
                this._handleOrderedPunFromAgent(payload);
            });
        }

        const activePunishmentJustSet = !Object.keys(prevProps.activePunishment).length && Object.keys(this.props.activePunishment).length > 0;

        if (activePunishmentJustSet && this.props.ignoredPunishmentSet && this.props.pastPunishments && Object.keys(this.props.user).length > 0) {

            this.selectTab('pastTab');
        }

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.acceptedPunishments.length === 0) {

            this.props.setAcceptedHeaderVisibility(false);

        } else if (nextProps.acceptedPunishments.length) {

            this.props.setAcceptedPunishments(nextProps.acceptedPunishments);
        }

        if (nextProps.orderedPunishments.length === 0) { // dobivanje praznog arrraya sa servera

            this.props.setOrderedHeaderVisibility(false);

        } else if (this.props.orderedPunishments.length === 0 && nextProps.orderedPunishments.length > 0) { // stvorene nove ordered kazne

            this.props.setOrderedPunishments(nextProps.orderedPunishments);
            this._handleOrderedPunFromAgent(nextProps.orderedPunishments);
        }

        if (nextProps.pastPunishments.length === 0) {

            this.props.setPastHeaderVisibility(false);

        } else if (nextProps.pastPunishments.length) {

            this.props.setPastPunishments(nextProps.pastPunishments);
        }

    }

    render() {

        const userLoggedIn = this.props.user._id;
        const adblockerOrCheatDetected = window.canRunAds === undefined || this.props.cheating;
        let shownTab = null;


        if (userLoggedIn && !adblockerOrCheatDetected) {

            const acceptedTabHeader = this.props.showAcceptedTab ? (<label id="acceptedTab" style={this.acceptedStyle} onClick={this.onChangeTab}>ACCEPTED</label>) : null;
            const pastTabHeader = this.props.showPastTab ? (<label id="pastTab" style={this.pastStyle} onClick={this.onChangeTab}>PAST</label>) : null;
            const orderedTabHeader = this.props.showOrderedTab ? (<label id="orderedTab" style={this.orderedStyle} onClick={this.onChangeTab}>ORDERED</label>) : null;


            let tableTabNamesElement = (
                <div style={{ display: "flex", alignItems: "center" }}>
                    {acceptedTabHeader}
                    {pastTabHeader}
                    {orderedTabHeader}
                </div>
            );

            switch (this.props.selectedTab) {
                case 'acceptedTab':
                    this.props.showAcceptedTab ? shownTab = (

                        <div className="container">
                            <AcceptedTab />
                        </div>

                    ) : null;
                    break;

                case 'pastTab':
                    this.props.showPastTab ? shownTab = (

                        <div className="container">
                            <PastTab />
                        </div>

                    ) : null;
                    break;

                case 'orderedTab':
                    this.props.showOrderedTab ? shownTab = (

                        <div className="container">
                            <OrderedTab />
                        </div>

                    ) : null;
                    break;
            }

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

