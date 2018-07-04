import React from 'react'
import { connect } from 'react-redux'
import PieChart from 'react-minimal-pie-chart';
import { checkIfIgnoredPunishment } from '../../helpers/helpers';

const circleRadius = 210;

const colors = {
      accepted: '#FFA623',
      rejected: '#EA411E',
      ignored: '#00BBD6',
      completed: '#FFA623',
      givenUp: '#00BBD6',
      failed: '#EA411E'
};

const graphAnimationDuration = 3500;

const mapStateToProps = state => ({
      currentUser: state.common.currentUser,
      rank: state.common.rank,
      acceptedPunishments: state.punishment.acceptedPunishments,
      pastPunishments: state.punishment.pastPunishments,
      orderedPunishments: state.punishment.orderedPunishments,
      orderedPunishmentsResorted: state.punishment.orderedPunishmentsResorted,
      pastPunishmentsResorted: state.punishment.pastPunishmentsResorted,
});

const mapDispatchToProps = dispatch => ({
      updateOrderedGraphState: data => {
            dispatch({ type: 'UPDATE_ORDERED_GRAPH_DATA', data });
      },
      updateReceivedGraphState: data => {
            dispatch({ type: 'UPDATE_RECEIVED_GRAPH_DATA', data });
      },
      clearOrderedPunishmentsResortedFlag: () => dispatch({ type: 'CLEAR_ORDERED_PUN_RESORTED_FLAG' }),
      clearPastPunishmentsResortedFlag: () => dispatch({ type: 'CLEAR_PAST_PUN_RESORTED_FLAG' }),
});

class Stats extends React.Component {

