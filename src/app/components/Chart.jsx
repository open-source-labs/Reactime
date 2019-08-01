import React, { Component } from 'react';
import '../styles/components/_d3Tree.scss';
import * as d3 from 'd3';

let root;

class Chart extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    root = JSON.parse(JSON.stringify(this.props.snapshot));
    this.maked3Tree();
  }

  componentWillUpdate(prevProps) {
    if (this.props.snapshot !== prevProps.snapshot) {
      root = JSON.parse(JSON.stringify(prevProps.snapshot));
      this.maked3Tree();
    }
  }

  removed3Tree() {
    const { anchor } = this.refs;
    while (anchor.hasChildNodes()) {
      anchor.removeChild(anchor.lastChild);
    }
  }

  maked3Tree() {
    this.removed3Tree();

    const margin = {
      top: 20,
      right: 120,
      bottom: 20,
      left: 120,
    };
    const width = 960 - margin.right - margin.left;
    const height = 800 - margin.top - margin.bottom;

    let i = 0;
    const duration = 750;

    const tree = d3.layout.tree().size([height, width]);

    const diagonal = d3.svg.diagonal().projection(d => [d.y, d.x]);

    const svg = d3
      .select(this.refs.anchor)
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    root.x0 = height / 2;
    root.y0 = 0;

    function update(source) {
      // Compute the new tree layout.
      const nodes = tree.nodes(root).reverse();
      const links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach((d) => {
        d.y = d.depth * 180;
      });

      // Update the nodes…
      const node = svg.selectAll('g.node').data(nodes, d => d.id || (d.id = ++i));

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${source.y0},${source.x0})`)
        .on('click', click)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);

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
        .style('fill-opacity', 1e-6);

      // Transition nodes to their new position.
      const nodeUpdate = node
        .transition()
        .duration(duration)
        .attr('transform', d => `translate(${d.y},${d.x})`);

      nodeUpdate
        .select('circle')
        .attr('r', 4.5)
        .style('fill', d => (d._children ? 'lightsteelblue' : '#fff'));

      nodeUpdate.select('text').style('fill-opacity', 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node
        .exit()
        .transition()
        .duration(duration)
        .attr('transform', d => `translate(${source.y},${source.x})`)
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
        .attr('d', (d) => {
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
        .attr('d', (d) => {
          const o = { x: source.x, y: source.y };
          return diagonal({ source: o, target: o });
        })
        .remove();

      // Stash the old positions for transition.
      nodes.forEach((d) => {
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
    function mouseover(d) {
      d3.select(this)
        .append('text')
        .attr('class', 'hover')
        .attr('transform', d => 'translate(5, -10)')
        .text(d.state === undefined ? '' : JSON.stringify(d.state));
    }

    // Toggle children on click.
    function mouseout(d) {
      d3.select(this)
        .select('text.hover')
        .remove();
    }

    function collapse(d) {
      if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
      }
    }

    // root.children.forEach(collapse);
    update(root);

    // d3.select(self.frameElement).style("height", "800px");
  }

  render() {
    return <div ref="anchor" className="d3Container" width="100%" />;
  }
}

export default Chart;
