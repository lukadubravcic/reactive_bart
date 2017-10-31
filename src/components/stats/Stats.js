import React from 'react'
import PieChart from 'react-minimal-pie-chart';
// import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'


class Stats extends React.Component {

      constructor() {
            super();

            this.parseData = () => {

            }
      }

      render() {

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
export default Stats;