      constructor() {
            super();

            this.state = {
                  orderedFirstGraphData: null,
                  orderedSecondGraphData: null,
                  punishedFirstGraphData: null,
                  punishedSecondGraphData: null,
            }

            // accepted/rejected/ignored
            this.firstStageClassification = punishments => {
                  let result = {
                        accepted: 0,
                        rejected: 0,
                        ignored: 0,
                        givenUp: 0,
                        completed: 0,
                        failed: 0
                  };

                  for (let punishment of punishments) {
                        if (typeof punishment.accepted !== 'undefined' && punishment.accepted !== null) result.accepted++;
                        else if (typeof punishment.rejected !== 'undefined' && punishment.rejected !== null) result.rejected++;
                        else if (typeof punishment.ignored !== 'undefined' && punishment.ignored !== null) result.ignored++;
                  }

                  return result;
            }

            this.secondStageClassification = punishments => {

                  let result = {
                        accepted: 0,
                        rejected: 0,
                        ignored: 0,
                        givenUp: 0,
                        completed: 0,
                        failed: 0
                  };

                  let punishmentClass = null;

                  for (let punishment of punishments) {

                        punishmentClass = null;

                        if (punishment.accepted) punishmentClass = 'accepted'; // punishmentStatus = 'ACCEPTED';                        
                        if (punishment.given_up) punishmentClass = 'givenUp'; // punishmentStatus = 'GIVEN UP';
                        if (punishment.done) punishmentClass = 'completed'; // punishmentStatus = "DONE";
                        if (punishment.failed) punishmentClass = 'failed'; // punishmentStatus = "FAILED";
                        if (!punishment.accepted && checkIfIgnoredPunishment(punishment)) punishmentClass = 'ignored';
                        if (punishment.rejected) punishmentClass = 'rejected'; // punishmentStatus = 'REJECTED';

                        if (punishmentClass) result[punishmentClass]++;
                  }

                  return result;
            };


            // vraca promjenjeno stanje i nakon resorta u tablicama
            this.didPunishmentsChange = (punishments, newPunishments, punsResorted = false) => {
                  // console.log('resorted: ' + punsResorted)
                  if (punishments.length !== newPunishments.length) return true;
                  else { // provjeri po kaznama ako se sta mjenja
                        for (let i = 0; i < punishments.length; i++) {
                              if (!comparePunishments(punishments[i], newPunishments[i]) && punsResorted !== true) {
                                    return true;
                              }
                        }
                        return false;
                  }
            };

            this.getGraphData = (classificationResults, neededProperties) => {

                  let graphData = [];

                  const data = getGraphProperties(classificationResults, neededProperties);

                  Object.keys(data).map((prop, index) => {

                        // if (data[prop] > 0) {
                        graphData.push({
                              value: data[prop],
                              key: index + 1,
                              color: colors[prop],
                              name: Object.keys(data)[index]
                        });
                        //}
                  });

                  return graphData;
            };

            this.getGraphLabels = data => {
                  data = getRadians(data);
                  data = getCoordPoints(data);
                  // stvaranje HTML elemenata
                  return this.getGraphLabelHTML(data);
            };

            this.getGraphLabelHTML = coordPoints => {
                  return coordPoints.map((item, index) => {
                        if (!item.x || !item.y) {
                              return null;
                        }
                        let padding = 35;
                        let xOffset = -((padding + item.name.length * 18) / 2);

                        return (
                              <div
                                    className="hover-dialog"
                                    style={{
                                          left: (item.x + xOffset) + 'px',
                                          bottom: item.y + 'px',
                                          opacity: 0,
                                          animationDelay: 3.5 + 's',
                                          animationDuration: 1 + 's'
                                    }}
                                    key={index}
                              >
                                    <label
                                          className="hover-dialog-text"
                                          style={{
                                                color: item.color,
                                                textTransform: "uppercase"
                                          }}>
                                          {item.name}
                                    </label>
                                    <div className="triangle-hover-box-container">
                                          <svg
                                                id="triangle-element"
                                                width="23px"
                                                height="14px"
                                                viewBox="0 0 23 14"
                                                version="1.1"
                                                xmlns="http://www.w3.org/2000/svg"
                                                xmlnsXlink="http://www.w3.org/1999/xlink">

                                                <g
                                                      id="page-03"
                                                      stroke="none"
                                                      strokeWidth="1"
                                                      fill="none"
                                                      fillRule="evenodd"
                                                      transform="translate(-528.000000, -981.000000)">

                                                      <g
                                                            id="Fill-2-+-LOG-IN-+-Triangle-4-Copy"
                                                            transform="translate(456.000000, 916.000000)"
                                                            fill="#323232">

                                                            <polygon
                                                                  id="Triangle-4-Copy"
                                                                  transform="translate(83.500000, 72.000000) scale(1, -1) translate(-83.500000, -72.000000)"
                                                                  points="83.5 65 95 79 72 79">
                                                            </polygon>
                                                      </g>
                                                </g>
                                          </svg>
                                    </div>
                              </div>
                        )
                  });
            }

            this.clearPastPunishmentsResortedFlag = () => {
                  if (this.props.pastPunishmentsResorted) this.props.clearPastPunishmentsResortedFlag();
            }

            this.setDummyData = () => {
                  requestAnimationFrame(() => {
                        this.setState((prevState, props) => {
                              return {
                                    orderedFirstGraphData: dummyOrderedOne,
                                    orderedSecondGraphData: dummyOrderedTwo,
                                    punishedFirstGraphData: dummyPunishedOne,
                                    punishedSecondGraphData: dummyPunishedTwo,
                              };
                        });
                  });
            }
      }


      // TODO: Je li potrebno updateati ordered kazne, tablica nadodaje nove kako se kreiraju no te kazne se ne mogu klasificirati
      // POTENCIJALNI DRUGACIJI PRISTUP: ne provjeravaj promjene na kaznama vec na klasifikacijama

      componentDidMount() {
            // pokazi dummy grafove
            this.setDummyData();
      }

