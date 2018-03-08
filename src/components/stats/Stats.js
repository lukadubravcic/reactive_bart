import React from 'react'
import { connect } from 'react-redux'
import PieChart from 'react-minimal-pie-chart';
import { checkIfIgnoredPunishment } from '../../helpers/helpers';
import RankInfo from './RankInfo';

const circleRadius = 210;

const colors = {
      accepted: '#FFA623',
      rejected: '#EA411E',
      ignored: '#00BBD6',
      completed: '#FFA623',
      givenUp: '#00BBD6',
      failed: '#EA411E'
};

const mapStateToProps = state => ({
      currentUser: state.common.currentUser,
      rank: state.common.rank,
      acceptedPunishments: state.punishment.acceptedPunishments,
      pastPunishments: state.punishment.pastPunishments,
      orderedPunishments: state.punishment.orderedPunishments,
      firstGraph: state.graphData.firstGraph,
      secondGraph: state.graphData.secondGraph,
      thirdGraph: state.graphData.thirdGraph,
      fourthGraph: state.graphData.fourthGraph
});

const mapDispatchToProps = dispatch => ({
      updateOrderedGraphState: data => {
            dispatch({ type: 'UPDATE_ORDERED_GRAPH_DATA', data });
      },
      updateReceivedGraphState: data => {
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
                                    key: index + 1,
                                    color: colors[prop],
                                    name: Object.keys(data)[index]
                              });
                        }
                  });

                  return graphData;
            };

            this.getGraphLabels = data => {

                  data = getRadians(data);

                  data = getCoordPoints(data);

                  // stvaranje HTML elemenata
                  let elements = this.getGraphLabelHTML(data);

                  return elements;
            };

            this.getGraphLabelHTML = coordPoints => {

                  return coordPoints.map((item, index) => {

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
      }

      componentWillReceiveProps(nextProps) {

            /* if (this.didPunishmentsChange(this.props.acceptedPunishments, nextProps.acceptedPunishments)) { // odlucuje o triggeru klasifikacije
                  console.log('test')
            } */

            if (nextProps.orderedPunishments !== 'empty' && nextProps.orderedPunishments.length > 0) { // classify ordered punishments
                  if (this.didPunishmentsChange(this.props.orderedPunishments, nextProps.orderedPunishments)) {

                        let classificationResults = this.clasifyPunishments(nextProps.orderedPunishments);

                        let graphData1 = this.getGraphData(classificationResults, ['accepted', 'rejected', 'ignored']);
                        let graphData2 = this.getGraphData(classificationResults, ['givenUp', 'completed', 'failed']);

                        this.props.updateOrderedGraphState({ graphData1, graphData2 });
                  }
            }

            if (nextProps.pastPunishments !== 'empty' && nextProps.pastPunishments.length > 0) { // classify accepted punishments

                  if (this.didPunishmentsChange(this.props.pastPunishments, nextProps.pastPunishments)) { // odlucuje o triggeru klasifikacije

                        let classificationResults = this.clasifyPunishments(nextProps.pastPunishments);

                        let graphData3 = this.getGraphData(classificationResults, ['accepted', 'rejected', 'ignored']);
                        let graphData4 = this.getGraphData(classificationResults, ['completed', 'givenUp', 'failed']);

                        this.props.updateReceivedGraphState({ graphData3, graphData4 });
                  }
            }

            /* if (this.props.orderedPunishments === 'empty' && nextProps.orderedPunishments !== 'empty' && nextProps.orderedPunishments.length > 0) {
                  //console.log('test')
            } */
      }

      render() {

            const usrLoggedIn = Object.keys(this.props.currentUser).length;

            if (!usrLoggedIn) return null;

            let firstGraphLabels = typeof this.props.firstGraph !== 'undefined' && this.props.firstGraph !== null && Object.keys(this.props.firstGraph).length
                  ? this.getGraphLabels(this.props.firstGraph)
                  : null;
            let secondGraphLabels = typeof this.props.secondGraph !== 'undefined' && this.props.secondGraph !== null && Object.keys(this.props.secondGraph).length
                  ? this.getGraphLabels(this.props.secondGraph)
                  : null;
            let thirdGraphLabels = typeof this.props.thirdGraph !== 'undefined' && this.props.thirdGraph !== null && Object.keys(this.props.thirdGraph).length
                  ? this.getGraphLabels(this.props.thirdGraph)
                  : null;            
            let fourthGraphLabels = typeof this.props.fourthGraph !== 'undefined' && this.props.fourthGraph !== null && Object.keys(this.props.fourthGraph).length
                  ? this.getGraphLabels(this.props.fourthGraph)
                  : null;

            return (
                  <div>
                        <div className="parent-component statz-component-container">
                              <div className="container">

                                    <label id="statz-heading" className="heading">Statz</label>


                                    <div className="punishing-others-container">

                                          <label className="statz-group-heading">PUNISHING OTHERS</label>

                                          {this.props.firstGraph ?
                                                <div className="float-left graph-container graph1-container"
                                                      style={{ width: "420px" }}>

                                                      {firstGraphLabels.map(label => label)}

                                                      <PieChart
                                                            data={this.props.firstGraph}
                                                            lengthAngle={-360}
                                                            lineWidth={100}
                                                            paddingAngle={0}
                                                            animate={true}
                                                            animationDuration={3500} />
                                                </div>

                                                : null}

                                          {this.props.secondGraph ?
                                                <div className="float-right graph-container graph2-container"
                                                      style={{ width: "420px" }}>

                                                      {secondGraphLabels.map(label => label)}

                                                      <PieChart
                                                            data={this.props.secondGraph}
                                                            lengthAngle={-360}
                                                            lineWidth={100}
                                                            paddingAngle={0}
                                                            animate={true}
                                                            animationDuration={3500} />
                                                </div>
                                                : null}

                                          <div className="pun-others-bottom-image-container">
                                                {punishingOthersSVG}
                                          </div>

                                    </div>

                                    <div className="being-punished-container">

                                          <label className="statz-group-heading">ME, BEING PUNISHED</label>

                                          {this.props.thirdGraph ?
                                                <div className="float-left graph-container graph1-container"
                                                      style={{ width: "420px" }}>

                                                      {thirdGraphLabels.map(label => label)}

                                                      <PieChart
                                                            data={this.props.thirdGraph}
                                                            lengthAngle={-360}
                                                            lineWidth={100}
                                                            paddingAngle={0}
                                                            animate={true}
                                                            animationDuration={3500} />
                                                </div>
                                                : null}

                                          {this.props.fourthGraph ?
                                                <div className="float-right graph-container graph2-container"
                                                      style={{ width: "420px" }}>

                                                      {fourthGraphLabels.map(label => label)}

                                                      <PieChart
                                                            data={this.props.fourthGraph}
                                                            lengthAngle={-360}
                                                            lineWidth={100}
                                                            paddingAngle={0}
                                                            animate={true}
                                                            animationDuration={3500} />
                                                </div>
                                                : null}

                                          <div className="being-punished-bottom-image-container">
                                                {beingPunishedSVG}
                                          </div>

                                    </div>
                              </div>
                        </div>

                        <RankInfo rank={this.props.rank} />

                  </div>
            )

      }
}

export default connect(mapStateToProps, mapDispatchToProps)(Stats);


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



const punishingOthersSVG = (
      <svg id="pun-others-bottom-image" width="1080px" height="43px" viewBox="0 0 1080 43" version="1.1" xmlns="http://www.w3.org/2000/svg">

            <title>Group 11</title>
            <desc>Created with Sketch.</desc>
            <defs></defs>
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

            <title>Fill 7 Copy 9 + Fill 15 Copy 4 + Group Copy 10</title>
            <desc>Created with Sketch.</desc>
            <defs></defs>
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



const getRadians = data => {

      let valueSum = 0;

      data.forEach(item => valueSum += item.value);

      return data.map(item => {
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