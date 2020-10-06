/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */

import React, { useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { useStoreContext } from '../store'
import { onHover } from '../actions/actions'

interface componentMapProps {
  x: number;
  y: number;
  k: number;
  setZoomState: any;
  snapshots: [];
  viewIndex: number;
}

const ComponentMap = (props: componentMapProps) => {
  //import props
  const { viewIndex, snapshots, x, y, k, setZoomState } = props;
  let lastSnap: number | null = null;
  if (viewIndex < 0) lastSnap = snapshots.length - 1;
  else lastSnap = viewIndex;
  console.log('inside ComnponentMap, snapshots:', snapshots)
  //external constants
  const width: any = '100vw';
  const height: any = '100vh';
  let data: Object = snapshots[lastSnap];

  useEffect(() => {
    document.getElementById('canvas').innerHTML = '_';
    setZoomState(d3.zoomTransform(d3.select('#canvas').node()));
    return makeChart(data);
  }, [data]);

  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const makeChart = useCallback(
    (data) => {
      // Establish Constants
      const margin = { top: 10, right: 120, bottom: 10, left: 120 };
      const dy = 120;
      const dx = 100;
      const tree = d3.tree().nodeSize([dx, dy]);
      const diagonal = d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x);
      const root = d3.hierarchy(data);

      // Determine descendants of root node use d.depth conditional to how many levels deep to display on first render
      root.x0 = dy / 2;
      root.y0 = 0;
      root.descendants().forEach((d, i) => {
        d.id = i;
        d._children = d.children;
        // use to limit depth of children rendered
        //if (d.depth === 5) d.children = null;
      });

      // Create Container for D3 Visualizations
      const svgContainer = d3
        .select('#canvas')
        .attr('width', width)
        .attr('height', height);

      // create inner container to help with drag and zoom
      const svg: any = svgContainer
        .append('g')
        .attr('transform', `translate(${x}, ${y}), scale(${k})`); // sets the canvas to the saved zoomState

      // create links
      const gLink = svg
        .append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.9)
        .attr('stroke-width', 1.5);

      // create nodes
      const gNode = svg
        .append('g')
        .attr('cursor', 'pointer')
        .attr('pointer-events', 'all');

      // declare re render funciton to handle collapse and expansion of nodes
      const update = (source) => {
        const duration = 250;
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);
        let left = root;
        let right = root;
        root.eachBefore((node) => {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
        });

        //use nodes to detrmine height
        const height = right.x - left.x + margin.top + margin.bottom;

        const transition = svg
          .transition()
          .duration(duration)
          .attr('viewBox', [-margin.left, left.x - margin.top, width, height]);
        // Update the nodes…
        const node = gNode.selectAll('g').data(nodes, (d) => d.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node
          .enter()
          .append('g')
          .attr('transform', (d) => `translate(${source.y0},${source.x0})`)
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 1)
          .on('click', (d) => {
            d.children = d.children ? null : d._children;
            update(d);
          });

        // paint circles, color based on children
        nodeEnter
          .append('circle')
          .attr('r', 10)
          .attr('fill', (d) => (d._children ? '#4e9dcc' : '#95B6B7'))
          .attr('stroke-width', 10)
          .attr('stroke-opacity', 1);

        // append node names
        nodeEnter
          .append('text')
          .attr('dy', '.31em')
          .attr('x', '-10')
          .attr('y', '-5')
          .attr('text-anchor', 'end')
          .text((d: any) => d.data.name.slice(0, 14)) // Limits Characters in Display
          .style('font-size', `.7rem`)
          .style('fill', 'white')
          .clone(true)
          .lower()
          .attr('stroke-linejoin', 'round')
          .attr('stroke', '#646464')
          .attr('stroke-width', 1);

        //TODO -> Alter incoming snapshots so there is useful data to show on hover.
        nodeEnter.on('mouseover', function (d: any, i: number): any {
            console.log('mousing over')
            dispatch(onHover());
            d3.select(this)
              .append('text')
              .text(() => {
                //i want to return to the node in d3 the values listed in a more readable way. Right now it's just a horizontal line of text
                return JSON.stringify(d.data.state);
              })
              .attr('x', -25)
              .attr('y', 20)
              .style('font-size', `.6rem`)
              .style('fill', 'white')
              .attr('stroke', 'white')
              .attr('stroke-width', .5)
              .attr('id', `popup${i}`);

              
          
        });
        nodeEnter.on('mouseout', function (d: any, i: number): any {
          d3.select(`#popup${i}`).remove();
        });

        // Transition nodes to their new position.
        const nodeUpdate = node
          .merge(nodeEnter)
          .transition(transition)
          .attr('transform', (d) => `translate(${d.y},${d.x})`)
          .attr('fill-opacity', 1)
          .attr('stroke-opacity', 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node
          .exit()
          .transition(transition)
          .remove()
          .attr('transform', (d) => `translate(${source.y},${source.x})`)
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0);

        // Update the links…
        const link = gLink.selectAll('path').data(links, (d) => d.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link
          .enter()
          .append('path')
          .attr('d', (d) => {
            const o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o });
          });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition).attr('d', diagonal);

        // Transition exiting nodes to the parent's new position.
        link
          .exit()
          .transition(transition)
          .remove()
          .attr('d', (d) => {
            const o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
          });

        // Stash the old positions for transition.
        root.eachBefore((d) => {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      };

      //______________ZOOM______________\\

      // Sets starting zoom
      let zoom = d3.zoom().on('zoom', zoomed);

      svgContainer.call(
        zoom.transform,
        // Changes the initial view, (left, top)
        d3.zoomIdentity.translate(x, y).scale(k)
      );

      // allows the canvas to be zoom-able
      svgContainer.call(
        d3
          .zoom()
          .scaleExtent([0.15, 1.5]) // [zoomOut, zoomIn]
          .on('zoom', zoomed)
      );
      function zoomed(d: any) {
        svg
          .attr('transform', d3.event.transform)
          .on(
            'mouseup',
            setZoomState(d3.zoomTransform(d3.select('#canvas').node()))
          );
      }

      // allows the canvas to be draggable
      svg.call(d3.drag());

      // call update on node click
      update(root);
    },
    [data]
  );

  return (
    <div data-testid="canvas" id="componentMapContainer">
      <svg id="canvas"></svg>
    </div>
  );
};

export default ComponentMap;
