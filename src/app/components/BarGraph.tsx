// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { BarStack } from '@visx/shape';
import { Bar } from '@visx/shape';
import { SeriesPoint } from '@visx/shape/lib/types';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { Text } from '@visx/text';
import { schemeSet3 } from 'd3-scale-chromatic';
import { onHover, onHoverExit, save } from '../actions/actions';
import { useStoreContext } from '../store';

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
const margin = {
  top: 30, right: 30, bottom: 0, left: 50,
};
const axisColor = '#FF6569';
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

const BarGraph = props => {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { width, height, data, comparison, setRoute, allRoutes, filteredSnapshots, snapshot, setSnapshot} = props;
  const [ seriesNameInput, setSeriesNameInput ] = useState(`Series ${comparison.length + 1}`);
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

  const HorizontalGraph = () => {
    const BarArray = [];
    // []
    //-----------::  :: 3     4             
    let i = 0;
    // let barWidth = (xMax / (Object.keys(data.barStack[0]).length) + 5);
    let barWidth = (xMax * (2/3)/ (Object.keys(data.barStack[0]).length - 2));
    console.log(data, '<-- data from snapshot');
    // function colorGen() {
    //   const r = Math.floor(Math.random() * 256);
    //   const g = Math.floor(Math.random() * 256);
    //   const b = Math.floor(Math.random() * 256);
    //   return "rgb(" + r + "," + g + "," + b + ", " + .5 + ")"
    // }
    const rgb = ["rgba(50, 100, 241, .5)", "rgba(90, 150, 217, .5)", "rgba(200, 30, 7, .5)", "rgba(23, 233, 217, .5)", "rgba(150, 227, 19, .5)"]
    for (const [key, value] of Object.entries(data.barStack[0])) {
      console.log(xMax, '<--  xmax'); 
      if (key !== 'snapshotId' && key !== 'route'){
          //console.log(`${key}: ${value}`);
          // let color = colorGen();
        if (i === 0) {
          BarArray.push(<Bar
            min={'outer min'}
            max={'first if'}
            // x={100}
            x={xMax / (Object.keys(data.barStack[0]).length)}
            y={yMax - value}
            height={value}
            key={key}
            width={barWidth}
            fill={'#62d6fb'}
            onMouseLeave={() => {
              dispatch(
                onHoverExit(data.componentData[key].rtid),
                (tooltipTimeout = window.setTimeout(() => {
                  hideTooltip();
                }, 300)),
              );
            }}
            // Cursor position in window updates position of the tool tip.
            onMouseMove={event => {
              console.log(event, '<-- event from onMouseMove')
              console.log(key, '<--key from onMouseMove');
              dispatch(onHover(data.componentData[key].rtid));
              if (tooltipTimeout) clearTimeout(tooltipTimeout);
              const top = event.clientY - margin.top - value * 25;
              const left = 10 + 10 * i + barWidth * i + barWidth / 2;
              showTooltip({
                tooltipData: value,
                tooltipTop: top,
                tooltipLeft: left,
              });
            }}
          />);
        }
        else {
          BarArray.push(<Bar
            min={'outer min'}
            max={'else here'}
            x={(xMax / (Object.keys(data.barStack[0]).length)) * (i + 1)} 
            // x={(xMax / (Object.keys(data.barStack[0]).length - 2)) + barWidth * i}
            y={yMax - value * 20}
            height={value * 20}
            key={key}
            width={barWidth}
            fill={'#62d6fb'}
            onMouseLeave={() => {
              dispatch(
                onHoverExit(data.componentData[key].rtid),
                (tooltipTimeout = window.setTimeout(() => {
                  hideTooltip();
                }, 300)),
              );
            }}
            // Cursor position in window updates position of the tool tip.
            onMouseMove={event => {
              console.log(event, '<-- event from onMouseMove')
              console.log(key, '<--key from onMouseMove');
              dispatch(onHover(data.componentData[key].rtid));
              if (tooltipTimeout) clearTimeout(tooltipTimeout);
              const top = event.clientY - margin.top - value * 25;
              const left = 10 + 10 * i + barWidth * i + barWidth / 2;
              showTooltip({
                tooltipData: value,
                tooltipTop: top,
                tooltipLeft: left,
              });
            }}
          />);
        }
        i++;        
      }

      }
      console.log(BarArray, '<-- barArray');
      return BarArray;
    };

  const keys = Object.keys(data.componentData);
  //console.log('this is data in barGraph.tsx: ', data);
  //console.log('these are the data\'s keys: ', keys);

  // data accessor (used to generate scales) and formatter (add units for on hover box)
  const getSnapshotId = (d: snapshot) => {
    //d coming from data.barstack post filtered data
    //Object.keys(data.barStack[0]).map(keys => if ())
    // console.log('snapshot object here from getSnapshotId: ', d);
    return d.snapshotId;
  };
  const getComponentKeys = d => {
    console.log('snapshot object here from getComponentKeys: ', d);
    return d.snapshotId;
  };
  const formatSnapshotId = id => `Snapshot ID: ${id}`;
  const formatRenderTime = time => `${time} ms `;

  // create visualization SCALES with cleaned data
  const snapshotIdScale = scaleBand<string>({
    domain: data.barStack.map(getSnapshotId),
    padding: 0.2,
  });

  console.log(data,' <--data')
  console.log(data.maxTotalRender,' <--data.maxTotalRender')

  const renderingScale = scaleLinear<number>({
    domain: [0, data.maxTotalRender],
    nice: true,
  });

  const componentsKeys = [];
  for (let key in data.barStack[0]) {
    if(key !== 'route' && key !== 'snapshotId' )
    componentsKeys.push(key);
  }
  console.log(data.barStack.map(getSnapshotId), '<-- check if getSnapshotId matches componentKeys')
  console.log(componentsKeys, '<-- componentKeys')

  const componentScale = scaleBand<string>({
    domain: componentsKeys,
    padding: 0.2
  })

  const colorScale = scaleOrdinal<string>({
    domain: keys,
    range: schemeSet3,
  });

  // setting max dimensions and scale ranges
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - 150;
  snapshotIdScale.rangeRound([0, xMax]);
  renderingScale.range([yMax, 0]);

  componentScale.rangeRound([0, xMax]);

  const toStorage = {
    currentTab,
    title: tabs[currentTab].title,
    data,
  };
  // use this to animate the save series button. It
  useEffect(() => {
    const saveButtons = document.getElementsByClassName('save-series-button');
    for (let i = 0; i < saveButtons.length; i++) {
      if (tabs[currentTab].seriesSavedStatus === 'saved') {
        saveButtons[i].classList.add('animate');
        console.log('checking saveButtons[i].classList', saveButtons[i].classList)
        saveButtons[i].innerHTML = 'Saved!';
      } else {
        saveButtons[i].innerHTML = 'Save Series';
        saveButtons[i].classList.remove('animate');
      }
    }
  });

  const saveSeriesClickHandler = () => {
    if (tabs[currentTab].seriesSavedStatus === 'inputBoxOpen') {
      const actionNames = document.getElementsByClassName('actionname');
      for (let i = 0; i < actionNames.length; i++) {
        toStorage.data.barStack[i].name = actionNames[i].value;
      }
      dispatch(save(toStorage, seriesNameInput));
      setSeriesNameInput(`Series ${comparison.length}`);
      return;
    }
    dispatch(save(toStorage));
  };
  console.log(data.barStack, 'data.barStack before graph');

  // FTRI9 note - need to ensure text box is not empty before saving
  const textbox = tabs[currentTab].seriesSavedStatus === 'inputBoxOpen' ? <input type="text" id="seriesname" placeholder="Enter Series Name" onChange={e => setSeriesNameInput(e.target.value)} /> : null;
  return (
    <div className="bargraph-position">
      <div className="saveSeriesContainer">
        {textbox}
        <button
          type="button"
          className="save-series-button"
          onClick={saveSeriesClickHandler}
        >
          Save Series
        </button>
        <form className="routesForm" id="routes-formcontrol">
          <label id="routes-dropdown">Select Route: </label>
          <select
            labelId="demo-simple-select-label"
            id="routes-select"
            onChange={e => {
              setRoute(e.target.value);
              setSnapshot('All Snapshots');
              const defaultSnapShot = document.querySelector('#snapshot-select');
              defaultSnapShot.value = 'defaultSnapShot';
            }}
          >
            <option>
              All Routes
            </option>
            {allRoutes.map(route => (
              <option className="routes">
                {route}
              </option>
            ))}
          </select>
        </form>
        <form className="routesForm" id="routes-formcontrol">
          <label id="routes-dropdown">Select Snapshot: </label>
          <select
            labelId="demo-simple-select-label"
            id="snapshot-select"
            onChange={e => setSnapshot(e.target.value)}
          >
            <option value="defaultSnapShot">
              All Snapshots
            </option>
            {filteredSnapshots.map(route => (
              <option className="routes">
                {route.snapshotId}
              </option>
            ))}
          </select>
        </form>
      </div>
      <svg ref={containerRef} width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={background}
          rx={14}
        />
        {snapshot === 'All Snapshots' ? (
        <><Grid
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
                {barStacks => barStacks.map(barStack => barStack.bars.map((bar, idx) => {
                  console.log(filteredSnapshots, '<-- filtered snap shots');
                  console.log(data, '<-- data from barStacks');
                  console.log(data.barStack, '<-- data.barstack');
                  console.log(barStacks, '<--barStacks');
                  // console.log(width, '<-- width');
                  // console.log(height, '<-- height');
                  console.log(bar, '<-- bar');
                  // Hides new components if components don't exist in previous snapshots.
                  if (Number.isNaN(bar.bar[1]) || bar.height < 0) {
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
                      // Hides tool tip once cursor moves off the current rect.
                      onMouseLeave={() => {
                        dispatch(
                          onHoverExit(data.componentData[bar.key].rtid),
                          (tooltipTimeout = window.setTimeout(() => {
                            hideTooltip();
                          }, 300))
                        );
                      } }
                      // Cursor position in window updates position of the tool tip.
                      onMouseMove={event => {
                        dispatch(onHover(data.componentData[bar.key].rtid));
                        if (tooltipTimeout)
                          clearTimeout(tooltipTimeout);
                        const top = event.clientY - margin.top - bar.height;
                        const left = bar.x + bar.width / 2;
                        showTooltip({
                          tooltipData: bar,
                          tooltipTop: top,
                          tooltipLeft: left,
                        });
                      } } />
                  );
                }))}
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
          </>
          )
            : (
              <>
              <Grid
                top={margin.top}
                left={margin.left}
                // xScale={snapshotIdScale}
                xScale={componentScale}
                yScale={renderingScale}
                width={xMax}
                height={yMax}
                stroke="black"
                strokeOpacity={0.1}
                xOffset={componentScale.bandwidth() / 2}
              />
                <Group top={margin.top} left={margin.left}>
                {HorizontalGraph()}
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
                scale={componentScale}
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
                // x={-xMax / 2}
                // x={Math.max((-xMax / 2), (-yMax / 2))}
                x={-yMax / 2 - 75}
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
              </>
          )}

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

export default BarGraph;
