import React from "react";
import { BarStack } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
// import { LegendOrdinal } from "@visx/legend";
import { Text } from '@visx/text';
import { schemeSet1,schemeSet3 } from "d3-scale-chromatic";
// import snapshots from "./snapshots";
import useForceUpdate from './useForceUpdate';


/* TYPESCRIPT */
type snapshot = any;
type TooltipData = {
  bar: SeriesPoint<snapshot>;
  key: CityName;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
};

export type BarStackProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  events?: boolean;
  snapshots?: any;
  hierarchy?: any;
};

/* DEFAULT STYLING */
const axisColor = '#679DCA';
const background = "#242529";
const defaultMargin = { top: 60, right: 30, bottom: 0, left: 50 };
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: "rgba(0,0,0,0.9)",
  color: "white"
};

/* DATA PREP FUNCTIONS */
const getPerfMetrics = (snapshots, snapshotsIds) => {
  return snapshots.reduce((perfSnapshots, curSnapshot,idx)=> {
    return perfSnapshots.concat(traverse(curSnapshot, {snapshotId:snapshotsIds[idx]}))
  }, [])
}

const traverse = (snapshot, perfSnapshot) => {
  if (!snapshot.children[0]) return
  for (let i = 0; i < snapshot.children.length; i++){
    if (snapshot.children[i].componentData.actualDuration){
    const renderTime = Number(Number.parseFloat(snapshot.children[i].componentData.actualDuration).toPrecision(5))
    perfSnapshot[snapshot.children[i].name+-[i+1]] = renderTime
    }
    traverse(snapshot.children[i], perfSnapshot)
  }
  return perfSnapshot
}

const getSnapshotIds = (obj, snapshotIds = []) => {
  snapshotIds.push(`${obj.name}.${obj.branch}`);
if (obj.children) {
  obj.children.forEach(child => {
    getSnapshotIds(child, snapshotIds);
  });
}
return snapshotIds
};

/* EXPORT COMPONENT */
export default function PerformanceVisx({
  width,
  height,
  events = false,
  margin = defaultMargin,
  snapshots,
  hierarchy,
}: BarStackProps)

{
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip
  } = useTooltip<TooltipData>();

let tooltipTimeout: number;

// filter and structure incoming data for VISX 
const data = getPerfMetrics(snapshots, getSnapshotIds(hierarchy))
const keys = Object.keys(data[0]).filter((d) => d !== "snapshotId") as CityName[];
console.log(data)

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
const formatSnapshotId = id => 'Snapshot ID: ' + id;  
const formatRenderTime = time => time + ' ms ';

// create visualization scales with filtered data 
const snapshotIdScale = scaleBand<string>({
  domain: data.map(getSnapshotId),
  padding: 0.2
});

const renderingScale = scaleLinear<number>({
  domain: [0, Math.max(...totalRenderArr)],
  nice: true
});

const colorScale = scaleOrdinal<CityName, string>({
  domain: keys,
  range: schemeSet3
});

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

// setting max dimensions and scale ranges
if (width < 10) return null;
const xMax = width - margin.left - margin.right
const yMax = height - margin.top - 150;
snapshotIdScale.rangeRound([0, xMax]);
renderingScale.range([yMax, 0]);

  return width < 10 ? null : (
  // relative position is needed for correct tooltip positioning

    <div style={{ position: "relative" }}>
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
            {(barStacks) => barStacks.map(barStack => barStack.bars.map((bar => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    /* TIP TOOL EVENT HANDLERS */
                    onClick={() => {
                      if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                    }}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip();
                      }, 300);
                    }}
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
                )),
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
          fill: axisColor,
          fontSize: 11,
          verticalAnchor: 'middle',
          textAnchor: 'end'
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
        <Text x={-xMax / 2} y="15"  transform="rotate(-90)" fontSize={10} fill="#FFFFFF">
        Rendering Time (ms)
        </Text>
        <Text x={xMax / 2} y={yMax + 100} fontSize={10} fill="#FFFFFF">
        Snapshot Id
        </Text> 
        
      </svg>
      
      {/* <div
        style={{
          position: "absolute",
          top: margin.top / 2 - 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          fontSize: "14px"
        }}
      >
        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
        />
      </div> */}

      {/* FOR HOVER OVER DISPLAY */}
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          key={Math.random()} // update tooltip bounds each render
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div style={{ color: colorScale(tooltipData.key) }}>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>
            {formatRenderTime(tooltipData.bar.data[tooltipData.key])}
          </div>
          <div>
            <small>{formatSnapshotId(getSnapshotId(tooltipData.bar.data))}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
