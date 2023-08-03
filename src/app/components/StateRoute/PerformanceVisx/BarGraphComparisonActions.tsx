// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { Text } from '@visx/text';
import { schemeSet3 } from 'd3-scale-chromatic';

import { styled } from '@mui/system';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import { Button } from '@mui/material';

import { deleteSeries, setCurrentTabInApp } from '../../../actions/actions';
import { useStoreContext } from '../../../store';
import { TooltipData, Margin, BarGraphComparisonAction, ActionObj } from '../../../FrontendTypes';

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

const BarGraphComparisonActions = (props: BarGraphComparisonAction) => {
  const [dispatch] = useStoreContext();
  const { width, height, data, comparison, setSeries, series, setAction, action } = props;
  const [snapshots] = React.useState(0);
  const [setOpen] = React.useState(false);
  const [setPicOpen] = React.useState(false);

  const [buttonLoad, setButtonLoad] = useState(false);
  const theme = useTheme();


  useEffect(() => {
    dispatch(setCurrentTabInApp('performance-comparison')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'performance-comparison' to facilitate render.
  }, []);

  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
    useTooltip<TooltipData>();
  let tooltipTimeout: number;

  const { containerRef, TooltipInPortal } = useTooltipInPortal();
  const keys = Object.keys(data[0]).filter(
    (componentName) =>
      componentName !== 'name' && componentName !== 'seriesName' && componentName !== 'snapshotId',
  );
  // data accessor (used to generate scales) and formatter (add units for on hover box)
  const getSeriesName = (action: ActionObj): string => action.seriesName;

  // create visualization SCALES with cleaned data.
  // the domain array/xAxisPoints elements will place the bars along the x-axis
  const seriesNameScale = scaleBand<string>({
    domain: data.map(getSeriesName),
    padding: 0.2,
  });
  // This function will iterate through the snapshots of the series,
  // and grab the highest render times (sum of all component times).
  // We'll then use it in the renderingScale function and compare
  // with the render time of the current tab.
  // The max render time will determine the Y-axis's highest number.
  const calculateMaxTotalRender = () => {
    let currentMax = -Infinity;
    for (let i = 0; i < data.length; i += 1) {
      let currentSum = 0;
      for (const key of keys) if (data[i][key]) currentSum += data[i][key];
      if (currentSum > currentMax) currentMax = currentSum;
    }
    return currentMax;
  };

  // the domain array on rendering scale will set the coordinates for Y-aix points.
  const renderingScale = scaleLinear<number>({
    domain: [0, calculateMaxTotalRender()],
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
  seriesNameScale.rangeRound([0, xMax]);
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

  const handleSeriesChange = (event) => {
    if (!event) return;
    setSeries(event.target.value);
    setAction(false);
  };

  const handleActionChange = (event) => {
    if (!event) return;
    setAction(event.target.value);
    setSeries(false);
  };

  

  const seriesList = comparison.map((elem) => elem.data.barStack);
  const actionsList = seriesList.flat();
  const testList = actionsList.map((elem) => elem.name);

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
            className='delete-button'
            onClick={() => {
              setButtonLoad(true);
              setAction(false);
              setSeries(true);
              dispatch(deleteSeries());

              setTimeout(() => {
                setButtonLoad(false);
              }, 1000);
            }}
            style={
              buttonLoad
                ? { backgroundColor: theme.palette.primary.main }
                : { backgroundColor: theme.palette.secondary.main }
            }
          >
            {buttonLoad ? 'Deleted' : 'Clear Series'}
          </Button>
          <h4 style={{ padding: '0 1rem' }}>Compare Series: </h4>
          <StyledFormControl variant='outlined'>
            <StyledSelect
              style={{ color: 'white' }}
              labelId='simple-select-outlined-label'
              id='simple-select-outlined'
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
              value={action} // snapshots
              onChange={handleActionChange}
            >
              {!comparison[snapshots] ? (
                <MenuItem>No snapshots available</MenuItem>
              ) : (
                finalList.map((elem) => (
                  <MenuItem key={`MenuItem${elem}`} value={elem}>
                    {elem}
                  </MenuItem>
                ))
              )}
            </StyledSelect>
          </StyledFormControl>
        </div>
      </div>

      <svg ref={containerRef} width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={seriesNameScale}
          yScale={renderingScale}
          width={xMax}
          height={yMax}
          stroke='black'
          strokeOpacity={0.1}
          xOffset={seriesNameScale.bandwidth() / 2}
        />
        <Group top={margin.top} left={margin.left}>
          <BarStack
            data={data}
            keys={keys}
            x={getSeriesName}
            xScale={seriesNameScale}
            yScale={renderingScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${bar.bar.data.seriesName}-${bar.key}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height === 0 ? null : bar.height}
                    width={bar.width}
                    fill={bar.color}
                    /* TIP TOOL EVENT HANDLERS */
                    // Hides tool tip once cursor moves off the current rect.
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip();
                      }, 300);
                    }}
                    // Cursor position in window updates position of the tool tip.
                    onMouseMove={(event) => {
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
            fill: 'rgb(231, 231, 231)',
            fontSize: 11,
            verticalAnchor: 'middle',
            textAnchor: 'end',
          })}
        />
        <AxisBottom
          top={yMax + margin.top}
          left={margin.left}
          scale={seriesNameScale}
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
          Series Name
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
            <strong>{tooltipData.key}</strong>
          </div>
          <div>{`${tooltipData.bar.data[tooltipData.key]} ms`}</div>
          <div>
            <small>{tooltipData.bar.data.seriesName}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
};

export default BarGraphComparisonActions;
