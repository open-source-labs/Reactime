import React, { useEffect } from 'react';
import Charts from 'react-apexcharts';
import ReactHover, { Trigger, Hover } from 'react-hover';
import { OptionsCursorTrueWithMargin } from '../FrontendTypes';
import { setCurrentTabInApp } from '../actions/actions';
import { useStoreContext } from '../store';

/*
  Used to render a single radial graph on the 'Web Metrics' tab
*/

const radialGraph = (props) => {
  const state = {
    series: [props.series], // series appears to be the scale at which data is displayed based on the type of webMetrics measured.
    options: {
      colors: [props.color], // color of the webmetrics performance bar from 'StateRoute'
      chart: {
        height: 100,
        width: 100,
        type: 'radialBar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            margin: 0,
            size: '75%',
            background: '#242529',
            image: undefined,
            imageOffsetX: 0,
            imageOffsetY: 0,
            position: 'front',
            dropShadow: {
              enabled: false,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24,
            },
          },
          track: {
            background: '#fff',
            strokeWidth: '3%',
            margin: 0, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: -3,
              left: 0,
              blur: 4,
              opacity: 0.35,
            },
          },

          dataLabels: {
            show: true,
            name: {
              offsetY: -10,
              show: true,
              color: '#fff',
              fontSize: '24px',
            },
            value: {
              formatter: props.formatted,
              color: '#fff',
              fontSize: '16px',
              show: true,
            },
          },
        },
      },
      fill: {
        type: 'solid',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.1,
          gradientToColors: [props.color],
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: 'flat',
      },
      labels: [props.label],
    },
  };

  const [store, dispatch] = useStoreContext(); // used to get the dispatch function from our storeContext
  useEffect(() => { 
    dispatch(setCurrentTabInApp('webmetrics')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'webmetrics' to facilitate render.
  }, []);

  const optionsCursorTrueWithMargin: OptionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };

  return (
    <div className='metric'> 
      <ReactHover options={optionsCursorTrueWithMargin}> 
        <Trigger type='trigger'>
          <div id='chart'>
            <Charts
              options={state.options}
              series={state.series}
              type='radialBar'
              height={350}
              width={350}
            />
          </div>
        </Trigger>
        <Hover type='hover'>
          <div style={{zIndex: 1, position: 'relative', padding: '0.5rem 1rem'}} id='hover-box'>
            <p><strong>{props.name}</strong></p>
            <p>{props.description}</p>
          </div>
        </Hover>
      </ReactHover>
    </div>
  );
};

export default radialGraph;
