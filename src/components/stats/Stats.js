import React from 'react'
import { connect } from 'react-redux'
import PieChart from 'react-minimal-pie-chart';
// import './App.css'
/* import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection' */

const colors = {
      accepted: 'rgba(185, 214, 0, 0.8)',
      rejected: 'rgba(198, 51, 51, 0.8)',
      ignored: 'rgba(131, 64, 214, 0.8)',
      completed: 'rgba(185, 214, 0, 0.8)',
      givenUp: 'rgba(198, 51, 51, 0.8)',
      failed: 'rgba(131, 64, 214, 0.8'
};

const mapStateToProps = state => ({
      acceptedPunishments: state.punishment.acceptedPunishments,
      pastPunishments: state.punishment.pastPunishments,
      orderedPunishments: state.punishment.orderedPunishments,
      firstGraph: state.graphData.firstGraph,
      secondGraph: state.graphData.secondGraph,
      thirdGraph: state.graphData.thirdGraph,
      fourthGraph: state.graphData.fourthGraph
});

const mapDispatchToProps = dispatch => ({
      updateOrderedGraphState: (data) => {
            dispatch({ type: 'UPDATE_ORDERED_GRAPH_DATA', data });
      },
      updateReceivedGraphState: (data) => {
            dispatch({ type: 'UPDATE_RECEIVED_GRAPH_DATA', data });
      }
});

class Stats extends React.Component {

      constructor() {
            super();

            this.clasifyPunishments = punishments => {

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

                        if (punishment.accepted) punishmentClass = 'accepted'; // punishmentStatus = 'ACCEPTED';                        
                        if (punishment.given_up) punishmentClass = 'givenUp'; // punishmentStatus = 'GIVEN UP';
                        if (punishment.done) punishmentClass = 'done'; // punishmentStatus = "DONE";
                        if (punishment.failed) punishmentClass = 'failed'; // punishmentStatus = "FAILED";
                        if (!punishment.accepted && checkIfIgnoredPunishment(punishment)) punishmentClass = 'ignored';
                        if (punishment.rejected) punishmentClass = 'rejected'; // punishmentStatus = 'REJECTED';

                        if (punishmentClass) result[punishmentClass]++;
                  }

                  return result;
            };

            this.didPunishmentsChange = (punishments, newPunishments) => {

                  if (punishments.length !== newPunishments.length) return true;

                  else { // provjeri po kaznama ako se sta mjenja

                        for (let i = 0; i < punishments.length; i++) {

                              if (!comparePunishments(punishments[i], newPunishments[i])) return true;
                        }
                        return false;
                  }
            };

