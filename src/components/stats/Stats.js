import React from 'react'
import { connect } from 'react-redux'
import PieChart from 'react-minimal-pie-chart';
// import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

const mapStateToProps = state => ({
      acceptedPunishments: state.punishment.acceptedPunishments,
      pastPunishments: state.punishment.pastPunishments,
      orderedPunishments: state.punishment.orderedPunishments
});

const mapDispatchToProps = dispatch => ({

});

class Stats extends React.Component {

      constructor() {
            super();

            this.punishingOthersData1 = {
                  numAccepted: 0,
                  numRejected: 0,
                  numIgnored: 0,
                  numGivenUp: 0,
                  numDone: 0,
                  numFailed: 0
            }; // accepted, rejected, ignored

            this.punishingOthers2 = [];



            this.clasifyPunishments = (punishments, condition) => {

                  let result = {
                        accepted: 0,
                        rejected: 0,
                        ignored: 0,
                        givenUp: 0,
                        done: 0,
                        failed: 0
                  };

                  let punishmentClass = null;

                  for (let punishment of punishments) {

                        punishmentClass = null;

                        if (punishment.accepted) punishmentClass = 'accepted';// punishmentStatus = 'ACCEPTED';
                        if (punishment.rejected) punishmentClass = 'rejected';// punishmentStatus = 'REJECTED';
                        if (punishment.given_up) punishmentClass = 'givenUp';// punishmentStatus = 'GIVEN UP';
                        if (punishment.done) punishmentClass = 'done';// punishmentStatus = "DONE";
                        if (punishment.failed) punishmentClass = 'failed';// punishmentStatus = "FAILED";
                        if (checkIfIgnoredPunishment(punishment)) punishmentClass = 'ignored';

                        if (punishmentClass) result[punishmentClass]++;
                  }

                  return result;
            }
      }

      componentWillReceiveProps(nextProps) {

            /*  if (this.props.pastPunishments !== 'empty' && this.props.pastPunishments.length > 0) {
                   console.log(this.getPunishmentTypes(this.props.pastPunishments));
             } */

            if (nextProps.orderedPunishments !== 'empty' && nextProps.orderedPunishments.length > 0) { // classify ordered punishments
                  console.log(this.clasifyPunishments(nextProps.orderedPunishments));
            }
            /* this.punishingOthersData1 = this.getData(this.props.orderedPunishments)
            console.log(this.props.acceptedPunishments.length, this.props.pastPunishments.length, this.props.orderedPunishments.length)
           */
      }

      render() {

            const acceptedPunishmentsLen = this.props.acceptedPunishments.length;
            const orderedPunishmentsLen = this.props.orderedPunishments.length;
            const pastPunishmentsLen = this.props.pastPunishments.length;

            return (
                  <div className="container">
                        <div style={{ float: "left", width: "200px", margin: "50px" }}>
                              <PieChart
                                    data={[
                                          { value: 24, key: 1, color: 'green' },
                                          { value: 15, key: 2, color: 'tomato' },
                                          { value: 20, key: 3, color: 'yellow' },
                                    ]}
                                    lineWidth={35}
                                    paddingAngle={2}
                                    animate={true}
                                    animationDuration={3500} />
                        </div>
                        <div style={{ float: "left", width: "200px", margin: "50px" }}>
                              <PieChart
                                    data={[
                                          { value: 24, key: 1, color: 'green' },
                                          { value: 15, key: 2, color: 'tomato' },
                                          { value: 20, key: 3, color: 'yellow' },
                                    ]} />
                        </div>
                        <div style={{ float: "left", width: "200px", margin: "50px" }}>
                              <PieChart
                                    data={[
                                          { value: 24, key: 1, color: 'green' },
                                          { value: 15, key: 2, color: 'tomato' },
                                          { value: 20, key: 3, color: 'yellow' },
                                    ]} />
                        </div>
                        <br style={{ clear: "left" }} />
                  </div>
            )
      }
}
export default connect(mapStateToProps, mapDispatchToProps)(Stats);

function checkIfIgnoredPunishment(punishment) {
      let createdPlus30Days = (new Date(punishment.created).getTime()) + (30 * 24 * 60 * 60 * 1000);
      if ((createdPlus30Days - Date.now() < 0) && (punishment.accepted === null)) return true // IGNORED
      return false;
}