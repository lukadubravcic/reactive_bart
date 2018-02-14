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
                this.props.changeSelectedTab(tab);
            }
        }

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

        this.setHeaderTabsElement = selectedTab => {

            let acceptedTabHeader = null;
            let pastTabHeader = null;
            let orderedTabHeader = null;

            switch (selectedTab) {
                case 'acceptedTab':
                    acceptedTabHeader = this.props.showAcceptedTab
                        ? (<button className="picker-tab picker-selected-tab" id="acceptedTab" onClick={this.onChangeTab}>ACCEPTED</button>)
                        : null;
                    pastTabHeader = this.props.showPastTab
                        ? (<button className="picker-tab picker-tab-with-border" id="pastTab" onClick={this.onChangeTab}>PAST</button>)
                        : null;
                    orderedTabHeader = this.props.showOrderedTab
                        ? (<button className="picker-tab" id="orderedTab" onClick={this.onChangeTab}>ORDERED</button>)
                        : null;

                    break;

                case 'pastTab':
                    acceptedTabHeader = this.props.showAcceptedTab
                        ? (<button className="picker-tab" id="acceptedTab" onClick={this.onChangeTab}>ACCEPTED</button>)
                        : null;
                    pastTabHeader = this.props.showPastTab
                        ? (<button className="picker-tab picker-selected-tab" id="pastTab" onClick={this.onChangeTab}>PAST</button>)
                        : null;
                    orderedTabHeader = this.props.showOrderedTab
                        ? (<button className="picker-tab" id="orderedTab" onClick={this.onChangeTab}>ORDERED</button>)
                        : null;

                    break;

                case 'orderedTab':
                    acceptedTabHeader = this.props.showAcceptedTab
                        ? (<button className="picker-tab picker-tab-with-border" id="acceptedTab" onClick={this.onChangeTab}>ACCEPTED</button>)
                        : null;
                    pastTabHeader = this.props.showPastTab
                        ? (<button className="picker-tab" id="pastTab" onClick={this.onChangeTab}>PAST</button>)
                        : null;
                    orderedTabHeader = this.props.showOrderedTab
                        ? (<button className="picker-tab picker-selected-tab" id="orderedTab" onClick={this.onChangeTab}>ORDERED</button>)
                        : null;
            }

            return (
                <div className="picker-nav-container">
                    <nav className="picker-navigation">
                        {acceptedTabHeader}
                        {pastTabHeader}
                        {orderedTabHeader}
                    </nav>
                </div>
            );
        }
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
        let selectorParentCSS = 'parent-component picker-component-container'


        if (userLoggedIn && !adblockerOrCheatDetected) {

            const tableTabNamesElement = this.setHeaderTabsElement(this.props.selectedTab);

            switch (this.props.selectedTab) {
                case 'acceptedTab':
                    selectorParentCSS += ' picker-accepted-color';
                    this.props.showAcceptedTab ? shownTab = (

                        <AcceptedTab />

                    ) : null;
                    break;

                case 'pastTab':
                    selectorParentCSS += ' picker-past-color';
                    this.props.showPastTab ? shownTab = (

                        <PastTab />

                    ) : null;
                    break;

                case 'orderedTab':
                    selectorParentCSS += ' picker-ordered-color';
                    this.props.showOrderedTab ? shownTab = (

                        <OrderedTab />

                    ) : null;
                    break;
            }

            return (
                <div className={selectorParentCSS}>
                    <div className="container">
                        <label className="heading picker-heading">Pick your punishment</label>

                        <div className="pun-picker-component">

                            {tableTabNamesElement}
                            {shownTab}

                        </div>

                            <div id="picker-bottom-image-container">
                                {componentBottomImage}
                            </div>

                    </div>
                </div>
            )

        } else return null; // no data
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PunishmentSelectorTable)



