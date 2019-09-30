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
  componentDidMount() {
    const { snapshot } = this.props;
    root = JSON.parse(JSON.stringify(snapshot));
    this.maked3Tree();
  }

  componentDidUpdate() {
    const { snapshot } = this.props;
    root = JSON.parse(JSON.stringify(snapshot));
    this.maked3Tree();
  }

  removed3Tree() {
    const { anchor } = this.refs;
    while (anchor.hasChildNodes()) {
      anchor.removeChild(anchor.lastChild);
    }
  }

  maked3Tree() {
    this.removed3Tree();
    duration = 0;

    const margin = {
      top: 20,
      right: 120,
      bottom: 20,
      left: 120,
    };
    // const width = 600 - margin.right - margin.left;
    const height = 600 - margin.top - margin.bottom;

    let i = 0;

    const tree = d3.layout
      .tree()
      .nodeSize([20])
      .separation((a, b) => (a.parent === b.parent ? 3 : 1));

    const diagonal = d3.svg.diagonal().projection(d => [d.y, d.x]);

    const svg = d3
      .select(this.refs.anchor)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('cursor', '-webkit-grab')
      .attr('preserveAspectRatio', 'xMinYMin slice')
      .call(
        d3.behavior
          .zoom()
          .on('zoom', () => svg.attr('transform', `translate(${d3.event.translate}) scale(${d3.event.scale})`)),
      )
      .append('g')
      .attr('transform', `translate(60,${height / 2})`);

    // Add tooltip div
    const div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 1e-6)
      .on('mouseover', tipMouseover)
      .on('mouseout', tipMouseout);

    root.x0 = height / 2;
    root.y0 = 0;

    function update(source) {
      // Compute the new tree layout.
      const nodes = tree.nodes(root).reverse();
      const links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(d => {
        d.y = d.depth * 180;
      });

      // Update the nodes…
      const node = svg.selectAll('g.node').data(nodes, d => {
        if (!d.id) {
          i += 1;
          d.id = i;
        }
        return d.id;
      });

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', () => `translate(${source.y0},${source.x0})`)
        .on('click', click)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout)
        .on('mousemove', d => mousemove(d));
      
      function mousemove(d) {
        div
          .text(!d.state ? 'No state found' : JSON.stringify(d.state, null, 4))
      }

      nodeEnter
        .append('circle')
        .attr('r', 1e-6)
        .style('fill', d => (d._children ? 'lightsteelblue' : '#fff'));

      nodeEnter
        .append('text')
        .attr('x', d => (d.children || d._children ? -10 : 10))
        .attr('dy', '.35em')
        .attr('text-anchor', d => (d.children || d._children ? 'end' : 'start'))
        .text(d => d.name)
        .style('fill', '#6FB3D2')
        .style('fill-opacity', 1e-6);

      // Transition nodes to their new position.
      const nodeUpdate = node
        .transition()
        .duration(duration)
        .attr('transform', d => `translate(${d.y},${d.x})`);

      nodeUpdate
        .select('circle')
        .attr('r', 7)
        .style('fill', d => (d._children ? '#A1C658' : '#D381C3'));

      nodeUpdate.select('text').style('fill-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', () => `translate(${source.y},${source.x})`)
        .remove();

      nodeExit.select('circle').attr('r', 1e-6);

      nodeExit.select('text').style('fill-opacity', 1e-6);

      // Update the links…
      const link = svg.selectAll('path.link').data(links, d => d.target.id);

      // Enter any new links at the parent's previous position.
      link
        .enter()
        .insert('path', 'g')
        .attr('class', 'link')
        .attr('d', () => {
          const o = { x: source.x0, y: source.y0 };
          return diagonal({ source: o, target: o });
        });

      // Transition links to their new position.
      link
        .transition()
        .duration(duration)
        .attr('d', diagonal);

      // Transition exiting nodes to the parent's new position.
      link
        .exit()
        .transition()
        .duration(duration)
        .attr('d', () => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach(d => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }

    // Show state on mouse over
    function mouseover() {
      div
        .transition()
        .duration(300)
        .style('display', 'block')
        .style('opacity', 1);
    }

    function mouseout() {
      div
        .transition()
        .duration(3000)
        .style('opacity', 1e-6)
        .style('display', 'none');
    }

    function tipMouseover() {
      div
        .transition()
        .duration(300)
        .style('opacity', 1);
    }

    function tipMouseout() {
      div
        .transition()
        .duration(3000)
        .style('opacity', 1e-6)
        .style('display', 'none');
    }

    update(root);
    duration = 750;

    // root.children.forEach(collapse);
  }

  render() {
    return <div ref="anchor" className="d3Container" />;
  }
}

Chart.propTypes = {
  snapshot: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Chart;
