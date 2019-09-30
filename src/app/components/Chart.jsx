/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import d3Tip from "d3-tip";

let root = {};
class Chart extends Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.maked3Tree = this.maked3Tree.bind(this);
    this.removed3Tree = this.removed3Tree.bind(this);
  }
  componentDidMount() {
    const { hierarchy } = this.props;
    root = JSON.parse(JSON.stringify(hierarchy));
    this.maked3Tree();
  }

  componentDidUpdate() {
    const { hierarchy } = this.props;
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
    let width = 960;
    let height = 1060;
    let chartContainer = d3.select(this.chartRef.current)
      .append('svg') // chartContainer is now pointing to svg
      .attr('width', width)
      .attr('height', height);
    
    svg.call(d3.zoom()
      .on("zoom", function () {
        svg.attr("transform", d3.event.transform)
      }))
      .append("g")

    let g = chartContainer
      .append("g")
      // this is changing where the graph is located physically
      .attr("transform", `translate(${width / 2 + 4}, ${height / 2 + 2})`);

    // if we consider the container for our radial node graph as a box encapsulating, half of this container width is essentially the radius of our radial node graph
    let radius = width / 2;

    // d3.hierarchy constructs a root node from the specified hierarchical data (our object titled dataset), which must be an object representing the root node
    let hierarchy = d3.hierarchy(root);

    let tree = d3.tree()
      // this assigns width of tree to be 2pi
      .size([2 * Math.PI, radius])
      .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth });

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
      //  assigning class to the node based on whether node has children or not
      .attr("class", function (d) {
        return "node" + (d.children ? " node--internal" : " node--leaf")
      })
      .attr("transform", function (d) {
        return "translate(" + reinfeldTidierAlgo(d.x, d.y) + ")";
      });

    node.append("circle")
      .attr("r", 15)

    //creating a d3.tip method where the html has a function that returns the data we passed into tip.show from line 120
    let tip = d3Tip()
      .attr("class", "d3-tip")
      .html(function (d) { return "State Snapshot: " + d; })
    
      //invoking tooltip for nodes
    node.call(tip)

    node
      .append("text")
      // adjusts the y coordinates for the node text
      .attr("dy", "0.276em")
      .attr("x", function (d) {
        // this positions how far the text is from leaf nodes (ones without children)
        // negative number before the colon moves the text of rightside nodes, positive number moves the text for the leftside nodes
        return d.x < Math.PI === !d.children ? -5 : 9;
      })
      .attr("text-anchor", function (d) { return d.x < Math.PI === !d.children ? "start" : "end"; })
      // this arranges the angle of the text
      .attr("transform", function (d) { return "rotate(" + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 1 / Math.PI + ")"; })
      .text(function (d) {
        return d.data.index;
      });
    
    //applying tooltip on mouseover and removes it when mouse cursor moves away
    node
      .on('mouseover', function (d) {
        // without JSON.stringify, data will display as object Object
        // console.log('d.data --> ', JSON.stringify(d.data))
        let displayedState;
        tip.show(JSON.stringify(d.data.stateSnapshot), this)
      })
      .on('mouseout', tip.hide)

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