      componentDidUpdate(prevProps) {
            const userJustLoggedOut = Object.keys(prevProps.currentUser).length > 0 && Object.keys(this.props.currentUser).length === 0;
            const userJustLoggedIn = !Object.keys(prevProps.currentUser).length && Object.keys(this.props.currentUser).length;

            if (userJustLoggedIn) {
                  requestAnimationFrame(() => {
                        this.setState((prevState, props) => {
                              return {
                                    orderedFirstGraphData: 'waitHack',
                                    orderedSecondGraphData: 'waitHack',
                                    punishedFirstGraphData: 'waitHack',
                                    punishedSecondGraphData: 'waitHack',
                              };
                        });
                  });

                  setTimeout(() => {
                        requestAnimationFrame(() => {
                              this.setState((prevState, props) => {
                                    return {
                                          orderedFirstGraphData: [],
                                          orderedSecondGraphData: [],
                                          punishedFirstGraphData: [],
                                          punishedSecondGraphData: [],
                                    };
                              });
                        });
                  }, 0);
            }

            if (userJustLoggedOut) {
                  requestAnimationFrame(() => {
                        this.setState((prevState, props) => {
                              return {
                                    orderedFirstGraphData: 'waitHack',
                                    orderedSecondGraphData: 'waitHack',
                                    punishedFirstGraphData: 'waitHack',
                                    punishedSecondGraphData: 'waitHack',
                              };
                        });
                  });

                  setTimeout(() => {
                        this.setDummyData();
                  }, 0);
            }

            if (this.props.orderedPunishments !== 'empty' && this.props.orderedPunishments.length > 0) { // classify ordered punishments
                  if (prevProps.orderedPunishments.length !== this.props.orderedPunishments.length) {
                        let firstStageClassificationResults = this.firstStageClassification(this.props.orderedPunishments);
                        let secondStageClassificationResults = this.secondStageClassification(this.props.orderedPunishments);
                        let graphData1 = this.getGraphData(firstStageClassificationResults, ['accepted', 'rejected', 'ignored']);
                        let graphData2 = this.getGraphData(secondStageClassificationResults, ['givenUp', 'completed', 'failed']);

                        requestAnimationFrame(() => {
                              this.setState((prevState, props) => {
                                    return {
                                          orderedFirstGraphData: 'waitHack',
                                          orderedSecondGraphData: 'waitHack',
                                    };
                              });
                        });

                        setTimeout(() => {
                              requestAnimationFrame(() => {
                                    this.setState((prevState, props) => {
                                          return {
                                                orderedFirstGraphData: graphData1,
                                                orderedSecondGraphData: graphData2,
                                          };
                                    });
                              });
                        }, 0);
                  }
            }

            if (this.props.pastPunishments !== 'empty' && this.props.pastPunishments.length > 0) { // classify accepted punishments
                  if (this.didPunishmentsChange(prevProps.pastPunishments, this.props.pastPunishments, this.props.pastPunishmentsResorted)) {
                        let firstStageClassificationResults = this.firstStageClassification(this.props.pastPunishments);
                        let secondStageClassificationResults = this.secondStageClassification(this.props.pastPunishments);
                        let graphData3 = this.getGraphData(firstStageClassificationResults, ['accepted', 'rejected', 'ignored']);
                        let graphData4 = this.getGraphData(secondStageClassificationResults, ['completed', 'givenUp', 'failed']);

                        requestAnimationFrame(() => {
                              this.setState((prevState, props) => {
                                    return {
                                          punishedFirstGraphData: 'waitHack',
                                          punishedSecondGraphData: 'waitHack',
                                    };
                              });
                        });

                        setTimeout(() => {
                              requestAnimationFrame(() => {
                                    this.setState((prevState, props) => {
                                          return {
                                                punishedFirstGraphData: graphData3,
                                                punishedSecondGraphData: graphData4,
                                          };
                                    }, this.clearPastPunishmentsResortedFlag());
                              });
                        }, 0);

                  }
            }


      }

