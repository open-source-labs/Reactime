/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
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
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import LinkControls from './LinkControls';
import getLinkComponent from './getLinkComponent';
import { toggleExpanded, setCurrentTabInApp } from '../../../actions/actions';
import { useStoreContext } from '../../../store';

// const exclude = [
//   'childExpirationTime',
//   'staticContext',
//   '_debugSource',
//   'actualDuration',
//   'actualStartTime',
//   'treeBaseDuration',
//   '_debugID',
//   '_debugIsCurrentlyTiming',
//   'selfBaseDuration',
//   'expirationTime',
//   'effectTag',
//   'alternate',
//   '_owner',
//   '_store',
//   'get key',
//   'ref',
//   '_self',
//   '_source',
//   'firstBaseUpdate',
//   'updateQueue',
//   'lastBaseUpdate',
//   'shared',
//   'responders',
//   'pending',
//   'lanes',
//   'childLanes',
//   'effects',
//   'memoizedState',
//   'pendingProps',
//   'lastEffect',
//   'firstEffect',
//   'tag',
//   'baseState',
//   'baseQueue',
//   'dependencies',
//   'Consumer',
//   'context',
//   '_currentRenderer',
//   '_currentRenderer2',
//   'mode',
//   'flags',
//   'nextEffect',
//   'sibling',
//   'create',
//   'deps',
//   'next',
//   'destroy',
//   'parentSub',
//   'child',
//   'key',
//   'return',
//   'children',
//   '$$typeof',
//   '_threadCount',
//   '_calculateChangedBits',
//   '_currentValue',
//   '_currentValue2',
//   'Provider',
//   '_context',
//   'stateNode',
//   'elementType',
//   'type',
// ];

const defaultMargin = {
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
  const [Tooltip, setTooltip] = useState(false);
  const [selectedNode, setSelectedNode] = useState('root');
  const [, dispatch] = useStoreContext();

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
    minHeight: '20px',
    maxHeight: '200px',
    overflowY: 'scroll',
    overflowWrap: 'break-word',
  };

  const formatRenderTime = (time: number): string => {
    const renderTime = time.toFixed(3);
    return `${renderTime} ms `;
  };

  const formatProps = (data) => {
    console.log('ComponentMap', { data });
    const propsFormat = [];
    // const nestedObj = [];
    for (const key in data) {
      if (
        // data[key] !== 'reactFiber' &&
        typeof data[key] !== 'object'
        // exclude.includes(key) !== true
      ) {
        propsFormat.push(<p className='stateprops'>{`${key}: ${data[key]}`}</p>);
      }
      // else if (
      // data[key] !== 'reactFiber' &&
      // typeof data[key] === 'object'
      // exclude.includes(key) !== true
      // ) {
      // const result = formatProps(data[key]);
      // nestedObj.push(result);
      // }
    }
    // if (nestedObj) {
    //   propsFormat.push(nestedObj);
    // }
    if (propsFormat.length) return propsFormat;
  };

  const formatContext = (data) => {
    const contextFormat = [];
    // const nestedObj = [];
    for (const key in data) {
      contextFormat.push(<p className='statecontext'>{`${key}: ${data[key]}`}</p>);
    }
    return contextFormat;
  };

  const formatState = (state) => {
    if (state === 'stateless') return ['stateless'];
    return ['stateful'];
  };

  // places all nodes into a flat array
  const nodeList = [];

  const collectNodes = (node) => {
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
  const LinkComponent = getLinkComponent({ layout, linkType, orientation });
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
            setTooltip(false);
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
                  const widthFunc = (name) => {
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
                  const handleMouseAndClickOver = (event) => {
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
                            setTooltip(false);
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
                            setTooltip(false);
                          }}
                          onMouseOver={(event) => {
                            setTooltip(true);
                            handleMouseAndClickOver(event);
                          }}
                          // with onmouseOver, this produces a hover over effect for the Tooltip
                          onMouseOut={() => {
                            hideTooltip();
                            setTooltip(false);
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
          onClick={hideTooltip}
        >
          <div
            onClick={() => {
              setTooltip(false);
              hideTooltip();
            }}
          >
            <div style={{}}>
              {' '}
              <strong>{tooltipData.name}</strong>{' '}
            </div>
            <div> Render time: {formatRenderTime(tooltipData.componentData.actualDuration)} </div>
            <div className='stateTip'>
              State:
              {formatState(tooltipData.state)}
            </div>
            <div style={React.scrollStyle}>
              <div className='tooltipWrapper'>
                <h2>Props:</h2>
                {formatProps(tooltipData.componentData.props)}
              </div>
              {tooltipData.componentData.context && (
                <div className='tooltipWrapper'>
                  <h2>Context:</h2>
                  {formatContext(tooltipData.componentData.context)}
                </div>
              )}
            </div>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
