import React from 'react';
import { connect } from 'react-redux';
import PastTabRow from './PastTabRow';
import TableFooter from '../TableFooter';

import agent from '../../../agent';

const ITEMS_PER_PAGE = 3;

const mapStateToProps = state => ({
    state: state,
    pastPunishments: state.punishment.pastPunishments,
    shownPastPunishments: state.punishment.shownPastPunishments,
    currentPage: state.punishment.currentPastPage
});

const mapDispatchToProps = dispatch => ({
    onLoadedPastPunishments: (punishments) => {
        dispatch({ type: 'PAST_PUNISHMENTS_LOADED', punishments })
    },
    changeShownPunishments: (punishments, newPage) => {
        dispatch({ type: 'UPDATE_SHOWN_PAST_PUNISHMENTS', punishments, newPage })
    }
});

class PastTab extends React.Component {

    constructor() {
        super();
        this.showFirstPage = () => {
            let firstPage = [];
            for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                if (this.props.pastPunishments[i]) firstPage.push(this.props.pastPunishments[i]);
            }
            this.props.changeShownPunishments(firstPage, 1);
        };
        this.loadAndShowPastPunishments = (punishments) => { // poziv kada stigne payload sa past punishmentima
            this.props.onLoadedPastPunishments(punishments);
            this.showFirstPage();
        };
    }

    componentDidMount() { // dohvat accepted kazni sa backenda
        agent.Punishment.getAccepted().then((payload) => {
            if (payload) {
                this.loadAndShowPastPunishments(payload.acceptedPunishments);
            } else {
                console.log("error: past punishments payload wasn't received");
            }
        });
    }

    render() {

        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownPastPunishments;
        const style = {
            "width": "210px",
            "display": "inline-block"
        };

        const tableHeader = (
            <div className="container">
                <hr />
                <label style={style}>ORDERED ON</label>
                <label style={style}>BY WHOM</label>
                <label style={style}>X</label>
                <label style={style}>WHAT</label>
                <label style={style}>STATUS</label>
                <hr />
            </div>
        );

        if (shownPunishments !== 'empty') {
            return (
                <div className="container">
                    {tableHeader}
                    {
                        shownPunishments.map(punishment => {
                            return (
                                <PastTabRow punishment={punishment} style={style} key={punishment._id} id={punishment._id} />
                            )
                        })
                    }
                    <TableFooter currentPage={currentPage} punishments={this.props.pastPunishments} changeShownPunishments={this.props.changeShownPunishments} />
                </div>
            )
        } else if (shownPunishments === 'empty') {
            return (
                <div className="container">
                    <h3>Loading data...</h3>
                </div>
            );
        }
        else {
            return (<h3>No data.</h3>);
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(PastTab);