      render() {
            const userLoggedIn = Object.keys(this.props.currentUser).length;

            const orderedFirstGraphData = this.state.orderedFirstGraphData;
            const orderedSecondGraphData = this.state.orderedSecondGraphData;
            const punishedFirstGraphData = this.state.punishedFirstGraphData;
            const punishedSecondGraphData = this.state.punishedSecondGraphData;

            const orderedFirstGraphDataValidity = validateGraphData(this.state.orderedFirstGraphData);
            const orderedSecondGraphDataValidity = validateGraphData(this.state.orderedSecondGraphData);
            const punishedFirstGraphDataValidity = validateGraphData(this.state.punishedFirstGraphData);
            const punishedSecondGraphDataValidity = validateGraphData(this.state.punishedSecondGraphData);

            let firstGraphLabels = orderedFirstGraphDataValidity === 'waitHack'
                  ? null
                  : orderedFirstGraphDataValidity
                        ? this.getGraphLabels(this.state.orderedFirstGraphData)
                        : null;
            let secondGraphLabels = orderedSecondGraphDataValidity === 'waitHack'
                  ? null
                  : orderedSecondGraphDataValidity
                        ? this.getGraphLabels(this.state.orderedSecondGraphData)
                        : null;
            let thirdGraphLabels = punishedFirstGraphDataValidity === 'waitHack'
                  ? null
                  : punishedFirstGraphDataValidity
                        ? this.getGraphLabels(this.state.punishedFirstGraphData)
                        : null;
            let fourthGraphLabels = punishedSecondGraphDataValidity === 'waitHack'
                  ? null
                  : punishedSecondGraphDataValidity
                        ? this.getGraphLabels(this.state.punishedSecondGraphData)
                        : null;

            return (
                  <div>
                        <div className={`parent-component statz-component-container${userLoggedIn ? "" : " greyscale-filter"}`}>
                              {userLoggedIn ? null : <div id="form-overlay"></div>}
                              <div className="container">

                                    <label id="statz-heading" className="heading">Statz</label>

                                    <div className="punishing-others-container">

                                          <label className="statz-group-heading">PUNISHING OTHERS</label>

                                          {orderedFirstGraphDataValidity === 'waitHack' ?
                                                null
                                                : orderedFirstGraphDataValidity
                                                      ? <div className="float-left graph-container graph1-container"
                                                            style={{ width: "420px" }}>

                                                            {firstGraphLabels && firstGraphLabels.map(label => label)}

                                                            <PieChart
                                                                  data={orderedFirstGraphData}
                                                                  lengthAngle={-360}
                                                                  lineWidth={100}
                                                                  paddingAngle={0}
                                                                  animate={true}
                                                                  animationDuration={graphAnimationDuration} />
                                                      </div>

                                                      : noDataLeftGraph}

                                          {orderedSecondGraphDataValidity === 'waitHack' ?
                                                null
                                                : orderedSecondGraphDataValidity
                                                      ? <div className="float-right graph-container graph2-container"
                                                            style={{ width: "420px" }}>

                                                            {secondGraphLabels && secondGraphLabels.map(label => label)}

                                                            <PieChart
                                                                  data={orderedSecondGraphData}
                                                                  lengthAngle={-360}
                                                                  lineWidth={100}
                                                                  paddingAngle={0}
                                                                  animate={true}
                                                                  animationDuration={graphAnimationDuration} />
                                                      </div>
                                                      : noDataRightGraph}

                                          <div className="pun-others-bottom-image-container">
                                                {punishingOthersSVG}
                                          </div>

                                    </div>

                                    <div className="being-punished-container">

                                          <label className="statz-group-heading">ME, BEING PUNISHED</label>

                                          {punishedFirstGraphDataValidity === 'waitHack' ?
                                                null
                                                : punishedFirstGraphDataValidity
                                                      ? <div className="float-left graph-container graph1-container"
                                                            style={{ width: "420px" }}>

                                                            {thirdGraphLabels && thirdGraphLabels.map(label => label)}

                                                            <PieChart
                                                                  data={punishedFirstGraphData}
                                                                  lengthAngle={-360}
                                                                  lineWidth={100}
                                                                  paddingAngle={0}
                                                                  animate={true}
                                                                  animationDuration={graphAnimationDuration} />
                                                      </div>
                                                      : noDataLeftGraph}

                                          {punishedSecondGraphDataValidity === 'waitHack' ?
                                                null
                                                : punishedSecondGraphDataValidity
                                                      ? <div className="float-right graph-container graph2-container"
                                                            style={{ width: "420px" }}>

                                                            {fourthGraphLabels && fourthGraphLabels.map(label => label)}

                                                            <PieChart
                                                                  data={punishedSecondGraphData}
                                                                  lengthAngle={-360}
                                                                  lineWidth={100}
                                                                  paddingAngle={0}
                                                                  animate={true}
                                                                  animationDuration={graphAnimationDuration} />
                                                      </div>
                                                      : noDataRightGraph}

                                          <div className="being-punished-bottom-image-container">
                                                {beingPunishedSVG}
                                          </div>

                                    </div>
                              </div>
                        </div>

                  </div>
            )
      }
}



