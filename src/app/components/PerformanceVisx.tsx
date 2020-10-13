import React from "react";
import { BarStack } from "@visx/shape";
import { SeriesPoint } from "@visx/shape/lib/types";
import { Group } from "@visx/group";
import { Grid } from "@visx/grid";
import { AxisBottom } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { useTooltip, useTooltipInPortal, defaultStyles } from "@visx/tooltip";
// import { LegendOrdinal } from "@visx/legend";
import { schemeSet1,schemeSet3 } from "d3-scale-chromatic";
// import snapshots from "./snapshots";


/* TYPESCRIPT */
type CityName = "New York" | "San Francisco" | "Austin";
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
const purple1 = "#6c5efb";
const purple2 = "#c998ff";
const purple4 = "#00ffff ";
const purple3 = "#a44afe";
const tickColor = '#679DCA';
const background = "#242529";
const defaultMargin = { top: 40, right: 0, bottom: 0, left: 0 };
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

    /* DATA PREP */
    // const data = getPerfMetrics(snapshots);
    const data = getPerfMetrics(snapshots, getSnapshotIds(hierarchy))
    console.log(data)

  // array of all object keys
const keys = Object.keys(data[0]).filter((d) => d !== "snapshotId") as CityName[];

// ARRAY OF TOTAL VALUES PER SNAPSHOT
const temperatureTotals = data.reduce((allTotals, currentDate) => {
  const totalTemperature = keys.reduce((dailyTotal, k) => {
    dailyTotal += Number(currentDate[k]);
    return dailyTotal;
  }, 0);
  allTotals.push(totalTemperature);
  return allTotals;
}, [] as number[]);

const temperatureScale = scaleLinear<number>({
  domain: [0, Math.max(...temperatureTotals)],
  nice: true
});
const colorScale = scaleOrdinal<CityName, string>({
  domain: keys,
  range: schemeSet3
});

let tooltipTimeout: number;


/*  ACCESSORS */
const getSnapshot = (d: snapshot) => d.snapshotId;

/* SCALE */
const dateScale = scaleBand<string>({
  domain: data.map(getSnapshot),
  padding: 0.2
});

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  if (width < 10) return null;
  // bounds

  //  width, height
  const xMax = width;
  const yMax = height - margin.top - 100;

  dateScale.rangeRound([0, xMax]);
  temperatureScale.range([yMax, 0]);

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
          xScale={dateScale}
          yScale={temperatureScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={dateScale.bandwidth() / 2}
        />
        <Group top={margin.top}>
          <BarStack <snapshot, CityName>
            data={data}
            keys={keys}
            x={getSnapshot}
            xScale={dateScale}
            yScale={temperatureScale}
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
        <AxisBottom
          top={yMax + margin.top}
          scale={dateScale}
          // tickFormat={formatDate}
          stroke={tickColor}
          tickStroke={tickColor}
          tickLabelProps={() => ({
            fill: tickColor,
            fontSize: 11,
            textAnchor: 'middle',
          })}
        />
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
            {tooltipData.bar.data[tooltipData.key]}
          </div>
          <div>
            <small>{getSnapshot(tooltipData.bar.data)}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}
