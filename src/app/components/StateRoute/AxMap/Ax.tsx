import React, { useState } from 'react';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import { useTooltipInPortal } from '@visx/tooltip';
import LinkControls from './axLinkControls';
import getLinkComponent from './getAxLinkComponents';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

interface TreeNode {
  name?: {
    sources?: any[];
    type?: string;
    value?: string;
  };
  isExpanded?: boolean;
  children?: TreeNode[];
  backendDOMNodeId?: number;
  childIds?: string[];
  ignored?: boolean;
  nodeId?: string;
  ignoredReasons?: any[];
}

// example data from visx

// pulling name property value to name the node, need to adjust data pull from ax tree to reassign name if the node is ignored

const data: TreeNode = {
  name: {
    sources: [{ attribute: 'aria-labelledby', type: 'relatedElement' }],
    type: 'computedString',
    value: 'Reactime MVP',
  },
  backendDOMNodeId: 1,
  childIds: ['46'],
  ignored: false,
  children: [
    {
      name: {
        sources: [{ attribute: 'aria-labelledby', type: 'relatedElement' }],
        type: 'computedString',
        value: '',
      },
      backendDOMNodeId: 7,
      childIds: ['47'],
      ignored: true,
    },
    {
      name: {
        sources: [{ attribute: 'aria-labelledby', type: 'relatedElement' }],
        type: 'computedString',
        value: 'Tic-Tac-Toe',
      },
      backendDOMNodeId: 8,
      childIds: ['48'],
      ignored: false,
    },
  ],
};

const nodeAxArr = [
  {
    name: {
      sources: [{ attribute: 'aria-labelledby', type: 'relatedElement' }],
      type: 'computedString',
      value: 'Reactime MVP',
    },
    backendDOMNodeId: 1,
    childIds: ['46'],
    ignored: false,
    children: [
      {
        name: {
          sources: [{ attribute: 'aria-labelledby', type: 'relatedElement' }],
          type: 'computedString',
          value: '',
        },
        backendDOMNodeId: 7,
        childIds: ['47'],
        ignored: true,
      },
      {
        name: {
          sources: [{ attribute: 'aria-labelledby', type: 'relatedElement' }],
          type: 'computedString',
          value: 'Tic-Tac-Toe',
        },
        backendDOMNodeId: 8,
        childIds: ['48'],
        ignored: false,
      },
    ],
  },
  {
    name: {
      sources: [{ attribute: 'aria-labelledby', type: 'relatedElement' }],
      type: 'computedString',
      value: '',
    },
    backendDOMNodeId: 7,
    childIds: ['47'],
    ignored: true,
  },
  {
    name: {
      sources: [{ attribute: 'aria-labelledby', type: 'relatedElement' }],
      type: 'computedString',
      value: 'Tic-Tac-Toe',
    },
    backendDOMNodeId: 8,
    childIds: ['48'],
    ignored: false,
  },
];

