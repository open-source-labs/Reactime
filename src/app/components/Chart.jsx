/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-operators */
/* eslint-disable prefer-template */
/* eslint-disable no-return-assign */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';

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
    const margin = {
      top: 0,
      right: 60,
      bottom: 200,
      left: 120,
    };
    const width = 600 - margin.right - margin.left;
    const height = 700 - margin.top - margin.bottom;

    const chartContainer = d3.select(this.chartRef.current)
      .append('svg') // chartContainer is now pointing to svg
      .attr('width', width)
      .attr('height', height);

    const g = chartContainer.append('g')
      // this is changing where the graph is located physically
      .attr('transform', `translate(${width / 2 + 4}, ${height / 2 + 2})`);

    // if we consider the container for our radial node graph as a box encapsulating
    // half of this container width is essentially the radius of our radial node graph
    const radius = width / 2;

    // d3.hierarchy constructs a root node from the specified hierarchical data
    // (our object titled dataset), which must be an object representing the root node
    const hierarchy = d3.hierarchy(root);

    const tree = d3.tree()
      // this assigns width of tree to be 2pi
      .size([2 * Math.PI, radius / 1.3])
      .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    const d3root = tree(hierarchy);

    g.selectAll('.link')
    // root.links() gets an array of all the links,
    // where each element is an object containing a
    // source property, which represents the link's source node,
    // and a target property, which represents the link's target node.
      .data(d3root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y));

    const node = g.selectAll('.node')
      // root.descendants gets an array of of all nodes
      .data(d3root.descendants())
      .enter()
      .append('g')
      //  assigning class to the node based on whether node has children or not
      .attr('class', function (d) {
        return 'node' + (d.children ? ' node--internal' : ' node--leaf');
      })
      .attr('transform', function (d) {
        return 'translate(' + reinfeldTidierAlgo(d.x, d.y) + ')';
      });

    node.append('circle')
      .attr('r', 10);

    // creating a d3.tip method where the html has a function that returns
    // the data we passed into tip.show from line 120
    const tip = d3Tip()
      .attr('class', 'd3-tip')
      .html(function (d) { return 'State: ' + d; });

    // invoking tooltip for nodes
    node.call(tip);

    node
      .append('text')
      // adjusts the y coordinates for the node text
      .attr('dy', '0.35em')
      .attr('x', function (d) {
        // this positions how far the text is from leaf nodes (ones without children)
        // negative number before the colon moves the text of rightside nodes,
        // positive number moves the text for the leftside nodes
        return d.x < Math.PI === !d.children ? -4 : 5;
      })
      .attr('text-anchor', function (d) { return d.x < Math.PI === !d.children ? 'start' : 'end'; })
      // this arranges the angle of the text
      .attr('transform', function (d) { return 'rotate(' + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 1 / Math.PI + ')'; })
      .text(function (d) {
        return d.data.index;
      });

    // allows svg to be dragged around
    node.call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

    chartContainer.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 8])
      .on('zoom', zoomed));

    function dragstarted() {
      d3.select(this).raise();
      g.attr('cursor', 'grabbing');
    }

    function dragged(d) {
      d3.select(this).attr('dx', d.x = d3.event.x).attr('dy', d.y = d3.event.y);
    }

    function dragended() {
      g.attr('cursor', 'grab');
    }

    function zoomed() {
      g.attr('transform', d3.event.transform);
    }

    // applying tooltip on mouseover and removes it when mouse cursor moves away
    node
      .on('mouseover', function (d) {
        // without JSON.stringify, data will display as object Object
        // console.log('d.data --> ', JSON.stringify(d.data))
        tip.show(JSON.stringify(d.data.stateSnapshot.children[0].state), this);
      })
      .on('mouseout', tip.hide);

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
