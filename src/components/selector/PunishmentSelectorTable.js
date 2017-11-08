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

        this._handleAcceptedPunFromAgent = (payload) => {

            if (payload.acceptedPunishments) {

                this.props.onLoadedAcceptedPunishments(payload.acceptedPunishments);

                if (payload.acceptedPunishments.length > 0) {

                    this.props.setAcceptedHeaderVisibility(true);
                    // this.showAcceptedTabHeader = true;
                    this.selectTab('acceptedTab');
                }
                // if (this.props.acceptedPunishments[0] && !this.props.activePunishment._id) this.setDefaultPunishment();
            } else {

                console.log("error: accepted punishments payload wasn't received");
                // this.showAcceptedTabHeader = false;
                this.props.onLoadedAcceptedPunishments([]);
            }
        };

        this._handlePastPunFromAgent = (payload) => {

            if (payload.pastPunishments) {

                this.props.onLoadedPastPunishments(payload.pastPunishments);

                if (payload.pastPunishments.length > 0) {

                    this.props.setPastHeaderVisibility(true);
                    // this.showPastTabHeader = true;

                    if (!this.props.selectedTab) {
                        this.selectTab('pastTab')
                    }
                }
            } else {

                console.log("error: past punishments payload wasn't received");
                // this.showPastTabHeader = false;
                this.props.onLoadedPastPunishments([]);
            }
        };

        this._handleOrderedPunFromAgent = (payload) => {

            if (payload.orderedPunishments) {

                this.props.onLoadedOrderedPunishments(payload.orderedPunishments);

                if (payload.orderedPunishments.length > 0) {

                    this.props.setOrderedHeaderVisibility(true);
                    // this.showOrderedTabHeader = true;

                    if (!this.props.selectedTab) {

                        this.selectTab('orderedTab');
                    }
                    // if (this.props.acceptedPunishments[0] && !this.props.activePunishment._id) this.setDefaultPunishment();
                }
            } else {

                console.log("error: ordered punishments payload wasn't received");
                //this.showOrderedTabHeader = false; // potencijalno maknuti
                this.props.onLoadedOrderedPunishments([]);
            }
        };

    }

    componentDidUpdate(prevProps) {

        if (!prevProps.user._id && this.props.user._id) { // dohvacen userdata

            agent.Punishment.getAccepted().then((payload) => {
                // console.log('accepted answer')
                this._handleAcceptedPunFromAgent(payload);
            });

            agent.Punishment.getPast().then((payload) => {
                // console.log('past answer')
                this._handlePastPunFromAgent(payload);
            });

            agent.Punishment.getOrdered().then((payload) => {
                // console.log('ordered answer')
                this._handleOrderedPunFromAgent(payload);
            });
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.acceptedPunishments.length === 0) this.props.setAcceptedHeaderVisibility(false);;
        if (nextProps.orderedPunishments.length === 0) this.props.setOrderedHeaderVisibility(false);
        if (nextProps.pastPunishments.length === 0) this.props.setPastHeaderVisibility(false);

    }

    render() {

        const userLoggedIn = this.props.user._id;
        let shownTab = null;


        if (userLoggedIn) {

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

