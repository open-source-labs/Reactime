/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import { localPoint } from '@visx/event';
import {
  useTooltip,
  useTooltipInPortal,
  TooltipWithBounds,
  defaultStyles,
} from '@visx/tooltip';
import { isAbsolute } from 'path';
import { nest } from 'jscharting';
import useForceUpdate from './useForceUpdate';
import LinkControls from './LinkControls';
import getLinkComponent from './getLinkComponent';
import { onHover, onHoverExit } from '../actions/actions';
import { useStoreContext } from '../store';

const exclude = ['childExpirationTime', 'staticContext', '_debugSource', 'actualDuration', 'actualStartTime', 'treeBaseDuration', '_debugID', '_debugIsCurrentlyTiming', 'selfBaseDuration', 'expirationTime', 'effectTag', 'alternate', '_owner', '_store', 'get key', 'ref', '_self', '_source', 'firstBaseUpdate', 'updateQueue', 'lastBaseUpdate', 'shared', 'responders', 'pending', 'lanes', 'childLanes', 'effects', 'memoizedState', 'pendingProps', 'lastEffect', 'firstEffect', 'tag', 'baseState', 'baseQueue', 'dependencies', 'Consumer', 'context', '_currentRenderer', '_currentRenderer2', 'mode', 'flags', 'nextEffect', 'sibling', 'create', 'deps', 'next', 'destroy', 'parentSub', 'child', 'key', 'return', 'children', '$$typeof', '_threadCount', '_calculateChangedBits', '_currentValue', '_currentValue2', 'Provider', '_context', 'stateNode', 'elementType', 'type'];

// const root = hierarchy({
//   name: 'root',
//   children: [
//     { name: 'child #1' },
//     {
//       name: 'child #2',
//       children: [
//         { name: 'grandchild #1' },
//         { name: 'grandchild #2' },
//         { name: 'grandchild #3' },
//       ],
//     },
//   ],
// });

interface TreeNode {
  name: string;
  isExpanded?: boolean;
  children?: TreeNode[];
}

// type HierarchyNode = HierarchyPointNode<TreeNode>;

const defaultMargin = {
  top: 30, left: 30, right: 55, bottom: 70,
};

export type LinkTypesProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  snapshots: [];
};

