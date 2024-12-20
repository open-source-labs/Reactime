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
import { toggleExpanded, setCurrentTabInApp } from '../../../slices/mainSlice';
import { useDispatch } from 'react-redux';
import { LinkTypesProps, DefaultMargin, ToolTipStyles } from '../../../FrontendTypes';

let stroke = '';

const lightWeight = '#94a3b8'; // Lightest gray for minimal props
const mediumWeight = '#64748b'; // Medium gray for light prop load
const heavyWeight = '#556579';
const veryHeavy = '#475569'; // Darker gray for medium load

const defaultMargin: DefaultMargin = {
  top: 30,
  left: 20,
  right: 20,
  bottom: 70,
};

const nodeCoords: object = {};
let count: number = 0;
let aspect: number = 1;
let nodeCoordTier = 0;
let nodeOneLeft = 0;
let nodeTwoLeft = 2;

export default function ComponentMap({
  // imported props to be used to display the dendrogram
  width: totalWidth,
  height: totalHeight,
  margin = defaultMargin,
  currentSnapshot, // from 'tabs[currentTab].stateSnapshot object in 'MainContainer'
}: LinkTypesProps): JSX.Element {
  const [orientation, setOrientation] = useState('vertical'); // We create a local state "orientation" and set it to a string 'vertical'.
  const [linkType, setLinkType] = useState('step'); // We create a local state "linkType" and set it to a string 'step'.
  const [stepPercent, setStepPercent] = useState(0.0); // We create a local state "stepPercent" and set it to a number '0.0'. This will be used to scale the Map component's link: Step to 0%
  const [selectedNode, setSelectedNode] = useState('root'); // We create a local state "selectedNode" and set it to a string 'root'.
  const [forceUpdate, setForceUpdate] = useState(false);

  const dispatch = useDispatch();

  const toolTipTimeoutID = useRef(null); //useRef stores stateful data that’s not needed for rendering.

  useEffect(() => {
    dispatch(setCurrentTabInApp('map')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'map' to facilitate render.
  }, [dispatch]);

  // force app to re-render to accurately calculate aspect ratio upon initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceUpdate((prev) => !prev);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // setting the margins for the Map to render in the tab window.
  const innerWidth: number = totalWidth - margin.left - margin.right;
  const innerHeight: number = totalHeight - margin.top - margin.bottom - 60;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  /*
    We begin setting the starting position for the root node on the maps display. 
    The default view sets the root nodes location either in the left middle *or top middle of the browser window relative to the size of the browser.
  */

  origin = { x: 0, y: 0 };
  if (orientation === 'vertical') {
    sizeWidth = innerWidth;
    sizeHeight = innerHeight;
  } else {
    // if the orientation isn't vertical, swap the width and the height
    sizeWidth = innerHeight;
    sizeHeight = innerWidth;
  }
  //}
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
  };

  const nodeList: [] = []; // create a nodeList array to store our nodes as a flat array

  const collectNodes: void = (node) => {
    // function that takes in a node (snapshot) as it's argument and modifies 'nodeList' so that the node and it's children are all within the flattened 'nodeList'.
    nodeList.splice(0, nodeList.length); // deletes all the nodes in nodelist
    nodeList.push(node); // pushes the snapshot into nodeList
    for (let i = 0; i < nodeList.length; i += 1) {
      // iterate through the nodeList that contains our snapshot
      const cur = nodeList[i];
      if (cur.children && cur.children.length > 0) {
        // if the currently itereated snapshot has non-zero children...
        for (const child of cur.children) {
          // iterate through each child in the children array
          nodeList.push(child); // add the child to the nodeList
        }
      }
    }
  };

  // check if any data should be displayed in tool tip display
  const hasDisplayableData = (nodeData) => {
    // Check if the node has props
    const hasProps =
      nodeData.componentData?.props && Object.keys(nodeData.componentData.props).length > 0;

    // Check if the node has state
    const hasState =
      (nodeData.componentData?.state && Object.keys(nodeData.componentData.state).length > 0) ||
      (nodeData.componentData?.hooksState &&
        Object.keys(nodeData.componentData.hooksState).length > 0);

    // Check if the node has reducer states
    const hasReducers =
      nodeData.componentData?.reducerStates && nodeData.componentData.reducerStates.length > 0;

    return hasProps || hasState || hasReducers;
  };

  const shouldIncludeNode = (node) => {
    // Return false if node has any context properties
    if (node?.componentData?.context && Object.keys(node.componentData.context).length > 0) {
      return false;
    }
    // Return false if node name ends with 'Provider'
    if (node?.name && node.name.endsWith('Provider')) {
      return false;
    }
    return true;
  };

  const processTreeData = (node) => {
    if (!node) return null;

    // Create a new node
    const newNode = { ...node };

    if (node.children) {
      // Process all children first
      const processedChildren = node.children
        .map((child) => processTreeData(child))
        .filter(Boolean); // Remove null results

      // For each child that shouldn't be included, replace it with its children
      newNode.children = processedChildren.reduce((acc, child) => {
        if (shouldIncludeNode(child)) {
          // If child should be included, add it directly
          acc.push(child);
        } else {
          // If child should be filtered out, add its children instead
          if (child.children) {
            acc.push(...child.children);
          }
        }
        return acc;
      }, []);
    }

    return newNode;
  };
  // filter out Conext Providers
  let filtered = processTreeData(currentSnapshot);
  collectNodes(filtered);

  // @ts
  // find the node that has been selected and use it as the root
  let startNode = null;
  let rootNode;

  const findSelectedNode = () => {
    // iterates through each node of nodeList and sets the rootNode and startNode to a node with the name root
    for (const node of nodeList) {
      if (node.name === 'root') rootNode = node;
      if (node.name === selectedNode) startNode = node; // selectedNode label initialized as 'root'
    }
    if (startNode === null) startNode = rootNode;
  };

  findSelectedNode(); // locates the rootNode

  // controls for the map
  const LinkComponent: React.ComponentType<unknown> = getLinkComponent({
    linkType,
    orientation,
  });
  return totalWidth < 10 ? null : (
    <div>
      <LinkControls
        orientation={orientation}
        linkType={linkType}
        stepPercent={stepPercent}
        snapShots={currentSnapshot}
        selectedNode={selectedNode}
        setOrientation={setOrientation}
        setLinkType={setLinkType}
        setStepPercent={setStepPercent}
        setSelectedNode={setSelectedNode}
      />

      <svg ref={containerRef} width={totalWidth} height={totalHeight + 0}>
        <LinearGradient id='root-gradient' from='#488689' to='#3c6e71' />
        <LinearGradient id='parent-gradient' from='#488689' to='#3c6e71' />
        <rect
          className='componentMapContainer'
          onClick={() => {
            hideTooltip();
          }}
          width={sizeWidth / aspect}
          height={sizeHeight / aspect + 0}
          rx={14}
        />
        <Group transform={`scale(${aspect})`} top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(startNode, (d) => (d.isExpanded ? d.children : null))}
            size={[sizeWidth / aspect, sizeHeight / aspect]}
            separation={(a, b) => (a.parent === b.parent ? 0.5 : 0.5) / a.depth}
          >
            {(tree) => (
              <Group top={origin.y + 35} left={origin.x + 50}>
                {tree.links().map((link, i) => {
                  const linkName = link.source.data.name;
                  const propsObj = link.source.data.componentData.props;
                  const childPropsObj = link.target.data.componentData.props;
                  let propsLength;
                  let childPropsLength;

                  if (propsObj) {
                    propsLength = Object.keys(propsObj).length;
                  }
                  if (childPropsObj) {
                    childPropsLength = Object.keys(childPropsObj).length;
                  }
                  // go to https://en.wikipedia.org/wiki/Logistic_function
                  // for an explanation of Logistic functions and parameters used
                  const yshift = -3;
                  const x0 = 5;
                  const L = 25;
                  const k = 0.4;
                  const strokeWidthIndex =
                    yshift + L / (1 + Math.exp(-k * (childPropsLength - x0)));

                  if (strokeWidthIndex <= 1) {
                    stroke = '#808080';
                  } else {
                    if (childPropsLength <= 1) {
                      stroke = lightWeight;
                    } else if (childPropsLength <= 2) {
                      stroke = mediumWeight;
                    } else if (childPropsLength <= 3) {
                      stroke = heavyWeight;
                    } else {
                      stroke = veryHeavy;
                    }
                  }

                  return (
                    <LinkComponent
                      className='compMapLink'
                      key={i}
                      data={link}
                      percent={stepPercent}
                      stroke={stroke} // color of the link --not used--
                      strokeWidth={strokeWidthIndex} /* strokeWidth */ // width of the link
                      fill='none'
                    />
                  );
                })}

                {tree.descendants().map((node, key) => {
                  const calculateNodeWidth = (text: string): number => {
                    const nodeLength = text.length;
                    if (nodeLength <= 5) return nodeLength + 50;
                    if (nodeLength <= 10) return nodeLength + 120;
                    return nodeLength + 140;
                  };

                  // Find the maximum width for any node
                  const findMaxNodeWidth = (nodeData: any): number => {
                    // If no children, return current node width
                    if (!nodeData.children) {
                      return calculateNodeWidth(nodeData.name);
                    }

                    // Get width of current node
                    const currentWidth = calculateNodeWidth(nodeData.name);

                    // Get max width from children
                    const childrenWidths = nodeData.children.map((child) =>
                      findMaxNodeWidth(child),
                    );

                    // Return the maximum width found
                    return Math.max(currentWidth, ...childrenWidths);
                  };

                  // Truncate text for nodes that exceed a certain length
                  const truncateText = (text: string, width: number, maxWidth: number): string => {
                    // Calculate approximate text width
                    const estimatedTextWidth = text.length * 8;

                    // If this node's width is close to the max width (within 10%), truncate it
                    if (width >= maxWidth * 0.9) {
                      const maxChars = Math.floor((width - 30) / 8); // -30 for padding + ellipsis
                      return `${text.slice(0, maxChars)}...`;
                    }

                    return text;
                  };

                  const getNodeDimensions = (
                    name: string,
                    rootNode: any,
                  ): { width: number; displayText: string } => {
                    const width = calculateNodeWidth(name);
                    const maxWidth = findMaxNodeWidth(rootNode);
                    const displayText = truncateText(name, width, maxWidth);

                    return { width, displayText };
                  };

                  // Usage in your render function:
                  const { width, displayText } = getNodeDimensions(node.data.name, startNode);

                  const height: number = 35;
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
                  count < nodeList.length
                    ? !nodeCoords[top]
                      ? (nodeCoords[top] = [left - width / 2, left + width / 2])
                      : nodeCoords[top].push(left - width / 2, left + width / 2)
                    : null;
                  count++;

                  //check if the node coordinate object has been constructed
                  if (count === nodeList.length) {
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
                    aspect = Math.max(aspect, 1);
                  }

                  // mousing controls & Tooltip display logic
                  const handleMouseAndClickOver = (event, nodeData) => {
                    // Only show tooltip if the node has data to display
                    if (hasDisplayableData(nodeData)) {
                      const coords = localPoint(event.target.ownerSVGElement, event);
                      const tooltipObj = { ...nodeData };

                      showTooltip({
                        tooltipLeft: coords.x,
                        tooltipTop: coords.y,
                        tooltipData: tooltipObj,
                      });
                    }
                  };

                  return (
                    <Group top={top} left={left} key={key} className='rect'>
                      // Replace the root node rect rendering block with this:
                      {node.depth === 0 && (
                        <rect
                          className='compMapRoot'
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          rx={10}
                          onClick={() => {
                            dispatch(toggleExpanded(node.data));
                            hideTooltip();
                          }}
                          onMouseEnter={(event) => {
                            if (hasDisplayableData(node.data)) {
                              if (toolTipTimeoutID.current !== null) {
                                clearTimeout(toolTipTimeoutID.current);
                                hideTooltip();
                              }
                              toolTipTimeoutID.current = null;
                              handleMouseAndClickOver(event, node.data);
                            }
                          }}
                          onMouseLeave={() => {
                            if (hasDisplayableData(node.data)) {
                              toolTipTimeoutID.current = setTimeout(() => {
                                hideTooltip();
                                toolTipTimeoutID.current = null;
                              }, 300);
                            }
                          }}
                        />
                      )}
                      {/* This creates the rectangle boxes for each component
                       and sets it relative position to other parent nodes of the same level. */}
                      {node.depth !== 0 && (
                        <rect
                          className={node.children ? 'compMapParent' : 'compMapChild'}
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          rx={10}
                          onClick={() => {
                            dispatch(toggleExpanded(node.data));
                            hideTooltip();
                          }}
                          onMouseEnter={(event) => {
                            if (hasDisplayableData(node.data)) {
                              if (toolTipTimeoutID.current !== null) {
                                clearTimeout(toolTipTimeoutID.current);
                                hideTooltip();
                              }
                              toolTipTimeoutID.current = null;
                              handleMouseAndClickOver(event, node.data);
                            }
                          }}
                          onMouseLeave={() => {
                            if (hasDisplayableData(node.data)) {
                              toolTipTimeoutID.current = setTimeout(() => {
                                hideTooltip();
                                toolTipTimeoutID.current = null;
                              }, 300);
                            }
                          }}
                        />
                      )}
                      {/* Display text inside of each component node */}
                      <text
                        className={
                          node.depth === 0
                            ? 'compMapRootText'
                            : node.children
                              ? 'compMapParentText'
                              : 'compMapChildText'
                        }
                        dy='.33em'
                        textAnchor='middle'
                        style={{ pointerEvents: 'none' }}
                      >
                        {displayText}
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
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
          onMouseEnter={() => {
            clearTimeout(toolTipTimeoutID.current);
            toolTipTimeoutID.current = null;
          }}
          onMouseLeave={() => {
            hideTooltip();
          }}
        >
          <div>
            <div className='tooltip-header'>
              <h3 className='tooltip-title'>{tooltipData.name}</h3>
            </div>
            <div>
              <ToolTipDataDisplay data={tooltipData} />
            </div>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
