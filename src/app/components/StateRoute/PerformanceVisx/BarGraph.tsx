// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { Text } from '@visx/text';
import { schemeSet1 } from 'd3-scale-chromatic';
import { onHover, onHoverExit, save } from '../../../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  snapshot,
  TooltipData,
  Margin,
  BarGraphProps,
  RootState,
  MainState,
} from '../../../FrontendTypes';

/* DEFAULTS */
const margin = {
  top: 30,
  right: 30,
  bottom: 0,
  left: 70,
};
const axisColor = 'var(--text-primary)';
const axisTickLabelColor = 'var(--text-secondary)';
const axisLabelColor = 'var(--text-primary)';
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  lineHeight: '18px',
  pointerEvents: 'all !important',
  padding: '8px',
  borderRadius: '8px',
};

const BarGraph = (props: BarGraphProps): JSX.Element => {
  const dispatch = useDispatch();
  const { tabs, currentTab }: MainState = useSelector((state: RootState) => state.main);

  const {
    width, // from stateRoute container
    height, // from stateRoute container
    data, // Acquired from getPerfMetrics(snapshots, getSnapshotIds(hierarchy)) in 'PerformanceVisx'
    comparison, // result from invoking 'allStorage' in 'PerformanceVisx'
    setRoute, // updates the 'route' state in 'PerformanceVisx'
    allRoutes, // array containing urls from 'PerformanceVisx'
    filteredSnapshots, // array containing url's that exist and with route === url.pathname
    snapshot, // state that is initialized to 'All Snapshots' in 'PerformanceVisx'
    setSnapshot, // updates the 'snapshot' state in 'PerformanceVisx'
  } = props;
  const [seriesNameInput, setSeriesNameInput] = useState(`Series ${comparison.length + 1}`);
  const {
    tooltipOpen, // boolean whether the tooltip state is open or closed
    tooltipLeft, // number used for tooltip positioning
    tooltipTop, // number used for tooltip positioning
    tooltipData, // value/data that tooltip may need to render
    hideTooltip, // function to close a tooltip
    showTooltip, // function to set tooltip state
  } = useTooltip<TooltipData>(); // returns an object with several properties that you can use to manage the tooltip state of your component
  let tooltipTimeout: number;
  const {
    containerRef, // Access to the container's bounding box. This will be empty on first render.
    TooltipInPortal, // TooltipWithBounds in a Portal, outside of your component DOM tree
  } = useTooltipInPortal({
    // Visx hook
    detectBounds: true, // use TooltipWithBounds
    scroll: true, // when tooltip containers are scrolled, this will correctly update the Tooltip position
  });

  const keys = Object.keys(data.componentData);
  const getSnapshotId = (d: snapshot) => d.snapshotId; // data accessor (used to generate scales) and formatter (add units for on hover box). d comes from data.barstack post filtered data
  const formatSnapshotId = (id) => `ID: ${id}`; // returns snapshot id when invoked in tooltip section
  const formatRenderTime = (time) => `${time} ms `; // returns render time when invoked in tooltip section

  const snapshotIdScale = scaleBand<string>({
    // create visualization SCALES with cleaned data
    domain: data.barStack.map(getSnapshotId),
    padding: 0.2,
  });

  const renderingScale = scaleLinear<number>({
    // Adjusts y axis to match/ bar height
    domain: [0, data.maxTotalRender],
    nice: true,
  });

  const LMcolorScale = [
    '#14b8a6', // Teal (matching existing accent)
    '#0d9488', // Darker teal (matching existing accent)
    '#3c6e71', // Primary strong teal
    '#284b63', // Primary blue
    '#2c5282', // Deeper blue
    '#1a365d', // Navy
    '#2d3748', // Blue gray
    '#4a5568', // Darker blue gray
    '#718096', // Medium blue gray
    '#a0aec0', // Light blue gray
  ];

  const colorScale = scaleOrdinal<string>({
    // Gives each bar on the graph a color using schemeSet1 imported from D3
    domain: keys,
    range: LMcolorScale,
  });

  // setting max dimensions and scale ranges
  const xMax = width - margin.left - margin.right;
  snapshotIdScale.rangeRound([0, xMax]);
  const yMax = height - margin.top - 100;
  renderingScale.range([yMax, 0]);

  const toStorage = {
    currentTab,
    title: tabs[currentTab].title,
    data,
  };

  return (
    <div className='bargraph-position'>
      <div className='saveSeriesContainer'>
        <form className='routesForm' id='routes-formcontrol'>
          <label id='routes-dropdown' htmlFor='routes-select'>
            Route:{' '}
          </label>
          <select
            className='performance-dropdown'
            labelid='demo-simple-select-label'
            id='routes-select'
            onChange={(e) => {
              setRoute(e.target.value);
              setSnapshot('All Snapshots');
              const defaultSnapShot = document.querySelector('#snapshot-select');
              defaultSnapShot.value = 'All Snapshots';
            }}
          >
            <option>All Routes</option>
            {allRoutes.map((route) => (
              <option key={route} className='routes'>
                {route}
              </option>
            ))}
          </select>
        </form>
        <form className='routesForm' id='routes-formcontrol'>
          <label id='routes-dropdown' htmlFor='snapshot-select'>
            Snapshot:{' '}
          </label>
          <select
            labelid='demo-simple-select-label'
            id='snapshot-select'
            value={snapshot}
            onChange={(e) => {
              e.preventDefault();
              setSnapshot(e.target.value);
            }}
          >
            <option value='All Snapshots'>All Snapshots</option>
            {filteredSnapshots.map((route) => (
              <option key={route.snapshotId} className='routes'>
                {route.snapshotId}
              </option>
            ))}
          </select>
        </form>
      </div>
      <svg ref={containerRef} width={width} height={height}>
        <rect className='perf-rect' x={0} y={0} width={width} height={height} rx={14} />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={snapshotIdScale}
          yScale={renderingScale}
          width={xMax}
          height={yMax}
          stroke='black'
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
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => {
                  if (Number.isNaN(bar.bar[1]) || bar.height < 0) {
                    // Hides new components if components don't exist in previous snapshots.
                    bar.height = 0;
                  }
                  return (
                    <rect
                      key={`bar-stack-${bar.bar.data.snapshotId}-${bar.key}`}
                      x={bar.x}
                      y={bar.y}
                      height={bar.height === 0 ? null : bar.height}
                      width={bar.width}
                      fill={bar.color}
                      /* TIP TOOL EVENT HANDLERS */
                      onMouseLeave={() => {
                        // Hides tool tip once cursor moves off the current rect.
                        dispatch(
                          onHoverExit(data.componentData[bar.key].rtid),
                          (tooltipTimeout = window.setTimeout(() => {
                            hideTooltip();
                          }, 300)),
                        );
                      }}
                      onMouseMove={(event) => {
                        // Cursor position in window updates position of the tool tip.
                        dispatch(onHover(data.componentData[bar.key].rtid));
                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                        let top;
                        if (snapshot === 'All Snapshots') {
                          top = event.clientY - margin.top - bar.height;
                        } else {
                          top = event.clientY - margin.top;
                        }

                        const left = bar.x + bar.width / 2;
                        showTooltip({
                          tooltipData: bar,
                          tooltipTop: top,
                          tooltipLeft: left,
                        });
                      }}
                    />
                  );
                }),
              )
            }
          </BarStack>
        </Group>
        <AxisLeft
          className='BarGraphAxis'
          top={margin.top}
          left={margin.left}
          scale={renderingScale}
          stroke={axisColor}
          tickStroke={axisColor}
          strokeWidth={2}
          tickLabelProps={() => ({
            fill: axisTickLabelColor,
            fontSize: 11,
            verticalAnchor: 'middle',
            textAnchor: 'end',
          })}
        />
        <AxisBottom
          className='BarGraphAxis'
          top={yMax + margin.top}
          left={margin.left}
          scale={snapshotIdScale}
          stroke={axisColor}
          tickStroke={axisColor}
          strokeWidth={2}
          tickLabelProps={() => ({
            fill: axisTickLabelColor,
            fontSize: 11,
            textAnchor: 'middle',
          })}
          tickFormat={() => ''} // Add this line to hide tick labels
        />
        <Text x={-yMax / 2 - 75} y='30' transform='rotate(-90)' fontSize={16} fill={axisLabelColor}>
          Rendering Time (ms)
        </Text>
        <br />
        {snapshot === 'All Snapshots' ? (
          <Text x={xMax / 2 + 15} y={yMax + 62} fontSize={16} fill={axisLabelColor}>
            Snapshot ID
          </Text>
        ) : (
          <Text x={xMax / 2 + 15} y={yMax + 62} fontSize={16} fill={axisLabelColor}>
            Components
          </Text>
        )}
      </svg>

      {/* FOR HOVER OVER DISPLAY */}
      {tooltipOpen &&
        tooltipData && ( // Ths conditional statement displays a different tooltip configuration depending on if we are trying do display a specific snapshot through options menu or all snapshots together in bargraph
          <TooltipInPortal
            key={Math.random()} // update tooltip bounds each render
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            <div
              style={{
                color: colorScale(tooltipData.key),
                paddingBottom: '8px',
              }}
            >
              {' '}
              <strong>{tooltipData.key}</strong>{' '}
            </div>
            <div> {'Render time: ' + formatRenderTime(tooltipData.bar.data[tooltipData.key])} </div>
            <div>
              {' '}
              <small>{formatSnapshotId(getSnapshotId(tooltipData.bar.data))}</small>
            </div>
          </TooltipInPortal>
        )}
    </div>
  );
};

export default BarGraph;
