// @ts-nocheck
import React, { useEffect } from 'react';
import { BarStack } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { Text } from '@visx/text';

import { schemeSet3 } from 'd3-scale-chromatic';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import snapshots from './snapshots';
import { onHover, onHoverExit } from '../actions/actions';
import { useStoreContext } from '../store';
import { save } from '../actions/actions';
/* TYPESCRIPT */
interface data {
  snapshotId?: string;
}
interface series {
  seriesId?: any;
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

// On-hover data.
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

const BarGraphComparison = (props) => {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { width, height, data, comparison } = props;

  const [series, setSeries] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [maxRender, setMaxRender] = React.useState(data.maxTotalRender);

  // console.log('comparison >>>', comparison);
  // console.log('tabs[currentTab] >>>', tabs[currentTab]);
  // console.log('props in comparison graph >>>', props);
  // console.log('data >>>>>', data);
  // change scale of graph based on clicking of forward and backwards buttons effect
  // useEffect(() => {
  //   console.log('setSeries is changing everytime currentIndex changes');
  //   //change the state with setChangeSeries
  //   setSeries(tabs[currentTab].sliderIndex);
  // }, [tabs[currentTab].sliderIndex]);

  // console.log('tabs in Bargraphs comparison >>', tabs);
  function titleFilter(comparisonArray) {
    return comparisonArray.filter(
      (elem) => elem.title === tabs[currentTab].title
    );
  }
  // console.log('tabs in BGComp >>>', tabs);
  const currentIndex = tabs[currentTab].sliderIndex;
  // console.log('sliderIndx outside of bargraph >>>', currentIndex);
  const {
    tooltipOpen,
    tooltipLeft,
    tooltipTop,
    tooltipData,
    hideTooltip,
    showTooltip,
  } = useTooltip<TooltipData>();
  let tooltipTimeout: number;

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  const keys = Object.keys(data.componentData);

  // data accessor (used to generate scales) and formatter (add units for on hover box)
  const getSnapshotId = (d: snapshot) => d.snapshotId;
  const formatSnapshotId = (id) => `Snapshot ID: ${id}`;
  const formatRenderTime = (time) => `${time} ms `;

  // create visualization SCALES with cleaned data
  const snapshotIdScale = scaleBand<string>({
    // domain: getSnapshotId(data.barStack[currentIndex]),
    // domain: [currentTab, comparison[series].currentTab],
    domain: [
      `Current Tab Series`,
      `Series ${!comparison[series] ? null : series + 1}`,
    ],
    padding: 0.2,
  });

  const calculateMaxTotalRender = (series) => {
    const currentSeriesBarStacks = !comparison[series]
      ? []
      : comparison[series].data.barStack;
    if (currentSeriesBarStacks.length === 0) return 0;
    let currentMax = -Infinity;
    for (let i = 0; i < currentSeriesBarStacks.length; i += 1) {
      const renderTimes = Object.values(currentSeriesBarStacks[i]).slice(1);
      const renderTotal = renderTimes.reduce((acc, curr) => acc + curr);
      if (renderTotal > currentMax) currentMax = renderTotal;
    }
    return currentMax;
  };

  const renderingScale = scaleLinear<number>({
    domain: [0, Math.max(calculateMaxTotalRender(series), data.maxTotalRender)],
    nice: true,
  });

  const colorScale = scaleOrdinal<string>({
    domain: keys,
    range: schemeSet3,
  });

  // console.log('rendering scale invocation', renderingScale);
  // setting max dimensions and scale ranges
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - 200;
  snapshotIdScale.rangeRound([0, xMax]);
  renderingScale.range([yMax, 0]);

  // const filterSeries = (comparisonArray) => {
  //   return comparisonArray.map((sessionName, idx) => {
  //     return <MenuItem>{sessionName}</MenuItem>;
  //   });
  // };
  // Dropdown to select series.
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 80,
      // padding: '0.5rem',
      height: 30,
    },
    select: {
      minWidth: 80,
      fontSize: '.75rem',
      fontWeight: '200',
      border: '1px solid grey',
      borderRadius: 4,
      color: 'grey',
      height: 30,
    },
  }));

  const classes = useStyles();

  const handleChange = (event) => {
    setSeries(event.target.value);
    // console.log('handleCh renderTime', renderTime);
    // // setMaxRender(renderTime);
    // console.log('maxRender', maxRender);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const toStorage = {
    currentTab,
    title: tabs[currentTab]['title'],
    data,
  };

  //this function creates a dropdown selection for each series of snapshots saved
  // const filterSeries = (comparisonArray) => {
  //   return comparisonArray.map((sessionName, idx) => {
  //     return <MenuItem>{sessionName}</MenuItem>;
  //   });
  // };

  return (
    <div>
      {/* <h1>{`Current Snapshot: ${currentIndex + 1}`}</h1> */}
      {/* <div class="dropdown dropdown-dark">
        <select name="two" class="dropdown-select">
          {!comparison[series] ? (
            <option value={series}>No series available</option>
          ) : (
            titleFilter(comparison).map((tabElem, index) => {
              return <option value={index}>{`Series ${index + 1}`}</option>;
            })
          )}
        </select>
      </div> */}
      <div className="series-options-container">
        <div className="snapshotId-header">
          {' '}
          Snapshot ID: {currentIndex + 1}{' '}
        </div>

        <div className="dropdown-and-save-series-container">
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              style={{ color: 'white' }}
              labelId="simple-select-outlined-label"
              id="simple-select-outlined"
              className={classes.select}
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={series}
              //data={data.barStack}
              // value={titleFilter(comparison)}
              onChange={handleChange}
            >
              {!comparison[series] ? (
                <MenuItem>No series available</MenuItem>
              ) : (
                titleFilter(comparison).map((tabElem, index) => {
                  return (
                    <MenuItem value={index}>{`Series ${index + 1}`}</MenuItem>
                  );
                })
              )}
            </Select>
          </FormControl>

          <button
            className="save-series-button"
            onClick={() => dispatch(save(toStorage))}
          >
            Save Series
          </button>
        </div>
      </div>

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
            // OG Barstack
            // data={!comparison ? [] : comparison}
            data={data.barStack}
            keys={keys}
            // x={getSnapshotId}
            x={getSnapshotId}
            xScale={snapshotIdScale}
            yScale={renderingScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack, idx) => {
                console.log('maxTotalRender 1st Barstack', data.maxTotalRender);
                const bar = barStack.bars[currentIndex];
                // console.log('Y SCALEEE', barStacks);
                // console.log('data.barStack >>>', data.barStack);
                console.log('OG bar.x', bar.x);

                return (
                  <rect
                    key={`bar-stack-${idx}-NewView`}
                    x={bar.x + 30}
                    y={bar.y}
                    height={bar.height === 0 ? null : bar.height}
                    width={bar.width}
                    fill={bar.color}
                    /* TIP TOOL EVENT HANDLERS */
                    // Hides tool tip once cursor moves off the current rect
                    onMouseLeave={() => {
                      dispatch(
                        onHoverExit(data.componentData[bar.key].rtid),
                        (tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300))
                      );
                    }}
                    // Cursor position in window updates position of the tool tip
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
            }
          </BarStack>
          <BarStack
            // Comparison Barstack
            data={!comparison[series] ? [] : comparison[series].data.barStack}
            // data={data.barStack}
            keys={keys}
            x={getSnapshotId}
            // x={getSeriesId}
            xScale={snapshotIdScale}
            yScale={renderingScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack, idx) => {
                if (!barStack.bars[currentIndex]) {
                  return <h1>No Comparison</h1>;
                }
                // console.log('barStacks in Comparison', barStacks);
                const bar = barStack.bars[currentIndex];
                console.log('Comparison bar.x', bar.x);
                return (
                  <rect
                    key={`bar-stack-${idx}-${bar.index}`}
                    x={225}
                    y={bar.y}
                    height={bar.height === 0 ? null : bar.height}
                    width={bar.width}
                    fill={bar.color}
                    /* TIP TOOL EVENT HANDLERS */
                    // Hides tool tip once cursor moves off the current rect
                    onMouseLeave={() => {
                      dispatch(
                        onHoverExit(data.componentData[bar.key].rtid),
                        (tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300))
                      );
                    }}
                    // Cursor position in window updates position of the tool tip
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
          {' '}
          Rendering Time (ms){' '}
        </Text>
        <Text x={xMax / 2} y={yMax + 65} fontSize={12} fill="#FFFFFF">
          {' '}
          Series ID{' '}
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

export default BarGraphComparison;