            this.getGraphData = (classificationResults, neededProperties) => {

                  let graphData = [];

                  const data = getGraphProperties(classificationResults, neededProperties);

                  Object.keys(data).map((prop, index) => {

                        if (data[prop] > 0) {
                              graphData.push({
                                    value: data[prop],
                                    key: index,
                                    color: colors[prop]
                              });
                        }
                  });

                  return graphData;
            };
      }

      componentWillReceiveProps(nextProps) {

            /* if (this.didPunishmentsChange(this.props.acceptedPunishments, nextProps.acceptedPunishments)) { // odlucuje o triggeru klasifikacije
                  console.log('test')
            } */

            if (nextProps.pastPunishments !== 'empty' && nextProps.pastPunishments.length > 0) { // classify accepted punishment
                  if (this.didPunishmentsChange(this.props.pastPunishments, nextProps.pastPunishments)) { // odlucuje o triggeru klasifikacije

                        let graphData1 = this.getGraphData(this.clasifyPunishments(nextProps.pastPunishments), ['accepted', 'rejected', 'ignored']);
                        let graphData2 = this.getGraphData(this.clasifyPunishments(nextProps.pastPunishments), ['completed', 'givenUp', 'failed']);

                        this.props.updateOrderedGraphState({ graphData1, graphData2 });
                  }
            }

            if (nextProps.orderedPunishments !== 'empty' && nextProps.orderedPunishments.length > 0) { // classify ordered punishments
                  if (this.didPunishmentsChange(this.props.orderedPunishments, nextProps.orderedPunishments)) {

                        let graphData3 = this.getGraphData(this.clasifyPunishments(nextProps.orderedPunishments), ['accepted', 'rejected', 'ignored']);
                        let graphData4 = this.getGraphData(this.clasifyPunishments(nextProps.orderedPunishments), ['completed', 'givenUp', 'failed']);

                        this.props.updateReceivedGraphState({ graphData3, graphData4 });
                  }
            }

            /* if (this.props.orderedPunishments === 'empty' && nextProps.orderedPunishments !== 'empty' && nextProps.orderedPunishments.length > 0) {
                  //console.log('test')
            } */
      }

      render() {

            return (
                  <div>
                        <div className="container">
                              {this.props.firstGraph ?
                                    <div style={{ float: "left", width: "200px", margin: "50px" }}>

                                          <PieChart
                                                data={this.props.firstGraph}
                                                lineWidth={80}
                                                paddingAngle={5}
                                                animate={true}
                                                animationDuration={3500} />

                                          <br />
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.accepted }}>&nbsp;</label>
                                                <label>&nbsp;Accepted</label>
                                          </div>
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.rejected }}>&nbsp;</label>
                                                <label>&nbsp;Rejected</label>
                                          </div>
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.ignored }}>&nbsp;</label>
                                                <label>&nbsp;Ignored</label>
                                          </div>
                                    </div>
                                    : null}
                              {this.props.secondGraph ?
                                    <div style={{ float: "left", width: "200px", margin: "50px" }}>

                                          <PieChart
                                                data={this.props.secondGraph}
                                                lineWidth={80}
                                                paddingAngle={1}
                                                animate={true}
                                                animationDuration={3500} />

                                          <br />
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.completed }}>&nbsp;</label>
                                                <label>&nbsp;Completed</label>
                                          </div>
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.givenUp }}>&nbsp;</label>
                                                <label>&nbsp;Given up</label>
                                          </div>
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.failed }}>&nbsp;</label>
                                                <label>&nbsp;Failed</label>
                                          </div>
                                    </div>
                                    : null}
                              <br style={{ clear: "left" }} />
                        </div>

                        <div className="container">
                              {this.props.thirdGraph ?
                                    <div style={{ float: "left", width: "200px", margin: "50px" }}>

                                          <PieChart
                                                data={this.props.thirdGraph}
                                                lineWidth={80}
                                                paddingAngle={1}
                                                animate={true}
                                                animationDuration={3500} />

                                          <br />
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.accepted }}>&nbsp;</label>
                                                <label>&nbsp;Accepted</label>
                                          </div>
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.rejected }}>&nbsp;</label>
                                                <label>&nbsp;Rejected</label>
                                          </div>
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.ignored }}>&nbsp;</label>
                                                <label>&nbsp;Ignored</label>
                                          </div>
                                    </div>
                                    : null}
                              {this.props.fourthGraph ?
                                    <div style={{ float: "left", width: "200px", margin: "50px" }}>

                                          <PieChart
                                                data={this.props.fourthGraph}
                                                lineWidth={80}
                                                paddingAngle={1}
                                                animate={true}
                                                animationDuration={3500} />

                                          <br />
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.completed }}>&nbsp;</label>
                                                <label>&nbsp;Completed</label>
                                          </div>
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.givenUp }}>&nbsp;</label>
                                                <label>&nbsp;Given up</label>
                                          </div>
                                          <div className="graph-legend-container">
                                                <label style={{ width: "20px", height: "auto", backgroundColor: colors.failed }}>&nbsp;</label>
                                                <label>&nbsp;Failed</label>
                                          </div>
                                    </div>
                                    : null}
                              <br style={{ clear: "left" }} />
                        </div>
                  </div>
            )
      }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats);


function checkIfIgnoredPunishment(punishment) {

      let createdPlus30Days = (new Date(punishment.created).getTime()) + (30 * 24 * 60 * 60 * 1000);

      if ((createdPlus30Days - Date.now() < 0) && (punishment.accepted === null)) return true // IGNORED

      return false; // NOT IGNORED
}

function comparePunishments(pun1, pun2) {
      // iterate trough object properties
      for (let prop in pun1) {

            if (pun1[prop] !== pun2[prop]) return false;
      }
      return true;
};

function getGraphProperties(classificationResults, neededProperties) {

      return Object.assign({}, ...Object.keys(classificationResults).map(property => {

            if (neededProperties.indexOf(property) > -1) return { [property]: classificationResults[property] };
      }));
}
