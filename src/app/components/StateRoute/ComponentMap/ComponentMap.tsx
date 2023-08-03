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
import ToolTipDataDisplay from './ToolTipDataDisplay';
import { toggleExpanded, setCurrentTabInApp } from '../../../actions/actions';
import { useStoreContext } from '../../../store';
import { LinkTypesProps, DefaultMargin, ToolTipStyles } from '../../../FrontendTypes'

const defaultMargin: DefaultMargin = {
  top: 30,
  left: 30,
  right: 55,
  bottom: 70,
};

export default function ComponentMap({
  // imported props to be used to display the dendrogram
  width: totalWidth,
  height: totalHeight,
  margin = defaultMargin,
  currentSnapshot, // from 'tabs[currentTab].stateSnapshot object in 'MainContainer'
}: LinkTypesProps): JSX.Element {
  const [layout, setLayout] = useState('cartesian'); // We create a local state "layout" and set it to a string 'cartesian'
  const [orientation, setOrientation] = useState('vertical'); // We create a local state "orientation" and set it to a string 'vertical'. 
  const [linkType, setLinkType] = useState('diagonal'); // We create a local state "linkType" and set it to a string 'diagonal'. 
  const [stepPercent, setStepPercent] = useState(10); // We create a local state "stepPercent" and set it to a number '10'.
  const [selectedNode, setSelectedNode] = useState('root'); // We create a local state "selectedNode" and set it to a string 'root'. 
  const [, dispatch] = useStoreContext(); // we destructure the returned context object from the invocation of the useStoreContext function to get access to our dispatch function

  const toolTipTimeoutID = useRef(null); //useRef stores stateful data that’s not needed for rendering.

  useEffect(() => {
    dispatch(setCurrentTabInApp('map')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'map' to facilitate render.
  }, [dispatch]);

  // setting the margins for the Map to render in the tab window.
  const innerWidth: number = totalWidth - margin.left - margin.right;
  const innerHeight: number = totalHeight - margin.top - margin.bottom - 60;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  /*
    We begin setting the starting position for the root node on the maps display. 
    The 'polar layout' sets the root node to the relative center of the display box based on the size of the browser window. 
    The 'cartesian layout' (else conditional) sets the root nodes location either in the left middle *or top middle of the browser window relative to the size of the browser.
  */

  if (layout === 'polar') { // 'polar layout' option
    origin = {
      x: innerWidth / 2,
      y: innerHeight / 2,
    };

    // set the sizeWidth and sizeHeight
    sizeWidth = 2 * Math.PI;
    sizeHeight = Math.min(innerWidth, innerHeight) / 2;

  } else { // 'cartesian layout' option
    origin = { x: 0, y: 0 };
    if (orientation === 'vertical') {
      sizeWidth = innerWidth;
      sizeHeight = innerHeight;
    } else { // if the orientation isn't vertical, swap the width and the height
      sizeWidth = innerHeight;
      sizeHeight = innerWidth;
    }
  }

  const { 
    tooltipData, // value/data that tooltip may need to render
    tooltipLeft, // number used for tooltip positioning
    tooltipTop, // number used for tooltip positioning
    tooltipOpen, // boolean whether the tooltip state is open or closed
    showTooltip, // function to set tooltip state
    hideTooltip // function to close a tooltip
  } = useTooltip(); // returns an object with several properties that you can use to manage the tooltip state of your component

  const {
    containerRef, // Access to the container's bounding box. This will be empty on first render. 
    TooltipInPortal // TooltipWithBounds in a Portal, outside of your component DOM tree
  } = useTooltipInPortal({ // Visx hook
    detectBounds: true, // use TooltipWithBounds
    scroll: true, // when tooltip containers are scrolled, this will correctly update the Tooltip position
  });

  const tooltipStyles: ToolTipStyles = {
    ...defaultStyles,
    minWidth: 60,
    maxWidth: 300,
    backgroundColor: 'rgb(15,15,15)',
    color: 'white',
    fontSize: '16px',
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

  const nodeList: [] = []; // create a nodeList array to store our nodes as a flat array

  const collectNodes: void = (node) => { // function that takes in a node (snapshot) as it's argument and modifies 'nodeList' so that the node and it's children are all within the flattened 'nodeList'.
    nodeList.splice(0, nodeList.length); // deletes all the nodes in nodelist
    nodeList.push(node); // pushes the snapshot into nodeList
    for (let i = 0; i < nodeList.length; i += 1) { // iterate through the nodeList that contains our snapshot
      const cur = nodeList[i];
      if (cur.children && cur.children.length > 0) { // if the currently itereated snapshot has non-zero children...
        for (const child of cur.children) { // iterate through each child in the children array
          nodeList.push(child); // add the child to the nodeList
        }
      }
    }
  };

  collectNodes(currentSnapshot);
  // @ts
  // find the node that has been selected and use it as the root
  let startNode = null;
  let rootNode;

  const findSelectedNode = () => { // iterates through each node of nodeList and sets the rootNode and startNode to a node with the name root
    for (const node of nodeList) {
      if (node.name === 'root') rootNode = node;
      if (node.name === selectedNode) startNode = node; // selectedNode label initialized as 'root'
    }
    if (startNode === null) startNode = rootNode;
  };

  findSelectedNode(); // locates the rootNode... do we really need this? This function is only used once... it's here.

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
        <LinearGradient id='links-gradient' from='#e75e62' to='#f00008' />
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
                    stroke='#F00008'
                    strokeWidth='1'
                    fill='none'
                  />
                ))}

                {tree.descendants().map((node, key) => {
                  const widthFunc:number = (name) => { // function that takes in a node's name and returns a number that is related to the length of the name. Used for determining the node width.
                    const nodeLength = name.length;
                    if (nodeLength <= 5) return nodeLength + 80; // returns a number between 80-85
                    if (nodeLength <= 10) return nodeLength + 120; // returns a number between 125-130
                    return nodeLength + 140;  // returns a number greater than 150
                  };

                  const width:number = widthFunc(node.data.name); // the width is determined by the length of the node.name
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
                          r={25} // increase from 12 to 25 to improve visibility
                          fill="url('#links-gradient')"
                          stroke='#F00008' // changing to red #F00008 to increase readability with sharper contrast
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
                              ? '#F00008'
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
                             * tooltip (see onMouseLeave immediately below). If so it clears the tooltip generated 
                             * from that component node so a new tooltip for the node you've just entered can render. */
                            if (toolTipTimeoutID.current !== null) {
                              clearTimeout(toolTipTimeoutID.current);
                              hideTooltip();
                            }
                            // Removes the previous timeoutID to avoid errors
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
                            // Store setTimeout ID so timeout can be cleared if necessary
                            toolTipTimeoutID.current = setTimeout(() => {
                              // hideTooltip unmounts the tooltip
                              hideTooltip();
                              toolTipTimeoutID.current = null;
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
          /** After the mouse enters the tooltip, it's able to persist by clearing the setTimeout
           *  that would've unmounted it */ 
          onMouseEnter={() => {
            clearTimeout(toolTipTimeoutID.current);
            toolTipTimeoutID.current = null;
          }}

          //------------- Mouse Leave TooltipInPortal -----------------------------------------------------------------
          /** When the mouse leaves the tooltip, the tooltip unmounts */
          onMouseLeave={() => {
            hideTooltip();
          }}
        >
          <div>
            <div>
              <strong>{tooltipData.name}</strong>
            </div>
            <div className='tooltipKey'>
              Key: {tooltipData.componentData.key !== null ? tooltipData.componentData.key : 'null'}
            </div>
            <div> Render time: {formatRenderTime(tooltipData.componentData.actualDuration)} </div>
            
            <div>
              <ToolTipDataDisplay
                containerName='Props' 
                dataObj={tooltipData.componentData.props}
              />
              <ToolTipDataDisplay
                containerName='State'
                dataObj={tooltipData.componentData.hooksIndex
                  ? tooltipData.componentData.hooksState
                  : tooltipData.componentData.state}
              />
            </div>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
