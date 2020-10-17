import React from 'react';
import { BarStack } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { Text } from '@visx/text';
import { schemeSet3 } from 'd3-scale-chromatic';

/* NOTES
Issue - Not fully compatible with recoil apps. Reference the recoil-todo-test.
Barstacks display inconsistently...however, almost always displays upon initial test app load or
when empty button is clicked. Updating state after initial app load typically makes bars disappear.
However, cycling between updating state and then emptying sometimes fixes the stack bars. Important
to note - all snapshots do render (check HTML doc) within the chrome extension but they do
not display because height is not consistently passed to each bar. This side effect is only
seen in recoil apps...
 */

/* TYPESCRIPT */
type snapshot = any;

interface margin { top: number; right: number; bottom: number; left: number };

interface TooltipData {
  bar: SeriesPoint<snapshot>;
  key: CityName;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
}

// typescript for PROPS from StateRoute.tsx
interface BarStackProps {
  width: number;
  height: number;
  snapshots: [];
  hierarchy: any;
}

/* DEFAULTS */
const margin = { top: 60, right: 30, bottom: 0, left: 50 };
const axisColor = '#679DCA';
const background = '#242529';
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};

/* DATA HANDLING HELPER FUNCTIONS */

// traverses a snapshot - returns all rendering times OR component state types. Depends on 2nd arg
const traverse = (snapshot, data = {}) => {
  if (!snapshot.children[0]) return;
  for (let i = 0; i < snapshot.children.length; i++) {
    const componentName = snapshot.children[i].name + -[i + 1];
    // Get component Type
    if (!data.snapshotId) {
      if (snapshot.children[i].state !== 'stateless') data[componentName] = 'STATEFUL';
      else data[componentName] = snapshot.children[i].state;
    }
    // Get component Rendering Time
    else if (snapshot.children[i].componentData.actualDuration) {
      const renderTime = Number(Number.parseFloat(snapshot.children[i].componentData.actualDuration).toPrecision(5));
      data[componentName] = renderTime;
    }
    traverse(snapshot.children[i], data);
  }
  return data;
};

const getSnapshotIds = (obj, snapshotIds = []) => {
  snapshotIds.push(`${obj.name}.${obj.branch}`);
  if (obj.children) {
    obj.children.forEach(child => {
      getSnapshotIds(child, snapshotIds);
    });
  }
  return snapshotIds;
};

// Returns array of snapshot objs each with components and corresponding render times
const getPerfMetrics = (snapshots, snapshotsIds) => {
  snapshots.reduce((perfSnapshots, curSnapshot, idx) => {
    perfSnapshots.concat(traverse(curSnapshot, { snapshotId: snapshotsIds[idx] }));
  }, []);
};

/* EXPORT COMPONENT */

const PerformanceVisx = (props: BarStackProps) => {

  const { width, height, snapshots, hierarchy } = props;

  const {
    tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip,
  } = useTooltip<TooltipData>();

  let tooltipTimeout: number;

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  // filter and structure incoming data for VISX
  const data = getPerfMetrics(snapshots, getSnapshotIds(hierarchy));
  const keys = Object.keys(data[0]).filter(d => d !== 'snapshotId') as CityName[];
  const allComponentStates = traverse(snapshots[0]);

  console.log(snapshots);
  console.log(hierarchy);
  console.log('margin', margin);

  // create array of total render times for each snapshot
  const totalRenderArr = data.reduce((totalRender, curSnapshot) => {
    const curRenderTotal = keys.reduce((acc, cur) => {
      acc += Number(curSnapshot[cur]);
      return acc;
    }, 0);
    totalRender.push(curRenderTotal);
    return totalRender;
  }, [] as number[]);

  // data accessor (used to generate scales) and formatter (add units for on hover box)
  const getSnapshotId = (d: snapshot) => d.snapshotId;
  const formatSnapshotId = id => `Snapshot ID: ${id}`;
  const formatRenderTime = time => `${time} ms `;

  // create visualization SCALES with cleaned data
  const snapshotIdScale = scaleBand<string>({
    domain: data.map(getSnapshotId),
    padding: 0.2,
  });

  const renderingScale = scaleLinear<number>({
    domain: [0, Math.max(...totalRenderArr)],
    nice: true,
  });

  const colorScale = scaleOrdinal<CityName, string>({
    domain: keys,
    range: schemeSet3,
  });

  // setting max dimensions and scale ranges
  if (width < 10) return null;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - 150;
  snapshotIdScale.rangeRound([0, xMax]);
  renderingScale.range([yMax, 0]);

  // if performance tab is too small it will not return VISX component
  return width < 10 ? null : (

    <div style={{ position: 'relative' }}>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={background}
          rx={14}
        />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={snapshotIdScale}
          yScale={renderingScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={snapshotIdScale.bandwidth() / 2}
        />
        <Group top={margin.top} left={margin.left}>
          <BarStack <snapshot, CityName>
            data={data}
            keys={keys}
            x={getSnapshotId}
            xScale={snapshotIdScale}
            yScale={renderingScale}
            color={colorScale}
          >
            {barStacks => barStacks.map(barStack => barStack.bars.map(((bar, idx) => (
              <rect
                key={`bar-stack-${barStack.index}-${bar.index}`}
                x={bar.x}
                y={bar.y}
                height={bar.height === 0 ? idx + 1 : bar.height}
                width={bar.width}
                fill={bar.color}
                    /* TIP TOOL EVENT HANDLERS */
                    // Hides tool tip once cursor moves off the current rect
                onMouseLeave={() => {
                  tooltipTimeout = window.setTimeout(() => {
                    hideTooltip();
                  }, 300);
                }}
                    // Cursor position in window updates position of the tool tip
                onMouseMove={event => {
                  if (tooltipTimeout) clearTimeout(tooltipTimeout);
                  const top = event.clientY - margin.top - bar.height;
                  const left = bar.x + bar.width / 2;
                  showTooltip({
                    tooltipData: bar,
                    tooltipTop: top,
                    tooltipLeft: left,
                  });
                }}
              />
            ))))}
          </BarStack>
        </Group>
        <AxisLeft
          top={margin.top}
          left={margin.left}
          scale={renderingScale}
          stroke={axisColor}
          tickStroke={axisColor}
          strokeWidth={2}
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 11,
            verticalAnchor: 'middle',
            textAnchor: 'end',
          })}
        />
        <AxisBottom
          top={yMax + margin.top}
          left={margin.left}
          scale={snapshotIdScale}
          stroke={axisColor}
          tickStroke={axisColor}
          strokeWidth={2}
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
        <Text x={-xMax / 2} y="15" transform="rotate(-90)" fontSize={10} fill="#FFFFFF"> Rendering Time (ms) </Text>
        <Text x={xMax / 2} y={yMax + 100} fontSize={10} fill="#FFFFFF"> Snapshot Id </Text>
      </svg>

      {/* FOR HOVER OVER DISPLAY */}
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()} // update tooltip bounds each render
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ color: colorScale(tooltipData.key) }}>
            {' '}
            <strong>{tooltipData.key}</strong>
            {' '}
          </div>
          <div>{allComponentStates[tooltipData.key]}</div>
          <div>
            {' '}
            {formatRenderTime(tooltipData.bar.data[tooltipData.key])}
            {' '}
          </div>
          <div>
            {' '}
            <small>{formatSnapshotId(getSnapshotId(tooltipData.bar.data))}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
};

export default PerformanceVisx;
