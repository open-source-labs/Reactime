// @ts-nocheck
/// <reference lib="dom" />
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { Text } from '@visx/text';
import { schemeTableau10 } from 'd3-scale-chromatic';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import { Button, InputLabel } from '@mui/material';
import { onHover, onHoverExit, deleteSeries, setCurrentTabInApp } from '../../../RTKslices';
import { useSelector, useDispatch } from 'react-redux';
import {
  snapshot,
  TooltipData,
  Margin,
  BarGraphComparisonProps,
  ActionObj,
  Series,
} from '../../../FrontendTypes';

/* DEFAULTS */
const margin: Margin = {
  top: 30,
  right: 30,
  bottom: 0,
  left: 50,
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
  const dispatch = useDispatch();
  const tabs = useSelector(state => state.main.tabs);
  const currentTab = useSelector(state => state.main.currentTab);

  const {
    width, // from ParentSize provided in StateRoute
    height, // from ParentSize provided in StateRoute
    data, // Acquired from getPerfMetrics(snapshots, getSnapshotIds(hierarchy)) in 'PerformanceVisx'
    comparison, // result from invoking 'allStorage' in 'PerformanceVisx'
    setSeries, // setter function to update the state located in 'PerfomanceVisx'
    series, // initialized as boolean, can be an object, from state set in 'PerformanceVisx'
    setAction, // setter function to update the state located in 'PerfomanceVisx'
  } = props;
  const [snapshots] = useState(0); // creates a local state snapshots and sets it to a value of 0 (why is there no setter function? Also, why use state when it's only referenced once and never changed? 08/03/2023)
  const [open, setOpen] = useState(false); // creates a local state setOpen and sets it to false (why is there no setter function? 08/03/2023)
  const [picOpen, setPicOpen] = useState(false); // creates a local state setPicOpen and sets it to false (why is there no setter function? 08/03/2023)
  const [buttonLoad, setButtonLoad] = useState(false); //tracking whether or not the clear series button is clicked
  const theme = useTheme(); // MUI hook that allows access to theme variables inside your functional React components

  useEffect(() => {
    dispatch(setCurrentTabInApp('performance-comparison')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'performance-comparison' to facilitate render.
  }, [dispatch]);

  const currentIndex: number = tabs[currentTab].sliderIndex;

  const {
    tooltipData, // value/data that tooltip may need to render
    tooltipLeft, // number used for tooltip positioning
    tooltipTop, // number used for tooltip positioning
    tooltipOpen, // boolean whether the tooltip state is open or closed
    showTooltip, // function to set tooltip state
    hideTooltip, // function to close a tooltip
  } = useTooltip<TooltipData>(); // returns an object with several properties that you can use to manage the tooltip state of your component
  let tooltipTimeout: number;

  const {
    containerRef, // Access to the container's bounding box. This will be empty on first render.
    TooltipInPortal, // Visx component that renders Tooltip or TooltipWithBounds in a Portal, outside of your component DOM tree
  } = useTooltipInPortal();

  const keys: string[] = Object.keys(data.componentData);

  // data accessor (used to generate scales) and formatter (add units for on hover box)
  const getSnapshotId = (d: snapshot) => d.snapshotId;
  const formatSnapshotId = (id: string): string => `Snapshot ID: ${id}`;
  const formatRenderTime = (time: string): string => `${time} ms`;
  const getCurrentTab = (storedSeries: ActionObj) => storedSeries.currentTab;

  // create visualization SCALES with cleaned data
  const xAxisPoints: string[] = ['currentTab', 'comparison'];
  const snapshotIdScale = scaleBand<string>({
    domain: xAxisPoints, // the domain array/xAxisPoints elements will place the bars along the x-axis
    padding: 0.2,
  });

  const calculateMaxTotalRender = (serie: number): number => {
    // This function will iterate through the snapshots of the series, and grab the highest render times (sum of all component times). We'll then use it in the renderingScale function and compare with the render time of the current tab. The max render time will determine the Y-axis's highest number.
    const currentSeriesBarStacks: ActionObj[] = !comparison[serie]
      ? []
      : comparison[serie].data.barStack;
    if (currentSeriesBarStacks.length === 0) return 0;

    let currentMax = -Infinity;

    for (let i = 0; i < currentSeriesBarStacks.length; i += 1) {
      const renderTimes: number[] = Object.values(currentSeriesBarStacks[i]).slice(1);
      const renderTotal: number = renderTimes.reduce((acc, curr) => acc + curr);

      if (renderTotal > currentMax) currentMax = renderTotal;
    }
    return currentMax;
  };

  const renderingScale = scaleLinear<number>({
    // this function will use the domain array to assign each key a different color to make rectangle boxes and use range to set the color scheme each bar
    domain: [0, Math.max(calculateMaxTotalRender(series), data.maxTotalRender)], // [minY, maxY] the domain array on rendering scale will set the coordinates for Y-axis points.
    nice: true,
  });

  const duplicate = schemeTableau10.slice();
  const colorScale = scaleOrdinal<string, string>({
    domain: keys, // the domain array will assign each key a different color to make rectangle boxes
    range: duplicate, // and use range to set the color scheme each bar
  });

  // setting max dimensions and scale ranges
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - 200;
  snapshotIdScale.rangeRound([0, xMax]);
  renderingScale.range([yMax, 0]);

  const handleSeriesChange = (event: Event) => {
    if (!event) {
      return;
    }
    const target = event.target as HTMLInputElement;
    if (target) {
      setSeries(target.value);
      setAction(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleActionChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.value) return;
    if (target) {
      setAction(target.value);
      setSeries(false);
    }
  };

  const picHandleClose = () => {
    setPicOpen(false);
  };

  const picHandleOpen = () => {
    setPicOpen(true);
  };

  function setXpointsComparison() {
    // manually assigning X -axis points with tab ID.
    comparison[series].data.barStack.forEach((elem: ActionObj) => {
      elem.currentTab = 'comparison';
    });
    return comparison[series].data.barStack;
  }

  function setXpointsCurrentTab() {
    data.barStack.forEach((element) => {
      element.currentTab = 'currentTab';
    });
    return data.barStack;
  }

  const seriesList: ActionObj[][] = comparison.map((action: Series) => action.data.barStack);
  const actionsList: ActionObj[] = seriesList.flat();
  const testList: string[] = actionsList.map((elem: ActionObj) => elem.name);

  const finalList = [];
  for (let i = 0; i < testList.length; i += 1) {
    if (testList[i] !== '' && !finalList.includes(testList[i])) finalList.push(testList[i]);
  }

  return (
    <div>
      <div className='series-options-container'>
        <div className='dropdown-and-delete-series-container'>
          {/*'Clear Series' MUI button that clears any saved series*/}
          <Button
            variant='contained'
            sx={{ p: 2, color: 'white' }}
            className='delete-button'
            onClick={() => {
              setButtonLoad(true);
              dispatch(deleteSeries());
              setTimeout(() => {
                setButtonLoad(false);
              }, 1000);
            }}
            style={
              buttonLoad
                ? { backgroundColor: '#62d6fb' }
                : { backgroundColor: '#ff6569', color: 'black' }
            }
          >
            {buttonLoad ? 'Deleted' : 'Clear All Series'}
          </Button>

          <FormControl sx={{ m: 1, minWidth: 180 }} size='small'>
            <InputLabel
              id='simple-select-outlined-label'
              sx={{ color: 'white', lineHeight: 1, fontWeight: 400 }}
            >
              Compare Series
            </InputLabel>
            <Select
              variant='filled'
              labelId='simple-select-outlined-label'
              id='simple-select-outlined-label'
              value={series}
              label='Compare Series'
              onClose={handleClose}
              onOpen={handleOpen}
              onChange={handleSeriesChange}
              sx={{
                backgroundColor: '#53b6d5',
                color: 'white',
                height: 34,
                fontWeight: 400,
                pt: 0,
                pb: 0,
              }}
            >
              {!comparison.length ? (
                <MenuItem>No series available</MenuItem>
              ) : (
                [
                  <MenuItem>None</MenuItem>,
                  ...comparison.map((tabElem, index) => (
                    <MenuItem key={`MenuItem${tabElem.name}`} value={index}>
                      {tabElem.name}
                    </MenuItem>
                  )),
                ]
              )}
            </Select>
          </FormControl>
          {/* Mui 'Compare Series Dropdown ENDS here */}

          {/*==============================================================================================================================*/}
          {/*commented the below portion out, as bargraphComparisonActions.tsx is not currently functional, can re implement later on */}
          {/*==============================================================================================================================*/}

          {/* {   <h4 style={{ padding: '0 1rem' }}>Compare Actions </h4>
          <StyledFormControl variant='filled'>
            {' '}
            {/* MUI styled 'FormControl' component */}
          {/* <InputLabel
              id='snapshot-select-label'
              sx={{ fontSize: '1.2rem' }}
              style={{ color: 'white' }}
            >
              Compare Actions
            </InputLabel>
            <StyledSelect // MUI styled 'Select' component
              labelId='snapshot-select-label'
              id='snapshot-select-label'
              open={picOpen}
              onClose={picHandleClose}
              onOpen={picHandleOpen}
              value={action} // snapshots
              onChange={handleActionChange}
            >
              {!comparison[snapshots] ? (
                <MenuItem>No snapshots available</MenuItem>
              ) : (
                finalList.map((elem) => <MenuItem value={elem}>{elem}</MenuItem>)
              )}
            </StyledSelect>
          </StyledFormControl>
          */}
          {/*==============================================================================================================================*/}
          {/*==============================================================================================================================*/}
        </div>
      </div>

      <svg ref={containerRef} width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
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
          <BarStack // Current Tab bar stack.
            data={setXpointsCurrentTab()} // array of data that generates a stack
            keys={keys} // array of keys corresponding to stack layers
            x={getCurrentTab} // returns the value mapped to the x of a bar
            xScale={snapshotIdScale} // takes in a value and maps it to an x axis position
            yScale={renderingScale} // takes in a value and maps it to an y axis position
            color={colorScale} // returns the desired color for a bar with a given key and index
          >
            {(
              barStacks, // overides render function which is past the configured stack generator
            ) =>
              barStacks.map((barStack, idx) => {
                // Uses map method to iterate through all components, creating a rect component, from visx, for each iteration. height, width, etc are calculated by visx to set X and Y scale. The scaler will used the passed in function and will run it on the array thats outputted by data
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
                      // Hides tool tip once cursor moves off the current rect
                      dispatch(
                        onHoverExit(data.componentData[bar.key].rtid),
                        (tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300)),
                      );
                    }}
                    // Cursor position in window updates position of the tool tip
                    onMouseMove={(event) => {
                      // Cursor position in window updates position of the tool tip
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
            data={!comparison[series] ? [] : setXpointsComparison()} // Comparison Barstack (populates based on series selected) to set X and Y scale, it  will used the passed in function and will run it on the array thats outputted by data. setXpointsComparison() iterates through each ActionObj in comparison[series].data.barStack, assigns a currentTab = 'comparison property, and returns the modified comparison[series].data.barStack if comparison[series] does not exist
            keys={keys}
            x={getCurrentTab}
            xScale={snapshotIdScale}
            yScale={renderingScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack, idx) => {
                // Uses map method to iterate through all components, creating a react component (from visx) for each iteration. height/width/etc. are calculated by visx.
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
                    onMouseLeave={() => {
                      // Hides tool tip once cursor moves off the current rect
                      dispatch(
                        onHoverExit(data.componentData[bar.key].rtid),
                        (tooltipTimeout = window.setTimeout(() => {
                          hideTooltip();
                        }, 300)),
                      );
                    }}
                    onMouseMove={(event) => {
                      // Cursor position in window updates position of the tool tip
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
        <Text x={-xMax / 2} y='15' transform='rotate(-90)' fontSize={12} fill='#FFFFFF'>
          Rendering Time (ms)
        </Text>
        <Text x={xMax / 2} y={yMax + 65} fontSize={12} fill='#FFFFFF'>
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
            <strong>{tooltipData.key}</strong>{' '}
          </div>
          <div>{'State: ' + data.componentData[tooltipData.key].stateType}</div>
          <div>{'Render time: ' + formatRenderTime(tooltipData.bar.data[tooltipData.key])}</div>
          <div>
            {' '}
            <small>{formatSnapshotId(getSnapshotId(tooltipData.bar.data))}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
};

export default BarGraphComparison;
