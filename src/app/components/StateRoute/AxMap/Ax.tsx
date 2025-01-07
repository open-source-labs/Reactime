import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import LinkControls from './axLinkControls';
import getLinkComponent from './getAxLinkComponents';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import ToolTipDataDisplay from './ToolTipDataDisplay';
import { ToolTipStyles } from '../../../FrontendTypes';
import { localPoint } from '@visx/event';
import { toggleExpanded, setCurrentTabInApp } from '../../../slices/mainSlice';

const defaultMargin = {
  top: 30,
  left: 20,
  right: 50,
  bottom: 20,
};

const nodeCoords: object = {};
let count: number = 0;
let aspect: number = 1; // aspect resizes the component map container to accommodate large node trees on complex sites
let nodeCoordTier = 0;
let nodeOneLeft = 0;
let nodeTwoLeft = 2;

export type LinkTypesProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function AxTree(props) {
  const { currLocation, axSnapshots, width, height, setShowTree, setShowParagraph } = props;

  let margin = defaultMargin;
  let totalWidth = width;
  let totalHeight = height;

  if (axSnapshots[currLocation.index] === 'emptyAxSnap') return;

  const toolTipTimeoutID = useRef(null); //useRef stores stateful data that’s not needed for rendering.
  const {
    tooltipData, // value/data that tooltip may need to render
    tooltipLeft, // number used for tooltip positioning
    tooltipTop, // number used for tooltip positioning
    tooltipOpen, // boolean whether the tooltip state is open or closed
    showTooltip, // function to set tooltip state
    hideTooltip, // function to close a tooltip
  } = useTooltip(); // returns an object with several properties that you can use to manage the tooltip state of your component

  const {
    containerRef, // Access to the container's bounding box. This will be empty on first render.
    TooltipInPortal, // TooltipWithBounds in a Portal, outside of your component DOM tree
  } = useTooltipInPortal({
    // Visx hook
    detectBounds: true, // use TooltipWithBounds
    scroll: true, // when tooltip containers are scrolled, this will correctly update the Tooltip position
  });

  const tooltipStyles: ToolTipStyles = {
    ...defaultStyles,
    minWidth: 60,
    maxWidth: 250,
    maxHeight: '300px',
    lineHeight: '18px',
    pointerEvents: 'all !important',
    margin: 0,
    padding: 0,
    borderRadius: '8px',
    overflowY: 'auto',
    overflowX: 'auto',
    backgroundColor: 'transparent',
  };

  const [orientation, setOrientation] = useState('horizontal');
  const [linkType, setLinkType] = useState('diagonal');
  const [stepPercent, setStepPercent] = useState(0.0);

  const innerWidth: number = totalWidth - margin.left - margin.right;
  const innerHeight: number = totalHeight - margin.top - margin.bottom - 60;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  origin = { x: 0, y: 0 };
  if (orientation === 'vertical') {
    sizeWidth = innerWidth;
    sizeHeight = innerHeight;
  } else {
    sizeWidth = innerHeight;
    sizeHeight = innerWidth;
  }

  const LinkComponent = getLinkComponent({ linkType, orientation });

  const currAxSnapshot = JSON.parse(JSON.stringify(axSnapshots[currLocation.index]));

  // root node of currAxSnapshot
  const rootAxNode = JSON.parse(JSON.stringify(currAxSnapshot[0]));

  // array that holds each ax tree node with children property
  const nodeAxArr = [];

  // populates ax nodes with children property; visx recognizes 'children' in order to properly render a nested tree
  const organizeAxTree = (currNode, currAxSnapshot) => {
    // checks if current ax node has children nodes through childId
    if (currNode.childIds && currNode.childIds.length > 0) {
      // if yes, add children property to current ax node
      currNode.children = [];
      for (let j = 0; j < currAxSnapshot.length; j++) {
        // locate ax node associated with childId
        for (const childEle of currNode.childIds) {
          if (childEle === currAxSnapshot[j].nodeId) {
            // store ax node in children array
            currNode.children.push(currAxSnapshot[j]);
            // recursively call organizeAxTree with child ax node passed in to check for further nested children nodes
            organizeAxTree(currAxSnapshot[j], currAxSnapshot);
          }
        }
      }
    }
  };

  organizeAxTree(rootAxNode, currAxSnapshot);

  // stores each individual ax node with populated children property in array
  const populateNodeAxArr = (currNode) => {
    nodeAxArr.splice(0, nodeAxArr.length);
    nodeAxArr.push(currNode);
    for (let i = 0; i < nodeAxArr.length; i += 1) {
      // iterate through the nodeAxArr that contains the root ax node
      const cur = nodeAxArr[i];
      if (cur.children && cur.children.length > 0) {
        // if the current ax node evaluated has non-zero children...
        for (const child of cur.children) {
          // iterate through each child ax node in the children array
          nodeAxArr.push(child); // add the child to the nodeAxArr
        }
      }
    }
  };

  populateNodeAxArr(rootAxNode);

  // Conditionally render ax legend component (RTK)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentTabInApp('Axtree')); // dispatch sent at initial page load allowing changing
  }, [dispatch]);

  return totalWidth < 10 ? null : (
    <div>
      <div className='axControls'>
        <LinkControls
          orientation={orientation}
          linkType={linkType}
          stepPercent={stepPercent}
          setOrientation={setOrientation}
          setLinkType={setLinkType}
          setStepPercent={setStepPercent}
          setShowTree={setShowTree}
          setShowParagraph={setShowParagraph}
        />
      </div>

      <svg ref={containerRef} width={totalWidth + 0.2 * totalWidth} height={totalHeight}>
        <LinearGradient id='root-gradient' from='#488689' to='#3c6e71' />
        <LinearGradient id='parent-gradient' from='#488689' to='#3c6e71' />
        <rect
          className='componentMapContainer'
          width={sizeWidth / aspect}
          height={sizeHeight / aspect + 0}
          rx={14}
          onClick={() => {
            hideTooltip();
          }}
        />
        <Group transform={`scale(${aspect})`} top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(nodeAxArr[0], (d) => (d.isExpanded ? null : d.children))}
            size={[sizeWidth / aspect, sizeHeight / aspect]}
            separation={(a, b) => (a.parent === b.parent ? 0.5 : 0.5) / a.depth}
          >
            {(tree) => (
              <Group top={origin.y + 35} left={origin.x + 110}>
                {tree.links().map((link, i) => (
                  <LinkComponent
                    key={i}
                    data={link}
                    percent={stepPercent}
                    stroke='rgb(254,110,158,0.6)'
                    strokeWidth='1'
                    fill='none'
                  />
                ))}
                {tree.descendants().map((node, key) => {
                  const widthFunc = (name): number => {
                    // returns a number that is related to the length of the name. Used for determining the node width.
                    const nodeLength = name.length;
                    if (nodeLength <= 5) return nodeLength + 60;
                    if (nodeLength <= 10) return nodeLength + 130;
                    return nodeLength + 160;
                  };

                  const width: number = widthFunc(node.data.name.value); // the width is determined by the length of the node.name
                  const height: number = 25;
                  let top: number;
                  let left: number;

                  if (orientation === 'vertical') {
                    top = node.y;
                    left = node.x;
                  } else {
                    top = node.x;
                    left = node.y;
                  }

                  //setup a nodeCoords Object that will have keys of unique y coordinates and value arrays of all the left and right x coordinates of the nodes on that level
                  count < nodeAxArr.length
                    ? !nodeCoords[top]
                      ? (nodeCoords[top] = [left - width / 2, left + width / 2])
                      : nodeCoords[top].push(left - width / 2, left + width / 2)
                    : null;
                  count++;

                  if (count === nodeAxArr.length) {
                    //check if there is still a tier of the node tree to collision check
                    while (Object.values(nodeCoords)[nodeCoordTier]) {
                      //check if there are atleast two nodes on the current tier
                      if (
                        Object.values(nodeCoords)[nodeCoordTier][nodeOneLeft] &&
                        Object.values(nodeCoords)[nodeCoordTier][nodeTwoLeft]
                      ) {
                        //check if the left side of the righthand node is to the right of the right side of the lefthand node (i.e. collision)
                        if (
                          Object.values(nodeCoords)[nodeCoordTier][nodeTwoLeft] <
                          Object.values(nodeCoords)[nodeCoordTier][nodeOneLeft + 1]
                        ) {
                          //check if the visible percentage of the left hand node is less than the current lowest (this will be used to resize and rescale the map)
                          if (
                            Math.abs(
                              Object.values(nodeCoords)[nodeCoordTier][nodeTwoLeft] -
                                Object.values(nodeCoords)[nodeCoordTier][nodeOneLeft],
                            ) /
                              Math.abs(
                                Object.values(nodeCoords)[nodeCoordTier][nodeOneLeft + 1] -
                                  Object.values(nodeCoords)[nodeCoordTier][nodeOneLeft],
                              ) <
                            aspect
                          ) {
                            //assign a new lowest percentage if one is found
                            aspect =
                              Math.abs(
                                Object.values(nodeCoords)[nodeCoordTier][nodeTwoLeft] -
                                  Object.values(nodeCoords)[nodeCoordTier][nodeOneLeft],
                              ) /
                              Math.abs(
                                Object.values(nodeCoords)[nodeCoordTier][nodeOneLeft + 1] -
                                  Object.values(nodeCoords)[nodeCoordTier][nodeOneLeft],
                              );
                          }
                          //move the node pointers down the list after checking the current overlap percentage
                          else {
                            nodeOneLeft += 2;
                            nodeTwoLeft += 2;
                          }
                        }
                        //move the node pointers if no collision is found
                        else {
                          nodeOneLeft += 2;
                          nodeTwoLeft += 2;
                        }
                      }
                      //move to the next tier of the node tree if done checking the current one
                      else {
                        nodeOneLeft = 0;
                        nodeTwoLeft = 2;
                        nodeCoordTier++;
                      }
                    }
                  } else {
                    aspect = Math.max(aspect, 0.5);
                  }
                  const handleMouseAndClickOver = (event): void => {
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
                        <rect
                          className={'compMapRoot'}
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          strokeWidth={1.5}
                          strokeOpacity='1'
                          rx={8}
                          onClick={() => {
                            dispatch(toggleExpanded(node.data));
                            hideTooltip();
                          }}
                        />
                      )}
                      {node.depth !== 0 && (
                        <rect
                          className={node.children ? 'compMapParent' : 'compMapChild'}
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          strokeWidth={1.5}
                          strokeOpacity='1'
                          rx={8}
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
                      <text
                        className={
                          node.depth === 0
                            ? 'compMapRootText'
                            : node.children
                              ? 'compMapParentText'
                              : 'compMapChildText'
                        }
                        dy='.33em'
                        fontSize='20px'
                        fontFamily='Roboto'
                        textAnchor='middle'
                        style={{ pointerEvents: 'none' }}
                      >
                        {node.data.name.value}
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
            <div className='tooltip-header'>
              <h3 className='tooltip-title'>{tooltipData['name'].value}</h3>
            </div>
            <div>
              {/* Ax Node Info below names the tooltip title because of how its passed to the ToolTipDataDisplay container*/}
              <ToolTipDataDisplay containerName='Accessbility' dataObj={tooltipData} />
            </div>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
