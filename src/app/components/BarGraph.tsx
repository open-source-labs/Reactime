// @ts-nocheck
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
import { onHover, onHoverExit } from '../actions/actions';
import { useStoreContext } from '../store';
import { save } from '../actions/actions';

/* TYPESCRIPT */
interface data {
  snapshotId?: string;
}

interface margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface snapshot {
  snapshotId?: string;
  children: [];
  componentData: any;
  name: string;
  state: string;
}

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

/* DEFAULTS */
const margin = { top: 30, right: 30, bottom: 0, left: 50 };
const axisColor = '#62d6fb';
const background = '#242529';
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
  fontSize: '14px',
  lineHeight: '18px',
  fontFamily: 'Roboto',
};

const BarGraph = (props) => {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { width, height, data } = props;
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();
  let tooltipTimeout: number;
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });
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
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - 150;
  snapshotIdScale.rangeRound([0, xMax]);
  renderingScale.range([yMax, 0]);

  const toStorage = {
    currentTab,
    title: tabs[currentTab]['title'],
    data,
  };

  const animateButton = function (e) {
    e.preventDefault;
    e.target.classList.add('animate');
    e.target.innerHTML = 'Saved!';
    setTimeout(function () {
      e.target.innerHTML = 'Save Series';
      e.target.classList.remove('animate');
    }, 1000);
  };
  const classname = document.getElementsByClassName('save-series-button');
  for (let i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', animateButton, false);
  }
  return (
    <div>
      <button
        className="save-series-button"
        onClick={(e) => {
          dispatch(save(toStorage));
        }}
      >
        Save Series
      </button>
      <svg ref={containerRef} width={width} height={height}>
        {}
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
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar, idx) => {
                  // Hides new components if components don't exist in previous snapshots.
                  if (Number.isNaN(bar.bar[1]) || bar.height < 0) {
                    bar.height = 0;
                  }
                  return (
                    <rect
                      key={`bar-stack-${barStack.id}-${bar.id}`}
                      x={bar.x}
                      y={bar.y}
                      height={bar.height === 0 ? null : bar.height}
                      width={bar.width}
                      fill={bar.color}
                      /* TIP TOOL EVENT HANDLERS */
                      // Hides tool tip once cursor moves off the current rect.
                      onMouseLeave={() => {
                        dispatch(
                          onHoverExit(data.componentData[bar.key].rtid),
                          (tooltipTimeout = window.setTimeout(() => {
                            hideTooltip();
                          }, 300))
                        );
                      }}
                      // Cursor position in window updates position of the tool tip.
                      onMouseMove={(event) => {
                        dispatch(onHover(data.componentData[bar.key].rtid));
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
                  );
                })
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
        <Text
          x={-xMax / 2}
          y="15"
          transform="rotate(-90)"
          fontSize={12}
          fill="#FFFFFF"
        >
          Rendering Time (ms)
        </Text>
        <br />
        <Text x={xMax / 2 + 15} y={yMax + 70} fontSize={12} fill="#FFFFFF">
          Snapshot ID
        </Text>
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
            <strong>{tooltipData.key}</strong>{' '}
          </div>
          <div>{data.componentData[tooltipData.key].stateType}</div>
          <div> {formatRenderTime(tooltipData.bar.data[tooltipData.key])} </div>
          <div>
            {' '}
            <small>
              {formatSnapshotId(getSnapshotId(tooltipData.bar.data))}
            </small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
};

export default BarGraph;