export default connect(mapStateToProps, mapDispatchToProps)(Stats);


const punishingOthersSVG = (
      <svg id="pun-others-bottom-image" width="1080px" height="43px" viewBox="0 0 1080 43" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-100.000000, -4071.000000)">
                  <g id="Group" transform="translate(0.000000, 3353.000000)">
                        <g id="Group-11" transform="translate(100.000000, 718.000000)">
                              <polygon id="Fill-7-Copy-8" fill="#A479E1" points="-2.38411233e-13 43 1080 43 1080 23 -2.38411233e-13 23"></polygon>
                              <polygon id="Fill-15-Copy-2" fill="#FEFEFE" points="684 23 722 23 722 14 684 14"></polygon>
                              <polygon id="Fill-15-Copy-6" fill="#FEFEFE" transform="translate(728.000000, 11.500000) rotate(22.000000) translate(-728.000000, -11.500000) "
                                    points="709 16 747 16 747 7 709 7"></polygon>
                        </g>
                  </g>
            </g>
      </svg>
)


const beingPunishedSVG = (
      <svg id="being-punished-bottom-image" width="1080px" height="213px" viewBox="0 0 1080 213" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="page-03" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(-100.000000, -4631.000000)">
                  <g id="Group" transform="translate(0.000000, 3353.000000)">
                        <g id="Fill-7-Copy-9-+-Fill-15-Copy-4-+-Group-Copy-10" transform="translate(100.000000, 1278.000000)">
                              <polygon id="Fill-7-Copy-9" fill="#A479E1" points="-2.38411233e-13 213 1080 213 1080 193 -2.38411233e-13 193"></polygon>
                              <polygon id="Fill-15-Copy-4" fill="#FEFEFE" points="496 193 534 193 534 184 496 184"></polygon>
                              <g id="Group-Copy-10" transform="translate(371.000000, 0.000000)">
                                    <polygon id="Fill-57" fill="#4F69A8" points="87.3739 127.1981 89.4319 66.1211 107.9589 0.3091 105.8999 68.0671 92.3909 128.2961"></polygon>
                                    <path d="M75.4524,139.4763 C75.4524,135.1873 39.7284,80.5903 39.7284,80.5903 L23.9904,83.8963 L64.1304,137.4173 L75.4524,139.4763 Z"
                                          id="Fill-58" fill="#4F69A8"></path>
                                    <polygon id="Fill-60" fill="#4F69A8" points="75.4524 131.2423 55.8964 60.2243 75.7524 58.9763 80.5984 131.2423"></polygon>
                                    <polygon id="Fill-61" fill="#4F69A8" points="91.9204 139.4763 122.0684 80.5903 135.1494 84.9263 100.1544 139.4763"></polygon>
                                    <polygon id="Fill-62" fill="#EA411E" points="46.7632 125.7058 57.0962 192.7788 106.4192 192.7788 116.7522 125.7058"></polygon>
                                    <polygon id="Fill-63" fill="#A479E1" points="22.2313 83.4673 0.6173 142.1343 39.7283 80.3793"></polygon>
                                    <polygon id="Fill-64" fill="#A479E1" points="75.7523 58.976 55.8963 151.827 55.8963 60.224"></polygon>
                                    <polygon id="Fill-65" fill="#A479E1" points="122.0686 80.5902 143.3826 153.8862 136.1786 84.9262"></polygon>
                              </g>
                        </g>
                  </g>
            </g>
      </svg>
)