const componentBottomImage = (
    <svg id="picker-bottom-image" width="1080px" height="166px" viewBox="0 0 1080 166" version="1.1" xmlns="http://www.w3.org/2000/svg">

        <title>Group Copy 5</title>
        <desc>Created with Sketch.</desc>
        <defs>
            <polyline id="path-1" points="0 73 72.577 73 72.577 0.722 0 0.722"></polyline>
        </defs>
        <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-100.000000, -3187.000000)">
            <g id="Group" transform="translate(0.000000, 2508.000000)">
                <g id="Group-Copy-5" transform="translate(100.000000, 679.000000)">
                    <text id="-" fontFamily="Montserrat-Light, Montserrat" fontSize="25" fontWeight="300"></text>
                    <polygon id="Fill-7-Copy-5" fill="#EA411E" points="-2.38411233e-13 166 1080 166 1080 146 -2.38411233e-13 146"></polygon>
                    <g id="Group-Copy" transform="translate(704.000000, 124.214000)">
                        <polygon id="Fill-34" fill="#234F78" points="0 21.9798 148 21.9798 148 0 0 0"></polygon>
                        <polygon id="Fill-37" fill="#2B80B2" points="21 21.9798 28 21.9798 28 0 21 0"></polygon>
                        <polygon id="Fill-38" fill="#2B80B2" points="7 22 14 22 14 0 7 0"></polygon>
                        <polygon id="Fill-37-Copy-3" fill="#2B80B2" points="134 21.9798 141 21.9798 141 0 134 0"></polygon>
                        <polygon id="Fill-37-Copy-2" fill="#2B80B2" points="120 21.9798 127 21.9798 127 0 120 0"></polygon>
                        <path d="M107,18 C110.866137,18 114,14.8661367 114,11 C114,7.13386328 110.866137,4 107,4 C103.133863,4 100,7.13386328 100,11 C100,14.8661367 103.133863,18 107,18"
                            id="Fill-39" fill="#00BBD6"></path>
                    </g>
                    <polygon id="Fill-15-Copy" fill="#FEFEFE" points="229 146.214 267 146.214 267 137.214 229 137.214"></polygon>
                    <polygon id="Fill-15-Copy-3" fill="#FEFEFE" transform="translate(220.000000, 136.355566) rotate(-17.000000) translate(-220.000000, -136.355566) "
                        points="201 140.855566 239 140.855566 239 131.855566 201 131.855566"></polygon>
                    <polygon id="Fill-1" fill="#EA411E" points="967.972874 79.3283189 972.753666 79.3283189 972.753666 38.6915886 967.972874 38.6915886"></polygon>
                    <g id="Group-7" transform="translate(928.726539, 0.214000)" fill="#EA411E">
                        <path d="M36.5924608,7.0890196 C25.6246834,-3.87875779 2.36706608,1.59778612 2.36706608,1.59778612 C2.36706608,1.59778612 -3.10947782,24.8567389 7.85696415,35.8231808 C18.8247415,46.7896228 42.0823589,41.3130789 42.0823589,41.3130789 C42.0823589,41.3130789 47.5589028,18.0554616 36.5924608,7.0890196 Z"
                            id="Fill-2"></path>
                        <path d="M41.6365968,54.1552472 C41.6365968,54.1552472 54.6702638,64.8305683 65.3429141,61.3624911 C76.0155644,57.8957494 80.2848916,41.5983239 80.2848916,41.5983239 C80.2848916,41.5983239 67.2512246,30.9216674 56.5785743,34.3897445 C45.905924,37.8578217 41.6365968,54.1552472 41.6365968,54.1552472"
                            id="Fill-5"></path>
                    </g>
                    <polygon id="Fill-8" fill="#234F78" points="934.507598 91.280432 951.447359 147.445388 989.279714 147.445388 1006.21814 91.280432"></polygon>
                    <polygon id="Fill-9" fill="#2B80B2" points="929.726539 91.2802984 1011 91.2802984 1011 74.5475271 929.726539 74.5475271"></polygon>
                    <g id="Group-3-+-Fill-4-Copy" transform="translate(729.000000, 52.214000)">
                        <g id="Group-3-+-Fill-4">
                            <g id="Group-3" transform="translate(0.423100, 0.000000)">
                                <mask id="mask-2" fill="white">
                                    <use xlinkHref="#path-1"></use>
                                </mask>
                                <g id="Clip-2"></g>
                                <path d="M60.2559,18.637 C60.2559,18.637 43.5389,16.956 36.2879,22.715 C29.0379,16.956 19.9919,15.06 12.3209,18.637 C0.5579,24.122 -3.4901,40.336 3.2789,54.851 C9.9449,69.147 24.6099,76.437 36.2879,71.417 C47.9669,76.437 62.6319,69.147 69.2979,54.851 C76.0669,40.336 72.0189,24.122 60.2559,18.637"
                                    id="Fill-1" fill="#EA411E" mask="url(#mask-2)"></path>
                            </g>
                            <path d="M35.9771,22.7153 C35.9771,22.7153 48.2791,25.5143 54.2721,19.6253 C60.2661,13.7353 57.6811,1.3863 57.6811,1.3863 C57.6811,1.3863 45.3801,-1.4127 39.3861,4.4773 C33.3931,10.3663 35.9771,22.7153 35.9771,22.7153"
                                id="Fill-4" fill="#2B80B2"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
)