const defaultMargin = {
  top: 30,
  left: 30,
  right: 55,
  bottom: 70,
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
  const { currLocation, axSnapshots, width, height } = props;

  let margin = defaultMargin;
  let totalWidth = width;
  let totalHeight = height;

  const [layout, setLayout] = useState('cartesian');
  const [orientation, setOrientation] = useState('horizontal');
  const [linkType, setLinkType] = useState('diagonal');
  const [stepPercent, setStepPercent] = useState(0.5);

  const innerWidth: number = totalWidth - margin.left - margin.right;
  const innerHeight: number = totalHeight - margin.top - margin.bottom - 60;

  let origin: { x: number; y: number };
  let sizeWidth: number;
  let sizeHeight: number;

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

  console.log('size width height ax: ', sizeWidth, sizeHeight);

  const LinkComponent = getLinkComponent({ layout, linkType, orientation });

  const currAxSnapshot = JSON.parse(JSON.stringify(axSnapshots[currLocation.index]));
  console.log('currAxSnapshot: ', currAxSnapshot);

  // root node of currAxSnapshot
  const rootAxNode = JSON.parse(JSON.stringify(currAxSnapshot[0]));

  // // array that holds the ax tree as a nested object and the root node initially
  const nodeAxArr = [];

  //     currNode.children = [];
  //     // checks if there is more than 1 child
  //     if (currNode.childIds.length > 1) {
  //       for (let m = 0; m < currNode.childIds.length; m++) {
  //         for (let j = 0; j < currAxSnapshot.length; j++) {
  //           if (currNode.childIds.includes(currAxSnapshot[j].nodeId)) {
  //             currNode.children.push(currAxSnapshot[j]);
  //           }
  //         }
  //       }
  //     } else if (currNode.childIds.length === 1) {
  //       for (let j = 0; j < currAxSnapshot.length; j++) {
  //         if (currNode.childIds.includes(currAxSnapshot[j].nodeId)) {
  //           currNode.children.push(currAxSnapshot[j]);
  //         }
  //       }
  //       organizeAxTree(currNode.children[0], currAxSnapshot);
  //     }
  //     organizeAxTree(currNode.children, currAxSnapshot);
  //   }

  // organizeAxTree([rootAxNode], currAxSnapshot);
  const organizeAxTree = (currNode, currAxSnapshot) => {
    if (currNode.childIds && currNode.childIds.length > 0) {
      currNode.children = [];
      for (let j = 0; j < currAxSnapshot.length; j++) {
        for (const childEle of currNode.childIds) {
          if (childEle === currAxSnapshot[j].nodeId) {
            currNode.children.push(currAxSnapshot[j]);
            organizeAxTree(currAxSnapshot[j], currAxSnapshot);
          }
        }
      }
    }
  };

  organizeAxTree(rootAxNode, currAxSnapshot);

  console.log('rootAxNode: ', rootAxNode);

  // store each individual node, now with children property in nodeAxArr
  // need to consider order, iterate through the children property first?
  const populateNodeAxArr = (currNode) => {
    nodeAxArr.splice(0, nodeAxArr.length);
    nodeAxArr.push(currNode);
    for (let i = 0; i < nodeAxArr.length; i += 1) {
      // iterate through the nodeList that contains our snapshot
      const cur = nodeAxArr[i];
      if (cur.children && cur.children.length > 0) {
        // if the currently itereated snapshot has non-zero children...
        for (const child of cur.children) {
          // iterate through each child in the children array
          nodeAxArr.push(child); // add the child to the nodeList
        }
      }
    }
  };

  populateNodeAxArr(rootAxNode);
  console.log('nodeAxArr: ', nodeAxArr);

  const {
    containerRef, // Access to the container's bounding box. This will be empty on first render.
  } = useTooltipInPortal({
    // Visx hook
    detectBounds: true, // use TooltipWithBounds
    scroll: true, // when tooltip containers are scrolled, this will correctly update the Tooltip position
  });

  return totalWidth < 10 ? null : (
    <div>
      <LinkControls
        layout={layout}
        orientation={orientation}
        linkType={linkType}
        stepPercent={stepPercent}
        setLayout={setLayout}
        setOrientation={setOrientation}
        setLinkType={setLinkType}
        setStepPercent={setStepPercent}
      />

      {/* svg references purple background */}
      <svg ref={containerRef} width={totalWidth} height={totalHeight + 0}>
        <LinearGradient id='root-gradient' from='#488689' to='#3c6e71' />
        <LinearGradient id='parent-gradient' from='#488689' to='#3c6e71' />
        <rect
          className='componentMapContainer'
          width={sizeWidth / aspect}
          height={sizeHeight / aspect + 0}
          rx={14}
        />
        <Group transform={`scale(${aspect})`} top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(nodeAxArr[0], (d) => (d.isExpanded ? null : d.children))}
            size={[sizeWidth / aspect, sizeHeight / aspect]}
            separation={(a, b) => (a.parent === b.parent ? 0.5 : 0.5) / a.depth}
          >
            {(tree) => (
              <Group top={origin.y + 35} left={origin.x + 50 / aspect}>
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
                // code relating to each node in tree
                {tree.descendants().map((node, key) => {
                  const widthFunc = (name): number => {
                    //returns a number that is related to the length of the name. Used for determining the node width.
                    const nodeLength = name.length;
                    //return nodeLength * 7 + 20; //uncomment this line if we want each node to be directly proportional to the name.length (instead of nodes of similar sizes to snap to the same width)
                    if (nodeLength <= 5) return nodeLength + 60;
                    if (nodeLength <= 10) return nodeLength + 130;
                    return nodeLength + 160;
                  };

                  const width: number = widthFunc(node.data.name.value); // the width is determined by the length of the node.name
                  const height: number = 25;
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
                    aspect = Math.max(aspect, 0.2);
                  }

                  return (
                    <Group top={top} left={left} key={key} className='rect'>
                      {node.depth === 0 && (
                        <rect
                          className={node.children ? 'compMapParent' : 'compMapChild'}
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          fill="url('#parent-gradient')"
                          strokeWidth={1.5}
                          strokeOpacity='1'
                          rx={node.children ? 4 : 10}
                          onClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
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
                          fill="url('#parent-gradient')"
                          //color={'#ff0000'}
                          //fill={node.children ? nodeParentFill : nodeChildFill}
                          //stroke={
                          //   node.data.isExpanded && node.data.children.length > 0
                          //     ? nodeParentStroke
                          //     : nodeChildStroke
                          // }
                          strokeWidth={1.5}
                          strokeOpacity='1'
                          rx={node.children ? 4 : 10}
                          onClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
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
                        //fill={node.depth === 0 ? '#161521' : node.children ? 'white' : '#161521'}
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
    </div>
  );
}