const noDataRightGraph = (
      <div className="float-right graph-container graph2-container"
            style={{ width: "420px", filter: "grayscale(95%)" }}>

            <label
                  className="hover-dialog-text"
                  style={{
                        position: "absolute",
                        color: "white",
                        textTransform: "uppercase",
                        top: "210px",
                        left: "60px"
                  }}>

                  <span>NOT ENOUGH DATA</span>
            </label>

            <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }}>
                  <path d="M 75 50 A 25 25 0 0 0 37.50000000000001 28.34936490538903" strokeWidth="50" strokeDasharray="52.35987755982988" strokeDashoffset="104.71975511965977" stroke="#FFA623" fill="none" style={{ transition: "stroke-dashoffset 1ms ease-out" }}></path>
                  <path d="M 37.50000000000001 28.34936490538903 A 25 25 0 0 0 37.499999999999986 71.65063509461096" strokeWidth="50" strokeDasharray="52.35987755982988" strokeDashoffset="104.71975511965977" stroke="#EA411E" fill="none" style={{ transition: "stroke-dashoffset 1ms ease-out" }}></path>
                  <path d="M 37.499999999999986 71.65063509461096 A 25 25 0 0 0 75 50.00000000000001" strokeWidth="50" strokeDasharray="52.35987755982988" strokeDashoffset="104.71975511965977" stroke="#00BBD6" fill="none" style={{ transition: "stroke-dashoffset 1ms ease-out" }}></path>
            </svg>
      </div >
)

const noDataLeftGraph = (
      <div className="float-left graph-container graph1-container"
            style={{ width: "420px", filter: "grayscale(95%)" }}>

            <label
                  className="hover-dialog-text"
                  style={{
                        position: "absolute",
                        color: "white",
                        textTransform: "uppercase",
                        top: "210px",
                        left: "60px"
                  }}>

                  <span>NOT ENOUGH DATA</span>
            </label>

            <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ display: "block" }}>
                  <path d="M 75 50 A 25 25 0 0 0 37.50000000000001 28.34936490538903" strokeWidth="50" strokeDasharray="52.35987755982988" strokeDashoffset="104.71975511965977" stroke="#FFA623" fill="none" style={{ transition: "stroke-dashoffset 1ms ease-out" }}></path>
                  <path d="M 37.50000000000001 28.34936490538903 A 25 25 0 0 0 37.499999999999986 71.65063509461096" strokeWidth="50" strokeDasharray="52.35987755982988" strokeDashoffset="104.71975511965977" stroke="#EA411E" fill="none" style={{ transition: "stroke-dashoffset 1ms ease-out" }}></path>
                  <path d="M 37.499999999999986 71.65063509461096 A 25 25 0 0 0 75 50.00000000000001" strokeWidth="50" strokeDasharray="52.35987755982988" strokeDashoffset="104.71975511965977" stroke="#00BBD6" fill="none" style={{ transition: "stroke-dashoffset 1ms ease-out" }}></path>
            </svg>
      </div >
)

