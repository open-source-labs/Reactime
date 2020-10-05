import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { Cluster, hierarchy } from '@visx/hierarchy';
//import { HierarchyPointNode, HierarchyPointLink } from '@visx/hierarchy/lib/types';
import { LinkVertical } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';

const citrus = '#ddf163';
const white = '#ffffff';
export const green = '#79d259';
const aqua = '#37ac8c';
const merlinsbeard = '#f7f7f3';
export const background = '#306c90';

// interface NodeShape {
//   name: string;
//   children?: NodeShape[];
// }

const clusterData = {
  name: '$',
  children: [
    {
      name: 'A',
      children: [
        { name: 'A1' },
        { name: 'A2' },
        {
          name: 'C',
          children: [
            {
              name: 'C1',
            },
          ],
        },
      ],
    },
    {
      name: 'B',
      children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }],
    },
    {
      name: 'X',
      children: [
        {
          name: 'Z',
        },
      ],
    },
  ],
};

function Node({ node }) {
  const isRoot = node.depth === 0;
  const isParent = !!node.children;

  if (isRoot) return <RootNode node={node} />;

  return (
    <Group top={node.y} left={node.x}>
      {node.depth !== 0 && (
        <circle
          r={12}
          fill={background}
          stroke={isParent ? white : citrus}
          onClick={() => {
            alert(`clicked: ${JSON.stringify(node.data.name)}`);
          }}
        />
      )}
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={isParent ? white : citrus}
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
      <rect width={width} height={height} y={centerY} x={centerX} fill="url('#top')" />
      <text
        dy=".33em"
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

const defaultMargin = { top: 40, left: 50, right: 50, bottom: 40 };

// export type DendrogramProps = {
//   width: number;
//   height: number;
//   margin?: { top: number; right: number; bottom: number; left: number };
// };

export default function Example({ width, height, margin = defaultMargin }) {
  const data = useMemo(() => hierarchy(clusterData), []);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <LinearGradient id="top" from={green} to={aqua} />
      <rect width={width} height={height} rx={14} fill={background} />
      <Cluster root={data} size={[xMax, yMax]}>
        {cluster => (
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
  )};
