/* eslint-disable no-param-reassign */
import React, { useEffect } from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { Text } from '@visx/text';
import { schemeSet3 } from 'd3-scale-chromatic';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import {
  onHover, onHoverExit, deleteSeries, setCurrentTabInApp,
} from '../../../actions/actions';
import { useStoreContext } from '../../../store';
import {
  snapshot, TooltipData, margin, BarGraphComparisonProps,
} from '../../FrontendTypes';

/* DEFAULTS */
const margin = {
  top: 30, right: 30, bottom: 0, left: 50,
};
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

const BarGraphComparison = (props: BarGraphComparisonProps): JSX.Element => {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const {
    width, height, data, comparison, setSeries, series, setAction,
  } = props;
  const [snapshots] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [picOpen, setPicOpen] = React.useState(false);
  useEffect(() => {
    dispatch(setCurrentTabInApp('performance-comparison'));
  }, []);

  const currentIndex = tabs[currentTab].sliderIndex;

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
  const formatSnapshotId = id => `Snapshot ID: ${id}`;
  const formatRenderTime = time => `${time} ms `;
  const getCurrentTab = storedSeries => storedSeries.currentTab;

  // create visualization SCALES with cleaned data
  // the domain array/xAxisPoints elements will place the bars along the x-axis
  const xAxisPoints = ['currentTab', 'comparison'];
  const snapshotIdScale = scaleBand<string>({
    domain: xAxisPoints,
    padding: 0.2,
  });
  // This function will iterate through the snapshots of the series,
  // and grab the highest render times (sum of all component times).
  // We'll then use it in the renderingScale function and compare
  // with the render time of the current tab.
  // The max render time will determine the Y-axis's highest number.
  const calculateMaxTotalRender = (serie: string) => {
    const currentSeriesBarStacks: number[] = !comparison[serie]
      ? []
      : comparison[serie].data.barStack;
    if (currentSeriesBarStacks.length === 0) return 0;
    let currentMax = -Infinity;
    for (let i = 0; i < currentSeriesBarStacks.length; i += 1) {
      const renderTimes = Object.values(currentSeriesBarStacks[i]).slice(1);
      const renderTotal: number = renderTimes.reduce((acc, curr) => acc + curr);
      if (renderTotal > currentMax) currentMax = renderTotal;
    }
    return currentMax;
  };

  // the domain array on rendering scale will set the coordinates for Y-axis points.
  const renderingScale = scaleLinear<number>({
    domain: [0, Math.max(calculateMaxTotalRender(series), data.maxTotalRender)],
    nice: true,
  });
  // the domain array will assign each key a different color to make rectangle boxes
  // and use range to set the color scheme each bar
  const colorScale = scaleOrdinal<string>({
    domain: keys,
    range: schemeSet3,
  });

  // setting max dimensions and scale ranges
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - 200;
  snapshotIdScale.rangeRound([0, xMax]);
  renderingScale.range([yMax, 0]);

  // useStyles will change the styling on save series dropdown feature
  const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 80,
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

  const handleSeriesChange = event => {
    if (!event) return;
    setSeries(event.target.value);
    setAction(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleActionChange = event => {
    if (!event.target.value) return;
    setAction(event.target.value);
    setSeries(false);
  };

  const picHandleClose = () => {
    setPicOpen(false);
  };

  const picHandleOpen = () => {
    setPicOpen(true);
  };

  // manually assignin X -axis points with tab ID.
  function setXpointsComparison() {
    comparison[series].data.barStack.forEach(elem => {
      elem.currentTab = 'comparison';
    });
    return comparison[series].data.barStack;
  }
  function setXpointsCurrentTab() {
    data.barStack.forEach(element => {
      element.currentTab = 'currentTab';
    });
    return data.barStack;
  }
  const animateButton = e => {
    e.preventDefault();
    e.target.classList.add('animate');
    e.target.innerHTML = 'Deleted!';
    setTimeout(() => {
      e.target.innerHTML = 'Clear All Series';
      e.target.classList.remove('animate');
    }, 1000);
  };
  const classname = document.getElementsByClassName('delete-button');
  for (let i = 0; i < classname.length; i += 1) {
    classname[i].addEventListener('click', animateButton, false);
  }
  const seriesList = comparison.map(elem => elem.data.barStack);
  const actionsList = seriesList.flat();
  const testList = actionsList.map(elem => elem.name);

  const finalList = [];
  for (let i = 0; i < testList.length; i += 1) {
    if (testList[i] !== '' && !finalList.includes(testList[i])) finalList.push(testList[i]);
  }

  return (
    <div>
      <div className="series-options-container">

        <div className="dropdown-and-delete-series-container">
          <button
            type="button"
            className="delete-button"
            onClick={() => {
              dispatch(deleteSeries());
            }}
          >
            Clear All Series
          </button>
          <h4 className="compare-series-box" style={{ padding: '0 1rem' }}>Compare Series: </h4>
          <FormControl id="selectSeries" variant="outlined" className={classes.formControl}>
            <Select
              style={{ color: 'white' }}
              labelId="simple-select-outlined-label"
              className={classes.select}
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              value={series}
              onChange={handleSeriesChange}
            >
              {!comparison.length ? (
                <MenuItem>No series available</MenuItem>
              ) : (
                comparison.map((tabElem, index) => (
                  <MenuItem key={`MenuItem${tabElem.name}`} value={index}>{tabElem.name}</MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <h4 style={{ padding: '0 1rem' }}>Compare Actions </h4>
          <FormControl variant="outlined" className={classes.formControl}>
            <Select
              style={{ color: 'white' }}
              labelId="snapshot-select"
              id="snapshot-select"
              className={classes.select}
              open={picOpen}
              onClose={picHandleClose}
              onOpen={picHandleOpen}
              value="" // snapshots
              onChange={handleActionChange}
            >
              {!comparison[snapshots] ? (
                <MenuItem>No snapshots available</MenuItem>
              ) : (
                finalList.map(elem => (
                  <MenuItem value={elem}>{elem}</MenuItem>
                  // <MenuItem value="test">{}</MenuItem>
                )))}
            </Select>
          </FormControl>
        </div>
      </div>

      <svg ref={containerRef} width={width} height={height}>
        { }
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
            // Current Tab bar stack.
            data={setXpointsCurrentTab()}
            keys={keys}
            x={getCurrentTab}
            xScale={snapshotIdScale}
            yScale={renderingScale}
            color={colorScale}
          >
            {barStacks => barStacks.map((barStack, idx) => {
              // Uses map method to iterate through all components,
              // creating a rect component (from visx) for each iteration.
              // height/width/etc. are calculated by visx.
              // to set X and Y scale, it  will used the p`assed in function and
              // will run it on the array thats outputted by data
              const bar = barStack.bars[currentIndex];
              if (Number.isNaN(bar.bar[1]) || bar.height < 0) {
                bar.height = 0;
              }
              return (
                <rect
                  key={`bar-stack-${idx}-NewView`}
                  x={bar.x}
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
                      }, 300)),
                    );
                  }}
                  // Cursor position in window updates position of the tool tip
                  onMouseMove={event => {
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
            })}
          </BarStack>
          <BarStack
            // Comparison Barstack (populates based on series selected)
            // to set X and Y scale, it  will used the passed in function and
            // will run it on the array thats outputted by data
            // setXpointsComparison()}
            // comparison[series].data.barStack
            data={!comparison[series] ? [] : setXpointsComparison()}
            keys={keys}
            x={getCurrentTab}
            xScale={snapshotIdScale}
            yScale={renderingScale}
            color={colorScale}
          >
            {barStacks => barStacks.map((barStack, idx) => {
              // Uses map method to iterate through all components,
              // creating a rect component (from visx) for each iteration.
              // height/width/etc. are calculated by visx.
              if (!barStack.bars[currentIndex]) {
                return <h1>No Comparison</h1>;
              }
              const bar = barStack.bars[currentIndex];
              if (Number.isNaN(bar.bar[1]) || bar.height < 0) {
                bar.height = 0;
              }
              return (
                <rect
                  key={`bar-stack-${idx}-${bar.index}`}
                  x={bar.x}
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
                      }, 300)),
                    );
                  }}
                  // Cursor position in window updates position of the tool tip
                  onMouseMove={event => {
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
            })}
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
        <Text x={xMax / 2} y={yMax + 65} fontSize={12} fill="#FFFFFF">
          Series ID
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
