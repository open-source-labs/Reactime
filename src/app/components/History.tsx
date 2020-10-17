import React, { Component, useEffect, useState } from 'react';
import * as d3 from 'd3';
import LegendKey from './Legend';
import { changeView, changeSlider } from '../actions/actions';
// import { useStoreContext } from '../store';
// import { string } from 'prop-types';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import { RectClipPath } from '@visx/clip-path';

// Visx Zoom feature stuff
const bg = '';
const points = [...new Array(1000)];

// const colorScale = scaleLinear<number>({ range: [0, 1], domain: [0, 1000] });
// const sizeScale = scaleLinear<number>({ domain: [0, 600], range: [0.5, 8] });

const initialTransform = {
  scaleX: 1.27,
  scaleY: 1.27,
  translateX: -211.62,
  translateY: 162.59,
  skewX: 0,
  skewY: 0,
};

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

/**
 * @method maked3Tree :Creates a new D3 Tree
 */

function History(props) {
  //visx zoom first
  const [showMiniMap, setShowMiniMap] = useState<boolean>(true);

  const { width, height, hierarchy, dispatch, sliderIndex, viewIndex } = props;
  let root = JSON.parse(JSON.stringify(hierarchy));
  let isRecoil = false;
  console.log('before makedTree, hierarchy is, ', hierarchy);
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
    const width: any = 800;
    const height: any = 600;
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
    console.log('after maked3tree, hierarchy is now: ', hierarchy);
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
        let loadTime;
        if (d.data.stateSnapshot.children[0].componentData.actualDuration) {
          loadTime =
            d.data.stateSnapshot.children[0].componentData.actualDuration;
        } else {
          loadTime = 1;
        }

        if (loadTime !== undefined) {
          if (loadTime > 16) {
            return '#d62b2b';
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

    // here we the node circle is created and given a radius size, we are also giving it a mouseover and onClick  functionality
    // mouseover will highlight the node while onClick will dispatch changeSlider and changeView actions. This will act as a timeJump request.
    //
    node
      .append('circle')
      .attr('r', 13)
      .on('mouseover', function (d: `Record<string, unknown>`) {
        d3.select(this).transition(100).duration(20).attr('r', 20);
      })
      .on('click', function (d: `Record<string, unknown>`) {
        const index = parseInt(`${d.data.name}.${d.data.branch}`);
        dispatch(changeSlider(index));
        dispatch(changeView(index));
      })
      .on('mouseout', function (d: any) {
        d3.select(this).transition().duration(300).attr('r', 13);
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
        // return `${d.data.name}.${d.data.branch}`;
        return `${d.data.name}.${d.data.branch}`;
      });

    // Zoom Functions
    let zoom = d3.zoom().on('zoom', zoomed);
    svgContainer.call(
      zoom.transform,
      // Changes the initial view, (left, top)
      d3.zoomIdentity.translate(width / 3, height / 4).scale(1)
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
  console.log('have we hit maked3dtree');
  // below we are rendering the LegendKey component and passing hierarchy as props
  // then rendering each node in History tab to render using D3
  return (
    <>
      <div>
        <LegendKey hierarchy={hierarchy} />
        <div
          ref={HistoryRef}
          className="history-d3-div"
          id="historyContainer"
          // position="absolute"
        />
      </div>
    </>
  );
}

export default History;
