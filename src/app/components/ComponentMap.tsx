// @ts-nocheck
import React, { useState } from 'react';
import { Group } from '@visx/group';
import { hierarchy, Tree } from '@visx/hierarchy';
import { LinearGradient } from '@visx/gradient';
import { pointRadial } from 'd3-shape';
import useForceUpdate from './useForceUpdate';
import LinkControls from './LinkControls';
import getLinkComponent from './getLinkComponent';
import { localPoint } from '@visx/event';
import { onHover, onHoverExit } from '../actions/actions';
import { useStoreContext } from '../store';

const root = hierarchy({
  name: 'root',
  children: [
    { name: 'child #1' },
    {
      name: 'child #2',
      children: [
        { name: 'grandchild #1' },
        { name: 'grandchild #2' },
        { name: 'grandchild #3' },
      ],
    },
  ],
});
interface TreeNode {
  name: string;
  isExpanded?: boolean;
  children?: TreeNode[];
}

type HierarchyNode = HierarchyPointNode<TreeNode>;

const defaultMargin = { top: 30, left: 30, right: 55, bottom: 70 };

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
  snapshots: snapshots,
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

  // Declared this variable and assigned it to the useForceUpdate function that forces a state to change causing that component to re-render and display on the map
  const forceUpdate = useForceUpdate();

  // setting the margins for the Map to render in the tab window.
  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

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

  //mousing controls
  const handleMouseOver = () => console.log("mouse entered");

  // controls for the map
  const LinkComponent = getLinkComponent({ layout, linkType, orientation });
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

      <svg width={totalWidth} height={totalHeight}>
        <LinearGradient id="links-gradient" from="#fd9b93" to="#fe6e9e" />
        <rect width={totalWidth} height={totalHeight} rx={14} fill="#242529" />
        <Group top={margin.top} left={margin.left}>
          <Tree
            root={hierarchy(data, (d) => (d.isExpanded ? null : d.children))}
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
                    stroke="#ff6569"
                    strokeWidth="1"
                    fill="none"
                  />
                ))}

                {tree.descendants().map((node, key) => {
                  const widthFunc = (name) => {
                    let nodeLength = name.length;
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

                  return (
                    <Group top={top} left={left} key={key}>
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
                      {/* This creates the rectangle boxes for each component and sets it relative position to other parent nodes of the same level.*/}
                      {node.depth !== 0 && (
                        <rect
                          height={height}
                          width={width}
                          y={-height / 2}
                          x={-width / 2}
                          fill={node.children ? '#161521' : '#62d6fb'}
                          stroke={node.children ? '#62d6fb' : '#161521'}
                          strokeWidth={1}
                          strokeDasharray={node.children ? '0' : '2,2'}
                          strokeOpacity="1"
                          rx={node.children ? 4 : 10}
                          onClick={() => {
                            node.data.isExpanded = !node.data.isExpanded;
                            forceUpdate();
                          }}
                          //check with recoil
                          onMouseOver={handleMouseOver}
                          onMouseOut={hideTooltip}
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
    </div>
  );
}
