/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
// @ts-nocheck

import React, { useState, useEffect, useRef } from 'react';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import { localPoint } from '@visx/event';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import LinkControls from './LinkControls';
import getLinkComponent from './getLinkComponent';
import { toggleExpanded, setCurrentTabInApp } from '../../../actions/actions';
import { useStoreContext } from '../../../store';

const defaultMargin: {} = {
  top: 30,
  left: 30,
  right: 55,
  bottom: 70,
};

export type LinkTypesProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  snapshots: Record<string, unknown>;
  currentSnapshot?: Record<string, unknown>;
};

export default function ComponentMap({
  // imported props to be used to display the dendrogram
  width: totalWidth,
  height: totalHeight,
  margin = defaultMargin,
  currentSnapshot,
}: LinkTypesProps): JSX.Element {
  // importing custom hooks for the selection tabs.
  const [layout, setLayout] = useState('cartesian');
  const [orientation, setOrientation] = useState('vertical');
  const [linkType, setLinkType] = useState('diagonal');
  const [stepPercent, setStepPercent] = useState(10);
  const [selectedNode, setSelectedNode] = useState('root');
  const [, dispatch] = useStoreContext();
  const toolTipTimeoutID = useRef(null);

  useEffect(() => {
    dispatch(setCurrentTabInApp('map'));
  }, [dispatch]);

  // setting the margins for the Map to render in the tab window.
  const innerWidth: number = totalWidth - margin.left - margin.right;
  const innerHeight: number = totalHeight - margin.top - margin.bottom - 60;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  // This sets the starting position for the root node on the maps display.
  // the polar layout sets the root node to the relative center of the display box
  // based on the size of the browser window.
  // the else conditional statements determines the root nodes location either in the left middle
  // or top middle of the browser window relative to the size of the browser.
  if (layout === 'polar') {
    origin = {
      x: innerWidth / 2,
      y: innerHeight / 2,
    };
    sizeWidth = 2 * Math.PI;
    sizeHeight = Math.min(innerWidth, innerHeight) / 2;
  } else {
    origin = { x: 0, y: 0 };
    if (orientation === 'vertical') {
      sizeWidth = innerWidth;
      sizeHeight = innerHeight;
    } else {
      sizeWidth = innerHeight;
      sizeHeight = innerWidth;
    }
  }

  // Tooltip stuff:
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });

  const tooltipStyles: {} = {
    ...defaultStyles,
    minWidth: 60,
    maxWidth: 300,
    backgroundColor: 'rgba(0,0,0,0.9)',
    color: 'white',
    fontSize: '14px',
    lineHeight: '18px',
    fontFamily: 'Roboto',
    zIndex: 100,
    pointerEvents: 'all !important',
  };

  const scrollStyle: {} = {
    minWidth: '60',
    maxWidth: '300',
    minHeight: '20px',
    maxHeight: '200px',
    overflowY: 'scroll',
    overflowWrap: 'break-word',
  };

  const formatRenderTime: string = (time: number): string => {
    const renderTime = time.toFixed(3);
    return `${renderTime} ms `;
  };

  const formatData: []  = (data, type) => {
    const contextFormat: string[] = [];
    for (const key in data) {
      // Suggestion: update the front end to display as a list if we have object
      let inputData = data[key];
      if (inputData !== null && typeof inputData === 'object') {
        inputData = JSON.stringify(inputData);
      }
      contextFormat.push(<p className={`${type}-item`}>{`${key}: ${inputData}`}</p>);
    }
    return contextFormat;
  };

  const formatState: string[] = (state) => {
    if (state === 'stateless') return ['stateless'];
    return ['stateful'];
  };

  // places all nodes into a flat array
  const nodeList: [] = [];

  const collectNodes: void = (node) => {
    nodeList.splice(0, nodeList.length);
    nodeList.push(node);
    for (let i = 0; i < nodeList.length; i += 1) {
      const cur = nodeList[i];
      if (cur.children && cur.children.length > 0) {
        for (const child of cur.children) {
          nodeList.push(child);
        }
      }
    }
  };
  collectNodes(currentSnapshot);
  // @ts
  // find the node that has been selected and use it as the root
  let startNode = null;
  let rootNode;
  const findSelectedNode = () => {
    for (const node of nodeList) {
      if (node.name === 'root') rootNode = node;
      if (node.name === selectedNode) startNode = node;
    }
    if (startNode === null) startNode = rootNode;
  };
  findSelectedNode();

  // controls for the map
  const LinkComponent: React.ComponentType<unknown> = getLinkComponent({ layout, linkType, orientation });
  return totalWidth < 10 ? null : (
    <div>
      <LinkControls
        layout={layout}
        orientation={orientation}
        linkType={linkType}
        stepPercent={stepPercent}
        snapShots={currentSnapshot}
        selectedNode={selectedNode}
        setLayout={setLayout}
        setOrientation={setOrientation}
        setLinkType={setLinkType}
        setStepPercent={setStepPercent}
        setSelectedNode={setSelectedNode}
      />

      <svg ref={containerRef} width={totalWidth} height={totalHeight}>
        <LinearGradient id='links-gradient' from='#fd9b93' to='#fe6e9e' />
        <rect
          onClick={() => {
            hideTooltip();
          }}
          width={totalWidth}
          height={totalHeight}
          rx={14}
          fill='#242529'
        />
        <Group top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(startNode, (d) => (d.isExpanded ? d.children : null))}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
          >
            {(tree) => (
              <Group top={origin.y} left={origin.x}>
                {tree.links().map((link, i) => (
                  <LinkComponent
                    key={i}
                    data={link}
                    percent={stepPercent}
                    stroke='#ff6569'
                    strokeWidth='1'
                    fill='none'
                  />
                ))}

                {tree.descendants().map((node, key) => {
                  const widthFunc:number = (name) => {
                    const nodeLength = name.length;
                    if (nodeLength < 5) return nodeLength + 40;
                    if (nodeLength < 10) return nodeLength + 60;
                    return nodeLength + 70;
                  };
                  const width:number = widthFunc(node.data.name);
                  const height:number = 25;

                  let top: number;
                  let left: number;
                  if (layout === 'polar') {
                    const [radialX, radialY] = pointRadial(node.x, node.y);
                    top = radialY;
                    left = radialX;
                  } else if (orientation === 'vertical') {
                    top = node.y;
                    left = node.x;
                  } else {
                    top = node.x;
                    left = node.y;
                  }

                  // mousing controls & Tooltip display logic
                  const handleMouseAndClickOver: void = (event) => {
                    const coords = localPoint(event.target.ownerSVGElement, event);
                    const tooltipObj = { ...node.data };

                    showTooltip({
                      tooltipLeft: coords.x,
                      tooltipTop: coords.y,
                      tooltipData: tooltipObj,
                      // this is where the data for state and render time is displayed
                      // but does not show props functions and etc
                    });
                  };

                  return (
                    <Group top={top} left={left} key={key} className='rect'>
                      {node.depth === 0 && (
                        <circle
                          r={12}
                          fill="url('#links-gradient')"
                          stroke='#ff6569'
                          onClick={() => {
                            dispatch(toggleExpanded(node.data));
                            hideTooltip();
                          }}
                        />
                      )}
                      {/* This creates the rectangle boxes for each component
                       and sets it relative position to other parent nodes of the same level. */}
                      {node.depth !== 0 && (
                        <rect
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          fill={node.children ? '#161521' : '#62d6fb'}
                          stroke={
                            node.data.isExpanded && node.data.children.length > 0
                              ? '#ff6569'
                              : '#4D4D4D'
                          }
                          strokeWidth={1.5}
                          strokeOpacity='1'
                          rx={node.children ? 4 : 10}
                          onClick={() => {
                            dispatch(toggleExpanded(node.data));
                            hideTooltip();
                          }}
                          // Mouse Enter Rect (Component Node) -----------------------------------------------------------------------
                          /** This onMouseEnter event fires when the mouse first moves/hovers over a component node.
                           * The supplied event listener callback produces a Tooltip element for the current node. */ 
                          
                          onMouseEnter={(event) => {
                            /** This 'if' statement block checks to see if you've just left another component node
                             * by seeing if there's a current setTimeout waiting to close that component node's 
                             * tooltip (see onMouseLeave immediately below).
                             * This setTimeout gives the mouse time to enter the tooltip element so the tooltip 
                             * can persist. If instead of entering said tooltip element you've left the previous 
                             * component node to enter this component node, this logic will clear the timeout event,
                             * and close the tooltip. */
                            if (toolTipTimeoutID.current !== null) {
                              clearTimeout(toolTipTimeoutID.current);
                              hideTooltip();
                            }
                            /** The following line resets the toolTipTimeoutID.current to null, showing that there
                            * are no current setTimeouts running. I placed this outside of the above if statement  
                            * to make sure there are no edge cases that would allow for the toolTipTimeoutID.current
                            * to hold onto an old reference. */
                            toolTipTimeoutID.current = null;
                            //This generates a tooltip for the component node the mouse has entered.
                            handleMouseAndClickOver(event);
                          }}

                          // Mouse Leave Rect (Component Node) --------------------------------------------------------------------------
                          /** This onMouseLeave event fires when the mouse leaves a component node.
                           * The supplied event listener callback generates a setTimeout call which gives the 
                           * mouse a certain amount of time between leaving the current component node and 
                           * closing the tooltip for that node.
                           * If the mouse enters the tooltip before the timeout delay has passed, the 
                           * setTimeout event will be canceled. */
                          onMouseLeave={() => {
                            // This line invokes setTimeout and saves its ID to the useRef var toolTipTimeoutID
                            toolTipTimeoutID.current = setTimeout(() => {
                              // hideTooltip unmounts the tooltip
                              hideTooltip();
                              // As the timeout has been executed, the timeoutID can be reset to null
                              toolTipTimeoutID.current = null;
                              //There is a delay of 300 ms
                            }, 300);
                          }}
                        />
                      )}
                      {/* Display text inside of each component node */}
                      <text
                        dy='.33em'
                        fontSize={10}
                        fontFamily='Roboto'
                        textAnchor='middle'
                        style={{ pointerEvents: 'none' }}
                        fill={node.depth === 0 ? '#161521' : node.children ? 'white' : '#161521'}
                      >
                        {node.data.name}
                      </text>
                    </Group>
                  );
                })}
              </Group>
            )}
          </Tree>
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          // set this to random so it correctly updates with parent bounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
          
          //------------- Mouse Over TooltipInPortal--------------------------------------------------------------------
          /** This onMouseEnter fires when the mouse first moves/hovers over the tooltip
           * The supplied event listener callback stops the setTimeout that was going to 
           * close the tooltip from firing */ 
          
          onMouseEnter={() => {
            // The setTimeoutID stored in toolTipTimeoutID.current is from the setTimeout initiated by leaving the 
            // component node that generated the tooltip. If you've triggered an onMouseEnter event in that tooltip,
            clearTimeout(toolTipTimeoutID.current);
            // This line resets the timeoutID to null
            toolTipTimeoutID.current = null;
          }}

          //------------- Mouse Leave TooltipInPortal -----------------------------------------------------------------
          /** This onMouseLeave event fires when the mouse leaves the tooltip 
           * The supplied event listener callback unmounts the tooltip */
          onMouseLeave={() => {
            // hideTooltip unmounts the tooltip
            hideTooltip();
          }}
        >
          <div>
            <div style={{}}>
              {' '}
              <strong>{tooltipData.name}</strong>{' '}
            </div>
            <div> Render time: {formatRenderTime(tooltipData.componentData.actualDuration)} </div>
            <div className='stateTip'>
              State: {formatState(tooltipData.state)}
            </div>
            <div style={React.scrollStyle}>
              <div className='tooltipWrapper'>
                <h2>Props:</h2>
                {formatData(tooltipData.componentData.props, 'props')}
              </div>
              
              {/* Currently no use for this field
              <div className='tooltipWrapper'>
                <h2>Initial Context:</h2>
                {formatData(tooltipData.componentData.context, 'context')}
              </div> */}

              <div className='tooltipWrapper'>
                <h2>State:</h2>
                {formatData(
                  tooltipData.componentData.hooksIndex
                    ? tooltipData.componentData.hooksState
                    : tooltipData.componentData.state,
                  'state',
                )}
              </div>
            </div>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
