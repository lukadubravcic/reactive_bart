import React from 'react';
import { connect } from 'react-redux';
import OrderedTabRow from './OrderedTabRow';
import TableFooter from '../TableFooter';

import agent from '../../../agent';

import { ITEMS_PER_PAGE } from '../../../constants/constants';

const mapStateToProps = state => ({
    state: state,
    orderedPunishments: state.punishment.orderedPunishments,
    shownOrderedPunishments: state.punishment.shownOrderedPunishments,
    currentPage: state.punishment.currentOrderedPage
});

const mapDispatchToProps = dispatch => ({
    onLoadedOrderedPunishments: (punishments) => {
        dispatch({ type: 'ORDERED_PUNISHMENTS_LOADED', punishments })
    },
    changeShownPunishments: (punishments, newPage) => {
        dispatch({ type: 'UPDATE_SHOWN_ORDERED_PUNISHMENTS', punishments, newPage })
    }
});

class OrderedTab extends React.Component {

    constructor() {
        super();
        this.showFirstPage = () => {
            let firstPage = [];
            if (this.props.orderedPunishments.length > 0) {
                for (let i = 0; i < ITEMS_PER_PAGE; i++) {
                    if (this.props.orderedPunishments[i]) firstPage.push(this.props.orderedPunishments[i]);
                }
            }
            this.props.changeShownPunishments(firstPage, 1);
        };
        this.loadAndShowOrderedPunishments = (punishments) => { // poziv kada stigne payload sa past punishmentima
            this.props.onLoadedOrderedPunishments(punishments);
            this.showFirstPage();
        };

        this.styles = {
            wideField: {
                "width": "220px",
                "display": "inline-block"
            },
            narrowField: {
                "width": "100px",
                "display": "inline-block"
            }
        }
    }

    componentDidMount() { // dohvat past kazni sa backenda
        agent.Punishment.getOrdered().then((payload) => {
            if (payload) {
                this.loadAndShowOrderedPunishments(payload.orderedPunishments);
            } else {
                console.log("error: past punishments payload wasn't received");
            }
        });
    }

    render() {

        const currentPage = this.props.currentPage;
        const shownPunishments = this.props.shownOrderedPunishments;

        const tableHeader = (
            <div className="container">
                <hr />
                <label style={this.styles.wideField}>WHEN</label>
                <label style={this.styles.narrowField}>TO WHOM</label>
                <label style={this.styles.wideField}>DEADLINE</label>
                <label style={this.styles.narrowField}>X</label>
                <label style={this.styles.wideField}>WHAT</label>
                <label style={this.styles.narrowField}>STATUS</label>
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
                                <OrderedTabRow punishment={punishment} styles={this.styles} key={punishment._id} id={punishment._id} />
                            )
                        })
                    }
                    <TableFooter currentPage={currentPage} punishments={this.props.orderedPunishments} changeShownPunishments={this.props.changeShownPunishments} />
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderedTab);