import React, { useEffect } from 'react';
import Charts from 'react-apexcharts';
import ReactHover, { Trigger, Hover } from 'react-hover';
import { OptionsCursorTrueWithMargin } from '../FrontendTypes';
import { setCurrentTabInApp } from '../slices/mainSlice';
import { useDispatch } from 'react-redux';
/*
  Used to render a single radial graph on the 'Web Metrics' tab
*/

const radialGraph = (props) => {
  const dispatch = useDispatch();
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
            background: 'transparent',
            // background: '#242529',
            image: props.overLimit
              ? 'https://static.vecteezy.com/system/resources/thumbnails/012/042/301/small/warning-sign-icon-transparent-background-free-png.png'
              : undefined,
            imageWidth: 32,
            imageHeight: 32,
            imageOffsetX: 0,
            imageOffsetY: -64,
            imageClipped: false,
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
          <div style={{ zIndex: 1, position: 'relative', padding: '0.5rem 1rem' }} id='hover-box'>
            <p>
              <strong>{props.name}</strong>
            </p>
            <p>{props.description}</p>
            <p>
              <span style={{ color: '#0bce6b' }}>Good: </span>
              {`< ${props.score[0]}`}
            </p>
            <p>
              <span style={{ color: '#fc5a03' }}>Needs Improvement: </span>
              {`< ${props.score[1]}`}
            </p>
            <p>
              <span style={{ color: '#fc2000' }}>Poor: </span>
              {`> ${props.score[1]}`}
            </p>
          </div>
        </Hover>
      </ReactHover>
    </div>
  );
};

export default radialGraph;
