import React, { Component } from 'react'
// import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'


class BarChart extends Component {

      constructor(props) {
            super(props)
            this.createBarChart = this.createBarChart.bind(this);
            this.data = [50, 100, 10, 30];
            this.size = [1000, 500];
            
      }

      componentDidMount() {
            this.createBarChart()            
      }

      componentDidUpdate() {
            this.createBarChart();           
      }     

      createBarChart() {
            const node = this.node
            const dataMax = max(this.data)
            const yScale = scaleLinear()
                  .domain([0, dataMax])
                  .range([0, this.size[1]])
            select(node)
                  .selectAll('rect')
                  .data(this.data)
                  .enter()
                  .append('rect')

            select(node)
                  .selectAll('rect')
                  .data(this.data)
                  .exit()
                  .remove()

            select(node)
                  .selectAll('rect')
                  .data(this.data)
                  .style('fill', '#fe9922')
                  .attr('x', (d, i) => i * 25)
                  .attr('y', d => this.size[1] - yScale(d))
                  .attr('height', d => yScale(d))
                  .attr('width', 25)
      }

      render() {

            return (
                  <div className="container">
                        <svg ref={node => this.node = node}
                              width={1000} height={500}>
                        </svg>
                  </div>
            )
      }
}
export default BarChart