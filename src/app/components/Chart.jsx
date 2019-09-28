/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

let root = {};
let duration = 750;
class Chart extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.maked3Tree = this.maked3Tree.bind(this);
    this.removed3Tree = this.removed3Tree.bind(this);
  }
  componentDidMount() {
    const { snapshot, hierarchy } = this.props;
    console.log('initial props', this.props)
    root = JSON.parse(JSON.stringify(hierarchy));
    this.maked3Tree();
  }

  componentDidUpdate() {
    const { snapshot, hierarchy } = this.props;
    console.log('updated props', this.props)
    root = JSON.parse(JSON.stringify(hierarchy));
    this.maked3Tree();
  }

  removed3Tree() {
    const { current } = this.chartRef;
    while (current.hasChildNodes()) {
      current.removeChild(current.lastChild);
    }
  }

  maked3Tree() {
    this.removed3Tree();
    let width = 900;
    let height = 1000;
    let chartContainer = d3.select(this.chartRef.current)
      .append('svg') // chartContainer is now pointing to svg
      .attr('width', width)
      .attr('height', height);

    let g = chartContainer
      .append("g")
      // this is changing where the graph is located physically
      .attr("transform", `translate(${width / 2.5}, ${height / 2 + 90})`);

    // if we consider the container for our radial node graph as a box encapsulating, half of this container width is essentially the radius of our radial node graph
    let radius = width / 2;

    // d3.hierarchy constructs a root node from the specified hierarchical data (our object titled dataset), which must be an object representing the root node
    let hierarchy = d3.hierarchy(root);

    let tree = d3.tree()
      // this assigns width of tree to be 2pi
      .size([2 * Math.PI, radius])

    let d3root = tree(hierarchy);

    g.selectAll('.link')
      // root.links() gets an array of all the links, where each element is an object containing a source property, which represents the link's source node, and a target property, which represents the link's target node.
      .data(d3root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr("d", d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y));

    let node = g.selectAll(".node")
      // root.descendants gets an array of of all nodes
      .data(d3root.descendants())
      .enter()
      .append("g")
      .attr("class", function (d) {
        return "node" + (d.children ? " node--internal" : " node--leaf")
      })
      .attr("transform", function (d) {
        return "translate(" + reinfeldTidierAlgo(d.x, d.y) + ")";
      });

    node.append("circle")
      .attr("r", 5.5)

    node
      .append("text")
      .attr("dy", "0.1em")
      .attr("x", function (d) {
        // this positions how far the text is from leaf nodes (ones without children)
        return d.x < Math.PI === !d.children ? 10 : -10;
      })
      .attr("text-anchor", function (d) { return d.x < Math.PI === !d.children ? "start" : "end"; })
      // this arranges the angle of the text
      .attr("transform", function (d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ")"; })
      .text(function (d) {
        return "state" + d.data.index;
      });

    function reinfeldTidierAlgo(x, y) {
      return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    }
  }

  render() {
    return <div ref={this.chartRef} className="d3Container" />;
  }
}

// Chart.propTypes = {
//   snapshot: PropTypes.arrayOf(PropTypes.object).isRequired,
// };

export default Chart;
