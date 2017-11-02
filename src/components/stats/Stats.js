import React from 'react'
import { connect } from 'react-redux'
import PieChart from 'react-minimal-pie-chart';
// import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

const mapStateToProps = state => ({
      acceptedPunishments: state.punishment.acceptedPunishments,
      orderedPunishments: state.punishment.orderedPunishments,
      pastPunishments: state.punishment.pastPunishments,
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

            

            this.getData = (punishments, condition) => {

                  let result = {
                        numAccepted: 0,
                        numRejected: 0,
                        numIgnored: 0,
                        numGivenUp: 0,
                        numDone: 0,
                        numFailed: 0
                  }

                  for (let punishment of punishments) {
                        if (punishment.accepted !== null) result.numAccepted++;// punishmentStatus = 'ACCEPTED';
                        if (punishment.rejected !== null) result.numRejected++;// punishmentStatus = 'REJECTED';
                        if (punishment.given_up !== null) result.numGivenUp++;// punishmentStatus = 'GIVEN UP';
                        if (punishment.done) result.numDone++;// punishmentStatus = "DONE";
                        if (punishment.failed) result.numFailed++;// punishmentStatus = "FAILED";
                        if (checkIfIgnoredPunishment(punishment)) result.numIgnored++; 

                  }

                  return result;
            }
      }

      componentWillReceiveProps(nextProps) {
            this.punishingOthersData1 = this.getData(this.props.orderedPunishments)
            console.log(this.props.acceptedPunishments.length, this.props.pastPunishments.length, this.props.orderedPunishments.length)
          
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