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
import * as d3 from 'd3';

const colors = ['#2C4870', '#519331', '#AA5039', '#8B2F5F', '#C5B738', '#858DFF', '#FF8D02','#FFCD51','#ACDAE6','#FC997E','#CF93AD','#AA3939','#AA6C39','#226666',]

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
    console.log("Chart -> componentDidUpdate -> hierarchy", hierarchy);
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
      // .size([2 * Math.PI, radius / 1.3])
      .nodeSize([width/10, height/10])
      // .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });
      .separation(function (a, b) { return (a.parent == b.parent ? 2 : 2)});

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
        .angle(d => {
          return d.x
        })
        .radius(d => d.y));

    const node = g.selectAll('.node')
      // root.descendants gets an array of of all nodes
      .data(d3root.descendants())
      .enter()
      .append('g')
      .style('fill', function (d) {
        if(d.data.branch < colors.length){
          return colors[d.data.branch]
        } else {
          let indexColors = d.data.branch - colors.length;
          while(indexColors > colors.length){
            indexColors = indexColors - colors.length;
          }
          return colors[indexColors]
        }
      })
      .attr('class', 'node--internal')
      // })
      //  assigning class to the node based on whether node has children or not
      // .attr('class', function (d) {
      //   return 'node' + (d.children ? ' node--internal' : ' node--leaf');
      // })
      .attr('transform', function (d) {
        return 'translate(' + reinfeldTidierAlgo(d.x, d.y) + ')';
      });

    node.append('circle')
      .attr('r', 15)
      .on('mouseover', function (d) {
        d3.select(this)
          .transition(100)
          .duration(20)
          .attr('r', 25);

        tooltipDiv.transition()
          .duration(50)
          .style('opacity', 0.9);

        tooltipDiv.html(JSON.stringify(d.data.stateSnapshot.children[0].state), this)
          .style('left', (d3.event.pageX - 90) + 'px')
          .style('top', (d3.event.pageY - 65) + 'px');
      })
      // eslint-disable-next-line no-unused-vars
      .on('mouseout', function (d) {
        d3.select(this)
          .transition()
          .duration(300)
          .attr('r', 15);

        tooltipDiv.transition()
          .duration(400)
          .style('opacity', 0);
      });
    node
      .append('text')
      // adjusts the y coordinates for the node text
      .attr('dy', '0.5em')
      .attr('x', function (d) {
        // this positions how far the text is from leaf nodes (ones without children)
        // negative number before the colon moves the text of rightside nodes,
        // positive number moves the text for the leftside nodes
        return d.x < Math.PI === !d.children ? 0 : 0;
      })
      .attr('text-anchor', 'middle')
      // this arranges the angle of the text
      .attr('transform', function (d) { return 'rotate(' + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 1 / Math.PI + ')'; })
      .text(function (d) {
        // gabi and nate :: display the name of of specific patch
        return `${d.data.name}.${d.data.branch}`;
      });

    // allows svg to be dragged around
    node.call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

    chartContainer.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0, 8]) // scaleExtent([minimum scale factor, maximum scale factor])
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

    // define the div for the tooltip
    const tooltipDiv = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    function reinfeldTidierAlgo(x, y) {
      return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    }
  }

  render() {
    return <div ref={this.chartRef} className="d3Container" />;
  }
}

export default Chart;