function validateGraphData(graphData) {
      if (graphData === 'waitHack') {
            return 'waitHack'
      } else if (
            typeof graphData === 'undefined'
            || graphData === null
            || !Object.keys(graphData).length
      ) {
            return false;
      }
      for (let i = 0; i < graphData.length; i++) {
            if (graphData[i].value > 0) return true;
      }
      return false;
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

const getRadians = data => {
      let valueSum = 0;
      data.forEach(item => valueSum += item.value);

      return data.map(item => {
            if (item.value === 0) {
                  return {
                        ...item,
                        radian: null,
                  }
            }
            return {
                  ...item,
                  radian: (item.value / valueSum) * (2 * Math.PI)
            };
      });
}

const getCoordPoints = data => {
      let tmp = 0;
      // pomak prema centru kruznice (da labeli nisu na samom rubu)
      const offsetToCenter = 20;
      const xCircleCenter = circleRadius;
      const yCircleCenter = circleRadius;

      return data.map((item, index) => {
            if (!item.radian) return {
                  ...item,
                  x: null,
                  y: null,
            };
            // izracunati koordinate i translacija u 1 quadrant cart.coord sustava
            let x = Math.floor(circleRadius * Math.cos(tmp + item.radian / 2)) + circleRadius;
            let y = Math.floor(circleRadius * Math.sin(tmp + item.radian / 2)) + circleRadius;

            let quadrant = getQuardrant(tmp + item.radian / 2);

            tmp += item.radian;

            let hypotenuse = distanceBetweenPoints(xCircleCenter, yCircleCenter, x, y);

            let x3 = xCircleCenter;
            let y3 = y;

            let a = Math.abs(x3 - x);
            let b = Math.abs(yCircleCenter - y3);

            let offsetedHypotenuse = hypotenuse - offsetToCenter;

            let d = (offsetedHypotenuse * a) / hypotenuse;
            let x4 = xCircleCenter - d;

            let e = (offsetedHypotenuse * b) / hypotenuse;
            let y4 = yCircleCenter - e;

            let offsetedX_InThirdQuadrant = x4;
            let offsetedY_InThirdQuadrant = y4;

            let finalCoords = placePointInQuardrant(offsetedX_InThirdQuadrant, offsetedY_InThirdQuadrant, quadrant);

            return {
                  ...item,
                  x: Math.floor(finalCoords.x),
                  y: Math.floor(finalCoords.y)
            }
      });
}

const distanceBetweenPoints = (x1, y1, x2, y2) => {

      let xAxisDistance = Math.abs(x1 - x2);
      let yAxisDistance = Math.abs(y1 - y2);

      return Math.sqrt(xAxisDistance ** 2 + yAxisDistance ** 2);
}

// default kvadrant je 3, pa je potreban pomak, koristi globalno definiran radijus kruznice
const placePointInQuardrant = (x, y, quadrant) => {
      switch (quadrant) {
            case 1:
                  return {
                        x: 2 * circleRadius - x,
                        y: 2 * circleRadius - y
                  };
            case 2:
                  return {
                        x,
                        y: 2 * circleRadius - y
                  };
            case 3:
                  return {
                        x,
                        y
                  };
            case 4:
                  return {
                        x: 2 * circleRadius - x,
                        y
                  };
            default:
                  return null;
      }
}


const getQuardrant = radianAngle => {

      const firstQuadrantBorder = Math.PI / 2;
      const secondQuadrantBorder = Math.PI;
      const thirdQuadrantBorder = 1.5 * Math.PI;
      const fourthQuadrantBorder = 2 * Math.PI;

      switch (true) {
            case (radianAngle <= firstQuadrantBorder):
                  return 1;
            case (radianAngle <= secondQuadrantBorder):
                  return 2;
            case (radianAngle <= thirdQuadrantBorder):
                  return 3
            case (radianAngle <= fourthQuadrantBorder):
                  return 4;
            default:
                  return null;
      }
}


const dummyOrderedOne = [
      {
            color: "#FBB",
            key: 1,
            name: "accepted",
            value: 8,
      },
      {
            color: "#EA411E",
            key: 2,
            name: "rejected",
            value: 1,
      },
      {
            color: "#00BBD6",
            key: 3,
            name: "ignored",
            value: 2.5,
      },
];

const dummyOrderedTwo = [
      {
            value: 1,
            key: 1,
            color: "#00BBD6",
            name: "givenUp"
      },
      {
            value: 9,
            key: 2,
            color: "#FBB",
            name: "completed"
      },
      {
            value: 3,
            key: 3,
            color: "#EA411E",
            name: "failed"
      },
];


const dummyPunishedOne = [
      {
            value: 7,
            key: 1,
            color: "#FBB",
            name: "accepted"
      },
      {
            value: 3,
            key: 2,
            color: "#EA411E",
            name: "rejected"
      },
      {
            value: 2,
            key: 3,
            color: "#00BBD6",
            name: "ignored"
      },
];

const dummyPunishedTwo = [
      {
            value: 2,
            key: 1,
            color: "#00BBD6",
            name: "givenUp"
      },
      {
            value: 8,
            key: 2,
            color: "#FBB",
            name: "completed"
      },
      {
            value: 1.5,
            key: 3,
            color: "#EA411E",
            name: "failed"
      },
];