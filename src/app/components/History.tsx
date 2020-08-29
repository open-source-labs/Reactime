import React, { Component, useEffect, useState } from 'react';
import * as d3 from 'd3';

/**
 * @var colors: Colors array for the diffrerent node branches, each color is for a different branch
 */
const colors = [
  '#95B6B7',
  '#475485',
  '#519331',
  '#AA5039',
  '#8B2F5F',
  '#C5B738',
  '#858DFF',
  '#FF8D02',
  '#FFCD51',
  '#ACDAE6',
  '#FC997E',
  '#CF93AD',
  '#AA3939',
  '#AA6C39',
  '#226666',
  '#2C4870',
];

const filterHooks = (data: any[]) => {
  if (data[0].children && data[0].state === 'stateless') {
    return filterHooks(data[0].children);
  }
  return JSON.stringify(data[0].state);
};

interface HistoryProps {
  hierarchy: Record<string, unknown>;
}


/**
 * @method maked3Tree :Creates a new D3 Tree
 */

function History(props) {
  let { hierarchy } = props;
  let root = JSON.parse(JSON.stringify(hierarchy));
  let isRecoil = false;
  let HistoryRef = React.createRef(root); //React.createRef(root);

  useEffect(() => {
    maked3Tree();
  }, [root]);

  let removed3Tree = function () {
    const { current } = HistoryRef;
    while (current.hasChildNodes()) {
      current.removeChild(current.lastChild);
    }
  };

  /**
   * @method maked3Tree Creates a new Tree History
   * @var
   */
  let maked3Tree = function () {
    removed3Tree();
    const width: number = 800;
    const height: number = 600;
    const svgContainer = d3
      .select(HistoryRef.current)
      .append('svg') // svgContainer is now pointing to svg
      .attr('width', width)
      .attr('height', height);

    const g = svgContainer
      .append('g')
      // this is changing where the graph is located physically
      .attr('transform', `translate(${width / 2 + 4}, ${height / 2 + 2})`);

    // d3.hierarchy constructs a root node from the specified hierarchical data
    // (our object titled dataset), which must be an object representing the root node
    const hierarchy = d3.hierarchy(root);

    const tree = d3
      .tree()
      .nodeSize([width / 10, height / 10])
      .separation(function (a: { parent: object }, b: { parent: object }) {
        return a.parent == b.parent ? 2 : 2;
      });

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
      .attr(
        'd',
        d3
          .linkRadial()
          .angle((d: { x: number }) => d.x)
          .radius((d: { y: number }) => d.y)
      );

    const node = g
      .selectAll('.node')
      // root.descendants gets an array of of all nodes
      .data(d3root.descendants())
      .enter()
      .append('g')
      .style('fill', function (d) {
        let loadTime =
          d.data.stateSnapshot.children[0].componentData.actualDuration;

        if (loadTime !== undefined) {
          if (loadTime > 16) {
            return '#ff0000';
          }
        }

        if (d.data.branch < colors.length) {
          return colors[d.data.branch];
        }
        let indexColors = d.data.branch - colors.length;
        while (indexColors > colors.length) {
          indexColors -= colors.length;
        }
        return colors[indexColors];
      })
      .attr('class', 'node--internal')
      .attr('transform', function (d: { x: number; y: number }) {
        return 'translate(' + reinfeldTidierAlgo(d.x, d.y) + ')';
      });

    node
      .append('circle')
      .attr('r', 15)
      .on('mouseover', function (d: any) {
        d3.select(this).transition(100).duration(20).attr('r', 25);

        tooltipDiv.transition().duration(50).style('opacity', 0.9);

        if (d.data.stateSnapshot.children[0].name === 'RecoilRoot') {
          console.log('enter');
          isRecoil = true;
        }
        if (!isRecoil) {
          tooltipDiv
            .html(filterHooks(d.data.stateSnapshot.children), this)
            .style('left', d3.event.pageX - 90 + 'px')
            .style('top', d3.event.pageY - 65 + 'px');
        } else {
          tooltipDiv
            .html(
              'Load Time : ' +
                JSON.stringify(
                  d.data.stateSnapshot.children[0].componentData.actualDuration
                ).substring(0, 5) +
                ' ms',
              this
            )
            .style('left', d3.event.pageX - 90 + 'px')
            .style('top', d3.event.pageY - 65 + 'px');
        }
      })
      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .on('mouseout', function (d: any) {
        d3.select(this).transition().duration(300).attr('r', 15);

        tooltipDiv.transition().duration(400).style('opacity', 0);
      });
    node
      .append('text')
      // adjusts the y coordinates for the node text
      .attr('dy', '0.5em')
      .attr('x', function (d: { x: number; children?: [] }) {
        // this positions how far the text is from leaf nodes (ones without children)
        // negative number before the colon moves the text of rightside nodes,
        // positive number moves the text for the leftside nodes
        return d.x < Math.PI === !d.children ? 0 : 0;
      })
      .attr('text-anchor', 'middle')
      // this arranges the angle of the text
      .attr('transform', function (d: { x: number; y: number }) {
        return (
          'rotate(' +
          ((d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 1) /
            Math.PI +
          ')'
        );
      })
      .text(function (d: { data: { name: number; branch: number } }) {
        // display the name of the specific patch
        return `${d.data.name}.${d.data.branch}`;
      });

    // Zoom Functions
    let zoom = d3.zoom().on('zoom', zoomed);
    svgContainer.call(
      zoom.transform,
      // Changes the initial view, (left, top)
      d3.zoomIdentity.translate(width / 2, height / 2).scale(1)
    );
    // allows the canvas to be zoom-able
    svgContainer.call(
      d3
        .zoom()
        .scaleExtent([0, 0.9]) // [zoomOut, zoomIn]
        .on('zoom', zoomed)
    );
    // helper function that allows for zooming
    function zoomed(d: any) {
      g.attr('transform', d3.event.transform);
    }

    // DRAG FUNCTIONS
    node.call(
      d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    );

    function dragstarted() {
      d3.select(this).raise();
      g.attr('cursor', 'grabbing');
    }

    function dragged(d: { x: number; y: number }) {
      d3.select(this)
        .attr('dx', (d.x = d3.event.x))
        .attr('dy', (d.y = d3.event.y));
    }

    function dragended() {
      g.attr('cursor', 'grab');
    }

    // define the div for the tooltip
    const tooltipDiv = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    function reinfeldTidierAlgo(x: number, y: number) {
      return [(y = +y) * Math.cos((x -= Math.PI / 2)), y * Math.sin(x)];
    }
  };

  return (
    <div className="history-d3-container">
      <div ref={HistoryRef} className="history-d3-div" />
    </div>
  );
}

export default History;
