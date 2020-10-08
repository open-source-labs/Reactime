import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Cluster, hierarchy } from '@visx/hierarchy';
//import { HierarchyPointNode, HierarchyPointLink } from '@visx/hierarchy/lib/types';
import { LinkVertical } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';

const blue = '#acdbdf';
const white = '#f0ece2';

export const lightorange = '#F9D976';
const orange = '#F39F86';

const merlinsbeard = '#f7f7f3';
export const background = '#242529';
const root = '#d2f5e3';

// interface NodeShape {
//   name: string;
//   children?: NodeShape[];
//

const clusterData = {};
let memoizeObj = {};

function clusterDataPopulate(props) {
  let atomCompObj = reorganizedObj(props);

  if (props[0].name) {
    clusterData.name = props[0].name;
  }

  let counter = 0;
  for (let key in atomCompObj) {
    if (atomCompObj[key].length) {
      for (let i = 0; i < atomCompObj[key].length; i++) {
        if (!memoizeObj[key]) {
          memoizeObj[key] = [];
          if (!clusterData.children) clusterData.children = [];
          clusterData.children.push({ name: key });
        }
        if (!memoizeObj[key].includes(atomCompObj[key][i])) {
          if (!clusterData.children[counter].children)
            clusterData.children[counter].children = [];
          clusterData.children[counter].children.push({
            name: atomCompObj[key][i],
          });
        }
        memoizeObj[key].push(atomCompObj[key][i]);
      }
    }
    counter++;
  }
}

function reorganizedObj(props) {
  let atomsComponentObj = props[0].atomsComponents;
  let reorganizedObj = {};

  for (const key in atomsComponentObj) {
    for (let i = 0; i < atomsComponentObj[key].length; i++) {
      if (!reorganizedObj[atomsComponentObj[key][i]]) {
        reorganizedObj[atomsComponentObj[key][i]] = [key];
      } else {
        reorganizedObj[atomsComponentObj[key][i]].push(key);
      }
    }
  }
  return reorganizedObj;
}

function Node({ node }) {
  const isRoot = node.depth === 0;
  const isParent = !!node.children;

  if (isRoot) return <RootNode node={node} />;

  return (
    <Group top={node.y} left={node.x}>
      {node.depth !== 0 && (
        <circle
          r={12}
          fill={isParent ? white : blue}
          stroke={isParent ? white : blue}
          // onClick={() => {
          //   alert(`clicked: ${JSON.stringify(node.data.name)}`);
          // }}
        />
      )}
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        y="-20"
        style={{ pointerEvents: 'none' }}
        fill={isParent ? white : blue}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function RootNode({ node }) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.y} left={node.x}>
      <rect
        width={width}
        height={height}
        fill={root}
        y={centerY}
        x={centerX}
        rx="10"
        ry="10"
        fill="url('#top')"
      />
      <text
        dy=".33em"
        top={node.y}
        left={node.x}
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={background}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

const defaultMargin = { top: 40, left: 0, right: 0, bottom: 40 };

// export type DendrogramProps = {
//   width: number;
//   height: number;
//   margin?: { top: number; right: number; bottom: number; left: number };
// };

export default function Example({
  width,
  height,
  margin = defaultMargin,
  snapshots,
}) {
  clusterDataPopulate(snapshots);

  const data = useMemo(() => hierarchy(clusterData), []);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <LinearGradient id="top" from={lightorange} to={orange} />

      <rect width={width} height={height} rx={14} fill={background} />

      <Cluster root={data} size={[xMax, yMax]}>
        {(cluster) => (
          <Group top={margin.top} left={margin.left}>
            {cluster.links().map((link, i) => (
              <LinkVertical
                key={`cluster-link-${i}`}
                data={link}
                stroke={merlinsbeard}
                strokeWidth="1"
                strokeOpacity={0.2}
                fill="none"
              />
            ))}
            {cluster.descendants().map((node, i) => (
              <Node key={`cluster-node-${i}`} node={node} />
            ))}
          </Group>
        )}
      </Cluster>
    </svg>
  );
}
