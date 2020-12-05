// @ts-nocheck
import React, { useState } from 'react';
import { BarStack } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { Text } from '@visx/text';
import { schemeSet3 } from 'd3-scale-chromatic';
import snapshots from './snapshots';
import { onHover, onHoverExit } from '../actions/actions';
import { useStoreContext } from '../store'

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
interface margin { top: number; right: number; bottom: number; left: number };

interface TooltipData {
  bar: SeriesPoint<snapshot>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
}

interface data {
  snapshotId?: string;
}

// typescript for PROPS from StateRoute.tsx
interface BarStackProps {
  width: number;
  height: number;
  snapshots: [];
  hierarchy: any;
}
interface snapshot {
  snapshotId?: string;
  children: [];
  componentData: any;
  name: string;
  state: string;
}

/* DEFAULTS */
const margin = { top: 60, right: 30, bottom: 0, left: 50 };
const axisColor = '#62d6fb';
const background = '#242529';
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
  fontSize: '14px',
  lineHeight: '18px',
  fontFamily: 'Roboto'
};

/* DATA HANDLING HELPER FUNCTIONS */
const traverse = (snapshot, data, currMaxTotalRender = 0) => {
  if (!snapshot.children[0]) return;
  // data.maxTotalRender
  // loop through snapshots
  snapshot.children.forEach((child, idx) => {
    const componentName = child.name + -[idx + 1];

    // Get component Rendering Time
    const renderTime = Number(Number.parseFloat(child.componentData.actualDuration).toPrecision(5));
    // sums render time for all children
    currMaxTotalRender += renderTime;
    // components as keys and set the value to their rendering time 
    data['barStack'][data.barStack.length - 1][componentName] = renderTime; 
    
    // Get component stateType
    if (!data.componentData[componentName]) {
      data.componentData[componentName] = {
        stateType: 'stateless',
        renderFrequency: 0,
        totalRenderTime: 0,
        rtid: ''
      };
      if (child.state !== 'stateless') data.componentData[componentName].stateType = 'stateful';
    }
    // increment render frequencies
    if (renderTime > 0) {
      data.componentData[componentName].renderFrequency++;
    }

   // add to total render time
    data.componentData[componentName].totalRenderTime += renderTime;
    // Get rtid for the hovering feature 
    data.componentData[componentName].rtid = child.rtid;
    traverse(snapshot.children[idx], data, currMaxTotalRender);
  })
  // reassigns total render time to max render time
  data.maxTotalRender = Math.max(currMaxTotalRender, data.maxTotalRender);
  return data;
};

const getSnapshotIds = (obj, snapshotIds = []): string[] => {
  snapshotIds.push(`${obj.name}.${obj.branch}`);
  if (obj.children) {
    obj.children.forEach(child => {
      getSnapshotIds(child, snapshotIds);
    });
  }
  return snapshotIds;
};

// Returns array of snapshot objs each with components and corresponding render times
const getPerfMetrics = (snapshots, snapshotsIds): any[] => {
  const perfData = {
    barStack: [],
    componentData: {},
    maxTotalRender: 0
  };
  snapshots.forEach((snapshot, i) => {
    perfData.barStack.push({snapshotId: snapshotsIds[i]});
    traverse(snapshot, perfData);
  });
  return perfData;
};

/* EXPORT COMPONENT */
const PerformanceVisx = (props: BarStackProps) => {
  // hook used to dispatch onhover action in rect
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { width, height, snapshots, hierarchy } = props;

  const {
    tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip,
  } = useTooltip<TooltipData>();
  let tooltipTimeout: number;
  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  // filter and structure incoming data for VISX
  const data = getPerfMetrics(snapshots, getSnapshotIds(hierarchy));
  const keys = Object.keys(data.componentData);

  // data accessor (used to generate scales) and formatter (add units for on hover box)
  const getSnapshotId = (d: snapshot) => d.snapshotId;
  const formatSnapshotId = (id) => `Snapshot ID: ${id}`;
  const formatRenderTime = (time) => `${time} ms `;

  // create visualization SCALES with cleaned data
  const snapshotIdScale = scaleBand<string>({
    domain: data.barStack.map(getSnapshotId),
    padding: 0.2,
  });

  const renderingScale = scaleLinear<number>({
    domain: [0, data.maxTotalRender],
    nice: true,
  });

  const colorScale = scaleOrdinal<string>({
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
          <BarStack
            data={data.barStack}
            keys={keys}
            x={getSnapshotId}
            xScale={snapshotIdScale}
            yScale={renderingScale}
            color={colorScale}
          >
            {barStacks =>
              barStacks.map(barStack =>
                barStack.bars.map(((bar, idx) => {
                  // hides new components if components don't exist in previous snapshots
                  if (Number.isNaN(bar.bar[1])) {
                    console.log('bar is NaN: ', bar.bar);
                    bar.height = 0;
                  }
                  return (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height === 0 ? null : bar.height}
                    width={bar.width}
                    fill={bar.color}
                    /* TIP TOOL EVENT HANDLERS */
                    // Hides tool tip once cursor moves off the current rect
                    onMouseLeave={() => {
                      console.log('bar: ', bar)
                      dispatch(onHoverExit(data.componentData[bar.key].rtid),
                        tooltipTimeout = window.setTimeout(() => {
                          hideTooltip()
                        }, 300))
                    }}
                    // Cursor position in window updates position of the tool tip
                    onMouseMove={event => {
                      dispatch(onHover(data.componentData[bar.key].rtid))
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
                )}))
              )
            }
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
            fill: 'rgb(231, 231, 231)',
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
            fill: 'rgb(231, 231, 231)',
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
        <Text x={-xMax / 2} y="15" transform="rotate(-90)" fontSize={12} fill="#FFFFFF"> Rendering Time (ms) </Text>
        <Text x={xMax / 2} y={yMax + 100} fontSize={12} fill="#FFFFFF"> Snapshot Id </Text>
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
          <div>{data.componentData[tooltipData.key].stateType}</div>
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