export default function ComponentMap({
  // imported props to be used to display the dendrogram
  width: totalWidth,
  height: totalHeight,
  margin = defaultMargin,
  snapshots,
}: LinkTypesProps) {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  // This is where we select the last object in the snapshots array from props to allow hierarchy to parse the data for render on the component map per hierarchy layout specifications.
  const lastNode = snapshots.length - 1;
  const data: {} = snapshots[lastNode];

  // importing custom hooks for the selection tabs.
  const [layout, setLayout] = useState('cartesian');
  const [orientation, setOrientation] = useState('horizontal');
  const [linkType, setLinkType] = useState('diagonal');
  const [stepPercent, setStepPercent] = useState(10);
  const [tooltip, setTooltip] = useState(false);
  const [expanded, setExpanded] = useState();
  const [selectedNode, setSelectedNode] = useState('root');

  // Declared this variable and assigned it to the useForceUpdate function that forces a state to change causing that component to re-render and display on the map
  const forceUpdate = useForceUpdate();

  // setting the margins for the Map to render in the tab window.
  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom - 60;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

  // This sets the starting position for the root node on the maps display. the polar layout sets the root node to the relative center of the display box based on the size of the browser window.
  // the else conditional statements determines the root nodes location either in the left middle or top middle of the browser window relative to the size of the browser.
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
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });

  const tooltipStyles = {
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

  const scrollStyle = {
    minWidth: '60',
    maxWidth: '300',
    maxHeight: '200px',
    overflowY: 'scroll',
    overflowWrap: 'break-word',
  };

  const formatRenderTime = time => {
    time = time.toFixed(3);
    return `${time} ms `;
  };

  // places all nodes into a flat array
  const nodeList = [];

  // if (exclude.includes(key) === true) {
  //   nestedObj[key] = 'react related';
  // }
  // if (typeof data[key] === 'object' && exclude.includes(key) !== true) {
  //   nestedObj = makePropsPretty(data[key]);
  //   if (Array.isArray(nestedObj)) {
  //     try {
  //       if (nestedObj[0].$$typeof) {
  //         nestedObj = null;
  //       } else {
  //         nestedObj = nestedObj.forEach(e => makePropsPretty(e));
  //       }
  //     } catch (error) {
  //     }
  //   }
  // }

  const makePropsPretty = data => {
    const propsFormat = [];
    const nestedObj = [];
    for (const key in data) {
      if (data[key] !== 'reactFiber' && typeof data[key] !== 'object' && exclude.includes(key) !== true) {
        propsFormat.push(<p className="stateprops">
          {`${key}: ${data[key]}`}
        </p>);
      } else if (data[key] !== 'reactFiber' && typeof data[key] === 'object' && exclude.includes(key) !== true) {
        const result = makePropsPretty(data[key]);
        nestedObj.push(result);
      }
    }
    if (nestedObj) {
      propsFormat.push(nestedObj);
    }

    return propsFormat;
  };

  const collectNodes = node => {
    nodeList.splice(0, nodeList.length);
    nodeList.push(node);
    for (let i = 0; i < nodeList.length; i++) {
      const cur = nodeList[i];
      if (cur.children && cur.children.length > 0) {
        for (const child of cur.children) {
          nodeList.push(child);
        }
      }
    }
  };
  collectNodes(snapshots[lastNode]);

  // find the node that has been selected and use it as the root
  const startNode = null;
  const findSelectedNode = () => {
    for (const node of nodeList) {
      if (node.name === selectedNode) {
        startNode = node;
      }
    }
  };
  findSelectedNode();

  // controls for the map
  const LinkComponent = getLinkComponent({ layout, linkType, orientation });
  return totalWidth < 10 ? null : (
    <div>
      <LinkControls
        layout={layout}
        orientation={orientation}
        linkType={linkType}
        stepPercent={stepPercent}
        snapShots={snapshots[lastNode]}
        selectedNode={selectedNode}
        setLayout={setLayout}
        setOrientation={setOrientation}
        setLinkType={setLinkType}
        setStepPercent={setStepPercent}
        setSelectedNode={setSelectedNode}
      />

      <svg ref={containerRef} width={totalWidth} height={totalHeight}>
        <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
        <rect onClick={() => {
            setTooltip(false);
            hideTooltip();}} width={totalWidth} height={totalHeight} rx={14} fill="#242529" />
        <Group top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(startNode || data, d => (d.isExpanded ? null : d.children))}
            size={[sizeWidth, sizeHeight]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 0.5) / a.depth}
          >
            {tree => (
              <Group top={origin.y} left={origin.x}>
                {tree.links().map((link, i) => (
                  <LinkComponent
                    key={i}
                    data={link}
                    percent={stepPercent}
                    stroke="#ff6569"
                    strokeWidth="1"
                    fill="none"
                  />
                ))}

                {tree.descendants().map((node, key) => {
                  const widthFunc = name => {
                    const nodeLength = name.length;
                    if (nodeLength < 5) return nodeLength + 40;
                    if (nodeLength < 10) return nodeLength + 60;
                    return nodeLength + 70;
                  };
                  const width = widthFunc(node.data.name);
                  const height = 25;

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
                  const handleMouseAndClickOver = event => {
                    () => dispatch(onHover(node.data.rtid));
                    const coords = localPoint(
                      event.target.ownerSVGElement,
                      event,
                    );
                    const tooltipObj = { ...node.data };
                    if (typeof tooltipObj.state === 'object') tooltipObj.state = 'stateful';
                    showTooltip({
                      tooltipLeft: coords.x,
                      tooltipTop: coords.y,
                      tooltipData: tooltipObj, // this is where the data for state and render time is displayed but does not show props functions and etc
                    });
                  };

                  return (
                    <Group top={top} left={left} key={key} className="rect">
                      {node.depth === 0 && (
                        <circle
                          r={12}
                          fill="url('#links-gradient')"
                          stroke="#ff6569"
                          onClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
                            forceUpdate();
                          }}
                        />
                      )}
                      {/* This creates the rectangle boxes for each component and sets it relative position to other parent nodes of the same level. */}
                      {node.depth !== 0 && (
                        <rect
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          // node.children = if node has children
                          fill={node.children ? '#161521' : '#62d6fb'}
                          // node.data.isExpanded = if node is collapsed
                          // stroke={(node.data.isExpanded && node.child) ? '#95fb62' : '#a69ff5'} => node.child is gone when clicked, even if it actually has children. Maybe better call node.children => node.leaf
                          stroke={(node.data.isExpanded && node.data.children.length > 0) ? '#ff6569' : '#4D4D4D'}
                          strokeWidth={1.5}
                          // strokeDasharray={node.children ? '0' : '2,2'}
                          strokeOpacity="1"
                          rx={node.children ? 4 : 10}
                          onDoubleClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
                            hideTooltip();
                            setTooltip(false);
                            forceUpdate();
                          }}
                          // Tooltip event handlers
                          // test feature
                          // onClick = {handleMouseAndClickOver}
                          onClick={event => {
                            if (!tooltip) {
                              handleMouseAndClickOver(event);
                              setTooltip(true);
                            }
                            // if (tooltip) { // cohort 45
                            //   hideTooltip();
                            //   setTooltip(false);
                            // } else {
                            //   handleMouseAndClickOver(event);
                            //   setTooltip(true);
                            // }
                          }}
                          onMouseEnter={() => dispatch(onHover(node.data.rtid))}
                          onMouseLeave={() => dispatch(onHoverExit(node.data.rtid))}
                        />
                      )}
                      {/* Display text inside of each component node */}
                      <text
                        dy=".33em"
                        fontSize={10}
                        fontFamily="Roboto"
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                        fill={
                          node.depth === 0
                            ? '#161521'
                            : node.children
                              ? 'white'
                              : '#161521'
                        }
                        z
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
          onClick={hideTooltip}
        >
          <div onClick={() => {
            setTooltip(false);
            hideTooltip();
          }}
          >
            <div style={{}}>
              {' '}
              <strong>{tooltipData.name}</strong>
              {' '}
            </div>
            <div>
              {' '}
              Render time:
              {' '}
              {formatRenderTime(tooltipData.componentData.actualDuration)}
              {' '}
            </div>
            <div>
              State:
              {tooltipData.state}
            </div>
            <div style={scrollStyle}>
              <div className="props">
                Props:
                {makePropsPretty(tooltipData.componentData.props)}
              </div>
            </div>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
