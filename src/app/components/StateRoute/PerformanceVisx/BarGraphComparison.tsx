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
import { styled } from '@mui/system';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import { onHover, onHoverExit, deleteSeries, setCurrentTabInApp } from '../../../actions/actions';
import { useStoreContext } from '../../../store';
import {
  snapshot,
  TooltipData,
  Margin,
  BarGraphComparisonProps,
  ActionObj,
  Series,
} from '../../../FrontendTypes';
// import { BarStack as BarStacks } from '@visx/shape/lib/types';

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
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { width, height, data, comparison, setSeries, series, setAction } = props;
  const [snapshots] = useState(0);
  const [open, setOpen] = useState(false);
  const [picOpen, setPicOpen] = useState(false); 
  const [buttonLoad, setButtonLoad] = useState(false); //tracking whether or not the clear series button is clicked
  const theme = useTheme();

  useEffect(() => {
    dispatch(setCurrentTabInApp('performance-comparison'));
  }, [dispatch]);

  const currentIndex: number = tabs[currentTab].sliderIndex;

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
    useTooltip<TooltipData>();
  let tooltipTimeout: number;

  const { containerRef, TooltipInPortal } = useTooltipInPortal();

  const keys: string[] = Object.keys(data.componentData);

  // data accessor (used to generate scales) and formatter (add units for on hover box)
  const getSnapshotId = (d: snapshot) => d.snapshotId;
  const formatSnapshotId = (id: string): string => `Snapshot ID: ${id}`;
  const formatRenderTime = (time: string): string => `${time} ms `;
  const getCurrentTab = (storedSeries: ActionObj) => storedSeries.currentTab;

  // create visualization SCALES with cleaned data
  // the domain array/xAxisPoints elements will place the bars along the x-axis
  const xAxisPoints: string[] = ['currentTab', 'comparison'];
  const snapshotIdScale = scaleBand<string>({
    domain: xAxisPoints,
    padding: 0.2,
  });
  // This function will iterate through the snapshots of the series,
  // and grab the highest render times (sum of all component times).
  // We'll then use it in the renderingScale function and compare
  // with the render time of the current tab.
  // The max render time will determine the Y-axis's highest number.
  const calculateMaxTotalRender = (serie: number): number => {
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

  // the domain array on rendering scale will set the coordinates for Y-axis points.
  const renderingScale = scaleLinear<number>({
    domain: [0, Math.max(calculateMaxTotalRender(series), data.maxTotalRender)],
    nice: true,
  });
  // the domain array will assign each key a different color to make rectangle boxes
  // and use range to set the color scheme each bar
  const duplicate = schemeTableau10.slice();
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: duplicate,
  });

  // setting max dimensions and scale ranges
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - 200;
  snapshotIdScale.rangeRound([0, xMax]);
  renderingScale.range([yMax, 0]);



  const StyledFormControl = styled(FormControl)(({ theme }) => ({
    margin: theme.spacing(1),
    minWidth: 80,
    height: 30,
  }));

  const StyledSelect = styled(Select)({
    minWidth: 80,
    fontSize: '.75rem',
    fontWeight: 200,
    height: 30,
  });

  const handleSeriesChange = (event: Event) => {
    if (!event) return;
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

  // manually assignin X -axis points with tab ID.
  function setXpointsComparison() {
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
          
          <Button
            variant='contained'
            sx={{ p: 2, color: 'white' }}
            // type='button'
            className='delete-button'
            onClick={() => {
              setButtonLoad(true);
              dispatch(deleteSeries());

              setTimeout(() => {
                setButtonLoad(false);
              }, 1000);
            }}
            style={ buttonLoad ? { backgroundColor: theme.palette.primary.main }
                : { backgroundColor: theme.palette.secondary.main }
            }>
            {buttonLoad ? 'Deleted' : 'Clear Series'}
          </Button>
            
          <h4 className='compare-series-box' style={{ padding: '0 1rem' }}>
            Compare Series:{' '}
          </h4>
          <StyledFormControl
            id='selectSeries'
            variant='outlined'
            label='compares series'
          // sx={{ backgroundColor: theme.palette.primary.main }}
          >
            <StyledSelect
              labelId='simple-select-outlined-label'
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
                  <MenuItem key={`MenuItem${tabElem.name}`} value={index}>
                    {tabElem.name}
                  </MenuItem>
                ))
              )}
            </StyledSelect>
          </StyledFormControl>
          <h4 style={{ padding: '0 1rem' }}>Compare Actions </h4>
          <StyledFormControl variant='outlined'>
            <StyledSelect
              style={{ color: 'white' }}
              labelId='snapshot-select'
              id='snapshot-select'
              open={picOpen}
              onClose={picHandleClose}
              onOpen={picHandleOpen}
              value='' // snapshots
              onChange={handleActionChange}
            >
              {!comparison[snapshots] ? (
                <MenuItem>No snapshots available</MenuItem>
              ) : (
                finalList.map((elem) => (
                  <MenuItem value={elem}>{elem}</MenuItem>
                  // <MenuItem value="test">{}</MenuItem>
                ))
              )}
            </StyledSelect>
          </StyledFormControl>
        </div>
      </div>

      <svg ref={containerRef} width={width} height={height}>
        { }
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
          <BarStack
            // Current Tab bar stack.
            data={setXpointsCurrentTab()}
            keys={keys}
            x={getCurrentTab}
            xScale={snapshotIdScale}
            yScale={renderingScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack, idx) => {
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
            {(barStacks) =>
              barStacks.map((barStack, idx) => {
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
          <div>{data.componentData[tooltipData.key].stateType}</div>
          <div> {formatRenderTime(tooltipData.bar.data[tooltipData.key])} </div>
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
